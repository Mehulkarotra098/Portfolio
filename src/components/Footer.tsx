import { motion } from 'framer-motion'

export const Footer = () => {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      x: 4,
      color: '#2e62ff',
    },
  }

  const footerLinks = [
    {
      category: 'Connect',
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mehulkarotra/' },
        { label: 'GitHub', href: 'https://github.com/Mehulkarotra098/' },
      ],
    },
    {
      category: 'Navigation',
      links: [
        { label: 'Work', href: '#work' },
        { label: 'About', href: '#about' },
      ],
    },
  ]

  return (
    <motion.footer
      className="bg-surface-container-lowest border-t border-outline-variant/10 pt-12 sm:pt-16 md:pt-24 lg:pt-32 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 md:px-8 lg:px-margin-x"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 sm:gap-12 md:gap-16 mb-12 sm:mb-16 md:mb-24">
          {/* About */}
          <motion.div variants={itemVariants}>
            <motion.h3
              className="font-display-xl text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-on-surface"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Mehul
            </motion.h3>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-xs">
              A digital artisan focused on the marriage of function and beauty.
            </p>
          </motion.div>

          {/* Links Grid */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12" variants={containerVariants}>
            {footerLinks.map((group) => (
              <motion.div key={group.category} className="flex flex-col gap-2 sm:gap-3 md:gap-4" variants={itemVariants}>
                <span className="font-label-sm text-[8px] sm:text-[9px] md:text-[10px] text-primary uppercase tracking-widest">{group.category}</span>
                {group.links.map((link) => (
                  <motion.a
                    key={link.label}
                    className="font-body-md text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors"
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center pt-6 sm:pt-8 md:pt-8 border-t border-outline-variant/10 gap-3 sm:gap-4 md:gap-4"
          variants={itemVariants}
        >
          <motion.span
            className="font-label-sm text-[8px] sm:text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest text-center md:text-left"
            whileHover={{ scale: 1.05 }}
          >
            © 2026 MEHUL KAROTRA - ALL RIGHTS RESERVED.
          </motion.span>
          <motion.span
            className="font-label-sm text-[8px] sm:text-[9px] md:text-[10px] text-primary-container uppercase tracking-widest italic"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            MADE WITH INTENTION IN MUMBAI
          </motion.span>
        </motion.div>
      </div>
    </motion.footer>
  )
}
