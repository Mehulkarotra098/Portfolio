import { useRef } from 'react'
import { useGSAPAnimation } from '../hooks/useGSAP'
import { gsap } from '../lib/gsap'
import { portfolioData } from '../data/portfolio'

export const Journey = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAPAnimation(() => {
    const label = sectionRef.current?.querySelector('.journey-label')
    const items = sectionRef.current?.querySelectorAll('.journey-item')

    if (label) {
      gsap.fromTo(
        label,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: label,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )
    }

    if (items && items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )
    }
  }, [])

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-40 md:py-56 bg-brand-bg">
      {/* Section Header */}
      <div className="mb-24 md:mb-32">
        <p className="journey-label text-brand-accent uppercase tracking-widest text-[10px] font-bold mb-10 md:mb-12">
          04 · Experience
        </p>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-brand-cream leading-tight">
          Professional<br className="hidden md:block" /> Journey
        </h2>
      </div>

      {/* Timeline */}
      <div className="space-y-0 max-w-5xl">
        {portfolioData.experience.map((item, index) => (
          <div
            key={index}
            className="journey-item grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-12 py-12 md:py-14 border-b border-brand-surface last:border-0"
          >
            <div className="md:col-span-2">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-display text-brand-cream mb-3">
                {item.company}
              </h3>
              <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest">
                {item.role}
              </p>
            </div>

            <div className="text-brand-muted text-sm md:text-base">
              <p>{item.duration}</p>
            </div>

            <div className="text-brand-muted text-sm md:text-base">
              <p>{item.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
