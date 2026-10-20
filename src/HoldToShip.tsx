import { useCallback, useEffect, useRef, useState } from 'react'
import { projects } from './data'

const PICKS = ['sashe', 'uscale', 'roar', 'growcred'].map((s) => projects.find((p) => p.slug === s)!)
const BUILD_SECONDS = 2.4
const CW = 960, CH = 600

type Pair = { live: HTMLImageElement; bp: HTMLCanvasElement }
const cache = new Map<string, Promise<Pair>>()

/** Turn a screenshot into a blueprint: navy paper, faint grid, edges in blueprint blue. */
function blueprintOf(img: HTMLImageElement) {
  const c = document.createElement('canvas'); c.width = CW; c.height = CH
  const x = c.getContext('2d', { willReadFrequently: true })!
  x.drawImage(img, 0, 0, CW, CH)
  const src = x.getImageData(0, 0, CW, CH).data
  const g = new Float32Array(CW * CH)
  for (let i = 0; i < CW * CH; i++) g[i] = src[i * 4] * 0.299 + src[i * 4 + 1] * 0.587 + src[i * 4 + 2] * 0.114
  const out = x.createImageData(CW, CH)
  const o = out.data
  for (let y = 0; y < CH; y++) for (let xx = 0; xx < CW; xx++) {
    const i = y * CW + xx
    let m = 0
    if (xx > 0 && y > 0 && xx < CW - 1 && y < CH - 1) {
      const gx = -g[i - CW - 1] - 2 * g[i - 1] - g[i + CW - 1] + g[i - CW + 1] + 2 * g[i + 1] + g[i + CW + 1]
      const gy = -g[i - CW - 1] - 2 * g[i - CW] - g[i - CW + 1] + g[i + CW - 1] + 2 * g[i + CW] + g[i + CW + 1]
      m = Math.min(1, Math.max(0, (Math.hypot(gx, gy) - 40) / 160))
    }
    const grid = xx % 24 === 0 || y % 24 === 0 ? 0.07 : 0
    const a = Math.max(m, grid)
    o[i * 4] = 11 + (158 - 11) * a
    o[i * 4 + 1] = 20 + (195 - 20) * a
    o[i * 4 + 2] = 38 + (255 - 38) * a
    o[i * 4 + 3] = 255
  }
  x.putImageData(out, 0, 0)
  return c
}
function load(slug: string) {
  if (!cache.has(slug)) cache.set(slug, new Promise<Pair>((res, rej) => {
    const img = new Image()
    img.onload = () => res({ live: img, bp: blueprintOf(img) })
    img.onerror = rej
    img.src = `/work/${slug}-live.webp`
  }))
  return cache.get(slug)!
}

type Result = null | 'wire' | 'half' | 'shipped'
const MSG: Record<Exclude<Result, null>, [string, string]> = {
  wire: ['Wireframe only.', "That's still a drawing. Hold longer."],
  half: ['Half built.', 'It went live with the top missing. The client noticed.'],
  shipped: ['Shipped.', 'Every part built, nothing lost on the way. This one is live:'],
}

export function HoldToShip() {
  const [pick, setPick] = useState(0)
  const [result, setResult] = useState<Result>(null)
  const [holding, setHolding] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)
  const timeEl = useRef<HTMLSpanElement>(null)
  const st = useRef({ p: 0, t: 0, holding: false, pair: null as Pair | null, raf: 0, last: 0, flash: 0, done: false })

  const draw = useCallback(() => {
    const c = canvas.current, s = st.current
    if (!c || !s.pair) return
    const x = c.getContext('2d')!
    x.drawImage(s.pair.bp, 0, 0)
    const yb = Math.round(CH * (1 - s.p))
    if (s.p > 0) {
      x.save(); x.beginPath(); x.rect(0, yb, CW, CH - yb); x.clip()
      x.drawImage(s.pair.live, 0, 0, CW, CH)
      x.restore()
      if (s.p < 1) {
        const gr = x.createLinearGradient(0, yb - 26, 0, yb + 6)
        gr.addColorStop(0, 'rgba(158,195,255,0)'); gr.addColorStop(0.8, 'rgba(158,195,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0.95)')
        x.fillStyle = gr; x.fillRect(0, yb - 26, CW, 32)
      }
    }
    if (s.flash > 0) { x.fillStyle = `rgba(255,236,210,${s.flash * 0.5})`; x.fillRect(0, 0, CW, CH) }
    if (timeEl.current) timeEl.current.textContent = s.t.toFixed(2)
  }, [])

  const loopRef = useRef<(now: number) => void>(() => {})
  useEffect(() => {
    loopRef.current = (now: number) => {
      const s = st.current
      const dt = Math.min(0.05, (now - (s.last || now)) / 1000)
      s.last = now
      if (s.holding && !s.done) {
        s.t = Math.min(s.t + dt, BUILD_SECONDS)
        s.p = s.t / BUILD_SECONDS
        if (s.p >= 1) { s.done = true; s.holding = false; s.flash = 1; setHolding(false); setResult('shipped') }
      }
      s.flash = Math.max(0, s.flash - dt * 2.2)
      draw()
      if (s.holding || s.flash > 0) s.raf = requestAnimationFrame(loopRef.current)
      else s.raf = 0
    }
  }, [draw])

  useEffect(() => {
    let alive = true
    load(PICKS[pick].slug).then((pair) => { if (alive) { st.current.pair = pair; draw() } })
    return () => { alive = false }
  }, [pick, draw])

  const choose = (i: number) => {
    const s = st.current
    s.p = 0; s.t = 0; s.done = false; s.holding = false
    setHolding(false); setResult(null); setPick(i)
  }

  const start = () => {
    const s = st.current
    if (s.holding) return
    if (s.done || result) { s.p = 0; s.t = 0; s.done = false; setResult(null) }
    s.holding = true; s.last = 0
    setHolding(true)
    if (!s.raf) s.raf = requestAnimationFrame(loopRef.current)
  }
  const end = () => {
    const s = st.current
    if (!s.holding) return
    s.holding = false
    setHolding(false)
    if (!s.done) setResult(s.p < 0.34 ? 'wire' : 'half')
  }

  const p = PICKS[pick]
  return (
    <section className="hold" aria-labelledby="hold-title">
      <div className="wrap hold__grid">
        <div className="hold__copy">
          <h2 id="hold-title" className="h2">Hold to ship.</h2>
          <p className="lead">Pick a site, then press and hold. Let go before it's built and you ship it half-done.</p>
          <div className="hold__picks" role="radiogroup" aria-label="Pick a site">
            {PICKS.map((q, i) => (
              <button key={q.slug} role="radio" aria-checked={i === pick} className={i === pick ? 'is-on' : ''} onClick={() => choose(i)}>{q.name}</button>
            ))}
          </div>
          <div className="hold__readout">
            <span className="hold__time"><span ref={timeEl}>0.00</span> s</span>
            <span className="hold__goal">Full build: {BUILD_SECONDS.toFixed(1)} s</span>
          </div>
          <button
            className={`hold__btn${holding ? ' is-down' : ''}`}
            onPointerDown={(e) => { e.preventDefault(); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); start() }}
            onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}
            onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start() } }}
            onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') end() }}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span>{holding ? 'Building…' : result ? 'Hold to try again' : 'Hold to build'}</span>
          </button>
          <div className="hold__result" aria-live="polite">
            {result && <>
              <p className="hold__verdict">{MSG[result][0]}</p>
              <p>{MSG[result][1]} {result === 'shipped' && <a href={p.url} target="_blank" rel="noopener">{p.url.replace(/^https?:\/\/(www\.)?/, '')}</a>}</p>
            </>}
          </div>
        </div>
        <figure className="hold__screen">
          <div className="hold__bar" aria-hidden="true"><i /><i /><i /><span>{p.url.replace(/^https?:\/\//, '')}</span></div>
          <canvas ref={canvas} width={CW} height={CH} role="img" aria-label={`${p.name} website, being built from its wireframe`} />
        </figure>
      </div>
    </section>
  )
}
