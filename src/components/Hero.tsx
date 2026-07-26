import { motion, useReducedMotionConfig } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

const practiceDetails = [
  { label: 'Practice', value: 'UI/UX + front-end' },
  { label: 'Location', value: 'Mumbai, India' },
  { label: 'Focus', value: 'Responsive products' },
]

export const Hero = () => {
  const shouldReduceMotion = useReducedMotionConfig()

  const entrance = (delay: number) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: 'easeOut' as const },
  })

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate mx-auto max-w-container-max overflow-hidden px-4 pb-16 pt-36 sm:px-6 sm:pb-20 sm:pt-40 md:px-8 md:pb-24 md:pt-36 lg:px-margin-x lg:pb-28 lg:pt-40"
      id="hero"
    >
      <div
        aria-hidden="true"
        className="absolute right-0 top-32 -z-10 h-56 w-[42%] bg-surface-container-low opacity-70 sm:h-72 md:top-28 md:h-[26rem]"
      />
      <div
        aria-hidden="true"
        className="absolute right-[12%] top-32 -z-10 h-24 w-px bg-primary/55 md:h-36"
      />

      <motion.p
        className="font-label-sm text-[10px] uppercase tracking-[0.19em] text-primary sm:text-[11px]"
        {...entrance(0)}
      >
        UI/UX Designer · Front-end Developer
      </motion.p>

      <motion.h1
        className="mt-8 max-w-[1180px] font-display-xl text-[clamp(2.85rem,11.5vw,8.35rem)] font-medium leading-[0.88] tracking-[-0.045em] text-on-surface sm:mt-10 md:mt-12"
        id="hero-title"
        {...entrance(0.06)}
      >
        I design digital experiences—
        <span className="text-primary">and build them for real.</span>
      </motion.h1>

      <div className="mt-12 grid grid-cols-12 gap-x-gutter gap-y-10 border-t border-outline-variant/25 pt-8 sm:mt-14 sm:pt-10 md:mt-16 lg:mt-20">
        <motion.p
          className="col-span-12 max-w-2xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8 lg:col-span-7"
          {...entrance(0.12)}
        >
          From Figma systems to responsive production websites, I connect
          thoughtful interface design with clean front-end execution.
        </motion.p>

        <motion.div
          className="col-span-12 flex flex-col items-start gap-3 sm:flex-row sm:gap-4 lg:col-span-5 lg:justify-end"
          {...entrance(0.18)}
        >
          <a
            className="inline-flex min-h-12 w-full items-center justify-between gap-4 bg-[rgb(var(--color-primary-rgb))] px-5 font-label-sm text-[10px] uppercase tracking-[0.14em] text-[rgb(var(--color-on-primary-rgb))] transition-colors hover:bg-[rgb(var(--color-on-surface-rgb))] hover:text-[rgb(var(--color-background-rgb))] sm:w-auto sm:min-w-52"
            href="#work"
          >
            View featured work
            <ArrowDownRight className="size-4" aria-hidden="true" />
          </a>
          <a
            className="inline-flex min-h-12 w-full items-center justify-between gap-4 border border-outline-variant/40 px-5 font-label-sm text-[10px] uppercase tracking-[0.14em] text-on-surface transition-colors hover:border-on-surface sm:w-auto sm:min-w-52"
            href="#contact"
          >
            Let’s work together
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </motion.div>
      </div>

      <motion.dl
        aria-label="Practice details"
        className="mt-12 grid border-y border-outline-variant/25 sm:grid-cols-3 lg:mt-16"
        {...entrance(0.24)}
      >
        {practiceDetails.map((detail) => (
          <div
            className="grid min-h-20 grid-cols-[7rem_1fr] items-center border-b border-outline-variant/20 py-3 last:border-b-0 sm:block sm:border-b-0 sm:border-r sm:px-6 sm:py-5 sm:first:pl-0 sm:last:border-r-0"
            key={detail.label}
          >
            <dt className="font-label-sm text-[9px] uppercase tracking-[0.16em] text-on-surface-variant">
              {detail.label}
            </dt>
            <dd className="text-sm text-on-surface sm:mt-3">{detail.value}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  )
}
