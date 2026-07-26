import { describe, expect, it } from 'vitest'
import * as projectModule from './projects'

type LinkSnapshot = {
  label: string
  href: string
}

type ProjectSnapshot = {
  id: string
  slug: string
  title: string
  links: LinkSnapshot[]
}

type ProjectModel = {
  featuredProjects?: ProjectSnapshot[]
  supportingProjects?: ProjectSnapshot[]
  archiveProjects?: ProjectSnapshot[]
  getProjectBySlug?: (slug: string) => ProjectSnapshot | undefined
}

const model = projectModule as ProjectModel

describe('project catalog', () => {
  it('keeps the approved flagship order', () => {
    expect(model.featuredProjects?.map(({ title }) => title)).toEqual([
      'TIS Admissions 2026–27',
      'Antrah Wellness',
      'Roar Arena',
    ])
  })

  it('keeps the approved flagship destinations exact', () => {
    expect(
      model.featuredProjects?.map(({ slug, links }) => ({ slug, links })),
    ).toEqual([
      {
        slug: 'tis-admissions',
        links: [
          {
            label: 'Live site',
            href: 'https://tis-school-admissions-2026.vercel.app/',
          },
          {
            label: 'Figma',
            href: 'https://www.figma.com/design/HzBRale6rfopuSuIsPtthh/TIS-Admissions-2026-27-%E2%80%94-UI-UX-Design?node-id=0-1&p=f',
          },
        ],
      },
      {
        slug: 'antrah-wellness',
        links: [
          {
            label: 'Live site',
            href: 'https://antrah-wellness.vercel.app/',
          },
          {
            label: 'Figma',
            href: 'https://www.figma.com/design/46wA5ZJf2vUucsRB6Rysnl/Antrah-Wellness-Event-%E2%80%94-UI-UX-Assignment?node-id=0-1&t=I1tJHwo6VLN88OEd-1',
          },
        ],
      },
      {
        slug: 'roar-arena',
        links: [
          {
            label: 'Live site',
            href: 'https://roararenaindia.vercel.app/',
          },
        ],
      },
    ])
  })

  it('keeps GrowCred as supporting work with its verified destination', () => {
    expect(model.supportingProjects?.map(({ title, links }) => ({ title, links }))).toEqual([
      {
        title: 'GrowCred',
        links: [
          {
            label: 'Live site',
            href: 'https://greencred.vercel.app/',
          },
        ],
      },
    ])
  })

  it('preserves all six earlier projects and their destinations', () => {
    expect(
      model.archiveProjects?.map(({ id, title, links }) => ({ id, title, links })),
    ).toEqual([
      {
        id: 'my-country-mobile',
        title: 'My Country Mobile',
        links: [{ label: 'Live site', href: 'http://mycountrymobile.com/' }],
      },
      {
        id: 'callmama',
        title: 'Callmama',
        links: [{ label: 'Live site', href: 'https://www.callmama.com/' }],
      },
      {
        id: 'ordhekdeen',
        title: 'Ordhekdeen',
        links: [
          {
            label: 'Figma',
            href: 'https://www.figma.com/design/Kh9i4e3tSF2jTjGySidzk7/Matrimony-Website--Community-?node-id=0-1&p=f',
          },
        ],
      },
      {
        id: 'bachira',
        title: 'Bachira',
        links: [
          {
            label: 'Figma',
            href: 'https://www.figma.com/design/7oYAa78La5UhpkfPoKkJCZ/Bachira-Online-Shop--Community-?node-id=169-249&p=f',
          },
        ],
      },
      {
        id: 'luminae',
        title: 'Luminae',
        links: [
          {
            label: 'Figma',
            href: 'https://www.figma.com/design/rnGMe9FnPzGFbIQlFmgfQJ/Ecommerce-UI-Kit--Community-?node-id=0-1&p=f',
          },
        ],
      },
      {
        id: 'edutrack',
        title: 'EduTrack',
        links: [
          {
            label: 'Figma',
            href: 'https://www.figma.com/design/zcZ6QGU9neTpj7TKYuiE3B/practice2?node-id=0-1&p=f',
          },
        ],
      },
    ])
  })

  it('finds routable projects by slug', () => {
    expect(model.getProjectBySlug?.('antrah-wellness')?.title).toBe('Antrah Wellness')
  })

  it('returns undefined for an unknown slug', () => {
    expect(model.getProjectBySlug).toBeTypeOf('function')
    expect(model.getProjectBySlug?.('not-a-project')).toBeUndefined()
  })

  it('does not expose supporting work as an internal case study', () => {
    expect(model.getProjectBySlug).toBeTypeOf('function')
    expect(model.getProjectBySlug?.('growcred')).toBeUndefined()
  })
})
