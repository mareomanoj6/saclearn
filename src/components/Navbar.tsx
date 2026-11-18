import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Presentation, Network, StickyNote, Gamepad2, Terminal, TrendingUp, Sun, Moon, Menu, X } from 'lucide-react'
import { href } from '../lib/router'
import { useTheme } from '../lib/theme'

const NAV = [
  { to: '/', match: ['', 'module', 'topic'], label: 'Modules', icon: BookOpen },
  { to: '/slides/1', match: ['slides'], label: 'Slides', icon: Presentation },
  { to: '/mindmap', match: ['mindmap'], label: 'Mind Map', icon: Network },
  { to: '/flashcards', match: ['flashcards'], label: 'Flashcards', icon: StickyNote },
  { to: '/quiz', match: ['quiz'], label: 'Quiz', icon: Gamepad2 },
  { to: '/playground', match: ['playground'], label: 'Playground', icon: Terminal },
  { to: '/pyq', match: ['pyq'], label: 'PYQ Analyzer', icon: TrendingUp },
]

export function Navbar({ section }: { section: string }) {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] flex items-center gap-2 h-16 px-4 lg:px-6">
        <a href={href('/')} className="flex items-center gap-3 mr-3 shrink-0">
          <img src="./ksucet-light.png" alt="KSU CET" className="h-10 w-auto dark:hidden" />
          <img src="./ksucet-dark.png" alt="KSU CET" className="h-10 w-auto hidden dark:block" />
          <span className="w-px h-9 bg-line mx-1" aria-hidden />
          <img src="./logo.png" alt="SAC LEARN logo" className="h-11 w-auto rounded-lg bg-white" />
          <span className="leading-tight hidden sm:block">
            <span className="block font-semibold text-[15px]">SAC LEARN</span>
            <span className="block text-[11px] text-subtle font-medium">An interactive learning platform</span>
          </span>
        </a>
        <nav className="hidden xl:flex items-center gap-0.5">
          {NAV.map(n => {
            const active = n.match.includes(section)
            return (
              <a key={n.to} href={href(n.to)} className={`tab relative ${active ? 'text-accent' : ''}`}>
                {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-[10px] bg-accent-soft" transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }} />}
                <n.icon size={16} className="relative" /><span className="relative">{n.label}</span>
              </a>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggle} className="btn btn-icon" aria-label="Toggle light/dark mode" title="Toggle theme">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} className="grid">
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button className="btn btn-icon xl:hidden" onClick={() => setOpen(o => !o)} aria-label="Menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="xl:hidden overflow-hidden border-t border-line">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-3">
              {NAV.map(n => (
                <a key={n.to} href={href(n.to)} onClick={() => setOpen(false)} className={`tab ${n.match.includes(section) ? 'tab-active' : ''}`}><n.icon size={16} />{n.label}</a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
