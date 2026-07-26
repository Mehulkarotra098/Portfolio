import { fireEvent, render, screen, within } from '@testing-library/react'
import { MotionConfig } from 'framer-motion'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '@/context/ThemeContext'
import { Footer } from './Footer'
import { Hero } from './Hero'
import { Nav } from './Nav'

const renderShell = (reducedMotion: 'always' | 'never' | 'user' = 'user') =>
  render(
    <MotionConfig reducedMotion={reducedMotion}>
      <ThemeProvider>
        <Nav />
        <main>
          <Hero />
        </main>
        <Footer />
      </ThemeProvider>
    </MotionConfig>,
  )

describe('portfolio shell', () => {
  it('introduces the design-to-production practice with the approved hero copy', () => {
    renderShell()

    expect(
      screen.getByText('UI/UX Designer · Front-end Developer'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'I design digital experiences—and build them for real.',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Figma systems.*responsive production websites/i,
      ),
    ).toBeInTheDocument()
  })

  it('offers both approved hero actions at their page destinations', () => {
    renderShell()

    expect(screen.getByRole('link', { name: 'View featured work' })).toHaveAttribute(
      'href',
      '#work',
    )
    expect(screen.getByRole('link', { name: 'Let’s work together' })).toHaveAttribute(
      'href',
      '#contact',
    )
  })

  it('provides the primary navigation and a working accessible theme control', () => {
    renderShell()

    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(navigation).toBeInTheDocument()

    for (const [label, href] of [
      ['Work', '#work'],
      ['About', '#about'],
      ['Skills', '#skills'],
      ['Contact', '#contact'],
    ]) {
      expect(
        screen.getAllByRole('link', { name: label }).find((link) =>
          navigation.contains(link),
        ),
      ).toHaveAttribute('href', href)
    }

    const themeControl = screen.getByRole('button', {
      name: 'Switch to light theme',
    })
    fireEvent.click(themeControl)

    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(window.localStorage.getItem('theme')).toBe('light')
    expect(
      screen.getByRole('button', { name: 'Switch to dark theme' }),
    ).toBeInTheDocument()
  })

  it('preserves the footer contact links, location, and navigation', () => {
    renderShell()

    const footer = within(screen.getByRole('contentinfo'))

    expect(footer.getByText(/Mumbai/)).toBeInTheDocument()
    expect(footer.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/mehulkarotra/',
    )
    expect(footer.getByRole('link', { name: /GitHub/i })).toHaveAttribute(
      'href',
      'https://github.com/Mehulkarotra098/',
    )
    expect(footer.getByRole('link', { name: /Email/i })).toHaveAttribute(
      'href',
      'mailto:mehulbitmaster@gmail.com',
    )

    for (const [label, href] of [
      ['Work', '#work'],
      ['About', '#about'],
      ['Skills', '#skills'],
      ['Contact', '#contact'],
    ]) {
      expect(footer.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        href,
      )
    }
  })

  it('renders motion components at rest when reduced motion is requested', () => {
    renderShell('always')

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'I design digital experiences—and build them for real.',
      }),
    ).toHaveStyle({ transform: 'none' })
  })
})
