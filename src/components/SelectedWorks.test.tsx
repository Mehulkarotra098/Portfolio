import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SelectedWorks } from './SelectedWorks'

const approvedTitles = [
  'TIS Admissions 2026–27',
  'Antrah Wellness',
  'Roar Arena',
  'GrowCred',
  'My Country Mobile',
  'Callmama',
  'Ordhekdeen',
  'Bachira',
  'Luminae',
  'EduTrack',
]

const newProjects = [
  {
    title: 'TIS Admissions 2026–27',
    href: 'https://tis-school-admissions-2026.vercel.app/',
    image: '/projects/tis-admissions/cover.webp',
  },
  {
    title: 'Antrah Wellness',
    href: 'https://antrah-wellness.vercel.app/',
    image: '/projects/antrah-wellness/cover.webp',
  },
  {
    title: 'Roar Arena',
    href: 'https://roararenaindia.vercel.app/',
    image: '/projects/roar-arena/cover.webp',
  },
  {
    title: 'GrowCred',
    href: 'https://greencred.vercel.app/',
    image: '/projects/growcred/cover.webp',
  },
]

const existingProjects = [
  {
    title: 'My Country Mobile',
    href: 'http://mycountrymobile.com/',
  },
  {
    title: 'Callmama',
    href: 'https://www.callmama.com/',
  },
  {
    title: 'Ordhekdeen',
    href: 'https://www.figma.com/design/Kh9i4e3tSF2jTjGySidzk7/Matrimony-Website--Community-?node-id=0-1&p=f',
  },
  {
    title: 'Bachira',
    href: 'https://www.figma.com/design/7oYAa78La5UhpkfPoKkJCZ/Bachira-Online-Shop--Community-?node-id=169-249&p=f',
  },
  {
    title: 'Luminae',
    href: 'https://www.figma.com/design/rnGMe9FnPzGFbIQlFmgfQJ/Ecommerce-UI-Kit--Community-?node-id=0-1&p=f',
  },
  {
    title: 'EduTrack',
    href: 'https://www.figma.com/design/zcZ6QGU9neTpj7TKYuiE3B/practice2?node-id=0-1&p=f',
  },
]

const renderProjectGrid = () => {
  render(<SelectedWorks />)
  return screen.getAllByRole('article')
}

describe('SelectedWorks', () => {
  it('renders exactly ten approved project cards in order', () => {
    const cards = renderProjectGrid()

    expect(cards).toHaveLength(10)
    approvedTitles.forEach((title, index) => {
      expect(cards[index]).toHaveTextContent(title)
    })
  })

  it('links the four new project cards to their exact live destinations', () => {
    const cards = renderProjectGrid()

    newProjects.forEach(({ title, href }, index) => {
      const link = within(cards[index]).getByRole('link', {
        name: `Open ${title} live site`,
      })

      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('preserves the six existing project destinations after the new cards', () => {
    const cards = renderProjectGrid().slice(4)

    expect(cards).toHaveLength(6)
    existingProjects.forEach(({ title, href }, index) => {
      expect(cards[index]).toHaveTextContent(title)
      expect(within(cards[index]).getByRole('link')).toHaveAttribute('href', href)
    })
  })

  it('uses the real local covers and lazy project-preview images', () => {
    const cards = renderProjectGrid()

    newProjects.forEach(({ title, image }, index) => {
      expect(
        within(cards[index]).getByRole('img', {
          name: `${title} project preview`,
        }),
      ).toHaveAttribute('src', image)
    })

    screen.getAllByRole('img').forEach((image) => {
      expect(image).toHaveAttribute('loading', 'lazy')
    })
  })
})
