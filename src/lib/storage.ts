import { useEffect, useState } from 'react'

export function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback } catch { return fallback }
}
export function save<T>(key: string, value: T) { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ } }

/** useState that persists to localStorage */
export function usePersistent<T>(key: string, fallback: T) {
  const [v, setV] = useState<T>(() => load(key, fallback))
  useEffect(() => { save(key, v) }, [key, v])
  return [v, setV] as const
}
