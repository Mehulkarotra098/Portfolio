import { useCallback, useEffect, useRef, useState } from 'react'
import { contact, projects } from './data'
import { clamp, sstep, usePin } from './scroll'
import { WA } from './icons'
import { Loop } from './media'
import { LOOPS, shot } from './shots'
import { IcClose, IcComment, IcDesktop, IcEye, IcEyeOff, IcFrame, IcHand, IcLayers, IcLock, IcMove, IcPhone, IcReset, IcSend, IcText, IcUndo, IcUnlock } from './canvasIcons'

// The hero is a live design canvas. Visitors can select, drag and resize the frames,
// switch them between desktop and phone, hide and lock layers, rewrite the headline,
// and pin a comment that goes to WhatsApp. Mehul's multiplayer cursor chases yours
// and reacts to what you do. Scrolling zooms into one frame and the work begins.

type View = 'desk' | 'mob'
type Frame = { id: string; slug: string; name: string; x: number; y: number; w: number; view: View; hidden?: boolean; locked?: boolean; note?: string }
const DESK = 0.625 // 1440 × 900
const MOB = 805 / 360
const ratio = (v: View) => (v === 'desk' ? DESK : MOB)
const LAND = { w: 1600, h: 900 }
const PORT = { w: 600, h: 1300 }
const landFrames: Frame[] = [
  { id: 'growcred', slug: 'growcred', name: 'GrowCred', x: 300, y: -175, w: 420, view: 'desk' },
  { id: 'vidhi', slug: 'vidhi', name: 'Vidhi Parmar', x: 860, y: 92, w: 560, view: 'desk', note: 'Love it. Ship it!' },
  { id: 'tis', slug: 'tis', name: 'TIS Admissions', x: 1452, y: 246, w: 150, view: 'mob' },
  { id: 'antrah', slug: 'antrah', name: 'Antrah Wellness', x: 858, y: 470, w: 128, view: 'mob' },
  { id: 'uscale', slug: 'uscale', name: 'U Scale', x: 1018, y: 496, w: 430, view: 'desk' },
  { id: 'sashe', slug: 'sashe', name: 'Sashe by Prachi', x: 1478, y: 640, w: 400, view: 'desk' },
  { id: 'roar', slug: 'roar', name: 'Roar Arena', x: 64, y: 712, w: 380, view: 'desk' },
  { id: 'brandgen', slug: 'brandgen', name: 'BrandGen', x: 476, y: 736, w: 350, view: 'desk' },
]
const portFrames: Frame[] = [
  { id: 'growcred', slug: 'growcred', name: 'GrowCred', x: 250, y: -150, w: 400, view: 'desk' },
  { id: 'vidhi', slug: 'vidhi', name: 'Vidhi Parmar', x: 24, y: 820, w: 410, view: 'desk', note: 'Love it. Ship it!' },
  { id: 'tis', slug: 'tis', name: 'TIS Admissions', x: 452, y: 760, w: 132, view: 'mob' },
  { id: 'sashe', slug: 'sashe', name: 'Sashe by Prachi', x: -150, y: 1110, w: 360, view: 'desk' },
  { id: 'roar', slug: 'roar', name: 'Roar Arena', x: 250, y: 1120, w: 360, view: 'desk' },
]
const ZOOM_TO = 'vidhi'
const LINE1 = 'I design it.'
const urlOf = (slug: string) => projects.find((p) => p.slug === slug)?.url ?? contact.uscale
const hasMob = (slug: string) => !!projects.find((p) => p.slug === slug)?.mobile
const label = (f: Frame) => `${f.name} / ${f.view === 'desk' ? 'Desktop' : 'Mobile'}`
const sizeOf = (f: Frame) => (f.view === 'desk' ? '1440 × 900' : '390 × 872')
const CATCH = ['Got you.', 'Caught you. Shall we build yours?', 'Too slow. Want a website?', 'Again! Okay, WhatsApp me.']
const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)]

const CursorSvg = ({ color }: { color: string }) => (
  <svg viewBox="0 0 20 22" width="20" height="22" aria-hidden="true"><path d="M2 1.6 17.4 10 10.2 11.6 6.6 18.6Z" fill={color} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
)

type Drag =
  | { kind: 'move'; id: string; sx: number; sy: number; fx: number; fy: number; moved: boolean; nx?: number; ny?: number; nw?: number }
  | { kind: 'resize'; id: string; corner: string; sx: number; sy: number; fx: number; fy: number; fw: number; nx?: number; ny?: number; nw?: number }
  | { kind: 'pan'; sx: number; sy: number; px: number; py: number }

export function Hero({ go }: { go: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  const [portrait, setPortrait] = useState(() => innerWidth / innerHeight < 0.85)
  const B = portrait ? PORT : LAND
  const [layout, setLayout] = useState<Frame[]>(() => (portrait ? portFrames : landFrames).map((f) => ({ ...f })))
  const [sel, setSel] = useState<string | null>(null)
  const [tool, setTool] = useState<'move' | 'hand' | 'comment'>('move')
  const [layers, setLayers] = useState(false)
  const [line1, setLine1] = useState(LINE1)
  const [hs, setHs] = useState(1)
  const [editing, setEditing] = useState(false)
  const [note, setNote] = useState<{ x: number; y: number; text: string; sent: boolean } | null>(null)
  const [touch] = useState(() => matchMedia('(hover: none)').matches)

  const stage = useRef<HTMLDivElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const me = useRef<HTMLDivElement>(null)
  const you = useRef<HTMLDivElement>(null)
  const bubble = useRef<HTMLSpanElement>(null)
  const props = useRef<HTMLDivElement>(null)
  const edit = useRef<HTMLSpanElement>(null)
  const noteInput = useRef<HTMLInputElement>(null)
  const zoom = useRef(0)
  const scale = useRef(1)
  const settle = useRef(0)
  const pan = useRef({ x: 0, y: 0 })
  const drag = useRef<Drag | null>(null)
  const history = useRef<Frame[][]>([])
  const live = useRef(layout)
  const focus = useRef({ x: 0, y: 0, until: 0 })
  const sayRef = useRef<(t: string, ms?: number) => void>(() => {})
  useEffect(() => { live.current = layout }, [layout])

  useEffect(() => {
    const on = () => {
      const p = innerWidth / innerHeight < 0.85
      setPortrait((old) => {
        if (old !== p) { setLayout((p ? portFrames : landFrames).map((f) => ({ ...f }))); setSel(null); history.current = [] }
        return p
      })
    }
    addEventListener('resize', on)
    return () => removeEventListener('resize', on)
  }, [])

  const say = (t: string, ms?: number) => sayRef.current(t, ms)
  const commit = (next: Frame[]) => { history.current.push(live.current.map((f) => ({ ...f }))); if (history.current.length > 40) history.current.shift(); live.current = next; setLayout(next) }
  const update = (id: string, patch: Partial<Frame>) => commit(live.current.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  const undo = () => { const prev = history.current.pop(); if (prev) { live.current = prev; setLayout(prev); say('Phew.') } else say('Nothing to undo yet.') }

  // board placement (cover) + pan + scroll zoom into one frame
  const place = useCallback((p: number) => {
    const st = stage.current, bd = board.current
    if (!st || !bd) return
    const vw = st.clientWidth, vh = st.clientHeight
    const s0 = Math.max(vw / B.w, vh / B.h)
    const z = sstep(0.06, 1, p)
    // on tall phones, keep the screens clear of the headline and buttons
    let lift = 0
    if (portrait && copy.current) {
      const btns = copy.current.querySelector<HTMLElement>('.btns')
      const safe = btns ? btns.offsetTop + btns.offsetHeight + 34 : 0
      const firstY = Math.min(...live.current.filter((x) => x.y > B.h * 0.4).map((x) => x.y))
      lift = Math.max(0, safe - ((vh - B.h * s0) / 2 + firstY * s0))
    }
    const ox = (vw - B.w * s0) / 2 + pan.current.x * (1 - z), oy = (vh - B.h * s0) / 2 + lift + pan.current.y * (1 - z)
    const f = live.current.find((x) => x.id === ZOOM_TO) ?? live.current[0]
    const fh = f.w * ratio(f.view)
    const s1 = Math.min((vh * 0.8) / fh, (vw * 0.9) / f.w)
    const s = s0 + (s1 - s0) * z
    const cx0 = ox + (f.x + f.w / 2) * s0, cy0 = oy + (f.y + fh / 2) * s0
    const cx = cx0 + (vw / 2 - cx0) * z, cy = cy0 + (vh / 2 - cy0) * z
    const tx = cx - (f.x + f.w / 2) * s, ty = cy - (f.y + fh / 2) * s
    scale.current = s
    bd.classList.add('is-moving')
    clearTimeout(settle.current)
    settle.current = window.setTimeout(() => bd.classList.remove('is-moving'), 180)
    bd.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${s.toFixed(4)})`
    bd.style.setProperty('--fade', (1 - sstep(0.25, 0.75, p)).toFixed(3))
    bd.style.setProperty('--s', (1 / s).toFixed(4))
    bd.classList.toggle('is-zooming', z > 0.02)
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
    st.classList.toggle('is-scrolled', p > 0.12)
  }, [B.w, B.h, portrait])
  const pin = usePin<HTMLElement>((p) => { zoom.current = p; place(p) })
  useEffect(() => { place(zoom.current) })

  const reset = () => {
    commit((portrait ? portFrames : landFrames).map((f) => ({ ...f })))
    setSel(null); setLine1(LINE1); setHs(1); pan.current = { x: 0, y: 0 }; place(zoom.current)
    say('Back to how I left it.')
  }

  // ------------------------------------------------------------------ pointer: select, move, resize, pan, comment
  const frameEl = (id: string) => board.current?.querySelector<HTMLElement>(`[data-id="${id}"]`) ?? null
  const showProps = (f: Frame) => {
    const el = props.current
    if (!el) return
    const set = (k: string, v: number) => { const n = el.querySelector(`[data-k="${k}"]`); if (n) n.textContent = String(Math.round(v)) }
    set('x', f.x); set('y', f.y); set('w', f.w); set('h', f.w * ratio(f.view))
  }
  const startPan = (e: React.PointerEvent) => {
    const st = stage.current!
    drag.current = { kind: 'pan', sx: e.clientX, sy: e.clientY, px: pan.current.x, py: pan.current.y }
    st.setPointerCapture(e.pointerId); st.classList.add('is-panning')
  }

  const onDown = (e: React.PointerEvent) => {
    if (zoom.current > 0.12 || e.button > 0) return
    const t = e.target as HTMLElement
    if (t.closest('.ui, .hero__copy a, .h-sel, .h-two, .mp')) return
    const r = stage.current!.getBoundingClientRect()
    if (tool === 'comment') {
      e.preventDefault()
      setNote({ x: Math.min(e.clientX - r.left, r.width - 330), y: Math.max(e.clientY - r.top, 70), text: '', sent: false })
      setTool('move')
      setTimeout(() => noteInput.current?.focus(), 40)
      say('Leave me a note. It goes to my WhatsApp.')
      return
    }
    const fr = t.closest<HTMLElement>('.fr')
    const handle = t.closest<HTMLElement>('[data-handle]')
    if (tool === 'hand') { if (e.pointerType === 'mouse') startPan(e); return }
    if (!fr) { setSel(null); if (e.pointerType === 'mouse') startPan(e); return }
    const id = fr.dataset.id!
    const f = live.current.find((x) => x.id === id)!
    const wasSel = sel === id
    setSel(id)
    if (f.locked) { say('That one is locked. Unlock it in the panel.'); return }
    if (e.pointerType !== 'mouse' && !wasSel) return // on touch: first tap selects, then drag
    e.preventDefault()
    stage.current!.setPointerCapture(e.pointerId)
    drag.current = handle
      ? { kind: 'resize', id, corner: handle.dataset.handle!, sx: e.clientX, sy: e.clientY, fx: f.x, fy: f.y, fw: f.w }
      : { kind: 'move', id, sx: e.clientX, sy: e.clientY, fx: f.x, fy: f.y, moved: false }
    stage.current!.classList.add('is-dragging')
    if (handle) say(pick(['Resizing? Responsive, I like it.', 'Bigger looks good on it.']))
  }

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const r = stage.current!.getBoundingClientRect()
    if (d.kind === 'pan') {
      const lim = { x: r.width * 0.35, y: r.height * 0.35 }
      pan.current = { x: clamp(d.px + e.clientX - d.sx, -lim.x, lim.x), y: clamp(d.py + e.clientY - d.sy, -lim.y, lim.y) }
      place(zoom.current)
      return
    }
    const f = live.current.find((x) => x.id === d.id)!
    const el = frameEl(d.id)
    if (!el) return
    const dx = (e.clientX - d.sx) / scale.current, dy = (e.clientY - d.sy) / scale.current
    const rt = ratio(f.view)
    let x: number, y: number, w: number
    if (d.kind === 'move') {
      if (!d.moved && Math.hypot(dx, dy) > 3) { d.moved = true; say(pick(['Rearranging my work? Bold.', "Careful, that one's live.", 'Moving it? Fine, I kept a backup.'])) }
      w = f.w; x = d.fx + dx; y = d.fy + dy
    } else {
      const min = f.view === 'desk' ? 180 : 70, max = f.view === 'desk' ? 980 : 330
      const sx = d.corner.includes('e') ? 1 : -1
      w = clamp(d.fw + dx * sx, min, max)
      x = d.corner.includes('w') ? d.fx + (d.fw - w) : d.fx
      y = d.corner.includes('n') ? d.fy + (d.fw - w) * rt : d.fy
    }
    const h = w * rt
    // the locked area: frames always stay on the canvas
    x = clamp(x, -w * 0.5, B.w - w * 0.5); y = clamp(y, -h * 0.5, B.h - h * 0.4)
    el.style.left = `${x}px`; el.style.top = `${y}px`; el.style.width = `${w}px`
    showProps({ ...f, x, y, w })
    focus.current = { x: e.clientX - r.left, y: e.clientY - r.top, until: performance.now() + 600 }
    d.nx = x; d.ny = y; d.nw = w
  }

  const onUp = () => {
    const d = drag.current
    drag.current = null
    stage.current?.classList.remove('is-panning', 'is-dragging')
    if (!d || d.kind === 'pan' || d.nx === undefined) return
    update(d.id, { x: d.nx, y: d.ny!, w: d.nw! })
  }

  // ------------------------------------------------------------------ keyboard shortcuts, only while the canvas is in view
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (zoom.current > 0.12 || scrollY > innerHeight * 0.6 || editing) return
      const tag = (document.activeElement as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); return }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toLowerCase()
      if (k === 'v') setTool('move')
      else if (k === 'h') setTool('hand')
      else if (k === 'c') setTool('comment')
      else if (k === 'escape') { setSel(null); setLayers(false); setTool('move') }
      else if (sel && (k === 'delete' || k === 'backspace')) { e.preventDefault(); update(sel, { hidden: true }); setSel(null); say('Hey, bring that back. Ctrl+Z works.') }
      else if (sel && k.startsWith('arrow')) {
        e.preventDefault()
        const f = live.current.find((x) => x.id === sel)
        if (!f || f.locked) return
        const n = e.shiftKey ? 10 : 1
        update(sel, { x: f.x + (k === 'arrowleft' ? -n : k === 'arrowright' ? n : 0), y: f.y + (k === 'arrowup' ? -n : k === 'arrowdown' ? n : 0) })
      }
    }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  })

  // ------------------------------------------------------------------ headline: resize from the corners (it can't be moved)
  const headResize = (e: React.PointerEvent<HTMLElement>, corner: string) => {
    e.preventDefault(); e.stopPropagation()
    const box = e.currentTarget.parentElement as HTMLElement
    const st = stage.current!.getBoundingClientRect()
    const r = box.getBoundingClientRect()
    const btns = copy.current!.querySelector('.btns')!.getBoundingClientRect()
    const start = hs, sx = e.clientX
    // limits: stay left of the screens on wide layouts, and keep the buttons above the canvas tools
    let rightLimit = st.left + st.width * 0.95
    if (!portrait) {
      // stop just before the first screen that sits beside the headline
      const grow = r.height * 0.8
      for (const fr of Array.from(board.current!.querySelectorAll<HTMLElement>('.fr:not(.is-hidden)'))) {
        const fb = fr.getBoundingClientRect()
        if (fb.left > r.left + 40 && fb.bottom > r.top - grow && fb.top < r.bottom + grow) rightLimit = Math.min(rightLimit, fb.left - 18)
      }
    }
    const maxW = start * Math.max(1, (rightLimit - r.left) / r.width)
    const maxH = start * (1 + Math.max(0, st.bottom - 132 - btns.bottom) / r.height)
    const hi = Math.min(maxW, maxH, 1.8), lo = 0.55
    const sign = corner.includes('e') ? 1 : -1
    let v = start, hit = false
    e.currentTarget.setPointerCapture(e.pointerId)
    say('Bigger or smaller. It stays where it is.')
    const mv = (ev: PointerEvent) => {
      const want = start * (1 + (sign * (ev.clientX - sx)) / r.width)
      v = clamp(want, lo, hi)
      if (want > hi + 0.02 && !hit) { hit = true; say("That's as big as it goes. It would crash into my work.") }
      box.style.setProperty('--hs', v.toFixed(3))
    }
    const up = () => {
      removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up)
      setHs(v)
      if (!hit) say(v > start + 0.02 ? 'Bigger headline, bolder promise.' : v < start - 0.02 ? 'Small and quiet. Classy.' : 'Same size. Fair.')
    }
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up)
  }

  // ------------------------------------------------------------------ headline editing
  const startEdit = () => {
    if (editing) return
    setEditing(true)
    say('Writing my headline for me?')
    requestAnimationFrame(() => {
      const el = edit.current
      if (!el) return
      el.focus()
      const range = document.createRange(); range.selectNodeContents(el)
      const s = getSelection(); s?.removeAllRanges(); s?.addRange(range)
    })
  }
  const endEdit = (save: boolean) => {
    const el = edit.current
    const txt = (el?.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 28)
    if (save && txt && txt !== line1) { setLine1(txt); say(txt === LINE1 ? 'Back to the original.' : 'Not bad. Want the job?') }
    else if (el) el.textContent = line1
    setEditing(false)
  }

  // ------------------------------------------------------------------ cursors
  useEffect(() => {
    const st = stage.current!, meEl = me.current!, youEl = you.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const t0 = performance.now()
    let raf = 0, last = t0
    const ptr = { x: -999, y: -999, seen: -1e9, inside: false }
    const pos = { x: st.clientWidth + 60, y: st.clientHeight * 0.85 }
    let cooldown = 0, caught = 0, wanderAt = 0, wanderIdx = 0, talkTimer = 0
    const wander = { x: pos.x, y: pos.y }
    const headSel = st.querySelector('.h-sel') as HTMLElement

    sayRef.current = (txt, ms = 2400) => {
      bubble.current!.textContent = txt
      meEl.classList.add('is-talk')
      clearTimeout(talkTimer)
      talkTimer = window.setTimeout(() => meEl.classList.remove('is-talk'), ms)
    }
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
    const cleanup = () => {
      cancelAnimationFrame(raf); clearTimeout(talkTimer)
      removeEventListener('pointermove', move); removeEventListener('pointerdown', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
    if (reduced) {
      const r = headSel.getBoundingClientRect(), sr = st.getBoundingClientRect()
      pos.x = r.right - sr.left - 6; pos.y = r.bottom - sr.top - 4
      setMe(); headSel.classList.add('is-on')
      return cleanup
    }
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      const el = now - t0
      if (zoom.current > 0.2) return
      let tx: number, ty: number, maxV = 1000
      if (el < 1250) {
        const r = headSel.getBoundingClientRect(), sr = st.getBoundingClientRect()
        tx = r.right - sr.left - 4; ty = r.bottom - sr.top - 2; maxV = 1500
        if (el > 700) headSel.classList.add('is-on')
      } else if (now < focus.current.until) {
        tx = focus.current.x + 26; ty = focus.current.y + 30; maxV = 1400 // keeping an eye on what you're doing
      } else if (now < cooldown || drag.current) {
        tx = pos.x; ty = pos.y
      } else if (ptr.inside && now - ptr.seen < 2600) {
        tx = ptr.x; ty = ptr.y; maxV = touch ? 700 : 820
        if (Math.hypot(tx - pos.x, ty - pos.y) < 16) {
          sayRef.current(CATCH[caught++ % CATCH.length], 1600)
          cooldown = now + 1700
        }
      } else {
        if (now > wanderAt) {
          const els = Array.from(st.querySelectorAll<HTMLElement>('.fr:not(.is-hidden)')).filter((f) => { const r = f.getBoundingClientRect(); return r.right > 40 && r.left < innerWidth - 40 && r.top > 40 && r.bottom > 80 && r.top < innerHeight - 60 })
          const target = els[wanderIdx++ % Math.max(1, els.length)]
          const sr = st.getBoundingClientRect()
          if (target) { const r = target.getBoundingClientRect(); wander.x = Math.min(r.right, innerWidth - 30) - sr.left - 8; wander.y = Math.min(r.bottom, innerHeight - 40) - sr.top - 6 }
          st.querySelectorAll('.fr.is-peek').forEach((n) => n.classList.remove('is-peek'))
          target?.classList.add('is-peek')
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
    return () => { cleanup(); io.disconnect() }
  }, [portrait, touch])

  const selFrame = layout.find((f) => f.id === sel) ?? null
  useEffect(() => { if (selFrame) showProps(selFrame) })
  const waBase = contact.whatsapp.split('?')[0]
  const sendNote = () => {
    if (!note || !note.text.trim()) return
    window.open(`${waBase}?text=${encodeURIComponent(`Hi Mehul, I left a comment on your portfolio canvas: "${note.text.trim()}"`)}`, '_blank', 'noopener')
    setNote({ ...note, sent: true })
    say('Got it. Talk soon.')
  }
  const switchView = (f: Frame, view: View) => {
    if (f.view === view) return
    const w = view === 'desk' ? Math.min(f.w / 0.3, 700) : Math.max(f.w * 0.3, 110)
    update(f.id, { view, w, x: f.x + f.w / 2 - w / 2 })
    say(view === 'mob' ? 'Mobile first, always.' : 'Desktop. Wide and proud.')
  }

  return (
    <section ref={pin} className="hero" id="top" aria-labelledby="hero-title">
      <div
        ref={stage}
        className={`hero__stage tool-${tool}${sel ? ' has-sel' : ''}`}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      >
        <div ref={board} className="board" style={{ width: B.w, height: B.h }} aria-hidden="true">
          {layout.map((f, i) => (
            <figure
              key={f.id} data-id={f.id}
              className={`fr fr--${f.view}${f.id === ZOOM_TO ? ' fr--hero' : ''}${sel === f.id ? ' is-sel' : ''}${f.hidden ? ' is-hidden' : ''}${f.locked ? ' is-locked' : ''}`}
              style={{ left: f.x, top: f.y, width: f.w, animationDelay: `${0.08 + i * 0.07}s` }}
            >
              <figcaption>{f.locked && <IcLock />}{label(f)}</figcaption>
              {f.view === 'desk' && LOOPS[f.slug]
                ? <Loop slug={f.slug} className="fr__media" />
                : <img className="fr__media" {...shot(f.slug, f.view === 'desk' ? 'live' : 'mobile')} alt="" decoding="async" draggable={false} fetchPriority={i < 4 ? 'high' : 'low'} />}
              <span className="fr__size">{sizeOf(f)}</span>
              {['nw', 'ne', 'sw', 'se'].map((c) => <i key={c} className={`h hd-${c}`} data-handle={c} />)}
              {f.note && <span className="pin"><b>V</b><span>{f.note}</span></span>}
            </figure>
          ))}
        </div>

        <div ref={copy} className="hero__copy wrap">
          <p className="eyebrow">Mehul Karotra, UI/UX designer and developer in Mumbai</p>
          <h1 id="hero-title" className="display">
            <span className={`h-sel${editing ? ' is-editing' : ''}`} style={{ ['--hs' as string]: hs }} onDoubleClick={startEdit} title="Double-click to edit, drag a corner to resize">
              <span
                ref={edit} className="h-sel__text"
                contentEditable={editing} suppressContentEditableWarning spellCheck={false}
                onBlur={() => editing && endEdit(true)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); endEdit(true) } if (e.key === 'Escape') { e.preventDefault(); endEdit(false) } }}
              >{line1}</span>
              {['nw', 'ne', 'sw', 'se'].map((c) => <i key={c} className={`h hd-${c}`} onPointerDown={(e) => headResize(e, c)} />)}
              <b className="h-badge" data-label={editing ? 'Editing text' : 'Text'} aria-hidden="true" />
            </span>{' '}
            <span className="h-two" onPointerDown={() => say(pick(["That line's locked. I do the building.", 'Locked. The building part is my job.']))}>
              Then I build it.<span className="h-lock" aria-hidden="true"><IcLock /></span>
            </span>
          </h1>
          <p className="lead">Every site starts as a frame in Figma, and I write the code that takes it live. One person from the first sketch to launch, so nothing gets lost on the way.</p>
          <div className="btns">
            <a className="btn btn--ink" href="#work" onClick={go}>See the work</a>
            <a className="btn btn--line" href={contact.whatsapp} target="_blank" rel="noopener"><WA />WhatsApp me</a>
          </div>
        </div>

        <div className="ui ctools" role="toolbar" aria-label="Canvas tools">
          {!touch && <>
            <button className={tool === 'move' ? 'is-on' : ''} onClick={() => setTool('move')} title="Move (V)" aria-label="Move tool"><IcMove /></button>
            <button className={tool === 'hand' ? 'is-on' : ''} onClick={() => setTool('hand')} title="Hand (H)" aria-label="Hand tool"><IcHand /></button>
          </>}
          <button className={tool === 'comment' ? 'is-on' : ''} onClick={() => { setTool(tool === 'comment' ? 'move' : 'comment'); if (tool !== 'comment') say(touch ? 'Tap anywhere to leave me a note.' : 'Click anywhere to leave me a note.') }} title="Comment (C)" aria-label="Comment tool"><IcComment /></button>
          <span className="ctools__sep" />
          <button className={layers ? 'is-on' : ''} onClick={() => setLayers(!layers)} title="Layers" aria-label="Layers" aria-expanded={layers}><IcLayers /></button>
          <button onClick={undo} title="Undo (Ctrl+Z)" aria-label="Undo"><IcUndo /></button>
          <button onClick={reset} title="Reset the canvas" aria-label="Reset the canvas"><IcReset /></button>
        </div>

        {layers && (
          <div className="ui panel layers" role="dialog" aria-label="Layers">
            <div className="panel__head"><span>Layers</span><button onClick={() => setLayers(false)} aria-label="Close layers"><IcClose /></button></div>
            <ul>
              <li className="layer is-text">
                <button className="layer__name" onClick={startEdit}><IcText /><span>{line1}</span></button>
                <span className="layer__hint">Edit</span>
              </li>
              <li className="layer is-text is-locked">
                <button className="layer__name" onClick={() => say("That line's locked. I do the building.")}><IcText /><span>Then I build it.</span></button>
                <span className="layer__ic"><IcLock /></span>
              </li>
              {layout.map((f) => (
                <li key={f.id} className={`layer${sel === f.id ? ' is-sel' : ''}${f.hidden ? ' is-off' : ''}`}>
                  <button className="layer__name" onClick={() => setSel(f.id)}>{f.view === 'desk' ? <IcFrame /> : <IcPhone />}<span>{label(f)}</span></button>
                  <button className="layer__ic" onClick={() => { update(f.id, { hidden: !f.hidden }); if (!f.hidden) say('Hey, bring that back.') }} aria-label={f.hidden ? `Show ${label(f)}` : `Hide ${label(f)}`}>{f.hidden ? <IcEyeOff /> : <IcEye />}</button>
                  <button className="layer__ic" onClick={() => update(f.id, { locked: !f.locked })} aria-label={f.locked ? `Unlock ${label(f)}` : `Lock ${label(f)}`}>{f.locked ? <IcLock /> : <IcUnlock />}</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selFrame && (
          <div ref={props} className="ui panel props" aria-label="Frame properties">
            <div className="panel__head"><span>{selFrame.name}</span><button onClick={() => setSel(null)} aria-label="Deselect"><IcClose /></button></div>
            <div className="props__grid">
              <span>X</span><b data-k="x" /><span>Y</span><b data-k="y" />
              <span>W</span><b data-k="w" /><span>H</span><b data-k="h" />
            </div>
            <div className="seg" role="group" aria-label="View">
              <button className={selFrame.view === 'desk' ? 'is-on' : ''} onClick={() => switchView(selFrame, 'desk')}><IcDesktop />Desktop</button>
              <button className={selFrame.view === 'mob' ? 'is-on' : ''} disabled={!hasMob(selFrame.slug)} title={hasMob(selFrame.slug) ? undefined : 'No mobile screen for this one'} onClick={() => switchView(selFrame, 'mob')}><IcPhone />Mobile</button>
            </div>
            <div className="props__row">
              <button onClick={() => update(selFrame.id, { locked: !selFrame.locked })}>{selFrame.locked ? <><IcLock />Locked</> : <><IcUnlock />Lock</>}</button>
              <button onClick={() => { update(selFrame.id, { hidden: true }); setSel(null); say('Hey, bring that back. Ctrl+Z works.') }}><IcEyeOff />Hide</button>
            </div>
            <a className="props__live" href={urlOf(selFrame.slug)} target="_blank" rel="noopener">Open the live site</a>
          </div>
        )}

        {note && (
          <div className="ui cnote" style={{ left: note.x, top: note.y }}>
            <b className="cnote__pin">You</b>
            {note.sent ? (
              <div className="cnote__box is-sent"><p>{note.text}</p><span>Sent to Mehul on WhatsApp</span><button onClick={() => setNote(null)} aria-label="Close comment"><IcClose /></button></div>
            ) : (
              <form className="cnote__box" onSubmit={(e) => { e.preventDefault(); sendNote() }}>
                <input ref={noteInput} maxLength={160} placeholder="Leave Mehul a comment" value={note.text} onChange={(e) => setNote({ ...note, text: e.target.value })} onKeyDown={(e) => { if (e.key === 'Escape') setNote(null) }} aria-label="Your comment" />
                <button type="submit" aria-label="Send on WhatsApp" disabled={!note.text.trim()}><IcSend /></button>
              </form>
            )}
          </div>
        )}

        <div ref={me} className="mp mp--me" aria-hidden="true"><CursorSvg color="#FF6347" /><span className="mp__tag">Mehul</span><span ref={bubble} className="mp__bubble">Got you.</span></div>
        <div ref={you} className="mp mp--you" aria-hidden="true"><span className="mp__tag">You</span></div>
        <p className="hero__hint" aria-hidden="true"><i />
          <span className="for-mouse">It's a live canvas. Drag, resize, double-click my headline.</span>
          <span className="for-touch">It's a live canvas. Tap a screen, then drag it.</span>
        </p>
      </div>
    </section>
  )
}
