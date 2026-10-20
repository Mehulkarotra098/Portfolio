import { useEffect, useRef, useState } from 'react'
import { contact, projects } from './data'
import { Ext, WA } from './icons'

// Navigation is a "Pages" rail, like Figma's left panel: one mark per section of the site.
// It fills as you scroll, shows where you are, and reveals the page names on hover.
type Page = { id: string; label: string; sub?: boolean }
const PAGES: Page[] = [
  { id: 'top', label: 'Canvas' },
  { id: 'work', label: 'Selected work' },
  ...projects.slice(0, 6).map((p) => ({ id: `p-${p.slug}`, label: p.name, sub: true })),
  { id: 'more', label: 'More work' },
  { id: 'sketchbook', label: 'Sketchbook' },
  { id: 'services', label: 'What I do' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'Questions' },
  { id: 'contact', label: 'Contact' },
]
const MENU = PAGES.filter((p) => !p.sub)
const uscaleServices = `${contact.uscale}/services`

type Go = (e: React.MouseEvent<HTMLAnchorElement>) => void

export function Nav({ go }: { go: Go }) {
  const [active, setActive] = useState('top')
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)
  const rail = useRef<HTMLElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = 0
      const vh = innerHeight
      const max = document.documentElement.scrollHeight - vh
      const prog = max > 0 ? scrollY / max : 0
      rail.current?.style.setProperty('--prog', prog.toFixed(4))
      bar.current?.style.setProperty('--prog', prog.toFixed(4))
      let cur = 'top'
      for (const p of PAGES) {
        const el = document.getElementById(p.id)
        if (el && el.getBoundingClientRect().top <= vh * 0.45) cur = p.id
      }
      setActive(cur)
      const probe = vh / 2
      setDark(Array.from(document.querySelectorAll<HTMLElement>('[data-tone="dark"]')).some((el) => { const r = el.getBoundingClientRect(); return r.top < probe && r.bottom > probe }))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (!open) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  }, [open])

  const activeMain = PAGES.find((p) => p.id === active)?.sub ? 'work' : active
  const jump: Go = (e) => { setOpen(false); go(e) }

  return (
    <>
      <div ref={bar} className="topbar" aria-hidden="true" />

      <nav ref={rail} className={`rail${dark ? ' on-dark' : ''}`} aria-label="Sections">
        <span className="rail__track" aria-hidden="true"><i /></span>
        <ul>
          {PAGES.map((p) => (
            <li key={p.id} className={`${p.sub ? 'is-sub' : ''}${active === p.id ? ' is-on' : ''}${!p.sub && activeMain === p.id ? ' is-main' : ''}`}>
              <a href={`#${p.id}`} onClick={go} aria-current={active === p.id ? 'true' : undefined}>
                <i aria-hidden="true" /><span>{p.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`cap${dark ? ' on-dark' : ''}`}>
        <a className="cap__us" href={uscaleServices} target="_blank" rel="noopener">U Scale<Ext /></a>
        <a className="cap__wa" href={contact.whatsapp} target="_blank" rel="noopener"><WA /><span>WhatsApp</span></a>
        <button className="cap__menu" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="menu" aria-label="Open the menu"><i /><i /></button>
      </div>

      <div id="menu" className={`menu${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <button className="menu__close" onClick={() => setOpen(false)} aria-label="Close the menu"><i /><i /></button>
        <ul>
          {MENU.map((p) => (
            <li key={p.id}><a href={`#${p.id}`} onClick={jump}>{p.label}</a></li>
          ))}
        </ul>
        <div className="menu__foot">
          <a className="btn btn--light" href={uscaleServices} target="_blank" rel="noopener">U Scale services<Ext /></a>
          <a className="btn btn--tomato" href={contact.whatsapp} target="_blank" rel="noopener"><WA />WhatsApp me</a>
        </div>
      </div>
    </>
  )
}
