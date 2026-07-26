import { motion, useReducedMotionConfig } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const connectLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mehulkarotra/',
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Mehulkarotra098/',
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:mehulbitmaster@gmail.com',
    external: false,
  },
]

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const Footer = () => {
  const shouldReduceMotion = useReducedMotionConfig()

  return (
    <footer className="px-4 pb-6 pt-16 sm:px-6 sm:pb-8 sm:pt-20 md:px-8 lg:px-margin-x lg:pt-24">
      <motion.div
        className="mx-auto max-w-container-max border-t border-outline-variant/30"
        initial={
          shouldReduceMotion ? false : { opacity: 0, y: 16 }
        }
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="grid grid-cols-12 gap-x-gutter gap-y-12 py-12 sm:py-14 lg:py-16">
          <div className="col-span-12 lg:col-span-6">
            <a
              className="inline-flex min-h-11 items-center font-display-xl text-3xl font-medium tracking-[-0.025em] text-on-surface transition-colors hover:text-primary sm:text-4xl"
              href="#hero"
            >
              Mehul Karotra
            </a>
            <p className="mt-5 max-w-md text-sm leading-6 text-on-surface-variant sm:text-base sm:leading-7">
              UI/UX designer and front-end developer creating thoughtful
              digital experiences from design system to production.
            </p>
          </div>

          <div className="col-span-12 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-6 lg:grid-cols-2">
            <FooterColumn heading="Navigate" links={navLinks} />
            <FooterColumn heading="Connect" links={connectLinks} />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-outline-variant/20 py-5 font-label-sm text-[9px] uppercase tracking-[0.16em] text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
          <p>Mumbai, India</p>
          <p>Design and front-end development</p>
        </div>
      </motion.div>
    </footer>
  )
}

type FooterColumnProps = {
  heading: string
  links: {
    label: string
    href: string
    external?: boolean
  }[]
}

const FooterColumn = ({ heading, links }: FooterColumnProps) => (
  <div className="col-span-2 sm:col-span-2 lg:col-span-1">
    <h2 className="font-label-sm text-[9px] uppercase tracking-[0.18em] text-primary">
      {heading}
    </h2>
    <ul className="mt-5">
      {links.map((link) => (
        <li key={link.label}>
          <a
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
          >
            {link.label}
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </li>
      ))}
    </ul>
  </div>
)
