import { projects, type Project } from './data'
import { sstep, usePin } from './scroll'
import { Ext } from './icons'

const featured = projects.slice(0, 6)
const more = projects.slice(6)
const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function Chapter({ p, i }: { p: Project; i: number }) {
  const ref = usePin<HTMLElement>((t, _r, el) => {
    el.style.setProperty('--t', sstep(0, 0.24, t).toFixed(3))
    el.style.setProperty('--sc', sstep(0.16, 0.9, t).toFixed(4))
    el.style.setProperty('--ph', sstep(0.36, 0.7, t).toFixed(3))
  })
  const fit = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const im = e.currentTarget
    const r = im.naturalHeight / im.naturalWidth
    im.style.setProperty('--range', Math.max(0, 1 - 0.625 / r).toFixed(4))
  }
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
            <div className="browser__bar" aria-hidden="true"><i /><i /><i /><span>{host(p.url)}</span></div>
            <div className="screen">
              <img className="screen__page" src={`/work/${p.slug}-page.webp`} alt={`${p.name} website`} loading="lazy" decoding="async" width={1152} onLoad={fit} />
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
        <p className="lead">Six sites, each one designed in Figma and built by me. Keep scrolling to move through every page.</p>
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
