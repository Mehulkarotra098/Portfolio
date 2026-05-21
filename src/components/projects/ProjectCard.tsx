import { motion, type Variants } from 'framer-motion'
import type { Project } from '../../data/projects'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

type ProjectCardProps = {
  project: Project
  variants: Variants
}

const formatCategory = (project: Project) => project.techStack.slice(0, 2).join(' - ')

export const ProjectCard = ({ project, variants }: ProjectCardProps) => {
  const cardContent = (
    <Card className="h-full gap-0 border border-outline-variant/15 bg-surface-container/45 py-0 shadow-[0_12px_36px_rgb(var(--color-deep-violet-rgb)/0.14)] backdrop-blur-xl transition-all duration-500 group-hover:border-primary-container/25 group-hover:bg-surface-container/55 group-hover:shadow-[0_16px_48px_rgb(var(--color-light-violet-rgb)/0.08)]">
      <CardContent className="relative aspect-[1.82] overflow-hidden bg-surface-container-lowest px-0">
        <motion.img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
          data-parallax="image"
        />
        <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/28 via-transparent to-surface-container-lowest/8" />
      </CardContent>

      <CardHeader className="flex-1 gap-0 px-4 py-5 sm:px-5">
        <CardDescription className="font-label-sm text-[9px] uppercase tracking-[0.22em] text-on-surface-variant/70">
          {formatCategory(project)}
        </CardDescription>
        <CardTitle className="mt-3 text-2xl font-bold leading-none text-on-surface transition-colors duration-300 group-hover:text-primary">
          {project.title}
        </CardTitle>
        <CardDescription className="mt-3 text-sm leading-relaxed text-on-surface-variant/85 sm:text-base">
          {project.role}
        </CardDescription>
      </CardHeader>
    </Card>
  )

  return (
    <motion.article
      className="group h-full"
      variants={variants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35 }}
    >
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full overflow-hidden rounded-xl"
          aria-label={`Open ${project.title} live site`}
        >
          {cardContent}
        </a>
      ) : (
        cardContent
      )}
    </motion.article>
  )
}
