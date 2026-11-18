import { motion } from 'framer-motion'
import { ArrowRight, Presentation, Gamepad2, StickyNote, Clapperboard } from 'lucide-react'
import { MODULE_ACCENT, MODULES, moduleById } from '../data/syllabus'
import { VISUALIZERS } from '../visualizers'
import { href } from '../lib/router'
import { TopicIcon } from '../components/Icon'

export function ModulePage({ id }: { id: number }) {
  const m = moduleById(id) ?? MODULES[0]
  const acc = MODULE_ACCENT[m.id]
  return (
    <div className="mx-auto max-w-[1100px] px-4 lg:px-6 py-10">
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-thin -mx-1 px-1">{MODULES.map(x => <a key={x.id} href={href(`/module/${x.id}`)} className={`tab ${x.id === m.id ? 'tab-active' : ''}`}>Module {x.id}</a>)}</div>
      <div className="relative overflow-hidden rounded-3xl border border-line p-5 sm:p-8 mb-8" style={{ background: 'var(--surface)' }}>
        <div className="label">Module {m.id}</div>
        <h1 className="text-3xl lg:text-4xl font-medium tracking-tight mt-1">{m.title}</h1>
        <p className="text-muted mt-2">{m.tagline}</p>
        <div className="flex flex-wrap gap-2 mt-6">
          <a className="btn btn-primary" href={href(`/topic/${m.topics[0].id}`)}>Start studying<ArrowRight size={16} /></a>
          <a className="btn" href={href(`/slides/${m.id}`)}><Presentation size={16} />Slide deck</a>
          <a className="btn" href={href(`/quiz?module=${m.id}`)}><Gamepad2 size={16} />Module quiz</a>
          <a className="btn" href={href(`/flashcards?module=${m.id}`)}><StickyNote size={16} />Flashcards</a>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {m.topics.map((t, i) => (
          <motion.a key={t.id} href={href(`/topic/${t.id}`)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-6 hover:border-accent group">
            <div className="flex items-start gap-4">
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-accent-soft text-accent shrink-0"><TopicIcon name={t.icon} size={20} /></span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><h2 className="font-medium text-lg group-hover:text-accent">{t.title}</h2><ArrowRight size={16} className="text-subtle group-hover:translate-x-1 transition-transform" /></div>
                <p className="text-sm text-muted mt-1">{t.summary}</p>
                <ol className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-[13px] text-muted list-decimal pl-5 marker:text-accent">
                  {t.subtopics.map((s, j) => <li key={j}>{s}</li>)}
                </ol>
                <div className="flex flex-wrap gap-1.5 mt-3">{t.visualizers.map(v => <span key={v} className="chip"><Clapperboard size={11} />{VISUALIZERS[v].label}</span>)}</div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
