// Hero scene: a hovering bot (Bot Neil by Oscar Creativo, CC BY 4.0) chases a butterfly
// (12 Animated butterflies by bestgamekits, CC BY 4.0) through a solarpunk garden built with EZ-Tree (MIT).
// On desktop the butterfly follows the cursor; on touch it flies by itself and follows your finger.
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import { buildWorld, pathX, type World } from './world'

export type GardenEvents = { onReady?: () => void; onCatch?: (n: number) => void; onGrow?: (p: number) => void }
export type GardenOptions = { reducedMotion: boolean; lowPower: boolean; botUrl: string; butterflyUrl: string; wingsUrl: string; gardenBase: string }

const clamp = THREE.MathUtils.clamp
const damp = THREE.MathUtils.damp
const C = (h: string) => new THREE.Color(h)

export class Garden {
  private renderer: THREE.WebGLRenderer
  private composer: EffectComposer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400)
  private timer = new THREE.Timer()
  private raf = 0
  private running = false
  private disposed = false
  private ready = false
  private w = 1
  private h = 1
  private halfW = 6
  private time = 0
  private world!: World

  private bot = new THREE.Group()
  private botInner = new THREE.Group()
  private wings: THREE.Group[] = []
  private eyes: THREE.Object3D[] = []
  private eyeBase: THREE.Vector3[] = []
  private ring?: THREE.Object3D
  private fly!: Butterfly
  private ambient: Butterfly[] = []
  private pollen!: THREE.Points
  private pollenU = { uTime: { value: 0 }, uScale: { value: 1 } }
  private sparks = new Sparks()
  private flowers: THREE.Vector3[] = []

  // state
  private pos = new THREE.Vector3(2.4, 2.6, 0)
  private vel = new THREE.Vector3()
  private lunge = 0
  private lungeCool = 0
  private caught = 0
  private caughtT = 0
  private count = 0
  private clap = 0
  private happySpin = 0
  private pointer = { has: false, x: 0, y: 0, last: -99, touch: false }
  private target = new THREE.Vector3(0, 2.4, 0.5)
  private wander = { t: 0, land: -1, landT: 0 }
  private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.5)
  private ray = new THREE.Raycaster()

  private opts: GardenOptions
  private ev: GardenEvents
  constructor(canvas: HTMLCanvasElement, opts: GardenOptions, ev: GardenEvents = {}) {
    this.opts = opts; this.ev = ev
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.25 : 1.75))
    this.renderer.toneMapping = THREE.NeutralToneMapping
    this.renderer.toneMappingExposure = 1.45
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.35
    this.timer.connect(document)

    // MSAA on the composer target keeps the grass and leaf edges clean
    const rt = new THREE.WebGLRenderTarget(1, 1, { samples: opts.lowPower ? 0 : 4, type: THREE.HalfFloatType })
    this.composer = new EffectComposer(this.renderer, rt)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    if (!opts.lowPower) this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), 0.35, 0.5, 0.92))
    this.composer.addPass(new ShaderPass({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      // one grade for every asset: warm golden-hour highlights, soft vignette
      fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv;
        void main(){ vec4 c=texture2D(tDiffuse,vUv); float l=dot(c.rgb,vec3(.299,.587,.114));
          c.rgb=mix(c.rgb, c.rgb*vec3(1.05,1.0,0.92), smoothstep(.4,1.,l));
          float v=smoothstep(1.3,0.35,length((vUv-.5)*vec2(1.2,1.)));
          c.rgb*=mix(.8,1.,v); gl_FragColor=c; }`,
    }))
    this.composer.addPass(new OutputPass())
    this.buildPollen()
    this.scene.add(this.sparks.points)
    this.load()
  }

  private buildPollen() {
    const pc = this.opts.lowPower ? 140 : 320
    const pp = new Float32Array(pc * 3), ps = new Float32Array(pc)
    for (let i = 0; i < pc; i++) { pp.set([(Math.random() - 0.5) * 24, Math.random() * 6, 4 - Math.random() * 14], i * 3); ps[i] = Math.random() }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); pg.setAttribute('seed', new THREE.BufferAttribute(ps, 1))
    this.pollen = new THREE.Points(pg, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: this.pollenU,
      vertexShader: `attribute float seed; uniform float uTime; uniform float uScale; varying float vA;
        void main(){ vec3 p=position; p.y=mod(p.y+uTime*(0.06+seed*0.1),6.); p.x+=sin(uTime*0.4+seed*20.)*0.6; p.z+=cos(uTime*0.3+seed*13.)*0.4;
          vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=uScale*(1.6+seed*3.)*(14./-mv.z); vA=(0.3+0.7*(sin(uTime*2.+seed*30.)*0.5+0.5))*smoothstep(0.3,1.0,p.y)*smoothstep(6.,4.5,p.y);
          gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `varying float vA; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,.0,d); gl_FragColor=vec4(vec3(1.3,1.1,.6)*a*vA*0.8,a*vA); }`,
    }))
    this.pollen.frustumCulled = false
    this.scene.add(this.pollen)
  }

  private async load() {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    const [world, gltf, bfly] = await Promise.all([
      buildWorld(this.scene, this.opts.gardenBase, this.opts.lowPower),
      loader.loadAsync(this.opts.botUrl), loader.loadAsync(this.opts.butterflyUrl),
    ])
    if (this.disposed) return
    this.world = world
    this.flowers = world.flowerTops
    this.buildButterflies(bfly)
    const model = gltf.scene
    model.position.y = -0.33
    this.botInner.add(model); this.bot.add(this.botInner); this.scene.add(this.bot)
    model.updateMatrixWorld(true)
    // re-pivot the wings at their roots so they can flap
    for (const [name, x] of [['ALA_IZQ', -0.39], ['ALA_DERE', 0.43]] as const) {
      const wing = model.getObjectByName(name)!
      const pivot = new THREE.Group(); pivot.position.set(x, 0.35 - 0.33, 0.03)
      this.botInner.add(pivot); pivot.updateMatrixWorld(true); pivot.attach(wing)
      pivot.userData.side = x < 0 ? -1 : 1
      this.wings.push(pivot)
    }
    for (const n of ['OJO', 'OJO_1']) { const e = model.getObjectByName(n)!; this.eyes.push(e); this.eyeBase.push(e.position.clone()) }
    this.ring = model.getObjectByName('PISO_RUEDA') ?? undefined
    model.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      const m = mesh.material as THREE.MeshStandardMaterial
      if (m.name.startsWith('OJO')) { m.emissive = C('#5ff6ff'); m.emissiveIntensity = 3.2; m.color = C('#0a1a22') }
      else if (m.emissiveMap) { m.emissive = C('#ffffff'); m.emissiveIntensity = 2.2 }
      m.envMapIntensity = 1.4
    })
    this.ready = true
    this.resize(this.w, this.h)
    this.start()
    this.ev.onReady?.()
    await world.grow((p) => this.ev.onGrow?.(p))
  }

  private buildButterflies(g: { scene: THREE.Group; animations: THREE.AnimationClip[] }) {
    const tmpl = new THREE.Group()
    const mesh = g.scene.getObjectByName('Butterfly_single_2_')!, bones = g.scene.getObjectByName('group3')!
    tmpl.add(mesh, bones); bones.position.set(0, 0, 0)
    const clip = g.animations[0]
    const tl = new THREE.TextureLoader()
    const wing = (k: number) => { const t = tl.load(`${this.opts.wingsUrl}/b_${k}.webp`); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t }
    this.fly = new Butterfly(tmpl, clip, null, 0.23)
    this.scene.add(this.fly.group); this.fly.group.position.set(-1.5, 2.6, 0.5)
    const kinds = this.opts.lowPower ? [8, 11] : [8, 1, 11, 7]
    kinds.forEach((k, i) => {
      const b = new Butterfly(tmpl, clip, wing(k), 0.16 + Math.random() * 0.05)
      b.group.position.set(-6 + i * 4, 1.5 + Math.random(), -1.5 - Math.random() * 3); b.seed = i * 1.7 + 0.3
      this.scene.add(b.group); this.ambient.push(b)
    })
  }

  // ----------------------------------------------------------------- public
  resize(w: number, h: number) {
    this.w = Math.max(1, w); this.h = Math.max(1, h)
    this.renderer.setSize(this.w, this.h, false)
    this.composer.setSize(this.w, this.h)
    const aspect = this.w / this.h
    const portrait = aspect < 0.9
    this.camera.fov = portrait ? 58 : 40
    this.camera.aspect = aspect
    this.camera.position.set(0, portrait ? 3.0 : 2.35, portrait ? 11.5 : 10.5)
    this.camera.lookAt(0, portrait ? 3.1 : 2.2, 0)
    this.camera.updateProjectionMatrix()
    const dist = this.camera.position.z
    this.halfW = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * dist * aspect
    this.pollenU.uScale.value = this.renderer.getPixelRatio() * (this.h / 800)
    if (this.ready) this.render()
  }
  pointerMove(x: number, y: number, touch: boolean) { Object.assign(this.pointer, { has: true, x, y, touch, last: performance.now() / 1000 }) }
  pointerLeave() { this.pointer.has = false }
  start() {
    if (this.running || !this.ready || this.disposed) return
    this.running = true
    const loop = (t: number) => { if (!this.running) return; this.raf = requestAnimationFrame(loop); this.timer.update(t); this.update(Math.min(this.timer.getDelta(), 1 / 20)); this.render() }
    this.raf = requestAnimationFrame(loop)
  }
  stop() { this.running = false; cancelAnimationFrame(this.raf) }
  dispose() {
    this.disposed = true; this.stop(); this.timer.dispose()
    this.scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.() })
    this.composer.dispose(); this.renderer.dispose()
  }
  render() { if (this.ready) this.composer.render() }

  // ----------------------------------------------------------------- update
  private toWorld(px: number, py: number, out: THREE.Vector3) {
    this.ray.setFromCamera(new THREE.Vector2((px / this.w) * 2 - 1, -(py / this.h) * 2 + 1), this.camera)
    return this.ray.ray.intersectPlane(this.plane, out) ?? out
  }

  private update(dt: number) {
    this.time += dt
    const t = this.time, rm = this.opts.reducedMotion
    this.pollenU.uTime.value = t
    const now = performance.now() / 1000
    const live = this.pointer.has && now - this.pointer.last < (this.pointer.touch ? 3 : 8)
    const minX = -this.halfW + 0.6, maxX = this.halfW - 0.6

    // ---- butterfly target: the cursor, or its own wandering
    if (this.caught > 0) {
      // held in front of the bot
      this.target.copy(this.pos).add(new THREE.Vector3(0, 0.08, 0.62))
    } else if (live && !rm) {
      this.toWorld(this.pointer.x, this.pointer.y, this.target)
      this.target.y = Math.max(0.9, this.target.y)
    } else {
      // wander, and now and then land on a glowing flower
      this.wander.t += dt
      if (this.wander.land < 0 && this.wander.t > 6 && this.flowers.length) { this.wander.land = Math.floor(Math.random() * this.flowers.length); this.wander.landT = 0 }
      if (this.wander.land >= 0) {
        this.target.copy(this.flowers[this.wander.land]); this.wander.landT += dt
        if (this.wander.landT > 5.5) { this.wander.land = -1; this.wander.t = 0 }
      } else {
        const a = t * 0.35
        this.target.set(clamp(Math.sin(a) * this.halfW * 0.7 + Math.sin(a * 2.3) * 1.2, minX, maxX), 2.6 + Math.sin(a * 1.7) * 0.9 + Math.sin(a * 3.1) * 0.3, 0.6 + Math.sin(a * 0.9) * 0.6)
      }
    }
    this.ambient.forEach((b) => {
      const a = t * 0.22 + b.seed * 3
      const z = -2 - Math.sin(a * 0.7 + b.seed) * 4
      const tgt = new THREE.Vector3(pathX(z) + Math.sin(a) * 5 + Math.sin(a * 2.7 + b.seed) * 1.5, 1.6 + Math.sin(a * 1.9 + b.seed) * 0.7, z)
      b.update(dt, tgt, false, false, rm)
    })
    const landed = this.wander.land >= 0 && !live && this.fly.group.position.distanceTo(this.target) < 0.08
    this.fly.update(dt, this.target, live && !this.pointer.touch && this.caught <= 0, landed, rm)

    // ---- bot steering
    const bp = this.fly.group.position
    const aim = new THREE.Vector3(bp.x, bp.y - 0.05, bp.z - 0.55)
    if (rm) aim.set(2.4, 2.6, 0)
    aim.x = clamp(aim.x, minX, maxX); aim.y = clamp(aim.y, 1.7, 5.2); aim.z = clamp(aim.z, -2.5, 1.2)
    const to = aim.clone().sub(this.pos)
    const dist = to.length()
    this.lungeCool -= dt
    if (this.caught <= 0 && dist < 1.4 && this.fly.speed < 4 && this.lungeCool <= 0 && !rm) { this.lunge = 0.4; this.lungeCool = 1.6 }
    this.lunge = Math.max(0, this.lunge - dt)
    const maxSpeed = this.caught > 0 ? 0.6 : this.lunge > 0 ? 7.5 : 3.6
    const desired = to.clone().normalize().multiplyScalar(maxSpeed * Math.min(1, dist / 1.2))
    const steer = desired.sub(this.vel).clampLength(0, (this.lunge > 0 ? 22 : 8) * dt)
    this.vel.add(steer)
    this.pos.addScaledVector(this.vel, dt)
    const bob = rm ? 0 : Math.sin(t * 2.2) * 0.07
    this.bot.position.set(this.pos.x, this.pos.y + bob, this.pos.z)

    // orientation: face the butterfly, tilt into acceleration like a drone
    const spd = this.vel.length()
    const yaw = clamp(Math.atan2(bp.x - this.pos.x, Math.max(0.8, bp.z - this.pos.z + 2.2)), -0.85, 0.85)
    this.happySpin = Math.max(0, this.happySpin - dt)
    const spin = this.happySpin > 0 ? (1 - this.happySpin / 1.1) * Math.PI * 2 : 0
    this.bot.rotation.y = damp(this.bot.rotation.y, yaw, 6, dt) + 0
    this.botInner.rotation.y = spin
    this.botInner.rotation.z = damp(this.botInner.rotation.z, clamp(-this.vel.x * 0.09, -0.45, 0.45), 6, dt)
    this.botInner.rotation.x = damp(this.botInner.rotation.x, clamp(this.vel.z * 0.08 + (this.lunge > 0 ? 0.25 : 0), -0.35, 0.4), 6, dt)

    // wings: flap faster when fast, clap shut to catch
    this.clap = damp(this.clap, this.caught > 0 && this.caughtT < 1.1 ? 1 : 0, 14, dt)
    this.wings.forEach((wg) => {
      const s = wg.userData.side as number
      const f = 7 + spd * 3.2, amp = 0.18 + Math.min(0.32, spd * 0.07)
      wg.rotation.z = s * (Math.sin(t * f) * amp * (1 - this.clap) - 0.05)
      wg.rotation.y = -s * this.clap * 1.15
    })
    // eyes look at the butterfly
    const look = new THREE.Vector3(clamp((bp.x - this.pos.x) * 0.02, -0.025, 0.025), clamp((bp.y - this.pos.y) * 0.02, -0.02, 0.02), 0)
    this.eyes.forEach((e, i) => { const b = this.eyeBase[i]; e.position.set(b.x + look.x * 5, b.y + look.y * 5, b.z) })
    if (this.ring) this.ring.rotation.y += dt * (1.5 + spd * 1.2)
    this.world.update(rm ? 0 : t, this.bot.position, rm ? 0.3 : 0.8 + Math.min(0.6, spd * 0.12))

    // catching
    const catchPoint = this.pos.clone().add(new THREE.Vector3(Math.sin(this.bot.rotation.y) * 0.6, 0.05, Math.cos(this.bot.rotation.y) * 0.6))
    if (this.caught <= 0 && !rm && this.lungeCool < 1.25 && catchPoint.distanceTo(bp) < 0.34 && this.fly.speed < 3.5) {
      this.caught = 1; this.caughtT = 0; this.count++
      this.sparks.burst(bp, '#ffd36b', 40)
      this.ev.onCatch?.(this.count)
    }
    if (this.caught > 0) {
      this.caughtT += dt
      if (this.caughtT > 1.6) {
        this.caught = 0; this.happySpin = 1.1; this.lungeCool = 2.2
        this.fly.escape(); this.sparks.burst(bp, '#7fe9ff', 60)
      }
    }
    this.sparks.update(dt)
  }
}


// ---------------------------------------------------------------- butterfly
class Butterfly {
  group = new THREE.Group()
  speed = 0
  seed = 0
  private vel = new THREE.Vector3()
  private mixer: THREE.AnimationMixer
  private action: THREE.AnimationAction
  private escapeT = 0
  private escapeDir = new THREE.Vector3()

  constructor(tmpl: THREE.Object3D, clip: THREE.AnimationClip, map: THREE.Texture | null, scale: number) {
    const body = SkeletonUtils.clone(tmpl)
    body.traverse((o) => {
      const m = o as THREE.SkinnedMesh
      if (!m.isSkinnedMesh) return
      const mat = (m.material as THREE.MeshStandardMaterial).clone()
      if (map) mat.map = map
      mat.roughness = 0.6; mat.side = THREE.DoubleSide; mat.alphaTest = 0.5
      mat.emissive = new THREE.Color('#ffffff'); mat.emissiveMap = mat.map; mat.emissiveIntensity = 0.18
      m.material = mat; m.frustumCulled = false; m.castShadow = true
    })
    body.position.y = -0.6 // centre the body on the group
    this.group.add(body)
    this.group.scale.setScalar(scale)
    this.mixer = new THREE.AnimationMixer(body)
    this.action = this.mixer.clipAction(clip); this.action.play(); this.action.time = Math.random() * clip.duration
  }

  escape() { this.escapeT = 0.9; this.escapeDir.set((Math.random() - 0.5) * 2, 1.6, 0.6).normalize() }

  update(dt: number, target: THREE.Vector3, follow: boolean, landed: boolean, rm: boolean) {
    const p = this.group.position
    if (this.escapeT > 0) {
      this.escapeT -= dt
      this.vel.lerp(this.escapeDir.clone().multiplyScalar(6), 0.2)
    } else {
      const to = target.clone().sub(p)
      if (follow) this.vel.lerp(to.multiplyScalar(10), 1 - Math.exp(-dt * 10))
      else this.vel.lerp(to.multiplyScalar(2.2).clampLength(0, 3), 1 - Math.exp(-dt * 3))
    }
    p.addScaledVector(this.vel, dt)
    this.speed = this.vel.length()
    // wing beat speeds up with flight speed, slows right down when resting on a flower
    this.action.timeScale = rm ? 0.6 : landed ? 0.35 : 1.6 + Math.min(1.6, this.speed * 0.35)
    this.mixer.update(dt)
    if (!landed && !rm) p.y += Math.sin(this.action.time * 9) * 0.003
    // head (+z) follows the direction of travel, banking into turns
    const h = Math.hypot(this.vel.x, this.vel.z)
    if (this.speed > 0.15) {
      const yaw = Math.atan2(this.vel.x, this.vel.z)
      let dy = yaw - this.group.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy))
      this.group.rotation.y += dy * (1 - Math.exp(-dt * 7))
      this.group.rotation.x = damp(this.group.rotation.x, clamp(-Math.atan2(this.vel.y, h + 0.4) * 0.7, -0.7, 0.7), 7, dt)
      this.group.rotation.z = damp(this.group.rotation.z, clamp(-dy * 1.2, -0.6, 0.6), 6, dt)
    } else if (landed) { this.group.rotation.x = damp(this.group.rotation.x, 0, 4, dt); this.group.rotation.z = damp(this.group.rotation.z, 0, 4, dt) }
  }
}

// ------------------------------------------------------------------ sparks
class Sparks {
  points: THREE.Points
  private n = 160
  private pos = new Float32Array(this.n * 3)
  private vel = new Float32Array(this.n * 3)
  private life = new Float32Array(this.n)
  private col = new Float32Array(this.n * 3)
  private i = 0
  constructor() {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3))
    g.setAttribute('life', new THREE.BufferAttribute(this.life, 1))
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3))
    this.points = new THREE.Points(g, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
      vertexShader: 'attribute float life; varying float vL; varying vec3 vC; void main(){ vL=life; vC=color; vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=(4.+life*6.)*(12./-mv.z)*1.5; gl_Position=projectionMatrix*mv; }',
      fragmentShader: 'varying float vL; varying vec3 vC; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,0.,d)*vL; gl_FragColor=vec4(vC*2.*a,a); }',
    }))
    this.points.frustumCulled = false
  }
  burst(at: THREE.Vector3, color: string, k: number) {
    const c = C(color)
    for (let j = 0; j < k; j++) {
      const i = this.i++ % this.n
      this.pos.set([at.x, at.y, at.z], i * 3)
      const v = new THREE.Vector3().randomDirection().multiplyScalar(1 + Math.random() * 2.2)
      this.vel.set([v.x, v.y + 0.6, v.z], i * 3); this.life[i] = 1; this.col.set([c.r, c.g, c.b], i * 3)
    }
  }
  update(dt: number) {
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] <= 0) continue
      this.life[i] = Math.max(0, this.life[i] - dt * 1.4)
      this.vel[i * 3 + 1] -= dt * 1.2
      for (let k = 0; k < 3; k++) { this.vel[i * 3 + k] *= 1 - dt * 1.5; this.pos[i * 3 + k] += this.vel[i * 3 + k] * dt }
    }
    const g = this.points.geometry
    g.attributes.position.needsUpdate = true; g.attributes.life.needsUpdate = true; g.attributes.color.needsUpdate = true
  }
}
