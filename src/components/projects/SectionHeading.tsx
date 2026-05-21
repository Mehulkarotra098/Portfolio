import { motion, type Variants } from 'framer-motion'

type SectionHeadingProps = {
  variants: Variants
}

export const SectionHeading = ({ variants }: SectionHeadingProps) => {
  return (
    <motion.div
      className="grid grid-cols-12 gap-6 md:gap-gutter mb-12"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.45 }}
    >
      <motion.div className="col-span-12 lg:col-span-7" variants={variants}>
        <span className="font-label-sm text-primary-container block mb-4 uppercase tracking-[0.4em]">
          Selected outcomes
        </span>
        <h2 className="font-display-xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-on-surface leading-tight font-bold">
          Work that feels
          <br />
          <span className="bg-[linear-gradient(90deg,var(--gradient-text-from),var(--gradient-text-via),var(--gradient-text-to))] bg-clip-text italic text-transparent">
            clear, fast, finished.
          </span>
        </h2>
      </motion.div>
    </motion.div>
  )
}
