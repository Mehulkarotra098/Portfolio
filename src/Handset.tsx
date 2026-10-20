import type { CSSProperties } from 'react'
import { shot, STATUS } from './shots'

// A drawn phone: titanium edge, glass bezel, Dynamic Island, side keys, a status bar tinted
// like the site's own header, and the home indicator. Every size comes from --hw (its width).
export function Handset({ slug, name, hidden = false, eager = false, style }: { slug: string; name: string; hidden?: boolean; eager?: boolean; style?: CSSProperties }) {
  const tone = STATUS[slug] ?? { bg: '#ffffff', fg: 'dark' as const }
  return (
    <div className="handset" style={style} aria-hidden={hidden || undefined}>
      <i className="handset__key handset__key--action" aria-hidden="true" />
      <i className="handset__key handset__key--up" aria-hidden="true" />
      <i className="handset__key handset__key--down" aria-hidden="true" />
      <i className="handset__key handset__key--power" aria-hidden="true" />
      <div className="handset__screen">
        <div className={`handset__status is-${tone.fg}`} style={{ background: tone.bg }} aria-hidden="true">
          <span className="handset__time">9:41</span>
          <span className="handset__island" />
          <svg className="handset__icons" viewBox="0 0 66 12" aria-hidden="true">
            <g fill="currentColor">
              <rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="6" width="3" height="6" rx="1" />
              <rect x="10" y="3.5" width="3" height="8.5" rx="1" /><rect x="15" y="1" width="3" height="11" rx="1" />
              <path d="M30.5 3.2a9.8 9.8 0 0 1 6.9 2.8l1.3-1.3a11.6 11.6 0 0 0-16.4 0l1.3 1.3a9.8 9.8 0 0 1 6.9-2.8Zm0 3.7a6 6 0 0 1 4.2 1.7l1.3-1.3a7.9 7.9 0 0 0-11 0l1.3 1.3a6 6 0 0 1 4.2-1.7Zm0 3.7a2.3 2.3 0 0 1 1.6.7l-1.6 1.6-1.6-1.6a2.3 2.3 0 0 1 1.6-.7Z" />
              <rect x="44" y="1.5" width="19" height="9" rx="2.6" fill="none" stroke="currentColor" strokeOpacity=".45" />
              <rect x="45.8" y="3.3" width="13.5" height="5.4" rx="1.4" /><rect x="64" y="4.3" width="1.6" height="3.4" rx=".8" fillOpacity=".45" />
            </g>
          </svg>
        </div>
        <img className="handset__page" {...shot(slug, 'mobile')} alt={hidden ? '' : `${name} website on a phone`} loading={eager ? 'eager' : 'lazy'} decoding="async" width={360} height={805} />
        <span className="handset__home" aria-hidden="true" />
      </div>
    </div>
  )
}
