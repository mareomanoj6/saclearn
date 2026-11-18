import { useEffect, useState } from 'react'

export interface Route { path: string[]; query: URLSearchParams }

function parse(): Route {
  if (window.location.hash.includes('about')) {
    window.history.replaceState(null, '', '/about')
  }
  const p = window.location.pathname || '/'
  return { path: p.split('/').filter(Boolean), query: new URLSearchParams(window.location.search) }
}

export function navigate(to: string) {
  const dest = to.startsWith('/') ? to : '/' + to
  if (dest === window.location.pathname) return
  window.history.pushState({}, '', dest)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0 })
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse)

  useEffect(() => {
    const on = () => {
      setRoute(parse())
      window.scrollTo({ top: 0 })
    }

    const onLinkClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const h = target.getAttribute('href')
      if (!h || h.startsWith('http') || h.startsWith('mailto:') || h.startsWith('tel:') || h.startsWith('#') || target.target === '_blank') return
      if (h.startsWith('/courses/')) return
      e.preventDefault()
      navigate(h)
    }

    window.addEventListener('popstate', on)
    document.addEventListener('click', onLinkClick)
    return () => {
      window.removeEventListener('popstate', on)
      document.removeEventListener('click', onLinkClick)
    }
  }, [])

  return route
}

export const go = navigate
export const href = (to: string) => to.startsWith('/') ? to : '/' + to
