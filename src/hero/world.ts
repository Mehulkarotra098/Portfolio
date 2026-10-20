// The garden. Ground, grass, flowers, rocks, sky and clouds are adapted from the EZ-Tree demo environment,
// and the trees, hedges and the vine trellis are generated with the EZ-Tree library itself.
// EZ-Tree by Daniel Greenheck, MIT License: https://github.com/dgreenheck/ez-tree
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { Tree } from '../vendor/ez-tree/index.js'

// EZ-Tree assets are authored at a larger scale; the whole environment lives in a group scaled by K
// so the garden matches the bot and butterflies (a scene unit is roughly 30 cm).
export const K = 1 / 7
const u = (v: number) => v / K

/** centre line of the garden path (scene units) */
export const pathX = (z: number) => 1.15 * Math.sin(z * 0.2 + 0.5) - 0.35
export const PATH_HALF = 0.7
const PATH_FROM = 9, PATH_TO = -15

export type World = {
  group: THREE.Group
  sun: THREE.DirectionalLight
  /** landing spots for butterflies (flower tops near the path) */
  flowerTops: THREE.Vector3[]
  update: (t: number, bot: THREE.Vector3, botPower: number) => void
  /** generates trees a few per frame; resolves when the garden is complete */
  grow: (onProgress?: (p: number) => void) => Promise<void>
}

// ------------------------------------------------------------------ noise
function simplex2d(x: number, y: number) {
  const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6
  const perm = P
  const s = (x + y) * F2, i = Math.floor(x + s), j = Math.floor(y + s)
  const t = (i + j) * G2, x0 = x - (i - t), y0 = y - (j - t)
  const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1
  const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2
  const ii = i & 255, jj = j & 255
  const g = (h: number, a: number, b: number) => { const k = h & 7; const u2 = k < 4 ? a : b, v2 = k < 4 ? b : a; return ((k & 1) ? -u2 : u2) + ((k & 2) ? -2 * v2 : 2 * v2) }
  let n = 0
  let t0 = 0.5 - x0 * x0 - y0 * y0; if (t0 > 0) { t0 *= t0; n += t0 * t0 * g(perm[ii + perm[jj]], x0, y0) }
  let t1 = 0.5 - x1 * x1 - y1 * y1; if (t1 > 0) { t1 *= t1; n += t1 * t1 * g(perm[ii + i1 + perm[jj + j1]], x1, y1) }
  let t2 = 0.5 - x2 * x2 - y2 * y2; if (t2 > 0) { t2 *= t2; n += t2 * t2 * g(perm[ii + 1 + perm[jj + 1]], x2, y2) }
  return 40 * n
}
const P = (() => { const p = new Uint8Array(512); let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647); const b = Array.from({ length: 256 }, (_, i) => i).sort(() => r() - 0.5); for (let i = 0; i < 512; i++) p[i] = b[i & 255]; return p })()

let seed = 1234

/** meshopt-quantized glTF geometry carries its scale on the node; expand to float and bake the node transform in */
export function bake(m: THREE.Mesh) {
  m.updateWorldMatrix(true, false)
  const src = m.geometry, g = new THREE.BufferGeometry()
  g.setIndex(src.index)
  for (const [name, attr] of Object.entries(src.attributes)) {
    const a = attr as THREE.BufferAttribute, n = a.count, k = a.itemSize, out = new Float32Array(n * k)
    for (let i = 0; i < n; i++) for (let j = 0; j < k; j++) out[i * k + j] = a.getComponent(i, j)
    g.setAttribute(name, new THREE.BufferAttribute(out, k))
  }
  g.applyMatrix4(m.matrixWorld)
  return g
}
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

// ------------------------------------------------------------ wind shader
const NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
  float simplex2d(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0); m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }`

type WindU = { uTime: { value: number }; uBot: { value: THREE.Vector3 }; uBotPower: { value: number } }
/** EZ-Tree's grass/flower wind, plus the bot's hover ring pushing the plants away */
function addWind(mat: THREE.Material, U: WindU, strength: number, heightScale: number, push: number) {
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, U, { uK: { value: K }, uStrength: { value: strength }, uHS: { value: heightScale }, uPush: { value: push } })
    shader.vertexShader = `uniform float uTime; uniform vec3 uBot; uniform float uBotPower; uniform float uK; uniform float uStrength; uniform float uHS; uniform float uPush;\n` + shader.vertexShader
    shader.vertexShader = shader.vertexShader.replace('void main() {', NOISE_GLSL + '\nvoid main() {')
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', /* glsl */ `
      vec4 ip = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        ip = instanceMatrix * ip;
      #endif
      vec4 wp = modelMatrix * ip;
      float h01 = clamp(position.y * uHS, 0.0, 1.0);
      float windOffset = 6.28 * simplex2d(wp.xz / 57.0);
      vec2 sway = vec2(0.3, 0.3) * uStrength * h01 * sin(uTime + windOffset) * cos(uTime * 1.4 + windOffset);
      wp.xz += sway;
      vec2 d = wp.xz - uBot.xz; float r = length(d) + 1e-3;
      float inf = uBotPower * uPush * smoothstep(2.2, 0.0, r) * smoothstep(3.6, 0.6, uBot.y - wp.y);
      wp.xz += d / r * inf * 0.65 * h01; wp.y -= inf * 0.3 * h01;
      vec4 mvPosition = viewMatrix * wp;
      gl_Position = projectionMatrix * mvPosition;`)
  }
}

// ------------------------------------------------------------------ build
export async function buildWorld(scene: THREE.Scene, base: string, low: boolean): Promise<World> {
  seed = 1234
  const group = new THREE.Group(); group.scale.setScalar(K)
  scene.add(group)
  const U: WindU = { uTime: { value: 0 }, uBot: { value: new THREE.Vector3(0, 99, 0) }, uBotPower: { value: 1 } }
  const tl = new THREE.TextureLoader()
  const tex = async (f: string, srgb = true) => { const t = await tl.loadAsync(base + f); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t }
  const gl = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  const [grassTex, dirtTex, dirtNor, grassG, fb, fw, fy, r1, r2] = await Promise.all([
    tex('grass.webp'), tex('dirt_color.webp'), tex('dirt_normal.webp', false),
    gl.loadAsync(base + 'grass.glb'), gl.loadAsync(base + 'flower_blue.glb'), gl.loadAsync(base + 'flower_white.glb'), gl.loadAsync(base + 'flower_yellow.glb'),
    gl.loadAsync(base + 'rock1.glb'), gl.loadAsync(base + 'rock3.glb'),
  ])

  // ---- sky, sun and clouds (scene units, outside the scaled group)
  const sunDir = new THREE.Vector3(-0.42, 0.3, -0.86).normalize()
  const sky = new THREE.Mesh(new THREE.SphereGeometry(140, 48, 24), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uSun: { value: sunDir }, uLow: { value: new THREE.Color('#f7dfae') }, uMid: { value: new THREE.Color('#bcd8f2') }, uHigh: { value: new THREE.Color('#5f97ea') } },
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 uSun, uLow, uMid, uHigh; varying vec3 vP;
      void main(){ vec3 d = normalize(vP); float t = d.y;
        vec3 c = mix(uLow, uMid, smoothstep(-0.02, 0.18, t)); c = mix(c, uHigh, smoothstep(0.18, 0.75, t));
        float s = max(dot(d, uSun), 0.0);
        c += vec3(1.0, 0.86, 0.58) * (pow(s, 900.0) * 3.0 + pow(s, 40.0) * 0.35 + pow(s, 6.0) * 0.12);
        gl_FragColor = vec4(c, 1.0); }`,
  }))
  sky.renderOrder = -1
  scene.add(sky)
  const sun = new THREE.DirectionalLight('#ffe5b8', 3.2)
  sun.position.copy(sunDir).multiplyScalar(30).add(new THREE.Vector3(0, 6, 0))
  sun.castShadow = true
  sun.shadow.mapSize.set(low ? 1024 : 2048, low ? 1024 : 2048)
  const sc = sun.shadow.camera; sc.left = -16; sc.right = 16; sc.top = 16; sc.bottom = -16; sc.near = 1; sc.far = 80
  sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03
  sun.target.position.set(0, 0, -4)
  scene.add(sun, sun.target, new THREE.AmbientLight('#ffffff', 0.45), new THREE.HemisphereLight('#cfe3ff', '#5d6b3a', 0.5))
  scene.fog = new THREE.FogExp2('#e8e3cf', 0.0095)

  const clouds = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85, depthWrite: false, fog: false }))
  const cloudU = { uTime: { value: 0 } }
  ;(clouds.material as THREE.Material).onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, cloudU)
    shader.vertexShader = 'varying vec2 vUv2; varying vec3 vWP;\n' + shader.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vUv2 = uv; vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;')
    shader.fragmentShader = 'uniform float uTime; varying vec2 vUv2; varying vec3 vWP;\n' + shader.fragmentShader
      .replace('void main() {', NOISE_GLSL + '\nvoid main() {')
      .replace('#include <map_fragment>', `float n = simplex2d(vUv2 * 5.0 + uTime / 40.0) + simplex2d(vUv2 * 10.0 + uTime / 30.0);
        float cl = smoothstep(0.2, 0.85, 0.5 * n + 0.38);
        diffuseColor = vec4(1.0, 0.99, 0.96, cl * opacity * clamp(28.0 / length(vWP.xz + vec2(0.0, 40.0)), 0.0, 1.0));`)
  }
  clouds.rotation.x = Math.PI / 2; clouds.position.set(0, 26, -40)
  scene.add(clouds)

  // ---- ground: grass and soil blended by noise, with a soft soil path
  const groundMat = new THREE.MeshPhongMaterial({ normalMap: dirtNor, shininess: 0.1, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.01 })
  groundMat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, { uGrass: { value: grassTex }, uDirt: { value: dirtTex } })
    shader.vertexShader = 'varying vec3 vWP;\n' + shader.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;')
    shader.fragmentShader = 'varying vec3 vWP; uniform sampler2D uGrass; uniform sampler2D uDirt;\n' + shader.fragmentShader
      .replace('void main() {', NOISE_GLSL + `
        float pathX(float z) { return 1.15 * sin(z * 0.2 + 0.5) - 0.35; }
        void main() {`)
      .replace('#include <map_fragment>', `
        vec2 wuv = vWP.xz / 4.3;
        vec3 gC = texture2D(uGrass, wuv).rgb; vec3 dC = texture2D(uDirt, wuv).rgb;
        float n = 0.5 + 0.5 * simplex2d(vWP.xz / 14.0);
        float s = smoothstep(0.62, 0.82, n);
        float dp = abs(vWP.x - pathX(vWP.z));
        float onPath = smoothstep(${(PATH_HALF + 0.12).toFixed(2)}, ${(PATH_HALF - 0.15).toFixed(2)}, dp) * step(${PATH_TO.toFixed(1)}, vWP.z) * step(vWP.z, ${PATH_FROM.toFixed(1)});
        s = max(s, onPath);
        diffuseColor *= vec4(mix(gC, dC * vec3(1.05, 0.98, 0.92), s), 1.0);`)
      .replace('#include <normal_fragment_maps>', `
        vec3 mapN = texture2D(normalMap, vWP.xz / 4.3).xyz * 2.0 - 1.0; mapN.xy *= normalScale; normal = normalize(tbn * mapN);`)
  }
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(u(220), u(220)), groundMat)
  ground.rotation.x = -Math.PI / 2; ground.position.z = u(-60); ground.receiveShadow = true
  group.add(ground)

  // ---- grass
  const gsrc = grassG.scene.children[0] as THREE.Mesh
  const gmat = new THREE.MeshPhongMaterial({ map: (gsrc.material as THREE.MeshStandardMaterial).map, emissive: new THREE.Color('#308040'), emissiveIntensity: 0.05, alphaTest: 0.5, side: THREE.DoubleSide })
  gmat.color.multiplyScalar(0.62)
  addWind(gmat, U, 1.0, 0.5, 1)
  const gCount = low ? 9000 : 24000
  const grass = new THREE.InstancedMesh(bake(gsrc), gmat, gCount)
  const dummy = new THREE.Object3D(), col = new THREE.Color()
  let gi = 0
  for (let tries = 0; gi < gCount && tries < gCount * 4; tries++) {
    const z = 8 - Math.pow(rand(), 0.85) * 60
    const x = (rand() - 0.5) * (22 + (8 - z) * 1.7)
    const dp = Math.abs(x - pathX(z))
    if (z < PATH_FROM && z > PATH_TO && dp < PATH_HALF + 0.25) continue
    const n = 0.5 + 0.5 * simplex2d(x / 14, z / 14)
    if (n > 0.72 && rand() + 0.6 > 0.72) continue
    const bed = z < PATH_FROM && z > PATH_TO && dp < PATH_HALF + 2.0
    dummy.position.set(u(x), 0, u(z))
    dummy.rotation.set(0, rand() * Math.PI * 2, 0)
    const k = bed ? 0.55 : 1
    dummy.scale.set((rand() + 4) * k, (rand() * 2 + 3.2) * k, (rand() + 4) * k)
    dummy.updateMatrix(); grass.setMatrixAt(gi, dummy.matrix)
    grass.setColorAt(gi, col.setRGB(0.25 + rand() * 0.1, 0.3 + rand() * 0.3, 0.1))
    gi++
  }
  grass.count = gi
  grass.receiveShadow = true; grass.castShadow = !low
  group.add(grass)

  // ---- flower beds along the path, and wildflowers in the meadow
  const flowerTops: THREE.Vector3[] = []
  const flowerKinds = [fb, fw, fy].map((g) => g.scene.children[0])
  const beds: { x: number; z: number; s: number; r: number }[][] = [[], [], []]
  const nBed = low ? 90 : 220, nWild = low ? 40 : 110
  for (let i = 0; i < nBed + nWild; i++) {
    let x: number, z: number, s: number
    if (i < nBed) {
      z = PATH_FROM - 1 - rand() * (PATH_FROM - PATH_TO - 1)
      const side = rand() < 0.5 ? -1 : 1
      x = pathX(z) + side * (PATH_HALF + 0.35 + rand() * 1.5)
      s = 0.06 + rand() * 0.04
    } else {
      z = 6 - rand() * 40; x = (rand() - 0.5) * (18 + (6 - z))
      if (Math.abs(x - pathX(z)) < PATH_HALF + 0.3) continue
      s = 0.04 + rand() * 0.03
    }
    // colour drifts: blue and white near the front, yellow further back
    const k = i < nBed ? Math.floor((simplex2d(x / 4, z / 4) * 0.5 + 0.5) * 2.999) : Math.floor(rand() * 3)
    beds[k].push({ x, z, s, r: rand() * Math.PI * 2 })
    if (i < nBed && z > -2 && z < 7 && rand() < 0.35) flowerTops.push(new THREE.Vector3(x, 82 * s * K * 0.92, z))
  }
  const fm4 = new THREE.Matrix4(), fq = new THREE.Quaternion()
  flowerKinds.forEach((root, kind) => {
    const list = beds[kind]
    root.updateMatrixWorld(true)
    const meshes: THREE.Mesh[] = []
    root.traverse((o) => { if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh) })
    // bake every primitive at the flower's authored size (82 units tall at a node scale of 0.018)
    const box = new THREE.Box3(); const geos = meshes.map((m) => { const g = bake(m); g.computeBoundingBox(); box.union(g.boundingBox!); return g })
    const authored = box.max.y - box.min.y
    meshes.forEach((m, mi) => {
      let mat = m.material as THREE.MeshStandardMaterial
      mat = mat.map ? new THREE.MeshPhongMaterial({ map: mat.map }) as unknown as THREE.MeshStandardMaterial : mat.clone()
      addWind(mat, U, 0.25, 1 / 82, 0.6)
      const inst = new THREE.InstancedMesh(geos[mi], mat, list.length)
      list.forEach((f, i) => {
        const k = (82 * f.s) / authored // EZ-Tree's flower scale (0.02-0.05) relative to the authored size
        fq.setFromEuler(new THREE.Euler(0, f.r, 0))
        fm4.compose(new THREE.Vector3(u(f.x), 0, u(f.z)), fq, new THREE.Vector3(k, k, k))
        inst.setMatrixAt(i, fm4)
      })
      inst.castShadow = !low; inst.receiveShadow = true
      group.add(inst)
    })
  })

  // ---- rocks edging the beds
  const rockSpots: [number, number, number][] = [[-2.9, 3.2, 0.5], [2.6, 0.5, 0.35], [-3.4, -5.2, 0.6], [3.8, -9.5, 0.5], [-6.5, 4.5, 0.7], [6.8, 2.2, 0.55], [0.9, -14.2, 0.45]]
  ;[r1, r2].forEach((g, k) => {
    const src = g.scene.children[0] as THREE.Mesh
    const geo = bake(src); geo.computeBoundingBox(); const size = geo.boundingBox!.getSize(new THREE.Vector3()).x
    const spots = rockSpots.filter((_, i) => i % 2 === k)
    const inst = new THREE.InstancedMesh(geo, src.material, spots.length)
    spots.forEach(([x, z, s], i) => { dummy.position.set(u(x), u(0.05), u(z)); dummy.rotation.set(0, rand() * 6.28, 0); dummy.scale.setScalar(u(s) / size); dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix) })
    inst.castShadow = inst.receiveShadow = true
    group.add(inst)
  })

  // ---- solar garden lamps along the path (the future, quietly growing in the garden)
  const post = new THREE.MeshStandardMaterial({ color: '#26302c', metalness: 0.6, roughness: 0.4 })
  const panel = new THREE.MeshStandardMaterial({ color: '#1c2f52', metalness: 0.4, roughness: 0.25 })
  const glow = new THREE.MeshStandardMaterial({ color: '#fff4dc', emissive: '#ffd58a', emissiveIntensity: 3.2 })
  for (let z = 6, i = 0; z > PATH_TO + 1; z -= 3.4, i++) {
    const side = i % 2 ? 1 : -1
    const x = pathX(z) + side * (PATH_HALF + 0.22)
    const lamp = new THREE.Group()
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 1.05, 10), post); p.position.y = 0.52
    const g2 = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), glow); g2.position.y = 1.1
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.025, 6), panel); cap.position.y = 1.2; cap.rotation.x = -0.12
    lamp.add(p, g2, cap); lamp.position.set(u(x), 0, u(z)); lamp.scale.setScalar(u(1))
    lamp.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true })
    group.add(lamp)
  }

  // ---- wind turbines on the far horizon
  const white = new THREE.MeshBasicMaterial({ color: '#eef1ea', fog: true })
  const turbines: THREE.Object3D[] = []
  for (const [x, z, s] of [[-38, -110, 1], [-24, -125, 0.85], [31, -118, 0.95]] as const) {
    const t = new THREE.Group()
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.55, 26, 8), white); pole.position.y = 13
    const hub = new THREE.Group(); hub.position.set(0, 26, 0.6)
    for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.7, 12, 0.15), white); b.position.y = 6; const arm = new THREE.Group(); arm.rotation.z = (i * Math.PI * 2) / 3; arm.add(b); hub.add(arm) }
    t.add(pole, hub); t.position.set(x, 0, z); t.scale.setScalar(s); scene.add(t); turbines.push(hub)
  }

  // ---- trees, hedges and a vine trellis (generated a few per frame)
  type Plant = { preset: string; x: number; z: number; h: number; seed: number; ry?: number }
  const plants: Plant[] = [
    { preset: 'Oak Large', x: 11.5, z: -5, h: 11.5, seed: 4021 },
    { preset: 'Ash Medium', x: -10.5, z: -13, h: 8.5, seed: 36330 },
    { preset: 'Trellis', x: pathX(-15.8), z: -15.8, h: 4.4, seed: 41563 },
    { preset: 'Aspen Medium', x: -5.2, z: -20, h: 9.5, seed: 1180 },
    { preset: 'Oak Medium', x: 6.2, z: -23, h: 8.5, seed: 777 },
  ]
  // clipped hedges on both sides of the path's far half
  for (let z = -4.5, i = 0; z > -14.5; z -= 2.1, i++) for (const side of [-1, 1]) plants.push({ preset: `Bush ${1 + ((i + (side > 0 ? 1 : 0)) % 3)}`, x: pathX(z) + side * 3.1, z, h: 1.15 + rand() * 0.35, seed: 100 + i * 7 + side })
  // a woodland behind the garden
  const forestPresets = ['Ash Medium', 'Aspen Medium', 'Oak Medium', 'Aspen Large', 'Ash Large', 'Pine Medium']
  const nForest = low ? 6 : 14
  for (let i = 0; i < nForest; i++) {
    const x = (i / (nForest - 1) - 0.5) * 70 + (rand() - 0.5) * 5, z = -30 - rand() * 22
    if (Math.abs(x) < 4) continue
    plants.push({ preset: forestPresets[i % forestPresets.length], x, z, h: 9 + rand() * 6, seed: 5000 + i * 131 })
  }
  const trees: { update: (t: number) => void }[] = []
  const grow = async (onProgress?: (p: number) => void) => {
    for (let i = 0; i < plants.length; i++) {
      const p = plants[i]
      const tree = new Tree()
      tree.loadPreset(p.preset)
      tree.options.seed = p.seed
      if (p.preset === 'Trellis' && tree.options.trellis) tree.options.trellis.color = 0x7a5a3c
      tree.generate()
      tree.traverse((o: THREE.Object3D) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = !low || p.h > 5; o.receiveShadow = true } })
      const box = new THREE.Box3().setFromObject(tree)
      const hgt = box.max.y - box.min.y || 1
      tree.scale.setScalar(u(p.h) / hgt)
      tree.position.set(u(p.x), 0, u(p.z))
      tree.rotation.y = p.ry ?? rand() * Math.PI * 2
      if (p.preset === 'Trellis') tree.rotation.y = 0
      group.add(tree)
      trees.push(tree)
      onProgress?.((i + 1) / plants.length)
      await new Promise((r) => requestAnimationFrame(r))
    }
  }

  const update = (t: number, bot: THREE.Vector3, power: number) => {
    U.uTime.value = t; U.uBot.value.copy(bot); U.uBotPower.value = power
    cloudU.uTime.value = t
    turbines.forEach((h, i) => (h.rotation.z -= 0.006 * (1 + i * 0.15)))
    trees.forEach((tr) => tr.update(t))
  }
  return { group, sun, flowerTops, update, grow }
}
