import { useRef } from 'react'
import { projects, type Project } from './data'
import { sstep, usePin } from './scroll'
import { Ext } from './icons'

export const featured = projects.slice(0, 6)
export const more = projects.slice(6)
const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function Chapter({ p, i }: { p: Project; i: number }) {
  const chip = useRef<HTMLSpanElement>(null)
  const ref = usePin<HTMLElement>((t) => {
    const el = ref.current!
    const b = sstep(0.14, 0.66, t)
    el.style.setProperty('--t', sstep(0, 0.22, t).toFixed(3))
    el.style.setProperty('--b', b.toFixed(4))
    el.style.setProperty('--ph', sstep(0.5, 0.84, t).toFixed(3))
    el.style.setProperty('--scan', (b > 0.003 && b < 0.997 ? 1 : 0).toString())
    const c = chip.current
    if (c) { const live = b > 0.5; if (c.dataset.live !== String(live)) { c.dataset.live = String(live); c.textContent = live ? 'Live site' : 'Wireframe' } }
  })
  return (
    <section ref={ref} className={`ch${i % 2 ? ' ch--flip' : ''}`} style={{ ['--accent' as string]: p.accent }} aria-labelledby={`ch-${p.slug}`}>
      <div className="ch__stage">
        <div className="ch__glow" aria-hidden="true" />
        <div className="ch__copy">
          <p className="ch__num"><span>{String(i + 1).padStart(2, '0')}</span> of {String(featured.length).padStart(2, '0')}</p>
          <h3 id={`ch-${p.slug}`} className="ch__title">{p.name}</h3>
          <p className="ch__meta"><span>{p.meta}</span>{p.note && <em>{p.note}</em>}</p>
          <p className="ch__text">{p.text}</p>
          <p className="ch__role">{p.role}</p>
          <a className="btn btn--light" href={p.url} target="_blank" rel="noopener">Visit {host(p.url)}<Ext /></a>
        </div>
        <div className="ch__media">
          <div className="browser">
            <div className="browser__bar" aria-hidden="true"><i /><i /><i /><span>{host(p.url)}</span><b ref={chip} className="chip" data-live="false">Wireframe</b></div>
            <div className="screen">
              <img className="screen__wire" src={`/work/${p.slug}-wire.webp`} alt="" loading="lazy" decoding="async" width={1152} height={720} />
              <img className="screen__live" src={`/work/${p.slug}-live.webp`} alt={`${p.name} website, home page`} loading="lazy" decoding="async" width={1152} height={720} />
              <span className="screen__scan" aria-hidden="true" />
            </div>
          </div>
          {p.mobile && (
            <div className="phone" aria-hidden="true">
              <img src={`/work/${p.slug}-mobile.webp`} alt="" loading="lazy" decoding="async" width={360} height={805} />
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
        <p className="lead">Six sites, each one designed in Figma and built by me. Scroll through them to watch every wireframe go live.</p>
      </header>
      {featured.map((p, i) => <Chapter key={p.slug} p={p} i={i} />)}
    </div>
  )
}

export function MoreWork() {
  return (
    <section className="more" aria-labelledby="more-title">
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
