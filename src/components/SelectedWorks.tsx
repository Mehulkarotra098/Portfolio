import { motion, type Variants } from 'framer-motion'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { projects } from '../data/projects'
import { ProjectCard } from './projects/ProjectCard'
import { SectionHeading } from './projects/SectionHeading'

gsap.registerPlugin(ScrollTrigger)

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 82,
      damping: 16,
    },
  },
}

export const SelectedWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-parallax="image"]').forEach((image) => {
        gsap.to(image, {
          y: -28,
          ease: 'none',
          scrollTrigger: {
            trigger: image,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        })
      })
    },
    { scope: containerRef }
  )

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-margin-x max-w-container-max mx-auto" id="work" ref={containerRef}>
      <SectionHeading variants={itemVariants} />

      <motion.div
        className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} variants={itemVariants} />
        ))}
      </motion.div>
    </section>
  )
}
