import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2, Sun, Moon } from 'lucide-react'
import { MODULES, MODULE_ACCENT, moduleById } from '../data/syllabus'
import type { Block, Module } from '../data/types'
import { Blocks } from '../components/Notes'
import { TopicIcon } from '../components/Icon'
import { href, go } from '../lib/router'
import { fmt } from '../lib/format'
import { useTheme } from '../lib/theme'

interface Slide { key: string; kicker: string; title: string; body: ReactNode }

function pickVisual(blocks: Block[][]): Block | undefined {
  const all = blocks.flat()
  return all.find(b => b.type === 'flow') ?? all.find(b => b.type === 'compare') ?? all.find(b => b.type === 'table')
}

function buildSlides(m: Module): Slide[] {
  const acc = MODULE_ACCENT[m.id]
  const slides: Slide[] = [{
    key: 'title', kicker: `Module ${m.id}`, title: m.title,
    body: (
      <div>
        <p className="text-xl text-muted mb-10">{m.tagline}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {m.topics.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }} className="card p-4 flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent-soft text-accent"><TopicIcon name={t.icon} size={18} /></span>
              <span className="font-medium text-lg">{t.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  }]
  for (const t of m.topics) {
    slides.push({
      key: t.id + '-a', kicker: `Module ${m.id} · Topic`, title: t.title,
      body: (
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10">
          <div>
            <p className="text-xl text-muted leading-relaxed">{t.summary}</p>
            <div className="label mt-8 mb-3">Syllabus subtopics</div>
            <div className="flex flex-wrap gap-2">{t.subtopics.map((s, i) => <span key={i} className="chip text-sm !py-1">{s.length > 70 ? s.slice(0, 68) + '…' : s}</span>)}</div>
          </div>
          <div className="card p-6" style={{ background: 'var(--surface)' }}>
            <div className="label mb-4">Key ideas</div>
            <ul className="flex flex-col gap-3">
              {t.takeaways.map((k, i) => (
                <motion.li key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="flex gap-3 text-[17px] leading-snug">
                  <span className="grid place-items-center w-6 h-6 rounded-full bg-accent text-accent-fg text-xs font-semibold shrink-0 mt-0.5">{i + 1}</span><span>{fmt(k)}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      ),
    })
    const vis = pickVisual(t.sections.map(s => s.blocks))
    if (vis) slides.push({ key: t.id + '-b', kicker: `${t.title} · at a glance`, title: (vis.type === 'flow' && vis.title) || (vis.type === 'table' && vis.caption) || t.short + ' — visual summary', body: <div className="text-[1.05rem]"><Blocks blocks={[vis]} /></div> })
  }
  slides.push({
    key: 'end', kicker: 'Module recap', title: 'You’ve covered Module ' + m.id,
    body: (
      <div className="flex flex-col gap-6">
        <p className="text-xl text-muted">Lock it in with active recall — then try the code yourself.</p>
        <div className="flex flex-wrap gap-3">
          <a className="btn btn-primary h-11 px-5" href={href(`/quiz?module=${m.id}`)}>Take the Module {m.id} quiz</a>
          <a className="btn h-11 px-5" href={href(`/flashcards?module=${m.id}`)}>Flashcards</a>
          <a className="btn h-11 px-5" href={href(`/topic/${m.topics[0].id}?tab=animate`)}>Animations</a>
          {m.id < 4 && <a className="btn h-11 px-5" href={href(`/slides/${m.id + 1}`)}>Next: Module {m.id + 1} slides →</a>}
        </div>
      </div>
    ),
  })
  return slides
}

export function Slides({ moduleId }: { moduleId: number }) {
  const m = moduleById(moduleId) ?? MODULES[0]
  const slides = useMemo(() => buildSlides(m), [m])
  const [[i, dir], setI] = useState<[number, number]>([0, 1])
  const [fs, setFs] = useState(false)
  const { theme, toggle } = useTheme()
  useEffect(() => setI([0, 1]), [m.id])
  const nav = useCallback((d: number) => setI(([x]) => [Math.max(0, Math.min(slides.length - 1, x + d)), d]), [slides.length])
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); nav(1) }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); nav(-1) }
      else if (e.key === 'Home') setI([0, -1])
      else if (e.key === 'End') setI([slides.length - 1, 1])
      else if (e.key.toLowerCase() === 'f') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.() }
      else if (e.key === 'Escape' && !document.fullscreenElement) go(`/module/${m.id}`)
    }
    const onFs = () => setFs(!!document.fullscreenElement)
    window.addEventListener('keydown', on); document.addEventListener('fullscreenchange', onFs)
    return () => { window.removeEventListener('keydown', on); document.removeEventListener('fullscreenchange', onFs) }
  }, [nav, m.id, slides.length])
  const s = slides[i]
  return (
    <div className="h-[100dvh] flex flex-col bg-bg overflow-hidden safe-top">
      <div className="h-1 bg-surface-2"><motion.div className="h-full bg-accent" animate={{ width: `${((i + 1) / slides.length) * 100}%` }} /></div>
      <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 h-14 border-b border-line">
        <a href={href(`/module/${m.id}`)} className="btn btn-ghost btn-sm"><X size={15} />Exit</a>
        <div className="flex gap-0.5 sm:gap-1 ml-1 sm:ml-2">{MODULES.map(x => <a key={x.id} href={href(`/slides/${x.id}`)} className={`tab !py-1 !text-xs ${x.id === m.id ? 'tab-active' : ''}`}>M{x.id}</a>)}</div>
        <div className="ml-auto flex items-center gap-2 text-xs text-subtle">
          <span className="hidden sm:inline"><span className="kbd">←</span> <span className="kbd">→</span> navigate · <span className="kbd">F</span> fullscreen</span>
          <button className="btn btn-sm btn-icon" onClick={toggle} aria-label="Theme">{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</button>
          <button className="btn btn-sm btn-icon hidden sm:inline-flex" onClick={() => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())} aria-label="Fullscreen">{fs ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden" onTouchStart={e => { (e.currentTarget as any)._x = e.touches[0].clientX; (e.currentTarget as any)._y = e.touches[0].clientY }} onTouchEnd={e => { const el = e.currentTarget as any; const dx = e.changedTouches[0].clientX - el._x, dy = e.changedTouches[0].clientY - el._y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) nav(dx < 0 ? 1 : -1) }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={s.key} custom={dir} initial={{ opacity: 0, x: dir * 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -60 }} transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-0 overflow-auto scrollbar-thin">
            <div className="mx-auto max-w-[1180px] px-8 lg:px-16 py-12 lg:py-16 min-h-full flex flex-col justify-center">
              <div className="label mb-3 text-accent">{s.kicker}</div>
              <h1 className="text-4xl lg:text-5xl font-medium tracking-tight mb-8 leading-tight">{s.title}</h1>
              {s.body}
            </div>
          </motion.div>
        </AnimatePresence>
        <button onClick={() => nav(-1)} disabled={i === 0} className="absolute left-3 top-1/2 -translate-y-1/2 btn btn-icon rounded-full h-11 w-11 disabled:opacity-0" aria-label="Previous slide"><ChevronLeft /></button>
        <button onClick={() => nav(1)} disabled={i === slides.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-icon rounded-full h-11 w-11 disabled:opacity-0" aria-label="Next slide"><ChevronRight /></button>
      </div>
      <div className="h-12 border-t border-line flex items-center justify-center gap-1.5">
        {slides.map((x, k) => <button key={x.key} onClick={() => setI([k, k > i ? 1 : -1])} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-6 bg-accent' : 'w-1.5 bg-line hover:bg-subtle'}`} aria-label={`Slide ${k + 1}`} />)}
        <span className="ml-3 text-xs text-subtle font-mono">{i + 1} / {slides.length}</span>
      </div>
    </div>
  )
}
