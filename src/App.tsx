import { useEffect, useRef, useState } from 'react'
import { concepts, contact, journey, projects, type Project } from './data'

const Ext = () => (
  <svg className="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3h7v7M13 3 4 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const WA = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.6-.3Z" /></svg>
)

// ------------------------------------------------------------------ hero
function Hero() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const section = useRef<HTMLElement>(null)
  const [caught, setCaught] = useState(0)
  const [live, setLive] = useState(false)
  const [touch] = useState(() => typeof window !== 'undefined' && matchMedia('(hover: none)').matches)

  useEffect(() => {
    const c = canvas.current, sec = section.current
    if (!c || !sec) return
    let alive = true
    let cleanup = () => {}
    if (location.search.includes('nogl')) return // static poster only (used for testing)
    import('./hero/Garden').then(({ Garden }) => {
      if (!alive) return
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      const nav = navigator as Navigator & { deviceMemory?: number }
      const low = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 || innerWidth < 700
      const g = new Garden(c, { reducedMotion: reduced, lowPower: low, botUrl: '/model/neil.glb', butterflyUrl: '/model/garden.glb', wingsUrl: '/model/wings', gardenBase: '/garden/' }, {
        onReady: () => setLive(true),
        onCatch: setCaught,
      })
      const fit = () => g.resize(c.clientWidth, c.clientHeight)
      const ro = new ResizeObserver(fit); ro.observe(c); fit()
      const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); g.pointerMove(e.clientX - r.left, e.clientY - r.top, e.pointerType === 'touch') }
      const leave = () => g.pointerLeave()
      sec.addEventListener('pointermove', move); sec.addEventListener('pointerdown', move); sec.addEventListener('pointerleave', leave)
      // only render while the hero is on screen
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? g.start() : g.stop()), { threshold: 0.02 })
      io.observe(sec)
      cleanup = () => { ro.disconnect(); io.disconnect(); sec.removeEventListener('pointermove', move); sec.removeEventListener('pointerdown', move); sec.removeEventListener('pointerleave', leave); g.dispose() }
    })
    return () => { alive = false; cleanup() }
  }, [])

  return (
    <section id="top" className={`hero${live ? " is-live" : ""}`} ref={section} aria-labelledby="hero-title">
      <div className="hero__poster" aria-hidden="true" />
      <canvas ref={canvas} className="hero__scene" aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="wrap hero__copy">
        <p className="hero__who">Mehul Karotra <span>UI/UX developer and designer, Mumbai</span></p>
        <h1 id="hero-title">I design interfaces, then I build them.</h1>
        <p className="hero__lead">Every screen starts in Figma and ends as fast, real code that I ship and look after. I also run <a href="#uscale">U Scale</a>, my studio for websites, SEO and social.</p>
        <div className="btns">
          <a className="btn btn--bot" href="#work">See the work</a>
          <a className="btn btn--ghost" href={contact.whatsapp} target="_blank" rel="noopener"><WA />WhatsApp me</a>
        </div>
      </div>
      <p className="hero__hint" aria-live="polite">
        <span className="dot" aria-hidden="true" />
        {touch ? 'Touch the garden: the bot is chasing the butterfly.' : 'Move your cursor: the bot is chasing the butterfly.'}
        {caught > 0 && <b> Caught {caught} {caught === 1 ? 'time' : 'times'}.</b>}
      </p>
    </section>
  )
}

// ------------------------------------------------------------------ header
function Header() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(scrollY > innerHeight * 0.75)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`top${solid ? ' is-solid' : ''}`}>
      <div className="wrap top__in">
        <a className="mark" href="#top" aria-label="Mehul Karotra, back to top">Mehul Karotra</a>
        <nav aria-label="Main">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="btn btn--small" href={contact.whatsapp} target="_blank" rel="noopener"><WA />WhatsApp</a>
      </div>
    </header>
  )
}

// --------------------------------------------------------- work: design -> build
function useScrub(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const items = () => Array.from(el.querySelectorAll<HTMLElement>('.proj'))
    const tick = () => {
      const vh = innerHeight
      for (const it of items()) {
        const r = it.getBoundingClientRect()
        if (r.bottom < -200 || r.top > vh + 200) continue
        // 0 while the card enters from below, 1 once its frame is past the middle of the screen
        const p = reduced ? 1 : Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.62)))
        it.style.setProperty('--p', p.toFixed(3))
      }
      raf = 0
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    on(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [ref])
}

function ProjectCard({ p }: { p: Project }) {
  const host = p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <li className="proj" style={{ '--acc': p.accent } as React.CSSProperties}>
      <div className="proj__text">
        <p className="proj__meta">{p.meta}{p.note && <span className="tag">{p.note}</span>}</p>
        <h3>{p.name}</h3>
        <p>{p.text}</p>
        <p className="proj__role">{p.role}</p>
        <a className="link" href={p.url} target="_blank" rel="noopener">Visit {host}<Ext /></a>
      </div>
      <figure className="proj__frame">
        <figcaption className="frame__label"><span className="frame__name">{p.name}</span><span className="frame__size">Desktop 1440</span></figcaption>
        <div className="frame__view">
          <img className="frame__wire" src={`/work/${p.slug}-wire.webp`} alt="" width="1152" height="720" loading="lazy" decoding="async" />
          <img className="frame__live" src={`/work/${p.slug}-live.webp`} alt={`${p.name} website, home page`} width="1152" height="720" loading="lazy" decoding="async" />
          <span className="frame__seam" aria-hidden="true"><i>Figma</i><i>Live</i></span>
          <span className="frame__handles" aria-hidden="true"><b /><b /><b /><b /></span>
        </div>
        {p.mobile && (
          <div className="proj__phone" aria-hidden="true"><img src={`/work/${p.slug}-mobile.webp`} alt="" width="360" height="805" loading="lazy" decoding="async" /></div>
        )}
      </figure>
    </li>
  )
}

function Work() {
  const ref = useRef<HTMLElement>(null)
  useScrub(ref)
  return (
    <section className="section work" id="work" ref={ref} aria-labelledby="work-title">
      <div className="wrap">
        <div className="head">
          <h2 id="work-title">Selected work</h2>
          <p className="lead">Each project starts as a Figma frame. Scroll, and watch the design turn into the site that went live.</p>
        </div>
        <ul className="projs">{projects.map((p) => <ProjectCard key={p.slug} p={p} />)}</ul>
      </div>
    </section>
  )
}

function Concepts() {
  return (
    <section className="section concepts" aria-labelledby="concepts-title">
      <div className="wrap">
        <div className="head">
          <h2 id="concepts-title">Straight from the Figma file</h2>
          <p className="lead">Interface concepts I designed in Figma. Open any of them to see the full file.</p>
        </div>
        <ul className="cgrid">
          {concepts.map((c) => (
            <li key={c.slug} className="concept">
              <a href={c.url} target="_blank" rel="noopener">
                <span className="concept__img"><img src={`/work/${c.slug}.webp`} alt={`${c.name} design in Figma`} loading="lazy" decoding="async" /></span>
                <span className="concept__name">{c.name}<Ext /></span>
                <span className="concept__text">{c.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Services() {
  const cols = [
    { t: 'Design', d: 'Research, flows and wireframes, then real screens in Figma. Design systems that a team can keep using.', tools: ['Figma', 'Illustrator', 'Photoshop', 'Prototyping', 'Design systems'] },
    { t: 'Build', d: 'The approved design, coded to match: responsive, fast and accessible, with forms and analytics wired in.', tools: ['React', 'TypeScript', 'Tailwind CSS', 'three.js', 'WordPress', 'Git'] },
    { t: 'Grow', d: 'Through U Scale: Google Business Profile, SEO, social media and ads, with a report every month.', tools: ['Local SEO', 'AI search', 'Social media', 'Google and Meta ads'] },
  ]
  return (
    <section className="section svc" aria-labelledby="svc-title">
      <div className="wrap">
        <div className="head"><h2 id="svc-title">What I do</h2></div>
        <div className="svc__grid">
          {cols.map((c) => (
            <div key={c.t} className="svc__col">
              <h3>{c.t}</h3>
              <p>{c.d}</p>
              <ul className="chips">{c.tools.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <figure className="about__photo"><img src="/mehul.webp" alt="Mehul Karotra" width="900" height="900" loading="lazy" decoding="async" /></figure>
        <div>
          <h2 id="about-title">Hi, I'm Mehul.</h2>
          <p className="lead">I'm a UI/UX developer and designer from Mumbai. I like the whole journey of a product: the first sketch, the Figma file, the code, and the day it goes live.</p>
          <p>Because I design and build myself, nothing gets lost between a designer and a developer. What a client approves in Figma is what ships. Today I work as a UI/UX developer at Apex36 Technology Services and run U Scale, my own practice, on the side.</p>
          <ol className="journey" aria-label="Where I've worked">
            {journey.map((j) => (
              <li key={j.org}><b>{j.org}</b><span>{j.role}{j.now && <em>Now</em>}</span>{j.note && <small>{j.note}</small>}</li>
            ))}
          </ol>
          <p className="muted">Bachelor of Computer Applications, Information Technology.</p>
        </div>
      </div>
    </section>
  )
}

function UScale() {
  return (
    <section className="uscale" id="uscale" aria-labelledby="uscale-title">
      <div className="wrap uscale__in">
        <div>
          <h2 id="uscale-title">I also run U Scale.</h2>
          <p>A one-person studio for Mumbai businesses: websites, SEO, social media and ads, with every price published. You talk to me, and I do the work.</p>
        </div>
        <a className="btn btn--light" href={contact.uscale} target="_blank" rel="noopener">Visit uscale.in<Ext /></a>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title">Have something to design or build?</h2>
        <p className="lead">Tell me about it. I usually reply the same day.</p>
        <a className="contact__mail" href={`mailto:${contact.email}`}><span>{contact.email.split('@')[0]}@</span><wbr /><span>{contact.email.split('@')[1]}</span></a>
        <ul className="contact__links">
          <li><a href={contact.whatsapp} target="_blank" rel="noopener"><WA />WhatsApp {contact.phone}</a></li>
          <li><a href={contact.linkedin} target="_blank" rel="noopener">LinkedIn<Ext /></a></li>
          <li><a href={contact.github} target="_blank" rel="noopener">GitHub<Ext /></a></li>
        </ul>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <p>© {new Date().getFullYear()} Mehul Karotra, Mumbai</p>
        <p className="credits">
          3D in the garden: <a href="https://sketchfab.com/3d-models/bot-neil-animation-by-oscar-creativo-56d5d623bb6c40faaa951aca02080510" target="_blank" rel="noopener">Bot Neil</a> by Oscar Creativo and <a href="https://sketchfab.com/3d-models/12-animated-butterflies-8ca3b9aa82694e6b8bc53a69b4529539" target="_blank" rel="noopener">12 Animated Butterflies</a> by bestgamekits (both <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>); trees, grass and flowers from <a href="https://github.com/dgreenheck/ez-tree" target="_blank" rel="noopener">EZ-Tree</a> by Daniel Greenheck (MIT).
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <Concepts />
        <Services />
        <About />
        <UScale />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
