import { useEffect, useRef } from 'react'

// One shared scroll/resize loop. Sections subscribe with a callback that gets
// their pin progress (0 when the section top hits the viewport top, 1 when its
// bottom reaches the viewport bottom). Off-screen sections are skipped.
type Sub = { el: HTMLElement; fn: (p: number, r: DOMRect) => void; on: boolean }
const subs = new Set<Sub>()
let raf = 0

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const sstep = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }

function run() {
  raf = 0
  const vh = innerHeight
  for (const s of subs) {
    if (!s.on) continue
    const r = s.el.getBoundingClientRect()
    const len = r.height - vh
    s.fn(len > 1 ? clamp(-r.top / len) : clamp(-r.top / vh), r)
  }
}
export function kick() { if (!raf) raf = requestAnimationFrame(run) }
if (typeof window !== 'undefined') {
  addEventListener('scroll', kick, { passive: true })
  addEventListener('resize', kick)
}

export function usePin<T extends HTMLElement>(fn: (p: number, r: DOMRect) => void) {
  const ref = useRef<T>(null)
  const fnRef = useRef(fn)
  useEffect(() => { fnRef.current = fn })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const s: Sub = { el, fn: (p, r) => fnRef.current(p, r), on: true }
    subs.add(s)
    const io = new IntersectionObserver(([e]) => { s.on = e.isIntersecting; if (s.on) kick() }, { rootMargin: '25% 0px 25% 0px' })
    io.observe(el)
    kick()
    return () => { subs.delete(s); io.disconnect() }
  }, [])
  return ref
}
