import { useEffect, useRef, useState } from 'react'
import { contact } from './data'
import { sstep, usePin } from './scroll'
import { WA } from './icons'

// The hero is a design canvas: real frames of Mehul's sites laid out like a Figma file.
// Mehul's multiplayer cursor chases yours. Scrolling zooms the canvas into one frame.

type Frame = { id: string; src: string; x: number; y: number; w: number; label: string; phone?: boolean; size: string; note?: string }
const LAND = { w: 1600, h: 900 }
const PORT = { w: 600, h: 1300 }
const landFrames: Frame[] = [
  { id: 'growcred', src: 'growcred-live', x: 300, y: -175, w: 420, label: 'GrowCred / Dashboard', size: '1440 × 900' },
  { id: 'sashe', src: 'sashe-live', x: 860, y: 92, w: 560, label: 'Sashe by Prachi / Home', size: '1440 × 900', note: 'Love it. Ship it!' },
  { id: 'sashe-m', src: 'sashe-mobile', x: 1452, y: 246, w: 150, label: 'Sashe / Mobile', size: '390 × 872', phone: true },
  { id: 'antrah-m', src: 'antrah-mobile', x: 858, y: 470, w: 128, label: 'Antrah / Mobile', size: '390 × 872', phone: true },
  { id: 'uscale', src: 'uscale-live', x: 1018, y: 496, w: 430, label: 'U Scale / Home', size: '1440 × 900' },
  { id: 'tis', src: 'tis-live', x: 1478, y: 640, w: 400, label: 'TIS Admissions / Home', size: '1440 × 900' },
  { id: 'vidhi', src: 'vidhi-live', x: 64, y: 712, w: 380, label: 'Vidhi Parmar / Home', size: '1440 × 900' },
  { id: 'roar', src: 'roar-live', x: 476, y: 736, w: 350, label: 'Roar Arena / Home', size: '1440 × 900' },
]
const portFrames: Frame[] = [
  { id: 'growcred', src: 'growcred-live', x: 250, y: -150, w: 400, label: 'GrowCred / Dashboard', size: '1440 × 900' },
  { id: 'sashe', src: 'sashe-live', x: 24, y: 820, w: 410, label: 'Sashe by Prachi / Home', size: '1440 × 900', note: 'Love it. Ship it!' },
  { id: 'sashe-m', src: 'sashe-mobile', x: 452, y: 760, w: 132, label: 'Sashe / Mobile', size: '390 × 872', phone: true },
  { id: 'uscale', src: 'uscale-live', x: -150, y: 1110, w: 360, label: 'U Scale / Home', size: '1440 × 900' },
  { id: 'roar', src: 'roar-live', x: 250, y: 1120, w: 360, label: 'Roar Arena / Home', size: '1440 × 900' },
]
const ZOOM_TO = 'sashe-m'
const CATCH_LINES = ['Got you.', 'Caught you. Shall we build yours?', 'Too slow. Want a website?', 'Again! Okay, WhatsApp me.']

const CursorSvg = ({ color }: { color: string }) => (
  <svg viewBox="0 0 20 22" width="20" height="22" aria-hidden="true"><path d="M2 1.6 17.4 10 10.2 11.6 6.6 18.6Z" fill={color} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
)

export function Hero({ go }: { go: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  const [portrait, setPortrait] = useState(() => innerWidth / innerHeight < 0.85)
  const frames = portrait ? portFrames : landFrames
  const B = portrait ? PORT : LAND
  const stage = useRef<HTMLDivElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const me = useRef<HTMLDivElement>(null)
  const you = useRef<HTMLDivElement>(null)
  const bubble = useRef<HTMLSpanElement>(null)
  const zoom = useRef(0)

  useEffect(() => {
    const on = () => setPortrait(innerWidth / innerHeight < 0.85)
    addEventListener('resize', on)
    return () => removeEventListener('resize', on)
  }, [])

  // board placement (cover) + scroll zoom into one frame
  const place = (p: number) => {
    const st = stage.current, bd = board.current
    if (!st || !bd) return
    const vw = st.clientWidth, vh = st.clientHeight
    const s0 = Math.max(vw / B.w, vh / B.h)
    const ox = (vw - B.w * s0) / 2, oy = (vh - B.h * s0) / 2
    const f = frames.find((x) => x.id === ZOOM_TO)!
    const fh = f.w * (872 / 390)
    const z = sstep(0.06, 1, p)
    const s1 = (vh * (portrait ? 0.6 : 0.84)) / fh
    const s = s0 + (s1 - s0) * z
    // keep the target frame's centre moving from where it is to the screen centre
    const cx0 = ox + (f.x + f.w / 2) * s0, cy0 = oy + (f.y + fh / 2) * s0
    const cx = cx0 + (vw / 2 - cx0) * z, cy = cy0 + (vh / 2 - cy0) * z
    const tx = cx - (f.x + f.w / 2) * s, ty = cy - (f.y + fh / 2) * s
    bd.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${s.toFixed(4)})`
    bd.style.setProperty('--fade', (1 - sstep(0.25, 0.75, p)).toFixed(3))
    bd.style.setProperty('--s', (1 / s).toFixed(4))
    const g = 24 * s
    st.style.backgroundSize = `${g.toFixed(2)}px ${g.toFixed(2)}px`
    st.style.backgroundPosition = `${tx.toFixed(1)}px ${ty.toFixed(1)}px`
    const c = copy.current
    if (c) {
      c.style.opacity = (1 - sstep(0.02, 0.3, p)).toFixed(3)
      c.style.transform = `translate3d(0, ${(-p * 90).toFixed(1)}px, 0)`
      c.style.visibility = p > 0.32 ? 'hidden' : ''
    }
    st.style.setProperty('--cur', (1 - sstep(0.02, 0.15, p)).toFixed(3))
    st.style.setProperty('--z', z.toFixed(3))
  }
  const pin = usePin<HTMLElement>((p) => { zoom.current = p; place(p) })
  useEffect(() => { place(zoom.current) })

  // cursors: yours gets a label, Mehul's chases it
  useEffect(() => {
    const st = stage.current!, meEl = me.current!, youEl = you.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = matchMedia('(hover: none)').matches
    const t0 = performance.now()
    let raf = 0, last = t0
    const ptr = { x: -999, y: -999, seen: -1e9, inside: false }
    const pos = { x: st.clientWidth + 60, y: st.clientHeight * 0.85 }
    let cooldown = 0, caught = 0, wanderAt = 0, wanderIdx = 0
    const wander = { x: pos.x, y: pos.y }
    const frameEls = () => Array.from(st.querySelectorAll<HTMLElement>('.fr'))
    const select = (el: HTMLElement | null) => { for (const f of frameEls()) f.classList.toggle('is-sel', f === el) }
    const headSel = st.querySelector('.h-sel') as HTMLElement

    const move = (e: PointerEvent) => {
      const r = st.getBoundingClientRect()
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.seen = performance.now()
      ptr.inside = ptr.y >= 0 && ptr.y <= r.height
      if (!touch && e.pointerType === 'mouse') {
        youEl.style.transform = `translate3d(${ptr.x.toFixed(1)}px, ${ptr.y.toFixed(1)}px, 0)`
        youEl.style.setProperty('--on', ptr.inside ? '1' : '0')
      }
    }
    const leave = () => { ptr.inside = false; youEl.style.setProperty('--on', '0') }
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerdown', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)

    const setMe = () => { meEl.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)` }
    if (reduced) {
      const r = headSel.getBoundingClientRect(), sr = st.getBoundingClientRect()
      pos.x = r.right - sr.left - 6; pos.y = r.bottom - sr.top - 4
      setMe(); headSel.classList.add('is-on')
      return () => { removeEventListener('pointermove', move); removeEventListener('pointerdown', move); document.documentElement.removeEventListener('pointerleave', leave) }
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      const el = now - t0
      if (zoom.current > 0.2) return
      let tx: number, ty: number, maxV = 1000
      if (el < 1250) {
        // intro: fly in and draw the selection around the headline
        const r = headSel.getBoundingClientRect(), sr = st.getBoundingClientRect()
        tx = r.right - sr.left - 4; ty = r.bottom - sr.top - 2; maxV = 1500
        if (el > 700) headSel.classList.add('is-on')
      } else if (now < cooldown) {
        tx = pos.x; ty = pos.y
      } else if (ptr.inside && now - ptr.seen < 2600) {
        tx = ptr.x; ty = ptr.y; maxV = touch ? 700 : 820
        select(null)
        if (Math.hypot(tx - pos.x, ty - pos.y) < 16) {
          bubble.current!.textContent = CATCH_LINES[caught % CATCH_LINES.length]
          caught++
          meEl.classList.add('is-talk')
          cooldown = now + 1700
          setTimeout(() => meEl.classList.remove('is-talk'), 1600)
        }
      } else {
        // idle: wander over the canvas, selecting frames like a designer at work
        if (now > wanderAt) {
          const els = frameEls().filter((f) => { const r = f.getBoundingClientRect(); return r.right > 40 && r.left < innerWidth - 40 && r.top > 40 && r.bottom > 80 && r.top < innerHeight - 60 })
          const pick = els[wanderIdx++ % Math.max(1, els.length)]
          const sr = st.getBoundingClientRect()
          if (pick) { const r = pick.getBoundingClientRect(); wander.x = Math.min(r.right, innerWidth - 30) - sr.left - 8; wander.y = Math.min(r.bottom, innerHeight - 40) - sr.top - 6; select(pick) }
          wanderAt = now + 2600
        }
        tx = wander.x; ty = wander.y; maxV = 520
      }
      const dx = tx - pos.x, dy = ty - pos.y, d = Math.hypot(dx, dy)
      if (d > 0.3) {
        const v = Math.min(d * 5.2, maxV)
        const step = Math.min(d, v * dt)
        pos.x += (dx / d) * step; pos.y += (dy / d) * step
        setMe()
      }
    }
    raf = requestAnimationFrame(tick)
    const io = new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting) { last = performance.now(); raf = requestAnimationFrame(tick) } })
    io.observe(st)
    return () => {
      cancelAnimationFrame(raf); io.disconnect()
      removeEventListener('pointermove', move); removeEventListener('pointerdown', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [portrait])

  return (
    <section ref={pin} className="hero" id="top" aria-labelledby="hero-title">
      <div ref={stage} className="hero__stage">
        <div ref={board} className="board" style={{ width: B.w, height: B.h }} aria-hidden="true">
          {frames.map((f, i) => (
            <figure key={f.id} className={`fr${f.phone ? ' fr--phone' : ''}${f.id === ZOOM_TO ? ' fr--hero' : ''}`} style={{ left: f.x, top: f.y, width: f.w, animationDelay: `${0.08 + i * 0.07}s` }}>
              <figcaption>{f.label}</figcaption>
              <img src={`/work/${f.src}.webp`} alt="" decoding="async" fetchPriority={i < 4 ? 'high' : 'low'} />
              <span className="fr__size">{f.size}</span>
              <i className="h h1" /><i className="h h2" /><i className="h h3" /><i className="h h4" />
              {f.note && <span className="pin"><b>P</b><span>{f.note}</span></span>}
            </figure>
          ))}
        </div>

        <div ref={copy} className="hero__copy wrap">
          <p className="eyebrow">Mehul Karotra, UI/UX designer and developer in Mumbai</p>
          <h1 id="hero-title" className="display">
            <span className="h-sel">I design it.<i className="h h1" /><i className="h h2" /><i className="h h3" /><i className="h h4" /><b className="h-badge">Text</b></span>
            <span className="h-two">Then I build it.</span>
          </h1>
          <p className="lead">Every site starts as a frame in Figma, and I write the code that takes it live. One person from the first sketch to launch, so nothing gets lost on the way.</p>
          <div className="btns">
            <a className="btn btn--ink" href="#work" onClick={go}>See the work</a>
            <a className="btn btn--line" href={contact.whatsapp} target="_blank" rel="noopener"><WA />WhatsApp me</a>
          </div>
        </div>

        <div ref={me} className="mp mp--me" aria-hidden="true"><CursorSvg color="#FF5C35" /><span className="mp__tag">Mehul</span><span ref={bubble} className="mp__bubble">Got you.</span></div>
        <div ref={you} className="mp mp--you" aria-hidden="true"><span className="mp__tag">You</span></div>
        <p className="hero__hint" aria-hidden="true"><i /><span className="for-mouse">Move your mouse. My cursor will try to catch yours.</span><span className="for-touch">Tap anywhere. My cursor will come and find you.</span></p>
      </div>
    </section>
  )
}

