import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Terminal } from 'lucide-react'
import { Compiler } from '../compiler/Compiler'

interface TryItState { open: (code: string, title?: string) => void }
const Ctx = createContext<TryItState>({ open: () => {} })
export const useTryIt = () => useContext(Ctx)

/** "Try it yourself" drawer — the full Python compiler sliding in from the right. */
export function TryItProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ code: string; title: string; key: number } | null>(null)
  const open = useCallback((code: string, title = 'Try it yourself') => setState({ code, title, key: Date.now() }), [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setState(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => { document.body.style.overflow = state ? 'hidden' : '' }, [state])

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {state && (
          <>
            <motion.div key="scrim" className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setState(null)} />
            <motion.aside key="drawer" role="dialog" aria-label={state.title}
              className="fixed right-0 top-0 z-50 h-[100dvh] w-full lg:w-[min(1100px,92vw)] bg-bg border-l border-line flex flex-col safe-top safe-bottom"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-3 px-4 sm:px-5 h-14 border-b border-line shrink-0">
                <span className="grid place-items-center w-8 h-8 shrink-0 rounded-lg bg-accent-soft text-accent"><Terminal size={16} /></span>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{state.title}</div>
                  <div className="text-xs text-subtle truncate"><span className="sm:hidden">Python runs in your browser</span><span className="hidden sm:inline">Real Python 3 running in your browser · <span className="kbd">Ctrl</span> + <span className="kbd">Enter</span> to run · <span className="kbd">Esc</span> to close</span></div>
                </div>
                <button className="btn btn-ghost btn-icon ml-auto shrink-0" onClick={() => setState(null)} aria-label="Close"><X size={18} /></button>
              </div>
              <div className="flex-1 min-h-0 p-4">
                <Compiler key={state.key} initialCode={state.code} height="100%" />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  )
}
