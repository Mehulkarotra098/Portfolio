import { motion } from 'framer-motion'

export const Skills = () => {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
    hover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(46, 98, 255, 0.15)',
      transition: { duration: 0.3 },
    },
  }

  const skillItems = [
    {
      number: '01',
      title: 'UI/UX Design',
      skills: [
        { label: 'Strategy & Ideation', value: 'User Research, Wireframing' },
        { label: 'Execution & Scale', value: 'Prototyping, Design Systems' },
      ],
    },
    {
      number: '02',
      title: 'Front-End',
      skills: [
        { label: 'Core & Logic', value: 'HTML5, CSS3, React.js' },
        { label: 'Styling & Interaction', value: 'Tailwind CSS, JS (ES6+)' },
      ],
    },
    {
      number: '03',
      title: 'Tools & Technologies',
      isFullWidth: true,
      tools: [
        { category: 'Design', items: 'Figma, Photoshop' },
        { category: 'Engineering', items: 'VS Code, Git' },
        { category: 'CMS', items: 'WordPress' },
      ],
    },
    {
      number: '04',
      title: 'Specialized Capabilities',
      isFullWidth: true,
      description:
        'Information Architecture, Search Engine Optimization (SEO), Responsive Design Patterns, and Accessibility Compliance.',
    },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background overflow-hidden" id="skills">
      <div className="px-4 sm:px-6 md:px-8 lg:px-margin-x max-w-container-max mx-auto">
        <div className="grid grid-cols-12 gap-6 sm:gap-8 md:gap-gutter border-b border-outline-variant/20 pb-12 sm:pb-16 md:pb-24">
          {/* Left Sticky */}
          <motion.div
            className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 h-fit mb-12 sm:mb-20 md:mb-28 lg:mb-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span className="font-label-sm text-primary mb-4 sm:mb-6 md:mb-8 block uppercase tracking-[0.4em]" variants={headingVariants}>
              Expertise
            </motion.span>
            <motion.h2 className="font-display-xl text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-on-surface leading-none mb-4 sm:mb-6 md:mb-8 font-bold" variants={headingVariants}>
              Creative
              <br />
              <span className="italic text-primary">Arsenal</span>
            </motion.h2>
            <motion.p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-sm" variants={headingVariants}>
              Merging deep technical proficiency with an eye for detail and user-first methodology.
            </motion.p>
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="col-span-12 md:col-span-12 lg:col-span-7 lg:col-start-6 space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-8">
              {skillItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`group surface-glass p-4 sm:p-6 md:p-8 rounded-xl hover:border-primary-container/30 transition-all duration-500 flex flex-col h-full ${
                    item.isFullWidth ? 'col-span-1 md:col-span-2' : ''
                  }`}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
                    <motion.span
                      className="font-label-sm text-primary-container text-lg italic"
                      whileHover={{ scale: 1.2, color: '#2e62ff' }}
                    >
                      {item.number}
                    </motion.span>
                    <motion.h3
                      className="font-display-xl text-xl sm:text-2xl md:text-3xl text-on-surface group-hover:text-primary transition-colors font-bold"
                      whileHover={{ x: 4 }}
                    >
                      {item.title}
                    </motion.h3>
                  </div>

                  {/* Standard skill layout */}
                  {!item.isFullWidth && item.skills && (
                    <motion.div className="grid grid-cols-1 gap-y-4 sm:gap-y-5 md:gap-y-6" variants={containerVariants}>
                      {item.skills.map((skill, skillIdx) => (
                        <motion.div
                          key={skillIdx}
                          className="border-l-2 border-primary-container/20 pl-3 sm:pl-4 group/skill"
                          whileHover={{ x: 4 }}
                          variants={cardVariants}
                        >
                          <h4 className="font-label-sm text-[8px] sm:text-[9px] md:text-[10px] uppercase text-primary/60 tracking-widest mb-0.5 sm:mb-1 group-hover/skill:text-primary transition-colors">
                            {skill.label}
                          </h4>
                          <p className="font-headline-md text-lg sm:text-xl text-on-surface leading-snug">{skill.value}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Tools layout */}
                  {'tools' in item && (
                    <div className="flex flex-wrap gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-4 sm:gap-y-5 md:gap-y-6">
                      {item.tools?.map((tool, toolIdx) => (
                        <motion.div key={toolIdx} whileHover={{ y: -4 }} className="min-w-[120px] sm:min-w-[140px]">
                          <h4 className="font-label-sm text-[8px] sm:text-[9px] md:text-[10px] uppercase text-primary/60 tracking-widest mb-0.5 sm:mb-1">
                            {tool.category}
                          </h4>
                          <p className="font-headline-md text-lg sm:text-xl text-on-surface">{tool.items}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Description layout */}
                  {'description' in item && <p className="font-body-lg text-sm sm:text-base text-on-surface-variant italic leading-relaxed">{item.description}</p>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
