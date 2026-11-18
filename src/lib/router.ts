import { useEffect, useState } from 'react'

export interface Route {
  path: string[]
  query: URLSearchParams
}

function parse(): Route {
  if (typeof window === 'undefined') {
    return { path: [], query: new URLSearchParams() }
  }
  if (window.location.hash.startsWith('#/')) {
    const clean = window.location.hash.slice(2)
    window.history.replaceState(null, '', '/' + clean)
  } else if (window.location.hash.startsWith('#')) {
    const clean = window.location.hash.slice(1)
    if (clean && !clean.includes('=')) {
      window.history.replaceState(null, '', '/' + clean)
    }
  }
  const p = window.location.pathname.replace(/^\/|\/$/g, '')
  return {
    path: p ? p.split('/') : [],
    query: new URLSearchParams(window.location.search)
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse)

  useEffect(() => {
    const onLocationChange = () => {
      setRoute(parse())
      window.scrollTo({ top: 0 })
    }

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (
        !target ||
        target.target === '_blank' ||
        target.hasAttribute('download') ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return
      }

      const to = target.getAttribute('href')
      if (!to || to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:') || to.startsWith('#')) {
        return
      }

      if (to.startsWith('/courses/')) {
        return
      }

      e.preventDefault()
      go(to)
    }

    window.addEventListener('popstate', onLocationChange)
    window.addEventListener('pushstate', onLocationChange)
    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('popstate', onLocationChange)
      window.removeEventListener('pushstate', onLocationChange)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return route
}

export function go(to: string) {
  if (window.location.pathname !== to) {
    window.history.pushState(null, '', to)
    window.dispatchEvent(new Event('pushstate'))
    window.scrollTo({ top: 0 })
  }
}

export const href = (to: string) => to
