import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { Water } from 'three/examples/jsm/objects/Water.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { N8AOPass } from 'n8ao'
import { BP, patch, edgesFor, makeSky, MASK_GLSL } from './blueprint'
import { paint } from './textures'

export type Shot = { pos: THREE.Vector3; tgt: THREE.Vector3; fov: number }
export type FrameInfo = { anchors: Record<string, [number, number, boolean]>; lens: [number, number, number] }
type Opts = { low: boolean; reducedMotion: boolean; screens: { slug: string; src: string }[] }
type Cb = { onReady?: () => void; onFrame?: (i: FrameInfo) => void; onScreen?: (index: number | null) => void }

// ---------- layout constants (metres) ----------
const FLOOR = 0.9
const CEIL = 4.4
const WALL_Z = -7.75 // interior face of the gallery wall
const SCR = { w: 3.6, h: 2.25, y: 2.55 }
export const STOPS = [-12.5, -7.5, -2.5, 2.5, 7.5, 12.5]
export const FILM_KEYS = 4 + STOPS.length // hero, built, approach, entry, stops..., exit (index 10)

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

/** Box with UVs scaled to world size so stone textures keep a constant grain. */
function stoneBox(w: number, h: number, d: number, scale = 3) {
  const g = new THREE.BoxGeometry(w, h, d)
  const uv = g.attributes.uv as THREE.BufferAttribute
  const dims: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]]
  for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) {
    const k = f * 4 + i
    uv.setXY(k, uv.getX(k) * dims[f][0] / scale, uv.getY(k) * dims[f][1] / scale)
  }
  return g
}

export class Pavilion {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 2000)
  private composer!: EffectComposer
  private bloom!: UnrealBloomPass
  private grade!: ShaderPass
  private ao: N8AOPass | null = null
  private sky = makeSky()
  private clock = new THREE.Clock()
  private raf = 0
  private running = false
  private w = 1
  private h = 1
  private dpr = 1
  private opts: Opts
  private cb: Cb

  // state
  private fTarget = 0
  private f = 0
  private night = 0
  private nightTarget = 0
  private finale = false
  private pointer = new THREE.Vector2(-9999, -9999)
  private pointerN = new THREE.Vector2()
  private pointerSeen = 0
  private lens = new THREE.Vector3(-9999, -9999, 0)
  private lensR = 0
  private keys: Shot[] = []
  private finaleShot!: Shot
  private posCurve!: THREE.CatmullRomCurve3
  private tgtCurve!: THREE.CatmullRomCurve3
  private screens: THREE.Mesh[] = []
  private ray = new THREE.Raycaster()
  private hovered: number | null = null
  lensEnabled = true
  private quality = 1
  private perf = { n: 0, t: 0 }

  // lights / night-driven
  private sun = new THREE.DirectionalLight('#ff9f62', 2.2)
  private hemi = new THREE.HemisphereLight('#5d6fa8', '#6a4a3a', 0.28)
  private warm: THREE.MeshBasicMaterial[] = []
  private areas: THREE.RectAreaLight[] = []
  private onyx!: THREE.MeshStandardMaterial
  private water: Water | null = null
  private anchors: Record<string, THREE.Vector3> = {
    roof: v(-12, CEIL + 0.45, 4.2), wall: v(9, 3.6, -7.9), onyx: v(-11, 3.4, 2.45), pool: v(-18.5, 0.8, 12.5), stone: v(20.5, 3.4, 9.5),
  }

  constructor(canvas: HTMLCanvasElement, opts: Opts, cb: Cb = {}) {
    this.opts = opts
    this.cb = cb
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false })
    this.renderer.toneMapping = THREE.AgXToneMapping
    this.renderer.toneMappingExposure = 0.95
    this.renderer.shadowMap.enabled = !opts.low
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.shadowMap.autoUpdate = false
    this.scene.fog = new THREE.FogExp2('#2f2c45', 0.0038)
    this.scene.add(this.sky)
    RectAreaLightUniformsLib.init()
    this.init().catch((e) => console.error(e))
  }

  // ---------------- build ----------------
  private async init() {
    const r = this.renderer
    const low = this.opts.low
    const tex = new THREE.TextureLoader()
    const load = (u: string) => new Promise<THREE.Texture>((res, rej) => tex.load(u, res, undefined, rej))

    const [hdr, waterN, ...shots] = await Promise.all([
      new HDRLoader().loadAsync('/env/sunset.hdr'),
      load('/env/water.webp'),
      ...this.opts.screens.map((s) => load(s.src)),
    ])
    const pm = new THREE.PMREMGenerator(r)
    hdr.mapping = THREE.EquirectangularReflectionMapping
    this.scene.environment = pm.fromEquirectangular(hdr).texture
    this.scene.environmentIntensity = 0.4
    hdr.dispose(); pm.dispose()

    const trav = paint(r, 'travertine').texture
    const onyxT = paint(r, 'onyx').texture
    const marbleT = paint(r, 'marble').texture
    const sandT = paint(r, 'sand', 512).texture
    const sandN = paint(r, 'sandN', 512, false).texture
    sandT.repeat.set(40, 40); sandN.repeat.set(40, 40)

    const M = {
      trav: patch(new THREE.MeshStandardMaterial({ map: trav, roughness: 0.62 })),
      travPol: patch(new THREE.MeshStandardMaterial({ map: trav, roughness: 0.2, envMapIntensity: 0.35 })),
      travIn: patch(new THREE.MeshStandardMaterial({ map: trav, roughness: 0.6, envMapIntensity: 0.25 })),
      plaster: patch(new THREE.MeshStandardMaterial({ color: '#ebe5dc', roughness: 0.9 })),
      chromeIn: patch(new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 1, roughness: 0.16, envMapIntensity: 0.6 })),
      chrome: patch(new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 1, roughness: 0.16, envMapIntensity: 1.1 })),
      marble: patch(new THREE.MeshStandardMaterial({ map: marbleT, roughness: 0.12, envMapIntensity: 1.2 })),
      glass: patch(new THREE.MeshStandardMaterial({ color: '#28343c', metalness: 0.2, roughness: 0.03, transparent: true, opacity: 0.32, envMapIntensity: 2.2, depthWrite: false, side: THREE.DoubleSide }), { glass: true }),
      sand: patch(new THREE.MeshStandardMaterial({ map: sandT, normalMap: sandN, normalScale: new THREE.Vector2(0.28, 0.28), roughness: 0.96 })),
      dark: patch(new THREE.MeshStandardMaterial({ color: '#0d0e10', roughness: 0.35, metalness: 0.4 })),
      hills: patch(new THREE.MeshStandardMaterial({ color: '#4a3a3e', roughness: 1 })),
    }
    this.onyx = patch(new THREE.MeshStandardMaterial({ map: onyxT, emissiveMap: onyxT, emissive: '#ffffff', emissiveIntensity: 1.4, roughness: 0.3 })) as THREE.MeshStandardMaterial

    const root = new THREE.Group()
    this.scene.add(root)
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, o: { edges?: boolean; cast?: boolean; recv?: boolean; ry?: number } = {}) => {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(x, y, z)
      if (o.ry) m.rotation.y = o.ry
      m.castShadow = o.cast ?? true
      m.receiveShadow = o.recv ?? true
      root.add(m)
      if (o.edges !== false) root.add(edgesFor(m))
      return m
    }

    // ground: dunes flattened around the site
    const gGeo = new THREE.PlaneGeometry(900, 900, low ? 120 : 220, low ? 120 : 220)
    gGeo.rotateX(-Math.PI / 2)
    const gp = gGeo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < gp.count; i++) {
      const x = gp.getX(i), z = gp.getZ(i)
      const d = Math.hypot(x / 1.3, z)
      const k = THREE.MathUtils.smoothstep(d, 34, 90)
      const dune = Math.sin(x * 0.021 + Math.sin(z * 0.013) * 2.2) * 2.2 + Math.sin(z * 0.034 + x * 0.008) * 1.4 + Math.sin(x * 0.063 - z * 0.02) * 0.5
      gp.setY(i, -0.02 + k * (dune + 2.0) * Math.min(1, d / 160 + 0.4))
    }
    gGeo.computeVertexNormals()
    const ground = new THREE.Mesh(gGeo, M.sand)
    ground.receiveShadow = true
    root.add(ground)

    // far mountains ring
    const mGeo = new THREE.CylinderGeometry(520, 520, 1, 160, 1, true)
    const mp = mGeo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < mp.count; i++) {
      if (mp.getY(i) > 0) {
        const a = Math.atan2(mp.getZ(i), mp.getX(i))
        const hgt = 18 + 26 * Math.abs(Math.sin(a * 3.1) * Math.sin(a * 7.3 + 1.2)) + 10 * Math.sin(a * 17.0) ** 2
        mp.setY(i, hgt)
      } else mp.setY(i, -2)
    }
    mGeo.computeVertexNormals()
    const hills = new THREE.Mesh(mGeo, M.hills)
    hills.material.side = THREE.BackSide
    root.add(hills)

    // plinth + steps
    // plinth, built around the pool recess
    const slab = (x0: number, x1: number, z0: number, z1: number) => add(stoneBox(x1 - x0, FLOOR, z1 - z0), M.trav, (x0 + x1) / 2, FLOOR / 2, (z0 + z1) / 2)
    slab(-26, 26, -14, 5); slab(-12, 26, 5, 14); slab(-26, -25, 5, 14); slab(-25, -12, 12.5, 14)
    for (let s = 0; s < 3; s++) add(stoneBox(8, FLOOR - s * 0.3, 0.45), M.trav, 0, (FLOOR - s * 0.3) / 2, 14 + 0.225 + s * 0.45)
    // interior polished floor inlay
    add(stoneBox(33, 0.02, 12.4, 2.4), M.travPol, 0, FLOOR + 0.01, -2.6, { edges: false })

    // pool (recess + water)
    const pool = { x0: -25, x1: -12, z0: 5, z1: 12.5 }
    const pw = pool.x1 - pool.x0, pd = pool.z1 - pool.z0, pcx = (pool.x0 + pool.x1) / 2, pcz = (pool.z0 + pool.z1) / 2
    add(stoneBox(pw, 0.3, pd), M.dark, pcx, 0.15, pcz, { edges: false })
    const waterGeo = new THREE.PlaneGeometry(pw, pd)
    if (!low) {
      waterN.wrapS = waterN.wrapT = THREE.RepeatWrapping
      const water = new Water(waterGeo, {
        textureWidth: 512, textureHeight: 512, waterNormals: waterN,
        sunDirection: v(-0.6, 0.1, -0.8).normalize(), sunColor: '#ffb07a', waterColor: '#0a1a24', distortionScale: 1.2, fog: true,
      })
      const wm = water.material as THREE.ShaderMaterial
      wm.uniforms = { ...wm.uniforms, ...BP }
      wm.uniforms.size.value = 2.2
      wm.fragmentShader = wm.fragmentShader
        .replace('#include <common>', '#include <common>\n' + MASK_GLSL)
        .replace('#include <fog_fragment>', '#include <fog_fragment>\n{ float b=bpBuilt(worldPosition.xyz); gl_FragColor.rgb=mix(uPaper*1.6,gl_FragColor.rgb,b); }')
      water.rotation.x = -Math.PI / 2
      water.position.set(pcx, FLOOR - 0.1, pcz)
      root.add(water)
      this.water = water
    } else {
      const wm = new THREE.Mesh(waterGeo, patch(new THREE.MeshStandardMaterial({ color: '#08141c', roughness: 0.04, metalness: 0.6, envMapIntensity: 1.6 })))
      wm.rotation.x = -Math.PI / 2
      wm.position.set(pcx, FLOOR - 0.1, pcz)
      root.add(wm)
    }
    // pool coping edges drawn

    // roof slab, floating
    const roof = add(stoneBox(34, 0.45, 13.4, 6), M.plaster, 0, CEIL + 0.225, -2.5)
    roof.name = 'roof'
    // warm light reveals under the roof
    const warmMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffc58a').multiplyScalar(4) })
    this.warm.push(warmMat)
    patch(warmMat, { flat: true })
    for (const z of [WALL_Z + 0.35, 2.8]) add(new THREE.BoxGeometry(31.5, 0.04, 0.12), warmMat, 0, CEIL - 0.02, z, { edges: false, cast: false, recv: false })

    // gallery wall (travertine) and screens
    add(stoneBox(32, CEIL - FLOOR, 0.3), M.travIn, 0, (CEIL + FLOOR) / 2, WALL_Z - 0.15)
    shots.forEach((t, i) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
      const x = STOPS[i]
      add(new THREE.BoxGeometry(SCR.w + 0.08, SCR.h + 0.08, 0.06), M.dark, x, SCR.y, WALL_Z + 0.03)
      const sm = patch(new THREE.MeshBasicMaterial({ map: t, color: new THREE.Color(0.92, 0.92, 0.92) }), { flat: true })
      const s = add(new THREE.PlaneGeometry(SCR.w, SCR.h), sm, x, SCR.y, WALL_Z + 0.065, { cast: false })
      s.userData.index = i
      this.screens.push(s)
      if (!low) {
        const a = new THREE.RectAreaLight('#cfd8ff', 0.7, SCR.w, SCR.h)
        a.position.set(x, SCR.y, WALL_Z + 0.08)
        a.lookAt(x, SCR.y, 10)
        root.add(a)
        this.areas.push(a)
      }
    })
    // wall wash
    const wash = new THREE.RectAreaLight('#ffcf9c', 1.6, 31, 0.6)
    wash.position.set(0, CEIL - 0.05, WALL_Z + 0.6)
    wash.lookAt(0, FLOOR, WALL_Z + 0.4)
    root.add(wash)
    this.areas.push(wash)

    // cruciform chrome columns
    const colGeo = (() => {
      const a = new THREE.BoxGeometry(0.26, CEIL - FLOOR, 0.05)
      const b = new THREE.BoxGeometry(0.05, CEIL - FLOOR, 0.26)
      const g = new THREE.BufferGeometry()
      const pos = [...a.attributes.position.array, ...b.attributes.position.array]
      const nor = [...a.attributes.normal.array, ...b.attributes.normal.array]
      const idx = [...a.index!.array, ...[...b.index!.array].map((n) => n + a.attributes.position.count)]
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
      g.setIndex(idx)
      return g
    })()
    for (const z of [-4.6, 1.4]) for (const x of [-15, -10, -5, 0, 5, 10, 15]) add(colGeo, z < 0 ? M.chromeIn : M.chrome, x, (CEIL + FLOOR) / 2, z, { edges: false })

    // glass front with mullions and a door gap
    for (let x = -16; x < 16; x += 2.5) {
      const x0 = x, x1 = Math.min(x + 2.5, 16)
      if (x0 >= -1.25 && x1 <= 1.25 + 2.5 && x0 < 1.25 && x1 > -1.25) { /* door */ }
      const cx = (x0 + x1) / 2
      if (Math.abs(cx) < 1.3) continue
      add(new THREE.PlaneGeometry(x1 - x0, CEIL - FLOOR), M.glass, cx, (CEIL + FLOOR) / 2, 3.4, { cast: false, recv: false })
      add(new THREE.BoxGeometry(0.05, CEIL - FLOOR, 0.08), M.chrome, x0, (CEIL + FLOOR) / 2, 3.4, { edges: false })
    }
    // side glass (left end)
    add(new THREE.PlaneGeometry(11.2, CEIL - FLOOR), M.glass, -16, (CEIL + FLOOR) / 2, -2.2, { ry: Math.PI / 2, cast: false, recv: false })

    // onyx wall, backlit, visible through the glass
    add(stoneBox(6, CEIL - FLOOR - 0.6, 0.12, 6), this.onyx, -11, (CEIL + FLOOR) / 2 - 0.3, 2.45)
    const glow = new THREE.PointLight('#ffb366', 9, 9, 1.6)
    glow.position.set(-11, 2.4, 1.4)
    root.add(glow)

    // black marble wall outside the right end, and a travertine screen wall by the pool
    add(stoneBox(0.3, CEIL - FLOOR, 11, 4), M.marble, 19.5, (CEIL + FLOOR) / 2, -3.5)
    add(stoneBox(0.3, 3.0, 9, 3), M.trav, -24.5, FLOOR + 1.5, -4)

    add(stoneBox(26, 3.0, 0.35, 3), M.trav, 33, FLOOR + 1.5 - 0.45, -10.5)
    add(stoneBox(0.35, 2.4, 14, 3), M.trav, 23.5, FLOOR + 1.2, 5)

    // sculpture standing in the pool: three polished bronze stones
    const bronze = patch(new THREE.MeshStandardMaterial({ color: '#b07a44', metalness: 1, roughness: 0.22, envMapIntensity: 1.5 }))
    const stones: [number, number, number, number][] = [[0.9, 0.55, 0.7, 0], [0.62, 0.42, 0.5, 0.95], [0.4, 0.34, 0.36, 1.68]]
    for (const [sx, sy, sz, y] of stones) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24), bronze)
      m.scale.set(sx, sy, sz); m.position.set(20.5, FLOOR + y + sy - 0.05, 9.5); m.castShadow = true
      root.add(m)
    }

    // lights
    this.sun.position.set(-62, 8, -50)
    this.sun.target.position.set(0, 0, 0)
    this.sun.castShadow = !low
    this.sun.shadow.mapSize.set(2048, 2048)
    const sc = this.sun.shadow.camera
    sc.left = -40; sc.right = 40; sc.top = 24; sc.bottom = -24; sc.near = 10; sc.far = 160
    this.sun.shadow.bias = -0.0004
    this.sun.shadow.normalBias = 0.03
    this.scene.add(this.sun, this.sun.target, this.hemi)

    // keyframes, post, go
    this.buildKeys()
    this.setupPost()
    this.resize(this.w, this.h)
    this.applyFrame(0)
    this.renderer.shadowMap.needsUpdate = true
    this.renderOnce()
    this.cb.onReady?.()
  }

  private setupPost() {
    const low = this.opts.low
    const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: low ? 0 : 4 })
    this.composer = new EffectComposer(this.renderer, rt)
    if (!low) {
      this.ao = new N8AOPass(this.scene, this.camera, 1, 1)
      const c = this.ao.configuration
      c.aoRadius = 1.6; c.distanceFalloff = 0.8; c.intensity = 2.2; c.halfRes = true; c.color = new THREE.Color('#1a1410'); c.gammaCorrection = false
      this.composer.addPass(this.ao)
    } else this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.55, 1.05)
    this.composer.addPass(this.bloom)
    this.grade = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uNight: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; uniform float uNight; varying vec2 vUv;
        float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
        void main(){
          vec2 c=vUv-0.5; float r=dot(c,c);
          vec2 off=c*r*0.006;
          vec3 col=vec3(texture2D(tDiffuse,vUv+off).r, texture2D(tDiffuse,vUv).g, texture2D(tDiffuse,vUv-off).b);
          float l=dot(col,vec3(0.2126,0.7152,0.0722));
          col=mix(col, col*vec3(0.92,0.97,1.08), smoothstep(0.35,0.0,l)*0.6);
          col*=1.0-smoothstep(0.12,0.7,r)*0.55;
          col+=(h(vUv*uRes+fract(uTime)*91.0)-0.5)*0.022*(0.4+l);
          gl_FragColor=vec4(col,1.0);
        }`,
    })
    this.composer.addPass(this.grade)
    this.composer.addPass(new OutputPass())
  }

  // ---------------- camera choreography ----------------
  private buildKeys() {
    const a = this.w / this.h
    const portrait = a < 0.9
    const fovFor = (base: number) => (portrait ? base * 1.55 : a < 1.4 ? base * 1.15 : base)
    const stopDist = (fov: number) => {
      const t = Math.tan(THREE.MathUtils.degToRad(fov / 2))
      const dH = SCR.h / (portrait ? 0.62 : 0.6) / (2 * t)
      const dW = SCR.w / (portrait ? 0.96 : 0.55) / (2 * t * a)
      return Math.max(dH, dW)
    }
    const k: Shot[] = []
    if (portrait) {
      k.push({ pos: v(-36, 2.6, 33), tgt: v(-13, 6.4, -2), fov: fovFor(30) })
      k.push({ pos: v(-29, 1.9, 21), tgt: v(-8, 5.0, -3), fov: fovFor(30) })
    } else {
      k.push({ pos: v(-38, 2.3, 31), tgt: v(-27, 3.6, 3), fov: fovFor(32) })
      k.push({ pos: v(-27, 1.75, 16), tgt: v(-5, 3.0, -3), fov: fovFor(38) })
    }
    k.push({ pos: v(0, 2.1, 15), tgt: v(0, 2.4, 0), fov: fovFor(36) })
    k.push({ pos: v(-1.5, 2.35, 0.2), tgt: v(-10, 2.45, -6.5), fov: fovFor(38) })
    const sf = fovFor(36)
    const d = stopDist(sf)
    const t = Math.tan(THREE.MathUtils.degToRad(sf / 2))
    const offX = portrait ? 0 : 0.165 * 2 * d * t * a // push the screen right, leaving room for the caption
    const offY = portrait ? 0.16 * 2 * d * t : 0 // push the screen up on phones
    for (const x of STOPS) k.push({ pos: v(x - offX, SCR.y - 0.05 - offY, WALL_Z + d), tgt: v(x - offX, SCR.y - offY, WALL_Z), fov: sf })
    k.push(portrait ? { pos: v(30, 5, 44), tgt: v(0, 2.6, -2), fov: fovFor(30) } : { pos: v(30, 4.8, 28), tgt: v(0, 2.6, -2), fov: fovFor(30) })
    this.keys = k
    this.finaleShot = portrait ? { pos: v(-20, 1.9, 52), tgt: v(-6, 4.4, 0), fov: fovFor(30) } : { pos: v(-34, 3.4, 33), tgt: v(-2, 0.6, -2), fov: fovFor(28) }
    this.posCurve = new THREE.CatmullRomCurve3(k.map((s) => s.pos), false, 'centripetal')
    this.tgtCurve = new THREE.CatmullRomCurve3(k.map((s) => s.tgt), false, 'centripetal')
  }

  private tmpP = new THREE.Vector3()
  private tmpT = new THREE.Vector3()
  private applyFrame(dt: number) {
    const n = this.keys.length - 1
    const f = THREE.MathUtils.clamp(this.f, 0, n)
    this.posCurve.getPoint(f / n, this.tmpP)
    this.tgtCurve.getPoint(f / n, this.tmpT)
    const i = Math.min(Math.floor(f), n - 1)
    let fov = THREE.MathUtils.lerp(this.keys[i].fov, this.keys[i + 1].fov, f - i)
    // finale blend
    const nb = this.night
    if (nb > 0) {
      this.tmpP.lerp(this.finaleShot.pos, nb)
      this.tmpT.lerp(this.finaleShot.tgt, nb)
      fov = THREE.MathUtils.lerp(fov, this.finaleShot.fov, nb)
    }
    // breathing drift and pointer parallax (outside only)
    const t = this.clock.elapsedTime
    const outside = Math.max(1 - f / 2, 0) + nb
    if (!this.opts.reducedMotion) {
      this.tmpP.x += Math.sin(t * 0.13) * 0.6 * outside + this.pointerN.x * 0.9 * outside
      this.tmpP.y += Math.sin(t * 0.21) * 0.12 * outside + this.pointerN.y * 0.3 * outside
      this.tmpT.x += this.pointerN.x * 0.25 * (1 - outside) * Math.min(1, Math.max(0, f - 3))
    }
    this.camera.position.copy(this.tmpP)
    this.camera.lookAt(this.tmpT)
    if (Math.abs(this.camera.fov - fov) > 1e-3) { this.camera.fov = fov; this.camera.updateProjectionMatrix() }

    // build sweep
    const b = THREE.MathUtils.smoothstep(f, 0.04, 0.96)
    BP.uSweep.value = THREE.MathUtils.lerp(-0.7, 8.2, b) + (nb > 0 ? 9 : 0)
    void dt
  }

  private applyNight() {
    const n = this.night
    const s = this.sky.material as THREE.ShaderMaterial
    s.uniforms.uNight.value = n
    this.sun.intensity = 2.2 * (1 - n)
    this.hemi.intensity = THREE.MathUtils.lerp(0.28, 0.1, n)
    this.hemi.color.set('#6d7fb0')
    this.scene.environmentIntensity = THREE.MathUtils.lerp(0.4, 0.1, n)
    this.renderer.toneMappingExposure = THREE.MathUtils.lerp(0.95, 1.15, n)
    ;(this.scene.fog as THREE.FogExp2).color.set(n > 0.5 ? '#0d1020' : '#2f2c45')
    for (const m of this.warm) m.color.set('#ffc58a').multiplyScalar(THREE.MathUtils.lerp(4, 8, n))
    this.onyx.emissiveIntensity = THREE.MathUtils.lerp(1.4, 2.6, n)
    for (const a of this.areas) a.intensity = (a.width > 10 ? 1.6 : 0.7) * (1 + n * 0.8)
  }

  // ---------------- public api ----------------
  setProgress(f: number) { this.fTarget = f }
  setFinale(on: boolean, snap = false) {
    this.finale = on
    this.nightTarget = on ? 1 : 0
    if (snap) { this.night = this.nightTarget; this.applyNight() }
  }
  jump() { this.f = this.fTarget }

  pointerMove(x: number, y: number) {
    this.pointer.set(x, y)
    this.pointerN.set((x / this.w) * 2 - 1, -((y / this.h) * 2 - 1))
    this.pointerSeen = this.clock.elapsedTime
  }
  pointerLeave() { this.pointerSeen = -99 }
  click() {
    if (this.hovered != null) return this.hovered
    return null
  }

  resize(w: number, h: number) {
    this.w = Math.max(1, w); this.h = Math.max(1, h)
    this.dpr = Math.min(window.devicePixelRatio || 1, this.opts.low ? 1.5 : 1.75) * this.quality
    this.renderer.setPixelRatio(this.dpr)
    this.renderer.setSize(this.w, this.h, false)
    this.camera.aspect = this.w / this.h
    this.camera.updateProjectionMatrix()
    if (this.composer) {
      this.composer.setPixelRatio(this.dpr)
      this.composer.setSize(this.w, this.h)
      this.ao?.setSize(this.w * this.dpr, this.h * this.dpr)
      ;(this.grade.uniforms.uRes.value as THREE.Vector2).set(this.w * this.dpr, this.h * this.dpr)
      this.buildKeys()
    }
  }

  start() {
    if (this.running) return
    this.running = true
    this.clock.getDelta()
    const loop = () => {
      if (!this.running) return
      this.raf = requestAnimationFrame(loop)
      this.tick()
    }
    loop()
  }
  stop() { this.running = false; cancelAnimationFrame(this.raf) }

  renderOnce() { if (this.composer) this.composer.render() }

  private proj = new THREE.Vector3()
  private tick() {
    if (!this.composer) return
    const rawDt = this.clock.getDelta()
    const dt = Math.min(rawDt, 0.1)
    // adaptive resolution: if frames are slow, render fewer pixels
    if (rawDt < 0.5 && !navigator.webdriver) {
      this.perf.n++; this.perf.t += rawDt
      if (this.perf.n >= 60) {
        const avg = this.perf.t / this.perf.n
        if (avg > 0.026 && this.quality > 0.55) { this.quality *= 0.78; this.resize(this.w, this.h) }
        this.perf.n = 0; this.perf.t = 0
      }
    }
    const t = this.clock.elapsedTime
    const rm = this.opts.reducedMotion
    const k = rm ? 1 : 1 - Math.exp(-dt * 3.2)
    this.f += (this.fTarget - this.f) * k
    if (Math.abs(this.fTarget - this.f) < 1e-4) this.f = this.fTarget
    const nk = rm ? 1 : 1 - Math.exp(-dt * 1.6)
    const prevN = this.night
    this.night += (this.nightTarget - this.night) * nk
    if (Math.abs(this.night - prevN) > 1e-4 || this.night === this.nightTarget) this.applyNight()
    BP.uTime.value = t
    ;(this.sky.material as THREE.ShaderMaterial).uniforms.uTime.value = t
    this.grade.uniforms.uTime.value = t
    if (this.water) (this.water.material as THREE.ShaderMaterial).uniforms.time.value = t * 0.35
    this.applyFrame(dt)

    // lens: follows pointer while the blueprint is on screen, wanders when idle
    const building = BP.uSweep.value < 7.6 && !this.finale
    const active = building && t - this.pointerSeen < 2.5
    let lx = this.pointer.x, ly = this.pointer.y
    if (!active) {
      const cx = this.w * (this.w < this.h ? 0.5 : 0.62), cy = this.h * (this.w < this.h ? 0.62 : 0.56)
      lx = cx + Math.sin(t * 0.45) * this.w * 0.16
      ly = cy + Math.sin(t * 0.31 + 1.0) * this.h * 0.08
    }
    const targetR = building && this.lensEnabled ? (this.w < 700 ? 96 : 150) : 0
    this.lensR += (targetR - this.lensR) * (1 - Math.exp(-dt * 5))
    const lk = 1 - Math.exp(-dt * (active ? 14 : 2.5))
    if (this.lens.x < -9000) this.lens.set(lx, ly, 0)
    this.lens.x += (lx - this.lens.x) * lk
    this.lens.y += (ly - this.lens.y) * lk
    BP.uLens.value.set(this.lens.x * this.dpr, (this.h - this.lens.y) * this.dpr, this.lensR * this.dpr)
    BP.uLensOn.value = this.lensR > 1 ? 1 : 0

    // hover on screens (gallery only)
    const inGallery = this.f > 3.4 && this.f < FILM_KEYS - 0.6 && this.night < 0.5
    let hov: number | null = null
    if (inGallery && t - this.pointerSeen < 3) {
      this.ray.setFromCamera(this.pointerN, this.camera)
      const hit = this.ray.intersectObjects(this.screens, false)[0]
      if (hit) hov = hit.object.userData.index as number
    }
    if (hov !== this.hovered) { this.hovered = hov; this.cb.onScreen?.(hov) }

    this.composer.render(dt)

    if (this.cb.onFrame) {
      const out: FrameInfo['anchors'] = {}
      for (const [name, p] of Object.entries(this.anchors)) {
        this.proj.copy(p).project(this.camera)
        out[name] = [(this.proj.x * 0.5 + 0.5) * this.w, (-this.proj.y * 0.5 + 0.5) * this.h, this.proj.z < 1 && Math.abs(this.proj.x) < 1.1 && Math.abs(this.proj.y) < 1.1]
      }
      this.cb.onFrame({ anchors: out, lens: [this.lens.x, this.lens.y, this.lensR] })
    }
  }

  get lensRadius() { return this.lensR }
  get lensPos() { return this.lens }

  dispose() {
    this.stop()
    this.renderer.dispose()
  }
}
