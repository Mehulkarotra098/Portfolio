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

const expectedProjects = [
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
  {
    title: 'My Country Mobile',
    href: 'http://mycountrymobile.com/',
    image: '/my-country-mobile.png',
  },
  {
    title: 'Callmama',
    href: 'https://www.callmama.com/',
    image: '/callmama.png',
  },
  {
    title: 'Ordhekdeen',
    href: 'https://www.figma.com/design/Kh9i4e3tSF2jTjGySidzk7/Matrimony-Website--Community-?node-id=0-1&p=f',
    image: '/matrimony.png',
  },
  {
    title: 'Bachira',
    href: 'https://www.figma.com/design/7oYAa78La5UhpkfPoKkJCZ/Bachira-Online-Shop--Community-?node-id=169-249&p=f',
    image: '/bachira.png',
  },
  {
    title: 'Luminae',
    href: 'https://www.figma.com/design/rnGMe9FnPzGFbIQlFmgfQJ/Ecommerce-UI-Kit--Community-?node-id=0-1&p=f',
    image: '/luminae.png',
  },
  {
    title: 'EduTrack',
    href: 'https://www.figma.com/design/zcZ6QGU9neTpj7TKYuiE3B/practice2?node-id=0-1&p=f',
    image: '/edutrack.png',
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

  it('links every card to its exact original or newly approved destination', () => {
    const cards = renderProjectGrid()

    expectedProjects.forEach(({ title, href }, index) => {
      const link = within(cards[index]).getByRole('link', {
        name: `Open ${title} live site`,
      })

      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('uses the exact cover, descriptive alt text, and lazy loading for every card', () => {
    const cards = renderProjectGrid()

    expectedProjects.forEach(({ title, image }, index) => {
      const preview = within(cards[index]).getByRole('img', {
        name: `${title} project preview`,
      })

      expect(preview).toHaveAttribute('src', image)
      expect(preview).toHaveAttribute('loading', 'lazy')
    })
  })
})
