import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { MoveDownRight } from 'lucide-react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { buttonVariants, buttonHoverAccent } from './ui/button'
import { cn } from '@/lib/utils'
import heroSectionImage from '@/assets/hero-section.png'
import heroSectionLightImage from '@/assets/hero-section-light.png'
import { useTheme } from '@/context/ThemeContext'

gsap.registerPlugin(ScrollTrigger)

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

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
      className="relative mx-auto max-w-container-max overflow-hidden px-4 pb-16 pt-24 sm:px-6 md:px-8 lg:px-margin-x"
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
        className="relative z-10 grid grid-cols-12 gap-gutter lg:items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="col-span-12 lg:col-span-7 lg:col-start-2">
          <motion.span
            className="font-label-sm text-primary-container block mb-4 sm:mb-6 md:mb-8 tracking-[0.4em] uppercase"
            variants={itemVariants}
          >
            UI/UX Developer & Designer
          </motion.span>

          <motion.h1
            className="overflow-visible text-4xl font-bold leading-[0.92] sm:text-5xl md:text-7xl lg:text-[84px] xl:text-[96px]"
            style={{ perspective: '1000px' }}
          >
            <motion.div className="headline-line overflow-visible pb-2" variants={headlineVariants}>
              Crafting{' '}
              <motion.span
                className="inline-block bg-[linear-gradient(90deg,var(--gradient-text-from),var(--gradient-text-via),var(--gradient-text-to))] bg-clip-text pr-4 italic font-light text-transparent"
                whileHover={{
                  scale: 1.04,
                  textShadow: '0 0 20px rgb(var(--color-light-violet-rgb) / 0.58)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                Seamless
              </motion.span>
            </motion.div>
            <motion.div className="headline-line overflow-visible" variants={headlineVariants}>
              Digital{' '}
              <span className="text-on-surface-variant font-light">Interfaces.</span>
            </motion.div>
          </motion.h1>

          <motion.div className="mt-3 sm:mt-8 max-w-xl" variants={itemVariants}>
            <motion.p
              className="font-body-lg text-on-surface-variant leading-relaxed border-l border-primary-container/30 pl-4 sm:pl-6 md:pl-8 text-base sm:text-lg"
              whileInView={{ borderColor: 'rgb(var(--color-light-violet-rgb) / 0.62)' }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false }}
            >
              I am a Mumbai-based developer specializing in the intersection of design and technology. Currently
              scaling products at Apex36 Technology Services.
            </motion.p>

            <motion.div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center" variants={containerVariants}>
              <motion.a
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'h-12 rounded-lg bg-primary-container px-5 py-3 font-label-sm text-xs uppercase tracking-[0.18em] text-on-primary-container',
                  buttonHoverAccent
                )}
                href="#work"
                variants={ctaVariants}
                whileHover="hover"
              >
                <span className="relative z-10">Explore work</span>
                <MoveDownRight className="relative z-10 size-4" aria-hidden="true" />
              </motion.a>
              <motion.a
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-12 rounded-lg border-outline-variant/30 px-5 py-3 font-label-sm text-xs uppercase tracking-[0.18em] text-on-surface-variant',
                  buttonHoverAccent
                )}
                href="#contact"
                variants={ctaVariants}
                whileHover="hover"
              >
                Start a brief
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="col-span-12 mx-auto w-full max-w-[460px] lg:col-span-5 lg:row-start-1 lg:col-start-9"
          variants={itemVariants}
        >
          <img
            src={theme === 'light' ? heroSectionLightImage : heroSectionImage}
            alt="Glassmorphic graphic design preview"
            className="h-auto w-full select-none object-contain drop-shadow-[0_28px_80px_rgb(var(--color-deep-violet-rgb)/0.32)]"
            draggable={false}
          />
        </motion.div>

      </motion.div>
    </section>
  )
}
