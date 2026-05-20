import { motion } from 'framer-motion'

export const Nav = () => {
  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 transition-all duration-600 ease-out h-16 sm:h-20 px-4 sm:px-6 md:px-8 lg:px-margin-x"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center max-w-container-max mx-auto h-full">
        <motion.a
          className="font-display-xl text-sm sm:text-base md:text-body-lg font-bold tracking-tighter text-on-surface group"
          href="#"
          variants={itemVariants}
          whileHover={{ x: -4 }}
        >
          <motion.span
            className="inline-block transition-transform duration-300 group-hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
          >
            Mehul Karotra
          </motion.span>
        </motion.a>

        <motion.div className="hidden md:flex items-center space-x-6 md:space-x-8 lg:space-x-12 font-label-sm uppercase text-xs sm:text-sm" variants={containerVariants}>
          {navLinks.map((link, idx) => (
            <motion.a
              key={link.label}
              className={`transition-colors duration-300 text-link ${idx === 0 ? 'text-on-surface' : 'text-on-surface-variant hover:text-primary'}`}
              href={link.href}
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>

        <motion.a
          className="button-ripple bg-white text-black px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 font-label-sm text-xs sm:text-sm uppercase hover:bg-primary-container hover:text-on-primary-container transition-colors duration-300 rounded-lg"
          href="mailto:mkarotra369@gmail.com"
          variants={itemVariants}
          whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(46, 98, 255, 0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          Hire
        </motion.a>
      </div>
    </motion.nav>
  )
}
