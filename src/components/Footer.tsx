import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Mail, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const connectLinks: {
  label: string
  href: string
  icon: LucideIcon
  external: boolean
}[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mehulkarotra/',
    icon: ExternalLink,
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Mehulkarotra098/',
    icon: ExternalLink,
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:mehulbitmaster@gmail.com',
    icon: Mail,
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 85,
        damping: 16,
      },
    },
  }

  return (
    <motion.footer
      className="px-4 pb-8 pt-16 sm:px-6 sm:pb-12 sm:pt-20 md:px-8 md:pb-16 md:pt-24 lg:px-margin-x"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-container-max">
        <motion.div
          className="mb-12 h-px bg-[linear-gradient(90deg,var(--gradient-line-from),var(--gradient-line-via),var(--gradient-line-to))] sm:mb-14 md:mb-16"
          variants={itemVariants}
        />

        <div className="grid grid-cols-12 items-start gap-x-gutter gap-y-10 sm:gap-y-12 lg:gap-y-0">
          {/* Brand */}
          <motion.div className="col-span-12 lg:col-span-5" variants={itemVariants}>
            <a href="#hero" className="group inline-block">
              <h3 className="font-display-xl text-3xl font-bold tracking-tight text-on-surface transition-colors duration-300 group-hover:text-primary sm:text-4xl">
                Mehul Karotra
              </h3>
            </a>
            <p className="mt-4 max-w-sm font-body-lg text-sm leading-relaxed text-on-surface-variant sm:text-base">
              A digital artisan focused on the marriage of function and beauty.
            </p>
            <p className="mt-3 font-label-sm text-[10px] uppercase tracking-[0.28em] text-primary-container/70">
              Mumbai, India · Open worldwide
            </p>
          </motion.div>

          {/* Link columns — grouped and top-aligned */}
          <motion.div
            className="col-span-12 grid grid-cols-2 gap-8 sm:gap-10 lg:col-span-7 lg:grid-cols-2 lg:gap-gutter lg:pl-8"
            variants={containerVariants}
          >
            {/* Connect */}
            <motion.div className="flex flex-col gap-5" variants={itemVariants}>
              <span className="font-label-sm text-[10px] uppercase tracking-[0.28em] text-primary">
                Connect
              </span>
              <ul className="flex flex-col gap-3">
                {connectLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink
                      href={link.href}
                      label={link.label}
                      icon={link.icon}
                      external={link.external}
                    />
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Navigation */}
            <motion.div className="flex flex-col gap-5" variants={itemVariants}>
              <span className="font-label-sm text-[10px] uppercase tracking-[0.28em] text-primary">
                Navigation
              </span>
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}

type FooterLinkProps = {
  href: string
  label: string
  icon?: LucideIcon
  external?: boolean
}

const FooterLink = ({ href, label, icon: Icon, external }: FooterLinkProps) => (
  <a
    href={href}
    className={cn(
      'group inline-flex items-center gap-2.5 font-body-md text-sm text-on-surface-variant transition-colors duration-300',
      'hover:text-on-surface'
    )}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
  >
    {Icon && (
      <span className="grid size-8 place-items-center rounded-lg border border-outline-variant/20 bg-surface-container/40 text-on-surface-variant transition-all duration-300 group-hover:border-primary-container/30 group-hover:bg-surface-container/60 group-hover:text-primary-container">
        <Icon className="size-3.5" aria-hidden />
      </span>
    )}
    <span className="inline-flex items-center gap-1">
      {label}
      <ArrowUpRight
        className="size-3 opacity-0 transition-all duration-300 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
        aria-hidden
      />
    </span>
  </a>
)
