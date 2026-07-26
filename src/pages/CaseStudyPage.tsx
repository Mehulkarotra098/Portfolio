import { Link } from 'react-router-dom'
import { getProjectBySlug } from '../data/projects'

type CaseStudyPageProps = {
  slug: string
}

export const CaseStudyPage = ({ slug }: CaseStudyPageProps) => {
  const project = getProjectBySlug(slug)

  if (!project) {
    return null
  }

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-on-surface sm:px-6 md:px-8 lg:px-margin-x">
      <article className="mx-auto max-w-container-max">
        <Link
          to="/"
          className="font-label-sm text-sm text-primary underline-offset-4 hover:underline"
        >
          Back to portfolio
        </Link>
        <p className="mt-16 font-label-sm uppercase tracking-[0.22em] text-primary">
          Case study · {project.year}
        </p>
        <h1 className="mt-4 font-display-xl text-5xl font-bold sm:text-6xl md:text-7xl">
          {project.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
          {project.caseStudy?.overview ?? project.description}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-outline-variant/30 px-5 py-3 font-label-sm text-sm text-on-surface"
            >
              {link.label}
            </a>
          ))}
        </div>
      </article>
    </main>
  )
}
