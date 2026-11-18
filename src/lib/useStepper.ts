import { useCallback, useEffect, useRef, useState } from 'react'

/** Shared play / pause / step / speed engine for every algorithm animation. */
export function useStepper(total: number, baseMs = 900) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const timer = useRef<number | null>(null)

  useEffect(() => { setIndex(0); setPlaying(false) }, [total])

  useEffect(() => {
    if (!playing) return
    if (index >= total - 1) { setPlaying(false); return }
    timer.current = window.setTimeout(() => setIndex(i => Math.min(i + 1, total - 1)), baseMs / speed)
    return () => { if (timer.current) window.clearTimeout(timer.current) }
  }, [playing, index, total, speed, baseMs])

  const next = useCallback(() => setIndex(i => Math.min(i + 1, total - 1)), [total])
  const prev = useCallback(() => setIndex(i => Math.max(i - 1, 0)), [])
  const reset = useCallback(() => { setPlaying(false); setIndex(0) }, [])
  const toggle = useCallback(() => {
    setPlaying(p => {
      if (!p && index >= total - 1) { setIndex(0) }
      return !p
    })
  }, [index, total])

  const safe = Math.max(0, Math.min(index, total - 1))
  return { index: safe, setIndex, playing, setPlaying, toggle, next, prev, reset, speed, setSpeed, total, atEnd: safe >= total - 1 }
}
export type Stepper = ReturnType<typeof useStepper>
