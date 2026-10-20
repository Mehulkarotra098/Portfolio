import * as THREE from 'three'

// One set of uniforms drives the "drawn vs built" state of every material in the scene.
export const BP = {
  uSweep: { value: -1.0 },                         // world height below which things are built
  uLens: { value: new THREE.Vector3(-999, -999, 0) }, // cursor lens: x, y (device px, GL origin), radius
  uLensOn: { value: 1.0 },
  uTime: { value: 0 },
  uPaper: { value: new THREE.Color('#0b1426') },
  uInk: { value: new THREE.Color('#9ec3ff') },
}

export const MASK_GLSL = /* glsl */ `
uniform float uSweep; uniform vec3 uLens; uniform float uLensOn; uniform float uTime; uniform vec3 uPaper; uniform vec3 uInk;
float bpHash(vec2 p){ return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453); }
float bpNoise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(bpHash(i),bpHash(i+vec2(1,0)),f.x),mix(bpHash(i+vec2(0,1)),bpHash(i+vec2(1,1)),f.x),f.y); }
float bpBuilt(vec3 wp){
  float edge=uSweep+(bpNoise(wp.xz*0.9)-0.5)*0.35;
  float s=1.0-smoothstep(edge-0.06,edge+0.06,wp.y);
  float d=distance(gl_FragCoord.xy,uLens.xy);
  float wob=(bpNoise(gl_FragCoord.xy*0.03+uTime*0.6)-0.5)*uLens.z*0.06;
  float l=(1.0-smoothstep(uLens.z*0.94,uLens.z,d+wob))*uLensOn;
  return clamp(max(s,l),0.0,1.0);
}
float bpScan(vec3 wp){ return exp(-abs(wp.y-uSweep)*9.0)*step(-0.5,uSweep)*(1.0-step(7.5,uSweep)); }
float bpGrid(vec3 wp, vec3 n){
  vec3 a=abs(n); vec2 g= a.y>0.6 ? wp.xz : (a.x>a.z ? wp.zy : wp.xy);
  vec2 f=abs(fract(g)-0.5); vec2 w=fwidth(g)*1.2;
  float m=max(smoothstep(w.x*1.5,0.0,0.5-f.x),smoothstep(w.y*1.5,0.0,0.5-f.y));
  return m;
}
`

type Opts = { flat?: boolean; glass?: boolean }

/** Patch a built-in material so it blends from blueprint (paper + grid) to its real look. */
export function patch(mat: THREE.Material, opts: Opts = {}) {
  const m = mat as THREE.Material & { onBeforeCompile: (s: THREE.WebGLProgramParametersWithUniforms) => void }
  m.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, BP)
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBpW;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvBpW=(modelMatrix*vec4(transformed,1.0)).xyz;')
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBpW;\n' + MASK_GLSL)
      .replace('#include <fog_fragment>', `#include <fog_fragment>
        {
          float b=bpBuilt(vBpW);
          vec3 nW=normalize(cross(dFdx(vBpW),dFdy(vBpW)));
          float shade=0.55+0.45*abs(dot(nW,normalize(vec3(-0.4,0.8,0.5))));
          float g=bpGrid(vBpW,nW);
          float dist=length(vBpW-cameraPosition);
          vec3 bp=uPaper*(1.5+shade*1.2)+uInk*g*0.08*${opts.glass ? '0.0' : '1.0'};
          bp=mix(bp,uPaper,smoothstep(40.0,140.0,dist));
          gl_FragColor.rgb=mix(bp,gl_FragColor.rgb,b)+uInk*bpScan(vBpW)*2.2*(1.0-b*0.5);
          ${opts.glass ? 'gl_FragColor.a=mix(0.05,gl_FragColor.a,b);' : ''}
        }`)
  }
  m.customProgramCacheKey = () => 'bp' + (opts.flat ? 'f' : '') + (opts.glass ? 'g' : '')
  return mat
}

const edgeMat = () => new THREE.ShaderMaterial({
  uniforms: { ...BP, uAlpha: { value: 1 } },
  transparent: true, depthWrite: false,
  vertexShader: 'varying vec3 vBpW; void main(){ vec4 w=modelMatrix*vec4(position,1.0); vBpW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
  fragmentShader: `uniform float uAlpha; varying vec3 vBpW; ${MASK_GLSL}
    void main(){ float b=bpBuilt(vBpW); float d=length(vBpW-cameraPosition);
      float a=(1.0-b)*uAlpha*mix(1.0,0.25,smoothstep(30.0,120.0,d));
      if(a<0.01) discard; gl_FragColor=vec4(uInk*1.6,a); }`,
})
let sharedEdge: THREE.ShaderMaterial | null = null
export function edgesFor(mesh: THREE.Mesh, angle = 25) {
  sharedEdge ??= edgeMat()
  const l = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, angle), sharedEdge)
  l.position.copy(mesh.position); l.quaternion.copy(mesh.quaternion); l.scale.copy(mesh.scale)
  l.renderOrder = 2
  return l
}
export const edgeMaterial = () => (sharedEdge ??= edgeMat())

/** Sky dome: blueprint star chart until the sweep passes the roof, then dusk (or night). */
export function makeSky() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { ...BP, uNight: { value: 0 }, uSun: { value: new THREE.Vector3(-0.6, -0.012, -0.8).normalize() } },
    vertexShader: 'varying vec3 vDir; varying vec3 vBpW; void main(){ vec4 w=modelMatrix*vec4(position,1.0); vBpW=w.xyz; vDir=normalize(position); gl_Position=projectionMatrix*viewMatrix*w; gl_Position.z=gl_Position.w; }',
    fragmentShader: `uniform float uNight; uniform vec3 uSun; varying vec3 vDir; varying vec3 vBpW; ${MASK_GLSL}
      vec3 dusk(vec3 d){
        float h=d.y; float s=max(dot(d,uSun),0.0);
        vec3 zen=vec3(0.018,0.03,0.09), mid=vec3(0.09,0.12,0.26), hor=vec3(0.95,0.40,0.16);
        vec3 c=mix(mid,zen,smoothstep(0.08,0.65,h));
        c=mix(hor,c,smoothstep(-0.01,0.16+0.12*pow(s,3.0),h));
        c+=vec3(1.4,0.6,0.25)*pow(s,40.0)*0.35+vec3(0.9,0.4,0.18)*pow(s,6.0)*0.25*smoothstep(0.4,0.0,h);
        c=mix(c,vec3(0.10,0.07,0.08),smoothstep(0.0,-0.08,h));
        return c;
      }
      vec3 night(vec3 d){
        float h=d.y; vec3 c=mix(vec3(0.05,0.06,0.12),vec3(0.006,0.01,0.03),smoothstep(0.0,0.5,h));
        c+=vec3(0.12,0.08,0.10)*smoothstep(0.25,0.0,h)*max(dot(d,uSun)*0.5+0.5,0.0);
        vec2 sp=vec2(atan(d.z,d.x)*700.0, asin(clamp(d.y,-1.0,1.0))*700.0);
        vec2 cs=fract(sp)-0.5; float st=step(0.992,bpHash(floor(sp)))*smoothstep(0.35,0.0,length(cs))*smoothstep(0.02,0.3,h)*(0.4+0.6*bpHash(floor(sp)+3.0));
        c+=vec3(0.9,0.92,1.0)*st*(0.5+0.5*sin(uTime*2.0+bpHash(floor(sp))*40.0));
        return c;
      }
      void main(){
        vec3 d=normalize(vDir);
        vec3 real=mix(dusk(d),night(d),uNight);
        // blueprint: star-chart graticule
        float lon=atan(d.z,d.x)/6.28318*72.0, lat=asin(clamp(d.y,-1.0,1.0))/1.5708*18.0;
        vec2 g=vec2(lon,lat); vec2 f=abs(fract(g)-0.5); vec2 w=fwidth(g);
        float grid=max(smoothstep(w.x*1.2,0.0,0.5-f.x),smoothstep(w.y*1.2,0.0,0.5-f.y))*smoothstep(-0.05,0.2,d.y);
        float horizon=smoothstep(0.004,0.0,abs(d.y))*1.0;
        vec3 bp=uPaper*1.0+uInk*(grid*0.06+horizon*0.5);
        float b=clamp((uSweep-6.0)/1.2,0.0,1.0);
        float dl=distance(gl_FragCoord.xy,uLens.xy);
        b=max(b,(1.0-smoothstep(uLens.z*0.94,uLens.z,dl))*uLensOn);
        gl_FragColor=vec4(mix(bp,real,b),1.0);
      }`,
  })
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), mat)
  sky.frustumCulled = false
  sky.renderOrder = -1
  return sky
}
