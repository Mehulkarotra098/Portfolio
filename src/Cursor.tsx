import { useEffect, useRef } from 'react'

// Your cursor, Figma-style. The arrow itself is a CSS cursor (so it never lags behind the mouse);
// this adds the name tag that says what a click will do, like a collaborator's label on a canvas.
// Mouse only. The hero canvas has its own multiplayer cursors and tools, so the tag stays out of it.
function labelFor(t: Element | null): string {
  const el = t?.closest<HTMLElement>('[data-cursor], a, button, summary, .grip, .ch .screen')
  if (!el || el.closest('#top, .rail')) return ''
  if (el.dataset.cursor !== undefined) return el.dataset.cursor
  if (el.classList.contains('grip')) return 'Drag to resize'
  if (el.classList.contains('screen')) return 'Scroll to explore'
  if (el.tagName === 'SUMMARY') return (el.parentElement as HTMLDetailsElement | null)?.open ? 'Close' : 'Open'
  if (el.closest('.vseg')) return 'Switch view'
  if (el instanceof HTMLAnchorElement) {
    const h = el.getAttribute('href') ?? ''
    if (/wa\.me|whatsapp/i.test(h)) return 'Say hi'
    if (h.startsWith('mailto:')) return 'Write to me'
    if (h.startsWith('#')) return 'Go there'
    return el.target === '_blank' ? 'Open ↗' : 'Open'
  }
  return ''
}

export function Cursor() {
  const tag = useRef<HTMLDivElement>(null)
  const txt = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = tag.current!, span = txt.current!
    let cur = '', x = -100, y = -100, raf = 0, seen = false
    const set = (l: string) => {
      if (l === cur) return
      cur = l
      if (l) span.textContent = l
      el.classList.toggle('is-on', !!l)
    }
    const paint = () => { raf = 0; el.style.transform = `translate3d(${x}px, ${y}px, 0)` }
    const at = () => { if (seen) set(labelFor(document.elementFromPoint(x, y))) }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX; y = e.clientY; seen = true
      set(labelFor(e.target as Element))
      if (!raf) raf = requestAnimationFrame(paint)
    }
    let sraf = 0
    const scroll = () => { if (!sraf) sraf = requestAnimationFrame(() => { sraf = 0; at() }) }
    const down = (e: PointerEvent) => { if (e.pointerType === 'mouse') el.classList.add('is-down') }
    const up = () => { el.classList.remove('is-down'); requestAnimationFrame(at) }
    const leave = () => { seen = false; set('') }
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerdown', down, { passive: true })
    addEventListener('pointerup', up, { passive: true })
    addEventListener('scroll', scroll, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(sraf)
      removeEventListener('pointermove', move); removeEventListener('pointerdown', down)
      removeEventListener('pointerup', up); removeEventListener('scroll', scroll)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])
  return <div ref={tag} className="ycur" aria-hidden="true"><span ref={txt} /></div>
}
