import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'

gsap.registerPlugin(ScrollTrigger)

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Smooth parallax effect using GSAP ScrollTrigger
    gsap.to('.hero-accent-line', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      scaleX: 0.5,
      opacity: 0.3,
      ease: 'none',
    })
  }, { scope: containerRef })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 20,
        delay: 0.1,
      },
    },
  }

  const headlineVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  }

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  }

  return (
    <section
      ref={containerRef}
      className="min-h-[92vh] pt-32 sm:pt-40 md:pt-48 lg:pt-52 pb-10 sm:pb-16 md:pb-24 px-4 sm:px-6 md:px-8 lg:px-margin-x max-w-container-max mx-auto relative overflow-hidden"
      id="hero"
      style={{ perspective: '1200px' }}
    >
      {/* Animated accent line */}
      <motion.div
        className="absolute top-40 right-0 w-1/3 h-px bg-linear-to-l from-primary-container via-accent to-transparent hidden lg:block hero-accent-line origin-right"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      />

      <motion.div
        className="grid grid-cols-12 gap-gutter relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="col-span-12 lg:col-span-10">
          <motion.span
            className="font-label-sm text-primary-container block mb-4 sm:mb-6 md:mb-8 tracking-[0.4em] uppercase"
            variants={itemVariants}
          >
            UI/UX Developer & Designer
          </motion.span>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[104px] leading-[0.92] mb-8 sm:mb-12 md:mb-14 font-bold"
            style={{ perspective: '1000px' }}
          >
            <motion.div className="headline-line" variants={headlineVariants}>
              Crafting{' '}
              <motion.span
                className="italic font-light text-gradient"
                whileHover={{
                  scale: 1.1,
                  textShadow: '0 0 20px rgba(183, 196, 255, 0.5)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                Seamless
              </motion.span>
            </motion.div>
            <motion.div className="headline-line" variants={headlineVariants}>
              Digital{' '}
              <span className="text-on-surface-variant font-light">Interfaces.</span>
            </motion.div>
          </motion.h1>
        </div>

        {/* <motion.div className="col-span-12 lg:col-span-5" variants={itemVariants}>
          <div className="surface-glass rounded-xl px-4 py-3 sm:px-5 sm:py-4 inline-flex items-center gap-3 mb-8">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(0,217,255,0.9)]" />
            <span className="font-label-sm text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
              Available for selected projects
            </span>
          </div>
        </motion.div> */}

        <motion.div className="col-span-12 lg:col-span-5 lg:col-start-7 items-start" variants={itemVariants}>
          <motion.p
            className="font-body-lg text-on-surface-variant leading-relaxed border-l border-primary-container/30 pl-4 sm:pl-6 md:pl-8 text-base sm:text-lg"
            whileInView={{ borderColor: 'rgba(46, 98, 255, 0.6)' }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
          >
            I am a Mumbai-based developer specializing in the intersection of design and technology. Currently
            scaling products at Apex36 Technology Services.
          </motion.p>

          <motion.div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center" variants={containerVariants}>
            <motion.a
              className="button-ripple inline-flex items-center gap-3 bg-primary-container text-on-primary-container rounded-lg px-5 py-3 font-label-sm text-xs uppercase tracking-[0.18em]"
              href="#work"
              variants={ctaVariants}
              whileHover="hover"
            >
              <span className="relative z-10">Explore work</span>
              <span className="relative z-10 material-symbols-outlined text-base">south_east</span>
            </motion.a>
            <motion.a
              className="inline-flex items-center gap-3 rounded-lg border border-outline-variant/30 px-5 py-3 font-label-sm text-xs uppercase tracking-[0.18em] text-on-surface-variant hover:border-primary-container/50 hover:text-primary transition-colors"
              href="#contact"
              variants={ctaVariants}
              whileHover="hover"
            >
              Start a brief
            </motion.a>
          </motion.div>
        </motion.div>

        {/* <motion.div
          className="col-span-12 mt-14 grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden border border-outline-variant/10 bg-outline-variant/10"
          variants={containerVariants}
        >
          {[
            ['4+', 'Years shipping interfaces'],
            ['1M+', 'Users reached'],
            ['Design', 'Systems and prototypes'],
            ['React', 'Motion-rich front ends'],
          ].map(([value, label]) => (
            <motion.div key={label} className="bg-background/70 px-4 py-5 sm:px-6 sm:py-6" variants={itemVariants}>
              <p className="font-display-xl text-2xl sm:text-3xl text-on-surface font-bold">{value}</p>
              <p className="font-label-sm text-[9px] uppercase tracking-[0.18em] text-on-surface-variant mt-2 leading-relaxed">
                {label}
              </p>
            </motion.div>
          ))}
        </motion.div> */}
      </motion.div>
    </section>
  )
}
