import { useEffect, useRef, useState } from 'react'

// Work in progress: the hero scene is in place; the rest of the redesign is being built.
export default function App() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [caught, setCaught] = useState(0)
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    let alive = true
    let stop = () => {}
    import('./hero/Meadow').then(({ Meadow }) => {
      if (!alive) return
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      const low = (navigator.hardwareConcurrency || 8) <= 4
      const m = new Meadow(c, { reducedMotion: reduced, lowPower: low, modelUrl: '/model/neil.glb' }, { onCatch: setCaught })
      const fit = () => m.resize(c.clientWidth, c.clientHeight)
      const ro = new ResizeObserver(fit); ro.observe(c); fit()
      const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); m.pointerMove(e.clientX - r.left, e.clientY - r.top, e.pointerType === 'touch') }
      window.addEventListener('pointermove', move)
      stop = () => { ro.disconnect(); window.removeEventListener('pointermove', move); m.dispose() }
    })
    return () => { alive = false; stop() }
  }, [])
  return (
    <main className="wip">
      <canvas ref={canvas} className="wip__scene" aria-hidden="true" />
      <div className="wip__copy">
        <p>Mehul Karotra, UI/UX developer and designer in Mumbai</p>
        <h1>I design interfaces, then I build them.</h1>
        <p className="wip__hint">Move your cursor: the bot is trying to catch the butterfly. Caught {caught} {caught === 1 ? 'time' : 'times'}.</p>
      </div>
    </main>
  )
}
