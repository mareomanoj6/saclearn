import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  Sun, 
  Moon, 
  Menu, 
  X,
  LayoutGrid,
  Info,
  ChevronDown,
  Terminal,
  Cpu,
  ArrowRight,
  Clock,
  Code2
} from 'lucide-react'
import { href } from '../lib/router'
import { useTheme } from '../lib/theme'

export function Navbar({ section }: { section: string }) {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [coursesOpen, setCoursesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCoursesOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setCoursesOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl safe-top safe-x">
      <div className="mx-auto max-w-[1440px] flex items-center gap-2 h-16 px-4 lg:px-6">
        <a href={href('/')} className="flex items-center gap-2 sm:gap-3 mr-1 sm:mr-3 min-w-0">
          <img src="./ksucet-light.png" alt="KSU CET" className="h-8 sm:h-9 w-auto dark:hidden" />
          <img src="./ksucet-dark.png" alt="KSU CET" className="h-8 sm:h-9 w-auto hidden dark:block" />
          <span className="w-px h-7 bg-line mx-0 sm:mx-1" aria-hidden />
          <img src="./logo-light.png" alt="SAC LEARN logo" className="h-8 sm:h-9 w-auto dark:hidden" />
          <img src="./logo.png" alt="SAC LEARN logo" className="h-8 sm:h-9 w-auto hidden dark:block" />
          <span className="leading-tight min-w-0">
            <span className="block font-semibold text-sm sm:text-[15px] whitespace-nowrap">SAC LEARN</span>
            <span className="hidden sm:block text-[11px] text-subtle font-medium">Student Assist Cell · CET</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCoursesOpen(o => !o)}
              className={`tab inline-flex items-center gap-1.5 transition-colors ${coursesOpen ? 'text-accent bg-accent-soft' : ''}`}
              aria-expanded={coursesOpen}
            >
              <LayoutGrid size={15} />
              <span>Courses</span>
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${coursesOpen ? 'rotate-180 text-accent' : 'text-subtle'}`} 
              />
            </button>

            <AnimatePresence>
              {coursesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-full mt-2 w-[480px] p-3 rounded-2xl border border-line bg-surface/95 backdrop-blur-2xl shadow-2xl z-50"
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-subtle">
                    Live Interactive Studios
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 mt-1">
                    <a
                      href="/courses/atp/"
                      onClick={() => setCoursesOpen(false)}
                      className="group flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-line hover:bg-elevated transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent grid place-items-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Terminal size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-fg group-hover:text-accent transition-colors">
                            Algorithmic Thinking with Python
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-good-soft text-good">
                            <span className="w-1.5 h-1.5 rounded-full bg-good animate-pulse" />
                            Live
                          </span>
                        </div>
                        <div className="text-xs text-subtle mt-0.5">
                          UCEST105 · S1/S2 · In-browser Python sandbox, animations & PYQs
                        </div>
                      </div>
                    </a>

                    <a
                      href="/courses/dsa/"
                      onClick={() => setCoursesOpen(false)}
                      className="group flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-line hover:bg-elevated transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-good-soft text-good grid place-items-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Cpu size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-fg group-hover:text-good transition-colors">
                            Data Structures & Algorithms (Atlas)
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-good-soft text-good">
                            <span className="w-1.5 h-1.5 rounded-full bg-good animate-pulse" />
                            Live
                          </span>
                        </div>
                        <div className="text-xs text-subtle mt-0.5">
                          CST201 · S3 · Step-by-step visual simulations & C runner
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="pt-2 mt-2 border-t border-line/70">
                    <div className="px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-subtle">
                      Upcoming in Pipeline
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 text-xs text-muted">
                      <div className="flex items-center gap-2">
                        <Code2 size={15} className="text-subtle" />
                        <span>Object-Oriented Programming (Java)</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-surface-2 text-subtle">
                        <Clock size={11} />
                        Scheduled
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href={href('/about')} className={`tab ${section === 'about' ? 'text-accent' : ''}`}>
            <Info size={15} />
            <span>About</span>
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <a href="/courses/atp/" className="btn btn-primary h-9 px-3.5 text-xs font-medium">
              Launch ATP
            </a>
            <a href="/courses/dsa/" className="btn h-9 px-3.5 text-xs font-medium">
              Launch DSA
            </a>
          </div>

          <button onClick={toggle} className="btn btn-icon" aria-label="Toggle light/dark mode" title="Toggle theme">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} className="grid">
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </motion.span>
            </AnimatePresence>
          </button>

          <button 
            className="btn btn-icon md:hidden" 
            onClick={() => setOpen(o => !o)} 
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="md:hidden overflow-hidden border-t border-line bg-surface/95 backdrop-blur-xl"
          >
            <div className="p-4 flex flex-col gap-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-subtle px-1">
                Active Courses
              </div>
              <a 
                href="/courses/atp/" 
                onClick={() => setOpen(false)} 
                className="flex items-center justify-between p-3 rounded-xl border border-line bg-elevated text-sm font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal size={17} className="text-accent" />
                  <span>Algorithmic Thinking (ATP)</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-good-soft text-good">Live</span>
              </a>

              <a 
                href="/courses/dsa/" 
                onClick={() => setOpen(false)} 
                className="flex items-center justify-between p-3 rounded-xl border border-line bg-elevated text-sm font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Cpu size={17} className="text-good" />
                  <span>Data Structures (Atlas)</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-good-soft text-good">Live</span>
              </a>

              <div className="pt-2 border-t border-line flex flex-col gap-1">
                <a 
                  href={href('/about')} 
                  onClick={() => setOpen(false)} 
                  className="tab justify-start"
                >
                  <Info size={16} />
                  About SAC Learn
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
