import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, ExternalLink, X } from 'lucide-react'
import { InstagramIcon, YoutubeIcon, WhatsappIcon } from './BrandIcons'
import { LINKS } from '../data/links'

export function Footer() {
  const [igOpen, setIgOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIgOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIgOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <footer className="border-t border-line bg-surface/30 backdrop-blur-md">
      <div className="mx-auto max-w-[1780px] px-4 sm:px-6 lg:px-10 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="text-center sm:text-left text-muted">
          <span className="text-accent font-semibold mr-1">©</span>
          <span className="text-fg font-medium">2026 SAC LEARN</span>
          <span className="mx-2 text-line" aria-hidden>·</span>
          <span>KSU CET Student Assist Cell</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={popupRef}>
            <button
              onClick={() => setIgOpen(o => !o)}
              aria-label="Instagram accounts"
              title="Instagram"
              className={`text-accent hover:text-accent-strong p-1.5 rounded-lg transition-all ${
                igOpen ? 'bg-accent-soft text-accent-strong' : 'hover:bg-accent-soft'
              }`}
            >
              <InstagramIcon width={17} height={17} />
            </button>

            <AnimatePresence>
              {igOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 w-64 p-2 rounded-2xl border border-line bg-surface/95 backdrop-blur-2xl shadow-2xl z-50"
                >
                  <div className="flex items-center justify-between px-2.5 py-1.5 mb-1 text-xs font-semibold text-subtle border-b border-line/60">
                    <span>Instagram Pages</span>
                    <button 
                      onClick={() => setIgOpen(false)} 
                      className="text-subtle hover:text-fg p-0.5 rounded"
                      aria-label="Close"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    <a
                      href={LINKS.instagramKsuCet}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIgOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-elevated text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-accent-soft text-accent grid place-items-center shrink-0">
                          <InstagramIcon width={15} height={15} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-fg group-hover:text-accent transition-colors">KSU CET Unit</div>
                          <div className="text-[11px] text-subtle">@ksu.cet</div>
                        </div>
                      </div>
                      <ExternalLink size={13} className="text-subtle group-hover:text-accent transition-colors" />
                    </a>

                    <a
                      href={LINKS.instagramSacCet}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIgOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-elevated text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-accent-soft text-accent grid place-items-center shrink-0">
                          <InstagramIcon width={15} height={15} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-fg group-hover:text-accent transition-colors">SAC CET</div>
                          <div className="text-[11px] text-subtle">@studentassistcell_cet</div>
                        </div>
                      </div>
                      <ExternalLink size={13} className="text-subtle group-hover:text-accent transition-colors" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href={LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            title="YouTube"
            className="text-accent hover:text-accent-strong p-1.5 rounded-lg hover:bg-accent-soft transition-all"
          >
            <YoutubeIcon width={17} height={17} />
          </a>

          <a
            href={'mailto:' + LINKS.email}
            aria-label="Email"
            title={LINKS.email}
            className="text-accent hover:text-accent-strong p-1.5 rounded-lg hover:bg-accent-soft transition-all"
          >
            <Mail size={17} strokeWidth={1.8} />
          </a>

          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            title="WhatsApp"
            className="text-accent hover:text-accent-strong p-1.5 rounded-lg hover:bg-accent-soft transition-all"
          >
            <WhatsappIcon width={17} height={17} />
          </a>
        </div>

        <div className="text-center sm:text-right text-muted text-xs">
          Developed by <span className="font-semibold text-accent">KSU SAC</span>
        </div>
      </div>
    </footer>
  )
}
