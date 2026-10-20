import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { concepts, contact, journey, projects } from './data'
import { HoldToShip } from './HoldToShip'
import type { Pavilion } from './scene/Pavilion'

const featured = projects.slice(0, 6)
const more = projects.slice(6)
// scroll length (viewport heights) of each step: hero→built, →approach, →entry, →stop 1, stop→stop ×5, →exit
const SEG = [1.5, 1, 1, 1, 1.15, 1.15, 1.15, 1.15, 1.15, 1]
const FILM_VH = SEG.reduce((a, b) => a + b, 0) + 1
const STOP0 = SEG.slice(0, 4).reduce((a, b) => a + b, 0)

type Anchors = Record<string, [number, number, boolean]>
const W = window as unknown as { __anchors?: (a: Anchors, lens: [number, number, number]) => void }

export const Ext = () => (
  <svg className="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 3.5h7v7M12.5 3.5 3.5 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const WA = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.6-.3Z" /></svg>
)

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const sstep = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }

function useScrollTo(lenis: React.RefObject<Lenis | null>) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    const id = e.currentTarget.getAttribute('href')!
    const el = document.querySelector(id) as HTMLElement | null
    if (!el) return
    e.preventDefault()
    if (lenis.current) lenis.current.scrollTo(el, { duration: 1.8 })
    else el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    history.replaceState(null, '', id)
  }
}

// ------------------------------------------------------------------ header
function Header({ go }: { go: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(scrollY > 40)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`top${solid ? ' is-solid' : ''}`}>
      <a href="#top" className="mark" onClick={go}>Mehul Karotra</a>
      <nav aria-label="Main">
        <a href="#work" onClick={go}>Work</a>
        <a href="#about" onClick={go}>About</a>
        <a href="#contact" onClick={go}>Contact</a>
        <a className="pill" href={contact.whatsapp} target="_blank" rel="noopener"><WA />WhatsApp</a>
      </nav>
    </header>
  )
}

// ------------------------------------------------------------------ the film: blueprint → build → gallery
function Film({ scene, staticMode, touch, go, onLeave }: {
  scene: React.RefObject<Pavilion | null>; staticMode: boolean; touch: boolean
  go: (e: React.MouseEvent<HTMLAnchorElement>) => void; onLeave: (gone: boolean) => void
}) {
  const film = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const notes = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (staticMode) return
    const el = film.current!, st = stage.current!
    const q = (s: string) => st.querySelector(s) as HTMLElement
    const hero = q('.f-hero'), lead = q('.f-lead'), hint = q('.f-hint'), cue = q('.f-cue'), inside = q('.f-inside')
    const stops = Array.from(st.querySelectorAll<HTMLElement>('.f-stop'))
    const show = (e: HTMLElement, o: number) => { e.style.opacity = o.toFixed(3); e.style.visibility = o < 0.02 ? 'hidden' : '' }
    let raf = 0
    const tick = () => {
      raf = 0
      const y = -el.getBoundingClientRect().top / innerHeight
      let acc = 0, f = SEG.length
      for (let i = 0; i < SEG.length; i++) {
        if (y < acc + SEG[i]) { const r = clamp((y - acc) / SEG[i]); f = i + (i === 0 ? r : i >= 3 ? sstep(0.2, 0.8, r) : sstep(0, 1, r)); break }
        acc += SEG[i]
      }
      f = clamp(f, 0, SEG.length)
      scene.current?.setProgress(f)
      onLeave(y > FILM_VH - 1 + 0.05)
      st.style.setProperty('--b', clamp(f / 0.92).toFixed(3))
      show(hero, 1 - sstep(1.25, 1.7, f))
      lead.style.opacity = sstep(0.5, 0.92, f).toFixed(3)
      lead.style.visibility = f < 0.5 ? 'hidden' : ''
      hint.style.opacity = (1 - sstep(0.04, 0.25, f)).toFixed(3)
      cue.style.opacity = (1 - sstep(0.02, 0.12, f)).toFixed(3)
      if (notes.current) notes.current.style.opacity = (1 - sstep(0.3, 0.75, f)).toFixed(3)
      show(inside, sstep(1.85, 2.25, f) * (1 - sstep(3.0, 3.4, f)))
      stops.forEach((s, i) => {
        const d = f - (4 + i)
        show(s, 1 - sstep(0.28, 0.46, Math.abs(d)))
        s.style.setProperty('--d', clamp(d / 0.46, -1, 1).toFixed(3))
      })
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [scene, staticMode, onLeave])

  // blueprint callouts pinned to points on the building
  useEffect(() => {
    if (staticMode || !notes.current) return
    const els = Array.from(notes.current.querySelectorAll<HTMLElement>('[data-a]'))
    const ring = stage.current!.querySelector('.lens') as HTMLElement
    W.__anchors = (a, l) => {
      ring.style.transform = `translate3d(${l[0].toFixed(1)}px, ${l[1].toFixed(1)}px, 0) scale(${(l[2] / 100).toFixed(3)})`
      ring.style.opacity = l[2] > 4 ? '1' : '0'
      for (const e of els) {
        const p = a[e.dataset.a!]
        if (!p) continue
        e.style.transform = `translate3d(${p[0].toFixed(1)}px, ${p[1].toFixed(1)}px, 0)`
        e.style.display = p[2] ? '' : 'none'
      }
    }
    return () => { W.__anchors = undefined }
  }, [staticMode])

  return (
    <section ref={film} className="film" id="top" style={staticMode ? undefined : { height: `${FILM_VH * 100}svh` }} aria-label="Introduction and selected work">
      <span className="anchor" id="work" style={staticMode ? undefined : { top: `${(STOP0 - 0.1) * 100}svh` }} />
      <div ref={stage} className="stage">
        <div className="lens" aria-hidden="true"><span>Built</span></div>
        <div className="notes" ref={notes} aria-hidden="true">
          <span data-a="roof">Roof slab, 34 m, on 14 steel columns</span>
          <span data-a="onyx">Onyx wall, lit from behind</span>
          <span data-a="stone">Three stones, cast bronze</span>
          <span data-a="pool">Reflecting pool, 13 × 7.5 m</span>
          <span data-a="wall">Gallery wall, six screens</span>
        </div>

        <div className="f-hero wrap">
          <p className="who"><strong>Mehul Karotra</strong> UI/UX designer and developer in Mumbai</p>
          <h1 className="display">
            <span className="l1">I draw it.</span>
            <span className="l2"><span className="l2__line" aria-hidden="true">Then I build it.</span><span className="l2__fill">Then I build it.</span></span>
          </h1>
          <div className="f-lead">
            <p>I design websites in Figma and write the code myself. Nothing gets lost between designer and developer, because they're the same person.</p>
            <div className="btns">
              <a className="btn btn--amber" href="#work" onClick={go}>Walk through the work</a>
              <a className="btn btn--line" href={contact.whatsapp} target="_blank" rel="noopener"><WA />WhatsApp me</a>
            </div>
          </div>
        </div>

        <p className="f-hint" aria-hidden="true"><i />{touch ? 'Touch the drawing to see it built' : 'Move over the drawing to see it built'}</p>
        <p className="f-cue" aria-hidden="true">Scroll to build it<i /></p>

        <div className="f-inside wrap">
          <p className="big">Six sites inside. Each one designed and built by me, from the first frame to launch.</p>
        </div>

        {featured.map((p, i) => (
          <article className="f-stop" key={p.slug} aria-labelledby={`stop-${p.slug}`}>
            <img className="f-stop__img" src={`/work/${p.slug}-live.webp`} alt={`${p.name} website, desktop view`} loading="lazy" width={1152} height={720} />
            <div className="f-stop__card">
              <p className="count">{i + 1} of {featured.length}</p>
              <h2 id={`stop-${p.slug}`}>{p.name}{p.note && <em>{p.note}</em>}</h2>
              <p className="meta">{p.meta}<span>{p.role}</span></p>
              <p className="text">{p.text}</p>
              <a className="visit" href={p.url} target="_blank" rel="noopener">Visit {p.url.replace(/^https?:\/\/(www\.)?/, '')}<Ext /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ more work
function MoreWork() {
  return (
    <section className="more" aria-labelledby="more-title">
      <div className="wrap">
        <h2 id="more-title" className="h2">More work</h2>
        <p className="lead">Product builds, websites, and the in-house work I did at My Country Mobile.</p>
        <ul className="more__list">
          {more.map((p) => (
            <li key={p.slug}>
              <a href={p.url} target="_blank" rel="noopener">
                <span className="more__img"><img src={`/work/${p.slug}-live.webp`} alt="" loading="lazy" width={1152} height={720} /></span>
                <span className="more__head">
                  <span className="more__name">{p.name}{p.note && <em>{p.note}</em>}</span>
                  <span className="more__meta">{p.meta}<br />{p.role}</span>
                </span>
                <span className="more__text">{p.text}</span>
                <span className="more__go"><Ext /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ sketchbook, services, about
function Sketchbook() {
  return (
    <section className="sketch" aria-labelledby="sketch-title">
      <div className="wrap">
        <h2 id="sketch-title" className="h2">From the sketchbook</h2>
        <p className="lead">Interface concepts I designed in Figma. Open any of them to see the full file.</p>
        <ul className="sketch__grid">
          {concepts.map((c) => (
            <li key={c.slug}>
              <a href={c.url} target="_blank" rel="noopener">
                <span className="sketch__img"><img src={`/work/${c.slug}.webp`} alt={`${c.name} concept in Figma`} loading="lazy" /></span>
                <span className="sketch__name">{c.name}<Ext /></span>
                <span className="sketch__text">{c.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const services = [
  { t: 'Design', d: 'Research, flows and wireframes, then real screens in Figma, with a design system your team can keep using.', k: ['Figma', 'Prototyping', 'Design systems', 'Illustrator', 'Photoshop'] },
  { t: 'Build', d: 'The approved design, coded to match: responsive, fast and accessible, with forms and analytics wired in.', k: ['React', 'TypeScript', 'three.js', 'Tailwind CSS', 'WordPress'] },
  { t: 'Grow', d: 'Through U Scale: Google Business Profile, SEO, social media and ads, with a report every month.', k: ['Local SEO', 'AI search', 'Social media', 'Google and Meta ads'] },
]
function Services() {
  return (
    <section className="services" aria-labelledby="svc-title">
      <div className="wrap">
        <h2 id="svc-title" className="h2">What I do</h2>
        <ul className="svc">
          {services.map((s) => (
            <li key={s.t}>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <ul className="tags">{s.k.map((k) => <li key={k}>{k}</li>)}</ul>
            </li>
          ))}
        </ul>
        <p className="uscale">I also run <a href={contact.uscale} target="_blank" rel="noopener">U Scale<Ext /></a>, my practice for websites, SEO, social media and ads for businesses in Mumbai. Every price is published, and you talk to me directly.</p>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <figure className="about__photo"><img src="/mehul.webp" alt="Mehul Karotra" loading="lazy" /></figure>
        <div className="about__copy">
          <h2 id="about-title" className="h2">Hi, I'm Mehul.</h2>
          <p className="lead">I'm a UI/UX designer and developer from Mumbai. I like the whole journey of a product: the first sketch, the Figma file, the code, and the day it goes live.</p>
          <p>Right now I'm a UI/UX developer at Apex36 Technology Services, and I run U Scale, my own practice, on the side.</p>
          <ul className="journey">
            {journey.map((j) => (
              <li key={j.org}>
                <span className="org">{j.org}{j.note && <small>{j.note}</small>}</span>
                <span className="role">{j.role}{j.now && <b>Now</b>}</span>
              </li>
            ))}
          </ul>
          <p className="edu">Bachelor of Computer Applications, Information Technology.</p>
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ finale: the pavilion at night
function Finale({ onEnter }: { onEnter: (on: boolean) => void }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => onEnter(e.isIntersecting), { threshold: 0 })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [onEnter])
  const [user, domain] = contact.email.split('@')
  return (
    <section ref={ref} className="finale" id="contact" aria-labelledby="contact-title">
      <div className="wrap finale__inner">
        <h2 id="contact-title" className="display display--sm">Your project is next.</h2>
        <p className="lead">Tell me what you're building. I usually reply the same day.</p>
        <a className="mail" href={`mailto:${contact.email}`}><span>{user}@</span><wbr /><span>{domain}</span></a>
        <div className="btns">
          <a className="btn btn--amber" href={contact.whatsapp} target="_blank" rel="noopener"><WA />WhatsApp {contact.phone}</a>
          <a className="btn btn--line" href={contact.linkedin} target="_blank" rel="noopener">LinkedIn<Ext /></a>
          <a className="btn btn--line" href={contact.github} target="_blank" rel="noopener">GitHub<Ext /></a>
        </div>
      </div>
      <footer className="foot wrap">
        <p>© 2026 Mehul Karotra, Mumbai</p>
        <p>The pavilion is modelled in code with three.js. Sky light: <a href="https://polyhaven.com/a/venice_sunset" target="_blank" rel="noopener">Venice Sunset</a> by Greg Zaal, Poly Haven, CC0.</p>
      </footer>
    </section>
  )
}

// ------------------------------------------------------------------ app
export default function App() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<Pavilion | null>(null)
  const lenis = useRef<Lenis | null>(null)
  const [staticMode] = useState(() => {
    if (location.search.includes('nogl')) return true
    try { return !document.createElement('canvas').getContext('webgl2') } catch { return true }
  })
  const [live, setLive] = useState(false)
  const [touch] = useState(() => matchMedia('(hover: none)').matches)
  const vis = useRef({ filmGone: false, finale: false, hidden: false })
  const go = useScrollTo(lenis)

  // smooth scrolling on desktop when motion is allowed
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || touch) return
    const l = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
    lenis.current = l
    let raf = 0
    const loop = (t: number) => { l.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); l.destroy(); lenis.current = null }
  }, [touch])

  const sync = useCallback(() => {
    const p = scene.current, v = vis.current
    const show = !v.filmGone || v.finale
    document.documentElement.classList.toggle('scene-off', !show)
    if (!p) return
    if (show) {
      p.setFinale(v.finale, v.hidden)
      if (v.hidden) p.jump()
      p.start()
    } else p.stop()
    v.hidden = !show
  }, [])
  const onLeave = useCallback((gone: boolean) => { if (vis.current.filmGone !== gone) { vis.current.filmGone = gone; sync() } }, [sync])
  const onFinale = useCallback((on: boolean) => { if (vis.current.finale !== on) { vis.current.finale = on; sync() } }, [sync])

  // the 3D pavilion, fixed behind the page
  useEffect(() => {
    if (staticMode) return
    const c = canvas.current!
    let alive = true
    let cleanup = () => {}
    import('./scene/Pavilion').then(({ Pavilion }) => {
      if (!alive) return
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      const nav = navigator as Navigator & { deviceMemory?: number }
      const low = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 || innerWidth < 760 || location.search.includes('low')
      const p = new Pavilion(c, { low, reducedMotion: reduced, screens: featured.map((f) => ({ slug: f.slug, src: `/work/${f.slug}-live.webp` })) }, {
        onReady: () => { setLive(true); p.jump(); sync() },
        onFrame: (i) => W.__anchors?.(i.anchors, i.lens),
        onScreen: (i) => document.documentElement.classList.toggle('on-screen', i != null),
      })
      scene.current = p
      const fit = () => p.resize(innerWidth, innerHeight)
      fit(); addEventListener('resize', fit)
      const move = (e: PointerEvent) => p.pointerMove(e.clientX, e.clientY)
      const leave = () => p.pointerLeave()
      const click = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest('a,button')) return
        const i = p.click()
        if (i != null) window.open(featured[i].url, '_blank', 'noopener')
      }
      addEventListener('pointermove', move, { passive: true }); addEventListener('pointerdown', move, { passive: true })
      document.documentElement.addEventListener('pointerleave', leave); addEventListener('click', click)
      cleanup = () => {
        removeEventListener('resize', fit); removeEventListener('pointermove', move); removeEventListener('pointerdown', move)
        document.documentElement.removeEventListener('pointerleave', leave); removeEventListener('click', click)
        p.dispose(); scene.current = null
      }
    })
    return () => { alive = false; cleanup() }
  }, [staticMode, sync])

  return (
    <div className={`site${staticMode ? ' static' : ''}${live ? ' is-live' : ''}`}>
      <a className="skip" href="#work">Skip to the work</a>
      <div className="backdrop" aria-hidden="true">
        <div className="poster" />
        <canvas ref={canvas} />
      </div>
      <Header go={go} />
      <main>
        <Film scene={scene} staticMode={staticMode} touch={touch} go={go} onLeave={onLeave} />
        <MoreWork />
        <HoldToShip />
        <Sketchbook />
        <Services />
        <About />
        <Finale onEnter={onFinale} />
      </main>
    </div>
  )
}
