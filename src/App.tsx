import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { concepts, contact, journey } from './data'
import { Hero } from './Hero'
import { Work, MoreWork } from './Work'
import { Ext, WA } from './icons'
import { kick } from './scroll'

function useScrollTo(lenis: React.RefObject<Lenis | null>) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    const id = e.currentTarget.getAttribute('href')!
    const el = document.querySelector(id) as HTMLElement | null
    if (!el) return
    e.preventDefault()
    if (lenis.current) lenis.current.scrollTo(el, { duration: 1.6 })
    else el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    history.replaceState(null, '', id)
  }
}

// ------------------------------------------------------------------ floating toolbar (navigation)
function Toolbar({ go }: { go: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-tone="dark"]'))
    const on = () => {
      const y = innerHeight - 40
      setDark(els.some((el) => { const r = el.getBoundingClientRect(); return r.top < y && r.bottom > y }))
    }
    on(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on) }
  }, [])
  return (
    <nav className={`tools${dark ? ' on-dark' : ''}`} aria-label="Main">
      <a href="#top" onClick={go} className="tools__mark" aria-label="Mehul Karotra, back to top">MK</a>
      <a href="#work" onClick={go}>Work</a>
      <a href="#about" onClick={go}>About</a>
      <a href="#contact" onClick={go}>Contact</a>
      <a className="tools__wa" href={contact.whatsapp} target="_blank" rel="noopener"><WA /><span>WhatsApp</span></a>
    </nav>
  )
}

// ------------------------------------------------------------------ sketchbook: Figma concepts on a canvas
function Sketchbook() {
  return (
    <section className="sketch canvas-bg" aria-labelledby="sketch-title">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="sketch-title" className="h2">From the sketchbook</h2>
          <p className="lead">Interface concepts I designed in Figma. Open any of them to see the full file.</p>
        </div>
        <ul className="sketch__grid">
          {concepts.map((c) => (
            <li key={c.slug}>
              <a href={c.url} target="_blank" rel="noopener" className="sk">
                <span className="sk__label">{c.name} / Concept</span>
                <span className="sk__img"><img src={`/work/${c.slug}.webp`} alt={`${c.name} concept in Figma`} loading="lazy" decoding="async" /></span>
                <span className="sk__name">{c.name}<Ext /></span>
                <span className="sk__text">{c.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const services = [
  { t: 'Design', d: 'Research, flows and wireframes, then real screens in Figma, with a design system your team can keep using.', k: 'Figma, prototyping, design systems, Illustrator, Photoshop' },
  { t: 'Build', d: 'The approved design, coded to match: responsive, fast and accessible, with forms and analytics wired in.', k: 'React, TypeScript, Tailwind CSS, WordPress, Vercel' },
  { t: 'Grow', d: 'Through U Scale: Google Business Profile, SEO, social media and ads, with a report every month.', k: 'Local SEO, AI search, social media, Google and Meta ads' },
]
function Services() {
  return (
    <section className="svc" aria-labelledby="svc-title">
      <div className="wrap">
        <h2 id="svc-title" className="h2">What I do</h2>
        <ul className="svc__list">
          {services.map((s) => (
            <li key={s.t}>
              <h3>{s.t}</h3>
              <div>
                <p>{s.d}</p>
                <p className="svc__k">{s.k}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="svc__us">I also run <a href={contact.uscale} target="_blank" rel="noopener">U Scale<Ext /></a>, my practice for websites, SEO, social media and ads. Every price is published, and you talk to me directly.</p>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <figure className="about__photo">
          <figcaption>mehul.jpg</figcaption>
          <img src="/mehul.webp" alt="Mehul Karotra" loading="lazy" decoding="async" width={900} height={900} />
          <i className="h h1" /><i className="h h2" /><i className="h h3" /><i className="h h4" />
        </figure>
        <div>
          <h2 id="about-title" className="h2">Hi, I'm Mehul.</h2>
          <p className="lead">I'm a UI/UX designer and developer from Mumbai. I like the whole journey of a product: the first sketch, the Figma file, the code, and the day it goes live.</p>
          <p className="about__p">Right now I'm a UI/UX developer at Apex36 Technology Services, and I run U Scale, my own practice, on the side.</p>
          <ul className="journey">
            {journey.map((j) => (
              <li key={j.org}>
                <span className="org">{j.org}{j.note && <small>{j.note}</small>}</span>
                <span className="role">{j.role}{j.now && <b>Now</b>}</span>
              </li>
            ))}
          </ul>
          <p className="edu">Bachelor of Computer Applications, Information Technology</p>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [user, domain] = contact.email.split('@')
  return (
    <section className="contact" id="contact" data-tone="dark" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title" className="display contact__title">Your turn.</h2>
        <p className="lead">Tell me what you're building. I usually reply the same day.</p>
        <a className="mail" href={`mailto:${contact.email}`}><span>{user}@</span><wbr /><span>{domain}</span></a>
        <div className="btns contact__btns">
          <span className="contact__wa">
            <a className="btn btn--orange" href={contact.whatsapp} target="_blank" rel="noopener"><WA />WhatsApp {contact.phone}</a>
            <span className="mp mp--me mp--static" aria-hidden="true">
              <svg viewBox="0 0 20 22" width="20" height="22"><path d="M2 1.6 17.4 10 10.2 11.6 6.6 18.6Z" fill="#1A0A3D" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
              <span className="mp__tag">Mehul</span><span className="mp__bubble">This one goes straight to me.</span>
            </span>
          </span>
          <a className="btn btn--line-light" href={contact.linkedin} target="_blank" rel="noopener">LinkedIn<Ext /></a>
          <a className="btn btn--line-light" href={contact.github} target="_blank" rel="noopener">GitHub<Ext /></a>
        </div>
      </div>
      <footer className="foot wrap">
        <p>© 2026 Mehul Karotra, Mumbai</p>
        <p>Designed in Figma and built by hand. No templates.</p>
      </footer>
    </section>
  )
}

export default function App() {
  const lenis = useRef<Lenis | null>(null)
  const go = useScrollTo(lenis)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(hover: none)').matches) return
    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95 })
    lenis.current = l
    l.on('scroll', kick)
    let raf = 0
    const loop = (t: number) => { l.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); l.destroy(); lenis.current = null }
  }, [])

  return (
    <>
      <a className="skip" href="#work">Skip to the work</a>
      <a className="wordmark" href="#top" onClick={go}>Mehul Karotra</a>
      <Toolbar go={go} />
      <main>
        <Hero go={go} />
        <div data-tone="dark">
          <Work />
          <MoreWork />
        </div>
        <Sketchbook />
        <Services />
        <About />
        <Contact />
      </main>
    </>
  )
}
