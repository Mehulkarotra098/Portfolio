import * as THREE from 'three'

// Procedural stone, sand and onyx textures, painted on the GPU once at load.
const NOISE = /* glsl */ `
vec2 h2(vec2 p){ p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return -1.0+2.0*fract(sin(p)*43758.5453123); }
// tileable gradient noise with period P
float gn(vec2 p, vec2 P){
  vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  vec2 a=mod(i,P), b=mod(i+vec2(1,0),P), c=mod(i+vec2(0,1),P), d=mod(i+vec2(1,1),P);
  return mix(mix(dot(h2(a),f),dot(h2(b),f-vec2(1,0)),u.x), mix(dot(h2(c),f-vec2(0,1)),dot(h2(d),f-vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p, vec2 P){ float s=0.0,a=0.5; for(int i=0;i<6;i++){ s+=a*gn(p,P); p*=2.0; P*=2.0; a*=0.5; } return s; }
float hash(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
`

const KINDS: Record<string, string> = {
  // honed travertine: horizontal bedding, warm bands, small elongated pores
  travertine: `
    vec2 p=uv*vec2(4.0,4.0);
    float bands=fbm(vec2(p.x*0.35,p.y*6.0),vec2(1.4,24.0));
    float fine=fbm(p*vec2(1.5,12.0),vec2(6.0,48.0));
    vec3 base=mix(vec3(0.80,0.72,0.60),vec3(0.90,0.84,0.74),0.5+bands*1.2);
    base=mix(base,vec3(0.74,0.63,0.50),smoothstep(0.15,0.5,fine)*0.35);
    // pores
    vec2 q=uv*vec2(48.0,240.0); vec2 c=floor(q); vec2 f=fract(q)-0.5-(vec2(hash(c+3.1),hash(c+7.7))-0.5)*0.5;
    float r=hash(c); float pore=step(0.955,r)*smoothstep(0.4,0.12,length(f*vec2(0.8,0.6)))*smoothstep(-0.1,0.2,fine);
    base=mix(base,vec3(0.55,0.47,0.38),pore*0.65);
    col=vec4(base,1.0);`,
  // backlit onyx: domain-warped amber veins
  onyx: `
    vec2 p=uv*3.0;
    vec2 w=vec2(fbm(p,vec2(3.0)),fbm(p+5.2,vec2(3.0)));
    float n=fbm(p+3.0*w,vec2(3.0));
    float v=abs(sin((n*6.0+uv.y*3.0)*3.14159));
    vec3 a=vec3(1.0,0.78,0.42), b=vec3(0.62,0.30,0.10), d=vec3(0.98,0.92,0.80);
    vec3 cc=mix(b,a,smoothstep(0.0,0.9,v));
    cc=mix(cc,d,smoothstep(0.92,1.0,v)*0.7);
    cc*=0.85+0.3*fbm(uv*20.0,vec2(20.0));
    col=vec4(cc,1.0);`,
  // nero marquina: black with thin white veins
  marble: `
    vec2 p=uv*2.5;
    vec2 w=vec2(fbm(p,vec2(2.5)),fbm(p+9.1,vec2(2.5)));
    float n=fbm(p*1.3+2.5*w,vec2(3.25));
    float vein=smoothstep(0.035,0.0,abs(n))*0.9+smoothstep(0.012,0.0,abs(n-0.18))*0.5;
    vec3 base=vec3(0.035,0.036,0.04)+0.02*fbm(uv*30.0,vec2(30.0));
    col=vec4(mix(base,vec3(0.78,0.78,0.8),vein),1.0);`,
  // sand albedo with soft mottling
  sand: `
    float m=fbm(uv*6.0,vec2(6.0)); float g=hash(floor(uv*512.0));
    vec3 base=mix(vec3(0.70,0.52,0.36),vec3(0.80,0.62,0.44),0.5+m);
    base*=0.94+0.12*g;
    col=vec4(base,1.0);`,
  // sand ripple normal map
  sandN: `
    float e=1.0/512.0;
    #define H(q) (sin(((q).y*24.0+(q).x*6.0+fbm((q)*3.0,vec2(3.0))*5.0)*6.2831)*0.5+0.5)*0.35*(0.6+fbm((q)*2.0+7.0,vec2(2.0))) + fbm((q)*32.0,vec2(32.0))*0.8
    float hx=H(uv+vec2(e,0.0))-H(uv-vec2(e,0.0));
    float hy=H(uv+vec2(0.0,e))-H(uv-vec2(0.0,e));
    vec3 n=normalize(vec3(-hx*6.0,-hy*6.0,1.0));
    col=vec4(n*0.5+0.5,1.0);`,
}

export function paint(renderer: THREE.WebGLRenderer, kind: keyof typeof KINDS, size = 1024, srgb = true) {
  const rt = new THREE.WebGLRenderTarget(size, size, {
    generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter,
    wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, colorSpace: srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace,
  })
  rt.texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
  const mat = new THREE.ShaderMaterial({
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }',
    fragmentShader: `precision highp float; varying vec2 vUv; ${NOISE}
      void main(){ vec2 uv=vUv; vec4 col; ${KINDS[kind]} gl_FragColor=${srgb ? 'vec4(pow(col.rgb,vec3(2.2)),1.0)' : 'col'}; }`,
  })
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
  const cam = new THREE.Camera()
  const prev = renderer.getRenderTarget()
  renderer.setRenderTarget(rt)
  renderer.render(quad, cam)
  renderer.setRenderTarget(prev)
  quad.geometry.dispose(); mat.dispose()
  return rt
}
