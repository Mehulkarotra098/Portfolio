import { useEffect, useRef } from 'react'
import { LOOPS, poster } from './shots'

/** A muted loop that only plays while it is on screen, and never for reduced motion.
 *  `on={false}` (e.g. a chapter showing its mobile view) keeps it from downloading or playing at all.
 *  `still={false}` skips the poster, for loops laid over a screenshot that already shows the same frame. */
export function Loop({ slug, className, label, on = true, still = true }: { slug: string; className?: string; label?: string; on?: boolean; still?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const loop = LOOPS[slug]
  useEffect(() => {
    const v = ref.current
    if (!v || !on) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (v.preload !== 'auto') { v.preload = 'auto'; v.load() } v.play().catch(() => {}) }
      else v.pause()
    }, { threshold: 0.05 })
    io.observe(v)
    return () => { io.disconnect(); v.pause() }
  }, [on])
  return (
    <video ref={ref} className={className} muted loop playsInline preload="none" poster={on && still ? poster(slug) : undefined} style={{ ['--lr' as string]: `${loop.w} / ${loop.h}` }} aria-label={label} aria-hidden={label ? undefined : true}>
      <source media="(min-width: 900px)" src={`${loop.base}-1440.webm`} type="video/webm" />
      <source media="(min-width: 900px)" src={`${loop.base}-1440.mp4`} type="video/mp4" />
      <source src={`${loop.base}-960.webm`} type="video/webm" />
      <source src={`${loop.base}-960.mp4`} type="video/mp4" />
    </video>
  )
}
