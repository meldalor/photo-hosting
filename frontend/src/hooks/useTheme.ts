import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark' | 'high-contrast'

const THEME_STORAGE_KEY = 'photo-hosting-theme'

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)

  if (stored === 'light' || stored === 'dark' || stored === 'high-contrast') {
    return stored
  }

  return 'light'
}

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)

    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState((current) => {
      if (current === 'light') return 'dark'
      if (current === 'dark') return 'high-contrast'

      return 'light'
    })
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
