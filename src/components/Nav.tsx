import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/useTheme'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const Nav = () => {
  const { theme, toggleTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/20 bg-surface-container-lowest/90 backdrop-blur-md">
      <motion.nav
        aria-label="Main navigation"
        className="mx-auto max-w-container-max px-4 sm:px-6 md:px-8 lg:px-margin-x"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex min-h-16 items-center justify-between gap-4 md:min-h-[72px]">
          <a
            className="inline-flex min-h-11 min-w-11 items-center font-display-xl text-[17px] font-semibold tracking-[-0.015em] text-on-surface transition-colors hover:text-primary"
            href="#hero"
          >
            Mehul Karotra
          </a>

          <div className="hidden items-center self-stretch md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                className="inline-flex min-h-11 items-center px-4 font-label-sm text-[10px] uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:text-on-surface lg:px-5"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              className="grid size-11 place-items-center text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              type="button"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="size-[18px]" aria-hidden="true" />
              ) : (
                <Moon className="size-[18px]" aria-hidden="true" />
              )}
            </button>

            <a
              aria-label="Email Mehul Karotra"
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 border border-outline-variant/35 px-3 font-label-sm text-[10px] uppercase tracking-[0.14em] text-on-surface transition-colors hover:border-primary hover:bg-primary hover:text-on-primary sm:px-4"
              href="mailto:mehulbitmaster@gmail.com"
            >
              <span className="hidden sm:inline">Email me</span>
              <Mail className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-4 border-t border-outline-variant/15 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.label}
              className="inline-flex min-h-11 items-center justify-center font-label-sm text-[9px] uppercase tracking-[0.14em] text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.nav>
    </header>
  )
}
