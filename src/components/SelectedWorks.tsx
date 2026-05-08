import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'

gsap.registerPlugin(ScrollTrigger)

export const SelectedWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Parallax effect for project images
      gsap.utils.toArray<HTMLElement>('[data-clip="project-image"]').forEach((image) => {
        gsap.to(image, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: image,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })
    },
    { scope: containerRef }
  )

  const projects = [
    {
      id: 1,
      title: 'My Country Mobile',
      category: 'WordPress • Figma • UI/UX',
      description: 'A comprehensive redesign for a global VoIP leader, focusing on clarity and conversion-centric user flows.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAlzjwdvRL2Vtr_cIviRlf7Sh7jg670G7_YNKrPejTPOC8bDnkPPuqQDsxx__GHmiFHaTBQkCQ83ZTo8M24FiAYfB-KV_t-wOGMD2UGuN1bEffllIlQldXr3hDtpdZxNkRDl-2oV1ukpD7mnDS9zpTsE3qhyxt6c34hTyCs_z3Fytb_vIgi5S2vWnFu9u4ZeVeQctYtXgWD_rtM1B7g56L2VUN0Xi0dzlFv3ORTk57hcrs5K6sF8tc_xE3P6OcbFnM0J7Yg9-J6ucXG',
      featured: true,
      featured_text: '01 / Featured',
    },
    {
      id: 2,
      title: 'Callmama',
      category: 'B2C Product • UI/UX',
      description: 'Simplifying international communication through a minimal and accessible interface.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDqli4xHIUkOXNNn-n8M8JoUVUYYLSYvYRBxILcGX7bblzGs4MCauRcaRg1yte87SAXgrxVwevk3v_J_hBe_A53_43AD3ecsw5wGbTZtJXR6hzoBzhoqQ8OEG1gB9Q7ruAddFrVewjvfO73jCJDgUNhsi6iOtU_xNG8E0pGhIruybTdZm5uc7ILgk5kre1lnLl9FQ5F3w03alni82xFqwLTnbZV1_asFTMJXe37-XqjNy3TLMkaxTtt8aG_i5zKqXSCoTzt9QYseDhi',
      featured: false,
    },
    {
      id: 3,
      title: 'Teloz Communication',
      category: 'Enterprise Platform',
      description: 'Reimagining enterprise SaaS with a focus on information density and cognitive ease for high-volume users.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QWhhzusWMFYdWGwZeHFyNC4k8oJnxVPrY3EjnpPkY8_0EdFvGFlNc2-5QgQtTiIef8I9nVVLolW_q9h9A7NPZhgOxvZuAe8ZYKFUmsknF6proj60L1EPrfpUSBJ3hku8BKQRQNzqH2TGFeFyz17hjBlk6I_p5Klai0mTQk02akqds04gNN2s53J7qsMFQRznxlp9cynNN5ShHWCP0eRVDpR7V4D0NzAb1itmYQx_tfzKwMwbg1gbapIebDJxKKKlVqg16i1pZ6WL',
      featured: false,
    },
    {
      id: 4,
      title: 'Ringflow',
      category: 'Product Design',
      description:
        'A React-driven interface for modern contact centers, prioritizing real-time data visualization.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAxSlsLPNp56fY6A9HJAEi7JA7xcm137qljGZ-Uelw1DPbIX93cKpa-2XpoMvTg2n9ot5K8AmaLFse76mjjCZ8JXQF52wXjI0ltity3gOj4-0ydCaNwO-nWrQgjfoywFh-swDexq-txN23w7w0VdCn3MLg7AZX5nYDZcSyEbf2lJIPmPWIU3MaBEOWEzXeiSr-NcSRpDpeq8sf7rJ3J5eS5uIBtaLMQ7rButNmsM4PPmTmdg1Yxi2SdPNlanIX_yoqjyr06-yoS2VMS',
      featured: false,
    },
  ]

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
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 20,
      },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  }

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay: 0.2,
      },
    },
  }

  return (
    <section className="px-margin-x max-w-container-max mx-auto mb-section-gap" id="work" ref={containerRef}>
      {/* Section Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div>
          <h2 className="font-display-xl text-6xl md:text-8xl mb-4 text-on-surface">
            <motion.div variants={headingVariants}>Selected</motion.div>
            <motion.div variants={headingVariants}>
              <span className="italic ml-8 md:ml-16 text-primary">Creations</span>
            </motion.div>
          </h2>
        </div>
        <motion.div className="text-right" variants={headingVariants}>
          <span className="font-label-sm text-on-surface-variant block tracking-widest mb-2 uppercase">Archive</span>
          <span className="font-headline-md text-2xl text-on-surface">2022 — 2024</span>
        </motion.div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        className="grid grid-cols-12 gap-y-64 md:gap-x-12 lg:gap-x-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Project 01 */}
        <motion.div className="col-span-12 md:col-span-7 group" variants={cardVariants} whileHover="hover">
          <div className="relative overflow-hidden mb-12 bg-surface-container-low aspect-[16/10] rounded-xl border border-outline-variant/10 group-hover:border-primary-container/50 transition-all">
            <motion.img
              alt={projects[0].title}
              className="w-full h-full object-cover"
              src={projects[0].image}
              variants={imageVariants}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
              data-clip="project-image"
            />
            <div className="absolute top-6 left-6 bg-surface-container-highest/90 backdrop-blur-sm px-4 py-2 text-[10px] font-label-sm tracking-widest uppercase text-on-surface">
              {projects[0].featured_text}
            </div>
          </div>
          <div className="max-w-lg px-2">
            <span className="font-label-sm text-[10px] tracking-[0.2em] text-primary uppercase mb-4 block">
              {projects[0].category}
            </span>
            <h3 className="font-headline-lg text-4xl mb-6 text-reveal inline-block cursor-default">{projects[0].title}</h3>
            <p className="font-body-md text-on-surface-variant mb-10">{projects[0].description}</p>
            <motion.a
              className="inline-flex items-center gap-4 group/link text-primary"
              href="#"
              whileHover={{ x: 8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className="font-label-sm border-b border-primary-container pb-1 group-hover/link:border-transparent transition-all">
                VIEW CASE STUDY
              </span>
              <motion.span
                className="material-symbols-outlined transition-transform group-hover/link:translate-x-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                arrow_forward
              </motion.span>
            </motion.a>
          </div>
        </motion.div>

        {/* Project 02 */}
        <motion.div className="col-span-12 md:col-span-4 md:col-start-9 group md:mt-48" variants={cardVariants} whileHover="hover">
          <div className="relative overflow-hidden mb-12 bg-surface-container aspect-[4/5] rounded-xl border border-outline-variant/10 group-hover:border-primary-container/50 transition-all">
            <motion.img
              alt={projects[1].title}
              className="w-full h-full object-cover"
              src={projects[1].image}
              variants={imageVariants}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
              data-clip="project-image"
            />
          </div>
          <div className="px-2">
            <span className="font-label-sm text-[10px] tracking-[0.2em] text-primary uppercase mb-4 block">
              {projects[1].category}
            </span>
            <h3 className="font-headline-md text-3xl mb-4 text-on-surface">{projects[1].title}</h3>
            <p className="font-body-md text-on-surface-variant">{projects[1].description}</p>
          </div>
        </motion.div>

        {/* Project 03 */}
        <motion.div className="col-span-12 lg:col-span-10 lg:col-start-2 group" variants={cardVariants} whileHover="hover">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center px-4">
            <div className="order-2 md:order-1">
              <span className="font-label-sm text-[10px] tracking-[0.2em] text-primary uppercase mb-4 block">
                {projects[2].category}
              </span>
              <h3 className="font-headline-lg text-4xl mb-8 text-on-surface">{projects[2].title}</h3>
              <p className="font-body-lg text-on-surface-variant mb-10">{projects[2].description}</p>
              <ul className="space-y-6 mb-10">
                {['Information Architecture', 'Visual Design System'].map((item) => (
                  <motion.li
                    key={item}
                    className="flex items-center gap-4 font-body-md text-on-surface-variant"
                    whileHover={{ x: 8 }}
                  >
                    <motion.span className="w-8 h-px bg-primary-container" animate={{ scaleX: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2 relative overflow-hidden bg-surface-container aspect-square rounded-xl border border-outline-variant/10 group-hover:border-primary-container/50 transition-all">
              <motion.img
                alt={projects[2].title}
                className="w-full h-full object-cover"
                src={projects[2].image}
                variants={imageVariants}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6 }}
                data-clip="project-image"
              />
            </div>
          </div>
        </motion.div>

        {/* Project 04 */}
        <motion.div className="col-span-12 md:col-span-5 group md:mt-24" variants={cardVariants} whileHover="hover">
          <div className="relative overflow-hidden mb-12 bg-surface-container aspect-[3/4] rounded-xl border border-outline-variant/10 group-hover:border-primary-container/50 transition-all">
            <motion.img
              alt={projects[3].title}
              className="w-full h-full object-cover"
              src={projects[3].image}
              variants={imageVariants}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
              data-clip="project-image"
            />
          </div>
          <div className="px-2">
            <h3 className="font-headline-md text-3xl mb-4 text-on-surface">{projects[3].title}</h3>
            <p className="font-body-md text-on-surface-variant">{projects[3].description}</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
