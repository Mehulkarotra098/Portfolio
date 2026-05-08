import { useState } from 'react'
import { motion } from 'framer-motion'

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [focused, setFocused] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.currentTarget
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', message: '' })
  }

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

  const inputVariants = {
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
    focus: {
      boxShadow: '0 0 20px rgba(46, 98, 255, 0.2)',
    },
  }

  const buttonVariants = {
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
      boxShadow: '0 0 30px rgba(46, 98, 255, 0.3)',
    },
    tap: {
      scale: 0.98,
    },
  }

  return (
    <section className="px-margin-x max-w-container-max mx-auto mb-32" id="contact">
      <motion.div
        className="editorial-line mb-32"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        style={{ originX: 0 }}
      />

      <div className="grid grid-cols-12 gap-gutter">
        {/* Left Section - Sticky */}
        <motion.div
          className="col-span-12 lg:col-span-6 lg:sticky lg:top-40 h-fit"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.span className="font-label-sm text-primary mb-8 block uppercase tracking-[0.4em]" variants={headingVariants}>
            Get in touch
          </motion.span>
          <motion.h2 className="font-display-xl text-[56px] md:text-[80px] leading-[0.9] mb-12 text-on-surface" variants={headingVariants}>
            Let's build the{' '}
            <motion.span
              className="italic text-primary"
              whileHover={{
                scale: 1.1,
                textShadow: '0 0 20px rgba(183, 196, 255, 0.5)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              next
            </motion.span>{' '}
            big thing.
          </motion.h2>
          <motion.div className="flex flex-col gap-6" variants={containerVariants}>
            <motion.a
              className="font-headline-md text-3xl md:text-4xl text-primary-container transition-all inline-block w-fit"
              href="mailto:mkarotra369@gmail.com"
              whileHover={{ x: 8, letterSpacing: '0.05em' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              variants={headingVariants}
            >
              mkarotra369@gmail.com
            </motion.a>
            <motion.p className="font-body-lg text-on-surface-variant" variants={headingVariants}>
              Based in Mumbai, Maharashtra, India. <br />
              Open to global collaborations.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Right Section - Form */}
        <motion.div
          className="col-span-12 lg:col-span-5 lg:col-start-8 mt-20 lg:mt-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <form className="space-y-16" onSubmit={handleSubmit}>
            {/* Name Input */}
            <motion.div className="relative group" variants={inputVariants}>
              <motion.input
                className="w-full bg-transparent border-b-2 border-outline-variant/30 py-6 focus:border-primary focus:ring-0 transition-colors outline-none font-headline-md text-2xl peer placeholder-transparent text-on-surface"
                id="name"
                placeholder="Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.label
                className="absolute left-0 top-0 font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px]"
                htmlFor="name"
                animate={focused === 'name' ? { color: '#b7c4ff' } : { color: '#c3c5d8' }}
              >
                Full Name
              </motion.label>
            </motion.div>

            {/* Email Input */}
            <motion.div className="relative group" variants={inputVariants}>
              <motion.input
                className="w-full bg-transparent border-b-2 border-outline-variant/30 py-6 focus:border-primary focus:ring-0 transition-colors outline-none font-headline-md text-2xl peer placeholder-transparent text-on-surface"
                id="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.label
                className="absolute left-0 top-0 font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px]"
                htmlFor="email"
                animate={focused === 'email' ? { color: '#b7c4ff' } : { color: '#c3c5d8' }}
              >
                Email Address
              </motion.label>
            </motion.div>

            {/* Message Input */}
            <motion.div className="relative group" variants={inputVariants}>
              <motion.textarea
                className="w-full bg-transparent border-b-2 border-outline-variant/30 py-6 focus:border-primary focus:ring-0 transition-colors outline-none font-headline-md text-2xl resize-none h-40 peer placeholder-transparent text-on-surface"
                id="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.label
                className="absolute left-0 top-0 font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px]"
                htmlFor="message"
                animate={focused === 'message' ? { color: '#b7c4ff' } : { color: '#c3c5d8' }}
              >
                Your Project Brief
              </motion.label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              className="group relative inline-flex items-center gap-6 bg-primary-container text-on-primary-container px-12 py-6 overflow-hidden rounded-lg hover:text-on-primary transition-colors"
              type="submit"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.span className="relative z-10 font-label-sm tracking-[0.2em] uppercase" whileHover={{ letterSpacing: '0.3em' }}>
                Send Message
              </motion.span>
              <motion.span className="relative z-10 material-symbols-outlined transition-transform group-hover:translate-x-2" animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                arrow_forward
              </motion.span>
              <motion.div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
