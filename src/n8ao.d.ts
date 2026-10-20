declare module 'n8ao' {
  import type { Scene, Camera, Color } from 'three'
  import { Pass } from 'three/examples/jsm/postprocessing/Pass.js'
  export class N8AOPass extends Pass {
    constructor(scene: Scene, camera: Camera, width?: number, height?: number)
    configuration: { aoRadius: number; distanceFalloff: number; intensity: number; halfRes: boolean; color: Color; aoSamples: number; denoiseSamples: number; denoiseRadius: number; gammaCorrection: boolean }
    setSize(w: number, h: number): void
  }
}
