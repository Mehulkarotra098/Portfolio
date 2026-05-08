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
      className=" pb-20 sm:pt-40 md:pb-40 px-margin-x max-w-container-max mx-auto relative overflow-hidden"
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
            className="font-label-sm text-primary-container block mb-8 tracking-[0.4em] uppercase"
            variants={itemVariants}
          >
            UI/UX Developer & Designer
          </motion.span>

          <motion.h1
            className="text-[56px] md:text-[100px] lg:text-[128px] leading-[0.95] mb-16 font-bold"
            style={{ perspective: '1000px' }}
          >
            <motion.div className="headline-line" variants={headlineVariants}>
              Crafting{' '}
              <motion.span
                className="italic font-light text-primary"
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

        <motion.div className="col-span-12 lg:col-span-5 lg:col-start-7" variants={itemVariants}>
          <motion.p
            className="font-body-lg text-on-surface-variant leading-relaxed border-l border-primary-container/30 pl-8"
            whileInView={{ borderColor: 'rgba(46, 98, 255, 0.6)' }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
          >
            I am a Mumbai-based developer specializing in the intersection of design and technology. Currently
            scaling products at Apex36 Technology Services.
          </motion.p>

          <motion.div className="mt-12 flex gap-8 items-center" variants={containerVariants}>
            <motion.a
              className="font-label-sm text-primary border-b border-primary-container pb-1"
              href="#work"
              variants={ctaVariants}
              whileHover="hover"
            >
              EXPLORE WORK
            </motion.a>
            <motion.span className="w-12 h-px bg-outline-variant" variants={itemVariants} />
            <motion.span
              className="font-label-sm text-[10px] text-on-surface-variant"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            >
              SCROLL TO DISCOVER
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
