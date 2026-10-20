// Solarpunk meadow: a hovering bot (Bot Neil by Oscar Creativo, CC BY 4.0) chases a morpho butterfly.
// On desktop the butterfly follows the cursor; on touch it flies by itself and follows your finger.
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

export type MeadowEvents = { onReady?: () => void; onCatch?: (n: number) => void; onFrame?: (info: { caught: boolean }) => void }
export type MeadowOptions = { reducedMotion: boolean; lowPower: boolean; modelUrl: string }

const clamp = THREE.MathUtils.clamp
const damp = THREE.MathUtils.damp
const C = (h: string) => new THREE.Color(h)

export class Meadow {
  private renderer: THREE.WebGLRenderer
  private composer!: EffectComposer
  private bloom?: UnrealBloomPass
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200)
  private timer = new THREE.Timer()
  private raf = 0
  private running = false
  private disposed = false
  private ready = false
  private w = 1
  private h = 1
  private halfW = 5
  private time = 0

  private bot = new THREE.Group()
  private botInner = new THREE.Group()
  private wings: THREE.Group[] = []
  private eyes: THREE.Object3D[] = []
  private eyeBase: THREE.Vector3[] = []
  private ring?: THREE.Object3D
  private shadow!: THREE.Mesh
  private fly = new Butterfly()
  private grass!: THREE.Mesh
  private grassU = { uTime: { value: 0 }, uBot: { value: new THREE.Vector3() }, uPower: { value: 1 } }
  private pollen!: THREE.Points
  private turbines: THREE.Object3D[] = []
  private sparks = new Sparks()
  private flowers: THREE.Vector3[] = []

  // state
  private pos = new THREE.Vector3(2.2, 1.6, 0)
  private vel = new THREE.Vector3()
  private lunge = 0
  private lungeCool = 0
  private caught = 0
  private caughtT = 0
  private count = 0
  private clap = 0
  private happySpin = 0
  private pointer = { has: false, x: 0, y: 0, last: -99, touch: false }
  private target = new THREE.Vector3(0, 2, 0.5)
  private wander = { t: 0, land: -1, landT: 0 }
  private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.5)
  private ray = new THREE.Raycaster()

  private opts: MeadowOptions
  private ev: MeadowEvents
  constructor(canvas: HTMLCanvasElement, opts: MeadowOptions, ev: MeadowEvents = {}) {
    this.opts = opts; this.ev = ev
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.lowPower, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.25 : 1.6))
    this.renderer.toneMapping = THREE.NeutralToneMapping
    this.renderer.toneMappingExposure = 1.0
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.65
    this.timer.connect(document)

    this.buildWorld()
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    if (!opts.lowPower) { this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.55, 0.88); this.composer.addPass(this.bloom) }
    this.composer.addPass(new OutputPass())
    this.loadBot()
  }

  // ------------------------------------------------------------------ world
  private buildWorld() {
    const s = this.scene
    s.add(new THREE.HemisphereLight('#e3f4ec', '#4f7d4c', 1.15))
    const sun = new THREE.DirectionalLight('#ffe1ae', 2.4); sun.position.set(-6, 9, 6); s.add(sun)
    const back = new THREE.DirectionalLight('#bff3e8', 1.2); back.position.set(5, 4, -6); s.add(back)

    // sky
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(260, 110), new THREE.ShaderMaterial({
      depthWrite: false,
      uniforms: { top: { value: C('#9fd7c7') }, mid: { value: C('#d8eedf') }, low: { value: C('#ffe9b8') }, sun: { value: new THREE.Vector2(0.3, 0.42) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: `uniform vec3 top, mid, low; uniform vec2 sun; varying vec2 vUv;
        void main(){ float y=vUv.y; vec3 c=mix(low, mid, smoothstep(0.38,0.55,y)); c=mix(c, top, smoothstep(0.55,0.9,y));
          float d=distance(vUv*vec2(2.4,1.), sun*vec2(2.4,1.)); c+=vec3(1.,.85,.55)*(0.55*exp(-d*d*120.)+0.18*exp(-d*9.));
          gl_FragColor=vec4(c,1.); }`,
    }))
    sky.position.set(0, 18, -70); s.add(sky)

    // hills, far to near
    const hill = (z: number, col: string, amp: number, base: number, seed: number) => {
      const shape = new THREE.Shape(); shape.moveTo(-90, -8)
      for (let x = -90; x <= 90; x += 2) {
        const y = base + amp * (Math.sin(x * 0.045 + seed) * 0.6 + Math.sin(x * 0.11 + seed * 2.1) * 0.3 + Math.sin(x * 0.23 + seed * 3.7) * 0.1)
        shape.lineTo(x, y)
      }
      shape.lineTo(90, -8); shape.closePath()
      const m = new THREE.Mesh(new THREE.ShapeGeometry(shape, 1), new THREE.MeshBasicMaterial({ color: col }))
      m.position.z = z; s.add(m); return m
    }
    hill(-60, '#bfe0cc', 4, 2.2, 1)
    hill(-44, '#9fcfae', 3.2, 0.8, 4)
    hill(-30, '#7fbb8d', 2.4, -0.4, 7)
    // wind turbines on the far ridge
    const white = new THREE.MeshBasicMaterial({ color: '#e3ece2' })
    for (const [x, z, sc] of [[-21, -44, 1], [-12.5, -44, 0.8], [17, -44, 0.9], [26, -60, 1.3]] as const) {
      const g = new THREE.Group()
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.14, 7, 8), white); pole.position.y = 3.5
      const hub = new THREE.Group(); hub.position.set(0, 7, 0.15)
      for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.4, 0.04), white); b.position.y = 1.7; const arm = new THREE.Group(); arm.rotation.z = (i * Math.PI * 2) / 3; arm.add(b); hub.add(arm) }
      g.add(pole, hub); g.position.set(x, 1.2, z); g.scale.setScalar(sc); s.add(g); this.turbines.push(hub)
    }
    s.fog = new THREE.Fog('#d9eedf', 18, 70)

    // ground
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), new THREE.MeshStandardMaterial({ color: '#3d7347', roughness: 1 }))
    ground.rotation.x = -Math.PI / 2; ground.position.z = -20; s.add(ground)

    // grass
    const count = this.opts.lowPower ? 5000 : 14000
    const blade = new THREE.PlaneGeometry(0.07, 1, 1, 4); blade.translate(0, 0.5, 0)
    const bp = blade.attributes.position
    for (let i = 0; i < bp.count; i++) { const y = bp.getY(i); bp.setX(i, bp.getX(i) * (1 - y * 0.92)) }
    const geo = new THREE.InstancedBufferGeometry(); geo.index = blade.index; geo.attributes.position = blade.attributes.position
    const off = new Float32Array(count * 3), sh = new Float32Array(count), ang = new Float32Array(count), tint = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const z = 3.5 - Math.pow(Math.random(), 0.75) * 16
      off.set([(Math.random() - 0.5) * (30 + (3.5 - z) * 2.4), 0, z], i * 3)
      sh[i] = 0.35 + Math.random() * 0.55 + (z < -6 ? 0.25 : 0)
      ang[i] = Math.random() * Math.PI
      tint[i] = Math.random()
    }
    geo.setAttribute('offset', new THREE.InstancedBufferAttribute(off, 3))
    geo.setAttribute('sh', new THREE.InstancedBufferAttribute(sh, 1))
    geo.setAttribute('ang', new THREE.InstancedBufferAttribute(ang, 1))
    geo.setAttribute('tint', new THREE.InstancedBufferAttribute(tint, 1))
    geo.instanceCount = count
    this.grass = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: { ...this.grassU, base: { value: C('#1f5236') }, tip: { value: C('#a8d36b') }, fogC: { value: C('#d9eedf') } },
      vertexShader: `attribute vec3 offset; attribute float sh; attribute float ang; attribute float tint;
        uniform float uTime; uniform vec3 uBot; uniform float uPower; varying float vH; varying float vT; varying float vF;
        void main(){
          float h=position.y; float c=cos(ang), s=sin(ang);
          vec3 w=offset+vec3(position.x*c, h*sh, position.x*s);
          float b=h*h;
          float wind=sin(uTime*1.5+offset.x*0.35+offset.z*0.22)*0.6+sin(uTime*2.6+offset.x*1.4+offset.z)*0.25;
          w.x+=wind*0.22*b*sh; w.z+=wind*0.06*b;
          vec2 d=offset.xz-uBot.xz; float dist=length(d)+1e-3;
          float inf=uPower*smoothstep(1.9,0.0,dist)*smoothstep(3.2,0.5,uBot.y);
          w.xz+=d/dist*inf*0.55*b*sh; w.y-=inf*0.3*b*sh;
          vH=h; vT=tint; vec4 mv=viewMatrix*vec4(w,1.); vF=smoothstep(10.,36.,-mv.z);
          gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 base, tip, fogC; varying float vH; varying float vT; varying float vF;
        void main(){ vec3 c=mix(base, tip, smoothstep(0.,1.,vH))*(0.82+vT*0.32); c+=vec3(1.,.86,.5)*0.16*vH*vH; c=mix(c,fogC,vF*0.85); gl_FragColor=vec4(c,1.); }`,
    }))
    this.grass.frustumCulled = false
    s.add(this.grass)

    // flowers: white daisies and a few glowing seed-lamps (the "tech" in the meadow)
    const daisy = new THREE.InstancedMesh(new THREE.SphereGeometry(0.034, 8, 6), new THREE.MeshStandardMaterial({ color: '#e9e4cf', roughness: 0.9 }), 90)
    const lamp = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 12, 8), new THREE.MeshStandardMaterial({ color: '#0fb5a8', emissive: '#37f1dc', emissiveIntensity: 2.2 }), 18)
    const stem = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.008, 0.012, 1, 5), new THREE.MeshStandardMaterial({ color: '#2d6a3e' }), 18)
    const m4 = new THREE.Matrix4()
    for (let i = 0; i < 90; i++) { const z = 3 - Math.random() * 12; m4.makeTranslation((Math.random() - 0.5) * 26, 0.45 + Math.random() * 0.35, z); daisy.setMatrixAt(i, m4) }
    for (let i = 0; i < 18; i++) {
      const z = 2.5 - Math.random() * 8, x = (Math.random() - 0.5) * 18, hh = 0.9 + Math.random() * 0.7
      m4.makeTranslation(x, hh, z); lamp.setMatrixAt(i, m4)
      m4.compose(new THREE.Vector3(x, hh / 2, z), new THREE.Quaternion(), new THREE.Vector3(1, hh, 1)); stem.setMatrixAt(i, m4)
      if (z > -1.5 && Math.abs(x) < 7) this.flowers.push(new THREE.Vector3(x, hh + 0.07, z))
    }
    s.add(daisy, lamp, stem)

    // floating pollen
    const pc = this.opts.lowPower ? 160 : 360
    const pp = new Float32Array(pc * 3), ps = new Float32Array(pc)
    for (let i = 0; i < pc; i++) { pp.set([(Math.random() - 0.5) * 24, Math.random() * 6, 3 - Math.random() * 12], i * 3); ps[i] = Math.random() }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); pg.setAttribute('seed', new THREE.BufferAttribute(ps, 1))
    this.pollen = new THREE.Points(pg, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: this.grassU.uTime, uScale: { value: 1 } },
      vertexShader: `attribute float seed; uniform float uTime; uniform float uScale; varying float vA;
        void main(){ vec3 p=position; p.y=mod(p.y+uTime*(0.08+seed*0.12),6.); p.x+=sin(uTime*0.4+seed*20.)*0.6; p.z+=cos(uTime*0.3+seed*13.)*0.4;
          vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=uScale*(2.+seed*3.5)*(14./-mv.z); vA=(0.35+0.65*sin(uTime*2.+seed*30.)*0.5+0.5)*smoothstep(0.,0.6,p.y)*smoothstep(6.,4.5,p.y);
          gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `varying float vA; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,.0,d); gl_FragColor=vec4(vec3(1.4,1.15,.6)*a*vA,a*vA); }`,
    }))
    this.pollen.frustumCulled = false
    s.add(this.pollen)

    // soft shadow under the bot
    const cv = document.createElement('canvas'); cv.width = cv.height = 128
    const g2 = cv.getContext('2d')!; const gr = g2.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(10,30,15,0.55)'); gr.addColorStop(1, 'rgba(10,30,15,0)'); g2.fillStyle = gr; g2.fillRect(0, 0, 128, 128)
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }))
    this.shadow.rotation.x = -Math.PI / 2; this.shadow.position.y = 0.02; s.add(this.shadow)

    s.add(this.fly.group, this.sparks.points)
    this.fly.group.position.set(-1.5, 2.2, 0.5)
  }

  private async loadBot() {
    const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(this.opts.modelUrl)
    if (this.disposed) return
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
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
      if (!m || !(o as THREE.Mesh).isMesh) return
      if (m.name.startsWith('OJO')) { m.emissive = C('#5ff6ff'); m.emissiveIntensity = 3.2; m.color = C('#0a1a22') }
      else if (m.emissiveMap) { m.emissive = C('#ffffff'); m.emissiveIntensity = 2.2 }
      m.envMapIntensity = 1.1
    })
    this.ready = true
    this.resize(this.w, this.h)
    this.ev.onReady?.()
    this.start()
  }

  // ----------------------------------------------------------------- public
  resize(w: number, h: number) {
    this.w = Math.max(1, w); this.h = Math.max(1, h)
    this.renderer.setSize(this.w, this.h, false)
    this.composer?.setSize(this.w, this.h)
    const aspect = this.w / this.h
    const portrait = aspect < 0.9
    this.camera.fov = portrait ? 46 : 34
    this.camera.aspect = aspect
    this.camera.position.set(0, portrait ? 2.6 : 2.0, portrait ? 10.5 : 9)
    this.camera.lookAt(0, portrait ? 2.3 : 1.7, 0)
    this.camera.updateProjectionMatrix()
    const dist = this.camera.position.z
    this.halfW = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * dist * aspect
    const pm = this.pollen.material as THREE.ShaderMaterial
    pm.uniforms.uScale.value = this.renderer.getPixelRatio() * (this.h / 800)
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
    this.composer?.dispose(); this.renderer.dispose()
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
    this.grassU.uTime.value = rm ? 0 : t
    this.turbines.forEach((h, i) => (h.rotation.z -= dt * (0.6 + i * 0.12) * (rm ? 0 : 1)))
    const now = performance.now() / 1000
    const live = this.pointer.has && now - this.pointer.last < (this.pointer.touch ? 3 : 8)
    const minX = -this.halfW + 0.6, maxX = this.halfW - 0.6

    // ---- butterfly target: the cursor, or its own wandering
    if (this.caught > 0) {
      // held in front of the bot
      this.target.copy(this.pos).add(new THREE.Vector3(0, 0.08, 0.62))
    } else if (live && !rm) {
      this.toWorld(this.pointer.x, this.pointer.y, this.target)
      this.target.y = Math.max(0.35, this.target.y)
    } else {
      // wander, and now and then land on a glowing flower
      this.wander.t += dt
      if (this.wander.land < 0 && this.wander.t > 6 && this.flowers.length) { this.wander.land = Math.floor(Math.random() * this.flowers.length); this.wander.landT = 0 }
      if (this.wander.land >= 0) {
        this.target.copy(this.flowers[this.wander.land]); this.wander.landT += dt
        if (this.wander.landT > 5.5) { this.wander.land = -1; this.wander.t = 0 }
      } else {
        const a = t * 0.35
        this.target.set(clamp(Math.sin(a) * this.halfW * 0.7 + Math.sin(a * 2.3) * 1.2, minX, maxX), 2.0 + Math.sin(a * 1.7) * 0.9 + Math.sin(a * 3.1) * 0.3, 0.6 + Math.sin(a * 0.9) * 0.6)
      }
    }
    const landed = this.wander.land >= 0 && !live && this.fly.group.position.distanceTo(this.target) < 0.08
    this.fly.update(dt, this.target, live && !this.pointer.touch && this.caught <= 0, landed, rm)

    // ---- bot steering
    const bp = this.fly.group.position
    const aim = new THREE.Vector3(bp.x, bp.y - 0.05, bp.z - 0.55)
    if (rm) aim.set(2.2, 1.6, 0)
    aim.x = clamp(aim.x, minX, maxX); aim.y = clamp(aim.y, 0.7, 4.2); aim.z = clamp(aim.z, -1.5, 1.2)
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
    this.grassU.uBot.value.copy(this.bot.position)
    this.grassU.uPower.value = rm ? 0.3 : 0.75 + Math.min(0.6, spd * 0.12)
    this.shadow.position.set(this.pos.x, 0.03, this.pos.z)
    const sh = clamp(1.3 - this.pos.y * 0.25, 0.25, 1)
    this.shadow.scale.setScalar(0.7 + this.pos.y * 0.25); (this.shadow.material as THREE.MeshBasicMaterial).opacity = sh

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
    this.ev.onFrame?.({ caught: this.caught > 0 })
  }
}

// ---------------------------------------------------------------- butterfly
class Butterfly {
  group = new THREE.Group()
  speed = 0
  private wingsL = new THREE.Group()
  private wingsR = new THREE.Group()
  private vel = new THREE.Vector3()
  private phase = 0
  private escapeT = 0
  private escapeDir = new THREE.Vector3()

  constructor() {
    const tex = new THREE.CanvasTexture(wingCanvas()); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4
    const mat = new THREE.MeshPhysicalMaterial({ map: tex, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.32, metalness: 0.15, iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 620], emissive: '#2a7dff', emissiveMap: tex, emissiveIntensity: 0.9 })
    const wing = (flip: number) => {
      const g = new THREE.Group()
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), mat)
      m.position.set(flip * 0.2, 0.0, 0); m.scale.x = flip
      g.add(m); return g
    }
    this.wingsL.add(wing(-1)); this.wingsR.add(wing(1))
    const dark = new THREE.MeshStandardMaterial({ color: '#141a2a', roughness: 0.6 })
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.17, 4, 8), dark)
    body.position.y = 0.0
    const inner = new THREE.Group(); inner.rotation.x = -0.45 // wings open towards the viewer, body along local y
    inner.add(this.wingsL, this.wingsR, body)
    for (const s of [-1, 1]) {
      const a = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.13, 4), dark)
      a.position.set(s * 0.025, 0.15, 0.0); a.rotation.z = -s * 0.4; inner.add(a)
    }
    this.group.add(inner)
    this.group.scale.setScalar(2.1)
  }

  escape() { this.escapeT = 0.9; this.escapeDir.set((Math.random() - 0.5) * 2, 1.6, 0.6).normalize() }

  update(dt: number, target: THREE.Vector3, follow: boolean, landed: boolean, rm: boolean) {
    const p = this.group.position
    if (this.escapeT > 0) {
      this.escapeT -= dt
      this.vel.lerp(this.escapeDir.clone().multiplyScalar(6), 0.2)
    } else {
      const to = target.clone().sub(p)
      if (follow) { this.vel.lerp(to.multiplyScalar(10), 1 - Math.exp(-dt * 10)) }
      else { this.vel.lerp(to.multiplyScalar(2.2).clampLength(0, 3), 1 - Math.exp(-dt * 3)) }
    }
    p.addScaledVector(this.vel, dt)
    this.speed = this.vel.length()
    // flutter: a quick flap with a little lift on each beat
    const rate = landed ? 2.2 : 15 + Math.min(10, this.speed * 1.5)
    this.phase += dt * (rm ? 4 : rate)
    const flap = landed ? 0.35 + Math.sin(this.phase) * 0.35 : Math.sin(this.phase) * 1.05 + 0.25
    this.wingsL.rotation.y = flap; this.wingsR.rotation.y = -flap
    if (!landed && !rm) p.y += Math.sin(this.phase) * 0.004
    // face the direction of travel
    const h = Math.hypot(this.vel.x, this.vel.z)
    if (this.speed > 0.15) {
      const yaw = clamp(Math.atan2(this.vel.x, Math.abs(this.vel.z) + 1.2), -0.7, 0.7)
      this.group.rotation.y = damp(this.group.rotation.y, yaw, 8, dt)
      this.group.rotation.x = damp(this.group.rotation.x, clamp(-Math.atan2(this.vel.y, h + 0.5) * 0.6, -0.6, 0.6), 8, dt)
    } else if (landed) { this.group.rotation.x = damp(this.group.rotation.x, -0.2, 4, dt) }
  }
}

function wingCanvas() {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const g = c.getContext('2d')!
  // forewing (top) and hindwing (bottom) for the right side; mirrored for the left
  const fore = new Path2D('M8 132 C 40 60, 140 10, 238 34 C 250 70, 214 116, 150 132 C 100 140, 40 140, 8 132 Z')
  const hind = new Path2D('M8 132 C 70 136, 150 140, 186 176 C 210 210, 170 246, 120 236 C 70 226, 30 186, 8 132 Z')
  const fill = (p: Path2D) => {
    const gr = g.createLinearGradient(0, 132, 240, 60)
    gr.addColorStop(0, '#0b2a8f'); gr.addColorStop(0.35, '#1f6dff'); gr.addColorStop(0.7, '#5fd8ff'); gr.addColorStop(1, '#bff6ff')
    g.fillStyle = gr; g.fill(p)
    g.save(); g.clip(p)
    g.lineWidth = 16; g.strokeStyle = '#091433'; g.stroke(p) // dark border band
    g.strokeStyle = 'rgba(8,20,60,0.45)'; g.lineWidth = 1.6
    for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(10, 132); g.quadraticCurveTo(110, 90 + i * 14, 236 - i * 8, 30 + i * 30); g.stroke() }
    g.fillStyle = '#ffffff'
    for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(200 - i * 6, 46 + i * 15, 3.2, 0, Math.PI * 2); g.fill() }
    g.restore()
  }
  fill(hind); fill(fore)
  return c
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
