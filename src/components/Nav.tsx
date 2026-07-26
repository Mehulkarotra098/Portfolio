import { motion } from 'framer-motion'
import { Mail, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { buttonHoverAccent } from './ui/button'
import { cn } from '@/lib/utils'

export const Nav = () => {
  const { theme, toggleTheme } = useTheme()

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: -16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 18,
        delayChildren: 0.08,
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 110,
        damping: 16,
      },
    },
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 md:px-8 lg:px-margin-x">
      <motion.nav
        className="pointer-events-auto mx-auto max-w-container-max"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Main navigation"
      >
        <div
          className={cn(
            'relative flex items-center justify-between gap-3 rounded-full border px-3 py-2 sm:gap-4 sm:px-5 sm:py-2.5',
            'border-[rgb(var(--color-on-surface-rgb)/0.1)] bg-[rgb(var(--color-surface-container-lowest-rgb)/0.78)]',
            'shadow-[0_10px_40px_rgb(var(--color-deep-violet-rgb)/0.22),inset_0_1px_0_rgb(var(--color-on-surface-rgb)/0.06)]',
            'backdrop-blur-[20px]'
          )}
        >
          <motion.a
            className="relative z-10 shrink-0 group"
            href="#hero"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="block font-display-xl text-sm font-bold leading-none tracking-tight text-on-surface sm:text-base">
              Mehul Karotra
            </span>
          </motion.a>

          <motion.div
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex lg:gap-10"
            variants={containerVariants}
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                className="font-label-sm text-[11px] uppercase tracking-[0.14em] text-on-surface-variant transition-colors duration-300 hover:text-on-surface"
                href={link.href}
                variants={itemVariants}
                whileHover={{ y: -1 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>

          <div className="relative z-10 flex shrink-0 items-center gap-2 sm:gap-2.5">
            <motion.button
              className={cn(
                'grid size-8 place-items-center rounded-full border transition-colors duration-300 sm:size-9',
                'border-[rgb(var(--color-on-surface-rgb)/0.1)] bg-[rgb(var(--color-surface-container-rgb)/0.45)] text-on-surface',
                'hover:border-primary-container/40 hover:bg-[rgb(var(--color-surface-container-high-rgb)/0.55)] hover:text-primary-container'
              )}
              type="button"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              onClick={toggleTheme}
              variants={itemVariants}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              {theme === 'dark' ? (
                <Sun className="size-4" aria-hidden="true" />
              ) : (
                <Moon className="size-4" aria-hidden="true" />
              )}
            </motion.button>

            <motion.a
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-full px-3 sm:h-9 sm:gap-2 sm:px-4 md:px-5',
                'font-label-sm text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[11px]',
                'border border-transparent transition-all duration-300',
                theme === 'dark'
                  ? 'bg-white text-[rgb(var(--color-deep-violet-rgb))] shadow-[0_6px_24px_rgb(var(--color-white-rgb)/0.12)]'
                  : 'bg-[rgb(var(--color-deep-violet-rgb))] text-white shadow-[0_6px_24px_rgb(var(--color-deep-violet-rgb)/0.28)]',
                buttonHoverAccent
              )}
              href="mailto:mehulbitmaster@gmail.com"
              variants={itemVariants}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="hidden sm:inline">Let&apos;s Connect</span>
              <span className="sm:hidden">Connect</span>
              <Mail className="size-3.5 sm:size-4" aria-hidden="true" />
            </motion.a>
          </div>
        </div>
      </motion.nav>
    </div>
  )
}
