import { useEffect, useRef, useState } from 'react'
import { projects, type Project } from './data'
import { clamp, kick, sstep, usePin } from './scroll'
import { Ext } from './icons'
import { IcDesktop, IcPhone } from './canvasIcons'
import { Loop } from './media'
import { LOOPS, shot } from './shots'
import { Handset } from './Handset'

const featured = projects.slice(0, 6)
const more = projects.slice(6)
const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function Chapter({ p, i }: { p: Project; i: number }) {
  const narrow = () => matchMedia('(max-width: 860px)').matches
  const ref = usePin<HTMLElement>((t, r, el) => {
    if (narrow()) {
      // Phones: chapters sit in the page flow, so progress follows the chapter across the screen.
      const vh = innerHeight
      el.style.setProperty('--t', sstep(0, 1, (vh - r.top) / (vh * 0.55)).toFixed(3))
      el.style.setProperty('--sc', sstep(0.25, 0.9, (vh - r.top) / (vh + r.height)).toFixed(4))
      el.style.setProperty('--ph', '1')
      return
    }
    el.style.setProperty('--t', sstep(0, 0.24, t).toFixed(3))
    el.style.setProperty('--sc', sstep(0.16, 0.9, t).toFixed(4))
    el.style.setProperty('--ph', sstep(0.36, 0.7, t).toFixed(3))
  })
  const media = useRef<HTMLDivElement>(null)
  // Every project opens on its desktop site; the phone view is one tap away.
  const [view, setView] = useState<'desk' | 'mob'>('desk')
  const [dragging, setDragging] = useState(false)
  // Size the browser (16:10 screen) and, on wide layouts, the phone that replaces it in phone view.
  const layout = () => {
    const m = media.current
    if (!m) return
    const w = m.clientWidth
    if (!w) return
    const bar = m.querySelector<HTMLElement>('.browser__bar')?.offsetHeight ?? 42
    const sh = w * 0.625
    m.style.setProperty('--sh', `${sh.toFixed(1)}px`)
    if (!narrow()) m.style.setProperty('--hw', `${clamp((sh + bar) / 2.09, 190, 300).toFixed(1)}px`)
    else m.style.removeProperty('--hw')
    if (!m.dataset.drag) m.style.setProperty('--bw', '1')
    requestAnimationFrame(() => { const sc = m.querySelector<HTMLElement>('.screen'); if (sc) m.style.setProperty('--shr', (sc.clientHeight / w).toFixed(4)) })
  }
  useEffect(() => {
    const m = media.current!
    const ro = new ResizeObserver(() => layout())
    ro.observe(m)
    return () => ro.disconnect()
  })
  const setTo = (v: 'desk' | 'mob') => { setView(v); requestAnimationFrame(() => { layout(); kick() }) }
  const fit = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const im = e.currentTarget
    media.current!.style.setProperty('--rd', (im.naturalHeight / im.naturalWidth).toFixed(4))
  }
  // Wide screens: drag the browser's edge narrower and it turns into the phone.
  const grip = (e: React.PointerEvent<HTMLButtonElement>) => {
    const m = media.current!
    const r = m.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const minW = 0.34
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    m.dataset.drag = '1'; setDragging(true)
    let v = view
    if (v === 'mob') { v = 'desk'; setView('desk') }
    const mv = (ev: PointerEvent) => {
      const bw = clamp((2 * (ev.clientX - cx)) / r.width, minW, 1)
      m.style.setProperty('--bw', bw.toFixed(3))
      v = bw < 0.5 ? 'mob' : 'desk'
      m.classList.toggle('is-narrow', bw < 0.62)
    }
    const up = () => {
      removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up)
      delete m.dataset.drag; setDragging(false); m.classList.remove('is-narrow')
      m.style.setProperty('--bw', '1')
      setView(v)
    }
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up)
  }
  return (
    <section ref={ref} id={`p-${p.slug}`} className={`ch${i % 2 ? ' ch--flip' : ''}`} style={{ ['--accent' as string]: p.accent }} aria-labelledby={`ch-${p.slug}`}>
      <div className="ch__stage">
        <div className="ch__glow" aria-hidden="true" />
        <div className="ch__copy">
          <p className="ch__num"><span>{String(i + 1).padStart(2, '0')}</span> of {String(featured.length).padStart(2, '0')}</p>
          <h3 id={`ch-${p.slug}`} className="ch__title">{p.name}</h3>
          <p className="ch__meta"><span>{p.meta}</span>{p.note && <em>{p.note}</em>}</p>
          <p className="ch__text">{p.text}</p>
          <p className="ch__role">{p.role}</p>
          <a className="btn btn--light ch__visit" href={p.url} target="_blank" rel="noopener"><span className="ch__host">Visit {host(p.url)}</span><span className="ch__host-s">Visit the live site</span><Ext /></a>
        </div>
        <div ref={media} className={`ch__media is-${view}${dragging ? ' is-dragging' : ''}`}>
          {p.mobile && (
            <div className="ch__tools">
              <div className="vseg" role="group" aria-label={`View ${p.name} on`}>
                <button className={view === 'desk' ? 'is-on' : ''} aria-pressed={view === 'desk'} onClick={() => setTo('desk')}><IcDesktop /><span>Desktop</span></button>
                <button className={view === 'mob' ? 'is-on' : ''} aria-pressed={view === 'mob'} onClick={() => setTo('mob')}><IcPhone /><span>Mobile</span></button>
              </div>
              <p className="ch__tip" aria-hidden="true">Drag the edge to resize</p>
            </div>
          )}
          <div className="ch__devices">
            <div className="browser" aria-hidden={view === 'mob' || undefined}>
              <div className="browser__bar">
                <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
                <span aria-hidden="true">{host(p.url)}</span>
              </div>
              <div className="screen">
                <div className="screen__page screen__desk">
                  <img {...shot(p.slug, 'page')} alt={`${p.name} website, desktop`} loading="lazy" decoding="async" width={1152} onLoad={fit} />
                  {LOOPS[p.slug] && <Loop slug={p.slug} className="screen__loop" on={view === 'desk'} still={false} />}
                </div>
                {p.mobile && <img className="screen__page screen__mob" {...shot(p.slug, 'mobile')} alt="" aria-hidden="true" loading="lazy" decoding="async" width={360} height={805} />}
              </div>
              {p.mobile && <button className="grip" onPointerDown={grip} aria-label="Drag to resize the browser" title="Drag to resize"><i /><i /></button>}
            </div>
            {p.mobile && <div className="ch__handset"><Handset slug={p.slug} name={p.name} hidden={view !== 'mob'} /></div>}
          </div>
          {p.mobile && (
            <div className="phone" aria-hidden="true">
              <Handset slug={p.slug} name={p.name} hidden />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function Work() {
  return (
    <div className="work" id="work">
      <header className="work__intro wrap">
        <h2 className="h2">Selected work</h2>
        <p className="lead">Six sites, each one designed in Figma and built by me. Keep scrolling to move through every page.</p>
      </header>
      {featured.map((p, i) => <Chapter key={p.slug} p={p} i={i} />)}
    </div>
  )
}

export function MoreWork() {
  return (
    <section className="more" id="more" aria-labelledby="more-title">
      <div className="wrap">
        <div className="more__head">
          <h2 id="more-title" className="h2">More work</h2>
          <p className="lead">A climate-tech product, an AI SaaS site, and the in-house work I did at My Country Mobile.</p>
        </div>
        <ul className="more__grid">
          {more.map((p) => (
            <li key={p.slug}>
              <a href={p.url} target="_blank" rel="noopener" className="card">
                <span className="card__img"><img src={`/work/${p.slug}-live.webp`} alt="" loading="lazy" decoding="async" width={1152} height={720} /></span>
                <span className="card__name">{p.name}<Ext /></span>
                <span className="card__meta">{p.meta}{p.note && <em>{p.note}</em>}</span>
                <span className="card__text">{p.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
