import { motion } from 'framer-motion'

export const Philosophy = () => {
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

  const journeyItemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
    hover: {
      x: 8,
      backgroundColor: 'rgb(var(--color-light-violet-rgb) / 0.1)',
      transition: { duration: 0.3 },
    },
  }

  const journeyData = [
    { company: 'Apex36 Technology Services', role: 'UI/UX Developer (Present)', location: 'MUMBAI, IN' },
    { company: 'My Country Mobile', role: 'UI/UX Designer & Web Developer', location: 'MUMBAI, IN' },
    { company: 'ApplQ Innovations', role: 'Front-end Developer', location: 'MUMBAI, IN' },
    { company: 'Threepin Info Tec.', role: 'Junior Web Developer', location: 'MUMBAI, IN' },
  ]

  return (
    <section className="bg-surface-container py-8 sm:py-16 md:py-24" id="about">
      <div className="px-4 sm:px-6 md:px-8 lg:px-margin-x max-w-container-max mx-auto">
        <div className="grid grid-cols-12 gap-4 sm:gap-6 md:gap-gutter">
          {/* Left Column */}
          <motion.div
            className="col-span-12 lg:col-span-5 mb-12 sm:mb-16 md:mb-20 lg:mb-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span className="font-label-sm text-primary mb-4 sm:mb-6 md:mb-8 block uppercase tracking-[0.4em]" variants={itemVariants}>
              The Philosophy
            </motion.span>
            <motion.h2 className="font-display-xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 italic leading-tight text-on-surface font-bold" variants={itemVariants}>
              Human-Centric <br />
              <motion.span
                className="text-primary-container"
                whileHover={{ scale: 1.05, color: 'rgb(var(--color-primary-rgb))' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                by Design.
              </motion.span>
            </motion.h2>
            <motion.p className="font-body-lg text-on-surface-variant mb-6 sm:mb-8 md:mb-10 max-w-md" variants={itemVariants}>
              I believe digital products should be as intuitive as a physical object. My approach blends systematic thinking
              with artistic intuition to create experiences that feel both familiar and futuristic.
            </motion.p>

            <motion.div className="space-y-8 sm:space-y-10 md:space-y-12 mt-12 sm:mt-16 md:mt-20" variants={containerVariants}>
              {[
                {
                  label: 'Education',
                  title: 'Bachelor of Computer Application',
                  subtitle: 'Information Technology',
                }
              ].map((item, idx) => (
                <motion.div key={idx} variants={itemVariants} whileHover={{ x: 8 }}>
                  <span className="font-label-sm text-[10px] text-primary/40 block mb-4 uppercase tracking-widest">
                    {item.label}
                  </span>
                  <h4 className="font-headline-md text-xl mb-1 text-on-surface font-bold">{item.title}</h4>
                  <p className="font-body-md text-on-surface-variant italic">{item.subtitle}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Experience */}
          <motion.div
            className="col-span-12 lg:col-span-6 lg:col-start-7"
            id="experience"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span className="font-label-sm text-primary mb-6 sm:mb-8 md:mb-10 lg:mb-12 block uppercase tracking-[0.4em]" variants={itemVariants}>
              The Journey
            </motion.span>
            <div className="space-y-0">
              {journeyData.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="group border-t border-outline-variant/20 py-4 sm:py-6 md:py-8 lg:py-10 transition-colors px-3 sm:px-4 md:px-4 -mx-3 sm:-mx-4 md:-mx-4"
                  variants={journeyItemVariants}
                  whileHover="hover"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3 md:gap-4">
                    <div>
                      <motion.h3
                        className="font-headline-md text-lg sm:text-xl md:text-2xl text-on-surface group-hover:text-primary transition-colors duration-500 font-bold"
                        whileHover={{ x: 4 }}
                      >
                        {item.company}
                      </motion.h3>
                      <p className="font-body-md text-sm sm:text-base text-on-surface-variant">{item.role}</p>
                    </div>
                    <motion.span className="font-label-sm text-[9px] sm:text-[10px] md:text-[11px] tracking-widest text-primary" whileHover={{ scale: 1.1 }}>
                      {item.location}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
