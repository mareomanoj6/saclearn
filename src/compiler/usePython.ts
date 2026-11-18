import { useCallback, useEffect, useRef, useState } from 'react'
import { WORKER_SOURCE } from './worker'

export type Line = { kind: 'out' | 'err' | 'echo' | 'sys' | 'ok'; text: string }
export type RuntimeStatus = 'idle' | 'loading' | 'ready' | 'running' | 'error'

/* One shared worker for the whole app, so the 10 MB runtime downloads only once. */
let shared: Worker | null = null
let sharedReady = false
let sharedVersion = ''
const listeners = new Set<(m: MessageEvent) => void>()

function spawn() {
  const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }))
  shared = new Worker(url)
  sharedReady = false
  shared.onmessage = (m) => {
    if (m.data.type === 'ready') { sharedReady = true; sharedVersion = m.data.version }
    listeners.forEach(l => l(m))
  }
  return shared
}

export function usePython() {
  const [status, setStatus] = useState<RuntimeStatus>(sharedReady ? 'ready' : 'idle')
  const [lines, setLines] = useState<Line[]>([])
  const [ms, setMs] = useState<number | null>(null)
  const pending = useRef<{ code: string; stdin: string } | null>(null)
  const runningRef = useRef(false)

  useEffect(() => {
    const on = (m: MessageEvent) => {
      const d = m.data
      switch (d.type) {
        case 'ready':
          setStatus(runningRef.current ? 'running' : 'ready')
          break
        case 'fatal':
          runningRef.current = false
          setStatus('error')
          setLines(l => [...l, { kind: 'err', text: 'Could not load the Python runtime (Pyodide). Check your internet connection and try again.\n' + d.text + '\n' }])
          break
        case 'out': case 'err': case 'echo':
          if (runningRef.current) setLines(l => [...l, { kind: d.type, text: d.text }])
          break
        case 'sys':
          if (runningRef.current) setLines(l => [...l, { kind: 'sys', text: d.text + '\n' }])
          break
        case 'needinput':
          if (runningRef.current) setLines(l => [...l, { kind: 'sys', text: '⌨  Program asked for input but the Input box has no more lines.\n' }])
          break
        case 'done': case 'error':
          if (!runningRef.current) break
          runningRef.current = false
          if (d.type === 'error') setLines(l => [...l, { kind: 'err', text: d.text }])
          setMs(d.ms)
          setStatus('ready')
          break
      }
    }
    listeners.add(on)
    return () => { listeners.delete(on) }
  }, [])

  const run = useCallback((code: string, stdin: string) => {
    const w = shared ?? spawn()
    runningRef.current = true
    setLines([])
    setMs(null)
    if (!sharedReady) {
      setStatus('loading')
      setLines([{ kind: 'sys', text: 'Loading Python runtime… (first run downloads ~10 MB, then it is cached)\n' }])
    } else setStatus('running')
    pending.current = { code, stdin }
    w.postMessage({ code, stdin })
  }, [])

  const stop = useCallback(() => {
    if (shared) { shared.terminate(); shared = null; sharedReady = false }
    runningRef.current = false
    setLines(l => [...l, { kind: 'err', text: '\n■ Execution stopped by user.\n' }])
    setStatus('idle')
  }, [])

  const clear = useCallback(() => { setLines([]); setMs(null) }, [])
  const warm = useCallback(() => { if (!shared) spawn() }, [])

  return { status, lines, ms, run, stop, clear, warm, version: sharedVersion }
}
