import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './theme'

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark'
  const storedTheme = window.localStorage.getItem('theme')
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const initialTheme = getInitialTheme()
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = initialTheme
    }
    return initialTheme
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
