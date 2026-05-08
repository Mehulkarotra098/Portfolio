import { motion } from 'framer-motion'

export const Nav = () => {
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
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/10 transition-all duration-600 ease-out h-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-x h-full">
        <motion.a
          className="font-display-xl text-body-lg font-bold tracking-tighter text-on-surface group"
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

        <motion.div className="hidden md:flex items-center space-x-12 font-label-sm uppercase" variants={containerVariants}>
          {['Work', 'Philosophy', 'Experience', 'Contact'].map((link, idx) => (
            <motion.a
              key={link}
              className={`transition-colors duration-300 ${idx === 0 ? 'text-on-surface border-b border-primary-container pb-1' : 'text-on-surface-variant hover:text-primary'}`}
              href={`#${link.toLowerCase()}`}
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              {link}
            </motion.a>
          ))}
        </motion.div>

        <motion.button
          className="bg-primary-container text-on-primary-container px-8 py-3 font-label-sm uppercase hover:bg-inverse-primary hover:text-on-primary transition-colors duration-300 rounded-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(46, 98, 255, 0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          Hire Me
        </motion.button>
      </div>
    </motion.nav>
  )
}
