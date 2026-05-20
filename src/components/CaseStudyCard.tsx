import { useRef } from 'react'
import { useGSAPAnimation } from '../hooks/useGSAP'
import { gsap } from '../lib/gsap'

interface CaseStudyCardProps {
  project: {
    id: number
    title: string
    year: string
    category: string
    description: string
    image: string
    link: string
  }
}

export const CaseStudyCard = ({ project }: CaseStudyCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useGSAPAnimation(() => {
    if (!cardRef.current) return

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 80, scale: 0.93 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          end: 'top 30%',
          toggleActions: 'play none none none',
          markers: false
        }
      }
    )

    // Image tilt effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!imgRef.current) return
      const rect = imgRef.current.parentElement?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const tiltX = (y - 0.5) * 2
      const tiltY = (x - 0.5) * -2

      gsap.to(imgRef.current, {
        rotationX: tiltX,
        rotationY: tiltY,
        transformPerspective: 1200,
        duration: 0.3,
        overwrite: 'auto'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(imgRef.current, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    const imageContainer = cardRef.current?.querySelector<HTMLElement>('.image-container')
    if (imageContainer) {
      imageContainer.addEventListener('mousemove', handleMouseMove as EventListener)
      imageContainer.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        imageContainer.removeEventListener('mousemove', handleMouseMove as EventListener)
        imageContainer.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [project.id])

  return (
    <div ref={cardRef} className="group cursor-pointer">
      <a href={project.link} className="block">
        {/* Image Container with Perspective */}
        <div className="image-container relative w-full bg-brand-surface mb-10 md:mb-12 overflow-hidden rounded-md perspective">
          <div className="relative aspect-square w-full overflow-hidden rounded-md" style={{ perspective: '1200px' }}>
            <img
              ref={imgRef}
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-linear-to-tr from-brand-accent/0 to-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Year Badge */}
          <div className="absolute top-6 right-6 bg-brand-bg/95 backdrop-blur-md px-4 py-2 rounded text-[10px] font-semibold text-brand-accent tracking-wider border border-brand-accent/20 group-hover:border-brand-accent/50 transition-all duration-300 shadow-lg">
            {project.year}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5">
          {/* Label */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-4 group-hover:spacing-widest transition-all duration-300">
              {project.category}
            </p>
            {/* Title with subtle underline animation */}
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-display text-brand-cream group-hover:text-brand-accent transition-colors duration-300 leading-tight">
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-brand-muted text-sm md:text-base leading-relaxed group-hover:text-brand-muted/80 transition-colors duration-300">
            {project.description}
          </p>

          {/* CTA with animated arrow */}
          <div className="pt-2 flex items-center gap-3 text-brand-accent text-xs md:text-sm font-semibold group-hover:gap-5 transition-all duration-300">
            <span>VIEW CASE STUDY</span>
            <span className="inline-block text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
          </div>
        </div>
      </a>
    </div>
  )
}
