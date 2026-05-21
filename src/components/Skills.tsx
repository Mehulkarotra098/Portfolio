import { motion } from 'framer-motion'
import { Code2, PenTool, Sparkles, Wrench, type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

type SkillItem = {
  number: string
  title: string
  icon: LucideIcon
  skills?: Array<{ label: string; value: string }>
  tools?: Array<{ category: string; items: string }>
  description?: string
}

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
    hidden: { opacity: 0, y: 22 },
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
      y: -4,
      transition: { duration: 0.3 },
    },
  }

  const skillItems: SkillItem[] = [
    {
      number: '01',
      title: 'UI/UX Design',
      icon: PenTool,
      skills: [
        { label: 'Strategy & Ideation', value: 'User Research, Wireframing' },
        { label: 'Execution & Scale', value: 'Prototyping, Design Systems' },
      ],
    },
    {
      number: '02',
      title: 'Front-End',
      icon: Code2,
      skills: [
        { label: 'Core & Logic', value: 'HTML5, CSS3, React.js' },
        { label: 'Styling & Interaction', value: 'Tailwind CSS, JS (ES6+)' },
      ],
    },
    {
      number: '03',
      title: 'Tools & Technologies',
      icon: Wrench,
      tools: [
        { category: 'Design', items: 'Figma, Adobe Illustrator, Photoshop' },
        { category: 'Engineering', items: 'VS Code, Git' },
        { category: 'CMS', items: 'WordPress' },
      ],
    },
    {
      number: '04',
      title: 'Specialized Capabilities',
      icon: Sparkles,
      description:
        'Information Architecture, Search Engine Optimization (SEO), Responsive Design Patterns, and Accessibility Compliance.',
    },
  ]

  return (
    <section className="bg-background pt-12 sm:pt-16" id="skills">
      <div className="px-4 sm:px-6 md:px-8 lg:px-margin-x max-w-container-max mx-auto">
        <motion.div
          className="pb-12 sm:pb-16 md:pb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mb-8 grid grid-cols-1 gap-5 md:mb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <motion.div variants={headingVariants}>
              <span className="mb-4 block font-label-sm text-primary uppercase tracking-[0.36em]">
                Expertise
              </span>
              <h2 className="font-display-xl text-4xl font-bold leading-none text-on-surface sm:text-5xl md:text-6xl">
                Creative <span className="italic text-primary">Arsenal</span>
              </h2>
            </motion.div>
            <motion.p
              className="max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base lg:justify-self-end lg:text-right"
              variants={headingVariants}
            >
              Merging technical precision, interface craft, and production-ready design habits into one compact toolkit.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
            variants={containerVariants}
          >
            {skillItems.map((item) => (
              <motion.div key={item.number} className="group h-full" variants={cardVariants} whileHover="hover">
                <Card className="relative h-full gap-0 overflow-hidden border-0 bg-[linear-gradient(145deg,rgb(var(--color-surface-container-high-rgb)/0.58),rgb(var(--color-surface-container-rgb)/0.28)_54%,rgb(var(--color-surface-container-low-rgb)/0.72))] p-0 text-on-surface shadow-none ring-1 ring-outline-variant/12 backdrop-blur-xl transition-all duration-500 hover:bg-[linear-gradient(145deg,rgb(var(--color-surface-container-highest-rgb)/0.58),rgb(var(--color-surface-container-rgb)/0.36)_58%,rgb(var(--color-surface-container-low-rgb)/0.76))] hover:ring-primary-container/24">
                  <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-primary-container/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute right-0 top-0 size-28 rounded-bl-full bg-primary-container/8 blur-2xl" />

                  <CardHeader className="gap-0 px-5 pb-3 pt-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <span className="font-label-sm text-sm italic text-primary-container">{item.number}</span>
                      <span className="grid size-9 place-items-center rounded-lg bg-primary-container/10 text-primary-container transition-colors group-hover:bg-primary-container/16">
                        <item.icon className="size-4" aria-hidden="true" />
                      </span>
                    </div>
                    <CardTitle className="text-xl font-bold leading-tight text-on-surface sm:text-2xl">
                      {item.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-5 pb-5">
                    {'skills' in item && item.skills && (
                      <div className="space-y-3">
                        {item.skills.map((skill) => (
                          <div
                            key={skill.label}
                            className="rounded-lg bg-surface-container-lowest/20 px-3 py-3 ring-1 ring-white/5"
                          >
                            <p className="font-label-sm text-[9px] uppercase tracking-[0.18em] text-primary/70">
                              {skill.label}
                            </p>
                            <p className="mt-1.5 text-sm font-medium leading-snug text-on-surface sm:text-[15px]">
                              {skill.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {'tools' in item && item.tools && (
                      <div className="flex flex-wrap gap-2">
                        {item.tools.map((tool) => (
                          <div
                            key={tool.category}
                            className="rounded-lg bg-surface-container-lowest/20 px-3 py-2 ring-1 ring-white/5"
                          >
                            <p className="font-label-sm text-[8px] uppercase tracking-[0.18em] text-primary/70">
                              {tool.category}
                            </p>
                            <p className="mt-1 text-sm font-medium leading-snug text-on-surface">{tool.items}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {'description' in item && (
                      <CardDescription className="text-sm leading-relaxed text-on-surface-variant">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
