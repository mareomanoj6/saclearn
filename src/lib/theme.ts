import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'atp-theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'))
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem(KEY, theme) } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent('atp-theme', { detail: theme }))
  }, [theme])
  const toggle = useCallback(() => {
    const root = document.documentElement
    root.classList.add('theme-anim')
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
    window.setTimeout(() => root.classList.remove('theme-anim'), 300)
  }, [])
  return { theme, toggle }
}

/** read-only subscription for components that need the theme (e.g. Monaco) */
export function useIsDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const on = (e: Event) => setDark((e as CustomEvent).detail === 'dark')
    window.addEventListener('atp-theme', on)
    return () => window.removeEventListener('atp-theme', on)
  }, [])
  return dark
}
