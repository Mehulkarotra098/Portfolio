import { useRef } from 'react'
import { useGSAPAnimation } from '../hooks/useGSAP'
import { gsap } from '../lib/gsap'
import { portfolioData } from '../data/portfolio'

export const CreativeArsenal = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAPAnimation(() => {
    const label = sectionRef.current?.querySelector('.arsenal-label')
    const cards = sectionRef.current?.querySelectorAll('.arsenal-card')

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

    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
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
    <section ref={sectionRef} className="px-6 md:px-12 py-40 md:py-56 bg-brand-surface">
      {/* Section Header */}
      <div className="mb-24 md:mb-32">
        <p className="arsenal-label text-brand-accent uppercase tracking-widest text-[10px] font-bold mb-10 md:mb-12">
          05 · Creative Arsenal
        </p>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-brand-cream leading-tight">
          Skills &<br className="hidden md:block" /> Capabilities
        </h2>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
        {portfolioData.skills.map((skillGroup, index) => (
          <div key={index} className="arsenal-card">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-display text-brand-cream mb-10">
              {skillGroup.category}
            </h3>

            <div className="space-y-5">
              {skillGroup.items.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-brand-accent rounded-full shrink-0" />
                  <span className="text-brand-cream text-sm md:text-base">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
