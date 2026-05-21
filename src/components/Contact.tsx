import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { buttonVariants, buttonHoverAccent } from './ui/button'
import { Card } from './ui/card'
import { cn } from '@/lib/utils'

export const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  }

  const ctaMotionVariants = {
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
      boxShadow: '0 0 30px rgb(var(--color-light-violet-rgb) / 0.34)',
    },
    tap: {
      scale: 0.98,
    },
  }

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-margin-x max-w-container-max mx-auto pb-20 sm:pb-28 md:pb-36" id="contact">
      <motion.div
        className="mb-16 h-0.5 bg-[linear-gradient(90deg,var(--gradient-line-from),var(--gradient-line-via),var(--gradient-line-to))] shadow-[0_0_20px_rgb(var(--color-light-violet-rgb)/0.42)] sm:mb-20 md:mb-28"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        style={{ originX: 0 }}
      />

      <div className="grid grid-cols-12 gap-gutter">
        {/* Left Section - Sticky */}
        <motion.div
          className="col-span-12 lg:col-span-6 lg:sticky lg:top-32 h-fit"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.span className="font-label-sm text-primary mb-8 block uppercase tracking-[0.4em]" variants={headingVariants}>
            Get in touch
          </motion.span>
          <motion.h2 className="font-display-xl text-4xl sm:text-5xl md:text-7xl lg:text-[80px] leading-[0.92] mb-8 sm:mb-10 md:mb-12 text-on-surface font-bold" variants={headingVariants}>
            Let's build the{' '}
            <motion.span
              className="bg-[linear-gradient(90deg,var(--gradient-text-from),var(--gradient-text-via),var(--gradient-text-to))] bg-clip-text italic text-transparent"
              whileHover={{
                scale: 1.1,
                textShadow: '0 0 20px rgb(var(--color-light-violet-rgb) / 0.58)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              next
            </motion.span>{' '}
            big thing.
          </motion.h2>
          <motion.div className="flex flex-col gap-6" variants={containerVariants}>
            <motion.a
              className="font-headline-md text-2xl sm:text-3xl md:text-4xl text-primary-container transition-all inline-block w-fit font-bold break-all"
              href="mailto:mehulbitmaster@gmail.com"
              whileHover={{ x: 8, letterSpacing: '0.05em' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              variants={headingVariants}
            >
              mehulbitmaster@gmail.com
            </motion.a>
            <motion.p className="font-body-lg text-on-surface-variant" variants={headingVariants}>
              Based in Mumbai, Maharashtra, India. <br />
              Open to global collaborations.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Contact form intentionally commented out for now. */}
        <motion.div
          className="col-span-12 mt-12 lg:col-span-5 lg:col-start-8 lg:mt-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className="flex h-full min-h-[260px] flex-col justify-between gap-10 border-outline-variant/20 bg-surface-container/80 p-5 text-on-surface shadow-[0_24px_80px_rgb(var(--color-deep-violet-rgb)/0.24)] backdrop-blur-xl sm:p-7 md:p-8">
            <div>
              <p className="font-label-sm text-[10px] uppercase tracking-[0.28em] text-primary mb-5">
                Direct contact
              </p>
              <h3 className="font-display-xl text-3xl sm:text-4xl text-on-surface font-bold leading-tight mb-5">
                Have a role, product, or redesign in mind?
              </h3>
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                Send a quick email and I will reply with availability, fit, and next steps.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <motion.a
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'h-14 w-full rounded-lg bg-primary-container px-8 py-5 font-label-sm text-xs uppercase tracking-[0.18em] text-on-primary-container sm:w-auto sm:flex-1 sm:px-10',
                  buttonHoverAccent
                )}
                href="mailto:mehulbitmaster@gmail.com"
                variants={ctaMotionVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span>let's Connect</span>
                <motion.span className="transition-transform group-hover:translate-x-2">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </motion.span>
              </motion.a>
              <motion.a
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-14 w-full rounded-lg border-outline-variant/30 px-8 py-5 font-label-sm text-xs uppercase tracking-[0.18em] text-on-surface-variant sm:w-auto sm:flex-1 sm:px-10',
                  buttonHoverAccent
                )}
                href="https://wa.me/917977360142"
                target="_blank"
                rel="noopener noreferrer"
                variants={ctaMotionVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.span className="transition-transform group-hover:translate-x-2">
                  <Phone className="size-4" aria-hidden="true" />
                </motion.span>
                Text Me
              </motion.a>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
