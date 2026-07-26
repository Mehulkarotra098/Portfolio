import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('portfolio routes', () => {
  it('announces route loading while the page bundle resolves', () => {
    renderAt('/work/roar-arena')

    expect(screen.getByRole('status')).toHaveTextContent('Loading page')
  })

  it(
    'renders the portfolio homepage at /',
    async () => {
      renderAt('/')

      expect(
        await screen.findByRole(
          'heading',
          {
            level: 1,
            name: /I design digital experiences—and build them for real\./i,
          },
          { timeout: 10_000 },
        ),
      ).toBeInTheDocument()
    },
    10_000,
  )

  it.each([
    ['/work/tis-admissions', 'TIS Admissions 2026–27'],
    ['/work/antrah-wellness', 'Antrah Wellness'],
    ['/work/roar-arena', 'Roar Arena'],
  ])('renders the %s flagship case study', async (path, title) => {
    renderAt(path)

    expect(
      await screen.findByRole('heading', { level: 1, name: title }),
    ).toBeInTheDocument()
  })

  it('renders a not-found page for an unknown route', async () => {
    renderAt('/work/not-a-project')

    expect(
      await screen.findByRole('heading', { level: 1, name: /Page not found/i }),
    ).toBeInTheDocument()
  })

  it('resets scroll when pathname navigation completes', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo')

    const NavigationControl = () => {
      const navigate = useNavigate()

      return (
        <button type="button" onClick={() => navigate('/work/roar-arena')}>
          Open Roar Arena
        </button>
      )
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
        <NavigationControl />
      </MemoryRouter>,
    )

    scrollTo.mockClear()
    fireEvent.click(screen.getByRole('button', { name: 'Open Roar Arena' }))

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith(0, 0)
    })
  })
})
