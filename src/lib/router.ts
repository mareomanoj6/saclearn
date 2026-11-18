import { useEffect, useState } from 'react'

export interface Route { path: string[]; query: URLSearchParams }

function parse(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [p, q = ''] = raw.split('?')
  return { path: p.split('/').filter(Boolean), query: new URLSearchParams(q) }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const on = () => { setRoute(parse()); window.scrollTo({ top: 0 }) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export function go(to: string) { window.location.hash = to.startsWith('#') ? to : '#' + to }
export const href = (to: string) => '#' + to
