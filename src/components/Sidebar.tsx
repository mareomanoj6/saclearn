import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { MODULES } from '../data/syllabus'
import { href } from '../lib/router'
import { TopicIcon } from './Icon'

export function Sidebar({ activeTopic, visited }: { activeTopic?: string; visited: string[] }) {
  const activeModule = MODULES.find(m => m.topics.some(t => t.id === activeTopic))?.id
  const [open, setOpen] = useState<number[]>(activeModule ? [activeModule] : [1, 2, 3, 4])
  return (
    <nav className="flex flex-col gap-1 text-sm" aria-label="Syllabus">
      {MODULES.map(m => {
        const isOpen = open.includes(m.id)
        return (
          <div key={m.id}>
            <button onClick={() => setOpen(o => isOpen ? o.filter(x => x !== m.id) : [...o, m.id])} className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-surface text-left">
              <span className="grid place-items-center w-6 h-6 rounded-md bg-accent-soft text-accent text-xs font-bold shrink-0">{m.id}</span>
              <span className="font-semibold text-[13px] leading-tight flex-1">{m.title}</span>
              <ChevronDown size={14} className={`text-subtle transition-transform ${isOpen ? '' : '-rotate-90'}`} />
            </button>
            {isOpen && (
              <div className="ml-5 pl-3 border-l border-line flex flex-col gap-0.5 my-1">
                {m.topics.map(t => {
                  const active = t.id === activeTopic
                  return (
                    <a key={t.id} href={href(`/topic/${t.id}`)} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] ${active ? 'bg-accent-soft text-accent font-semibold' : 'text-muted hover:text-fg hover:bg-surface'}`}>
                      <TopicIcon name={t.icon} size={14} />
                      <span className="flex-1 leading-tight">{t.title}</span>
                      {visited.includes(t.id) && !active && <span className="w-1.5 h-1.5 rounded-full bg-good" title="Visited" />}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
