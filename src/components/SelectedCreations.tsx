import { useRef } from 'react'
import { useGSAPAnimation } from '../hooks/useGSAP'
import { gsap } from '../lib/gsap'
import { CaseStudyCard } from './CaseStudyCard'
import { portfolioData } from '../data/portfolio'

export const SelectedCreations = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAPAnimation(() => {
    const label = sectionRef.current?.querySelector('.section-label')
    const heading = sectionRef.current?.querySelector('.section-heading')

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

    if (heading) {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
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
      <div className="mb-24 md:mb-36">
        <p className="section-label text-brand-accent uppercase tracking-widest text-[10px] font-bold mb-10 md:mb-12">
          02 · Selected Creations
        </p>
        <h2 className="section-heading text-5xl md:text-6xl lg:text-7xl font-display text-brand-cream leading-tight">
          Featured<br className="hidden md:block" /> Projects
        </h2>
      </div>

      {/* Projects Grid - 2 Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 lg:gap-24 xl:gap-32">
        {portfolioData.projects.map((project) => (
          <CaseStudyCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
