import { useEffect, useRef } from 'react'
import { LOOPS, poster } from './shots'

/** A muted loop that only plays while it is on screen, and never for reduced motion. */
export function Loop({ slug, className, label }: { slug: string; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const loop = LOOPS[slug]
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (v.preload !== 'auto') { v.preload = 'auto'; v.load() } v.play().catch(() => {}) }
      else v.pause()
    }, { threshold: 0.05 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <video ref={ref} className={className} muted loop playsInline preload="none" poster={poster(slug)} aria-label={label} aria-hidden={label ? undefined : true}>
      <source src={loop.webm} type="video/webm" />
      <source src={loop.mp4} type="video/mp4" />
    </video>
  )
}
