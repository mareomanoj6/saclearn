import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  Sun, 
  Moon, 
  Menu, 
  X,
  LayoutGrid,
  Info
} from 'lucide-react'
import { href } from '../lib/router'
import { useTheme } from '../lib/theme'

export function Navbar({ section }: { section: string }) {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-xl safe-top safe-x">
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
          <a href="#courses-catalog" className="tab">
            <LayoutGrid size={15} />
            <span>Course Catalog</span>
          </a>
          <a href={href('/about')} className={`tab ${section === 'about' ? 'text-accent' : ''}`}>
            <Info size={15} />
            <span>About</span>
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
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
            className="md:hidden overflow-hidden border-t border-line bg-surface/90"
          >
            <div className="p-4 flex flex-col gap-2">
              <a 
                href="#courses-catalog" 
                onClick={() => setOpen(false)} 
                className="tab justify-start"
              >
                <LayoutGrid size={16} />
                Browse Course Catalog
              </a>
              <a 
                href={href('/about')} 
                onClick={() => setOpen(false)} 
                className="tab justify-start"
              >
                <Info size={16} />
                About SAC Learn
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
