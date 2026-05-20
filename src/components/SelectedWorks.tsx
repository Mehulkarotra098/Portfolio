import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'

gsap.registerPlugin(ScrollTrigger)

type Project = {
  id: number
  title: string
  category: string
  type: 'live' | 'design'
  description: string
  image: string
  year: string
  role: string
  impact: string
  tags: string[]
}

const projects: Project[] = [
  {
    id: 1,
    title: 'My Country Mobile',
    category: 'Live Product',
    type: 'live',
    description: 'AI-powered communication platform for enterprise teams managing voice, messaging, and global workflows.',
    image: '/my-country-mobile.png',
    year: '2026',
    role: 'Product UI, front-end',
    impact: 'Enterprise communications',
    tags: ['Dashboard UX', 'SaaS', 'React'],
  },
  {
    id: 2,
    title: 'Callmama',
    category: 'Live Product',
    type: 'live',
    description: 'A cleaner international calling experience built around faster purchase paths and confident account management.',
    image: '/callmama.png',
    year: '2025',
    role: 'UX systems, web UI',
    impact: 'Global calling platform',
    tags: ['Conversion', 'Mobile-first', 'Design system'],
  },
  {
    id: 3,
    title: 'Bachira',
    category: 'Design Work',
    type: 'design',
    description: 'A retail concept with modern browsing, sharper product hierarchy, and a polished editorial rhythm.',
    image: '/bachira.png',
    year: '2025',
    role: 'Interface design',
    impact: 'Commerce concept',
    tags: ['E-commerce', 'Visual design'],
  },
  {
    id: 4,
    title: 'OrdhekDeen',
    category: 'Design Work',
    type: 'design',
    description: 'A matrimony portal designed to make discovery, trust, and profile review feel calmer and more intentional.',
    image: '/matrimony.png',
    year: '2025',
    role: 'UX/UI design',
    impact: 'Cultural connection',
    tags: ['Research', 'Responsive UI'],
  },
]

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
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

  // const getBadgeColor = (type: Project['type']) => {
  //   return type === 'live'
  //     ? 'bg-primary-container/15 text-primary border border-primary-container/35'
  //     : 'bg-accent/10 text-accent border border-accent/30'
  // }

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-margin-x max-w-container-max mx-auto" id="work" ref={containerRef}>
      <motion.div
        className="grid grid-cols-12 gap-6 md:gap-gutter items-end mb-12 sm:mb-16 md:mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.45 }}
      >
        <motion.div className="col-span-12 lg:col-span-7" variants={itemVariants}>
          <span className="font-label-sm text-primary-container block mb-4 uppercase tracking-[0.4em]">
            Selected outcomes
          </span>
          <h2 className="font-display-xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-on-surface leading-tight font-bold">
            Work that feels
            <br />
            <span className="italic text-gradient">clear, fast, finished.</span>
          </h2>
        </motion.div>
        <motion.p
          className="col-span-12 lg:col-span-4 lg:col-start-9 font-body-lg text-on-surface-variant leading-relaxed"
          variants={itemVariants}
        >
          Product interfaces, live business surfaces, and design explorations presented as full screenshots so the work
          stays front and center.
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            className={`group surface-glass rounded-xl overflow-hidden ${index < 2 ? 'md:col-span-2' : ''}`}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className={`grid ${index < 2 ? 'lg:grid-cols-[1.45fr_0.55fr]' : 'grid-cols-1'} h-full`}>
              <div className={`relative overflow-hidden media-frame bg-background/70 ${index < 2 ? 'min-h-[320px] sm:min-h-[520px]' : 'aspect-[4/3]'}`}>
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-contain p-3 sm:p-5 transition-transform duration-700 group-hover:scale-[1.02]"
                  data-parallax="image"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/18 via-transparent to-transparent" />
                {/* <div className="absolute left-4 top-4 sm:left-6 sm:top-6 flex gap-2">
                  <span className={`rounded-full px-3 py-1.5 font-label-sm text-[9px] uppercase tracking-[0.18em] ${getBadgeColor(project.type)}`}>
                    {project.category}
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 font-label-sm text-[9px] uppercase tracking-[0.18em] text-on-surface backdrop-blur">
                    {project.year}
                  </span>
                </div> */}
              </div>

              <div className="flex flex-col justify-between gap-8 p-5 sm:p-7 md:p-8 lg:p-10">
                <div>
                  <p className="font-label-sm text-[10px] uppercase tracking-[0.28em] text-primary mb-4">
                    {project.role}
                  </p>
                  <h3 className="font-display-xl text-3xl sm:text-4xl md:text-5xl text-on-surface leading-tight font-bold mb-4 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-xl">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3 border-y border-outline-variant/10 py-4">
                    <div>
                      <p className="font-label-sm text-[9px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                        Focus
                      </p>
                      <p className="font-body-md text-sm text-on-surface">{project.impact}</p>
                    </div>
                    <div>
                      <p className="font-label-sm text-[9px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                        Craft
                      </p>
                      <p className="font-body-md text-sm text-on-surface">{project.tags.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-outline-variant/20 px-3 py-1.5 font-label-sm text-[9px] uppercase tracking-[0.16em] text-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
