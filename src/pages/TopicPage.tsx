import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clapperboard, Brain, Play, ChevronLeft, ChevronRight, Sparkles, Gamepad2, Check } from 'lucide-react'
import { MODULE_ACCENT, moduleById, neighbours, topicById } from '../data/syllabus'
import { FLASHCARDS } from '../data/flashcards'
import { QUIZZES } from '../data/quizzes'
import { Blocks } from '../components/Notes'
import { Sidebar } from '../components/Sidebar'
import { TopicIcon } from '../components/Icon'
import { useTryIt } from '../components/TryIt'
import { VISUALIZERS } from '../visualizers'
import { href, go } from '../lib/router'
import { useMastered, useVisited } from '../lib/progress'
import { fmt } from '../lib/format'

const TABS = [
  { id: 'notes', label: 'Study Notes', icon: BookOpen },
  { id: 'animate', label: 'Animate', icon: Clapperboard },
  { id: 'practice', label: 'Practice', icon: Brain },
]

export function TopicPage({ id, tab }: { id: string; tab: string }) {
  const topic = topicById(id)
  const [visited, setVisited] = useVisited()
  const { open } = useTryIt()
  useEffect(() => { if (topic && !visited.includes(topic.id)) setVisited(v => [...v, topic.id]) }, [topic?.id])
  if (!topic) return <div className="p-10 text-center">Topic not found. <a className="text-accent" href={href('/')}>Go home</a></div>
  const mod = moduleById(topic.moduleId)!
  const acc = MODULE_ACCENT[topic.moduleId]
  const { prev, next } = neighbours(topic.id)
  const setTab = (t: string) => go(`/topic/${topic.id}?tab=${t}`)

  return (
    <div className="mx-auto max-w-[1440px] px-4 lg:px-6 py-6 grid lg:grid-cols-[270px_minmax(0,1fr)] gap-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-auto scrollbar-thin pr-1"><Sidebar activeTopic={topic.id} visited={visited} /></div>
      </aside>

      <div className="min-w-0">
        {/* header */}
        <div className="relative overflow-hidden rounded-3xl border border-line p-6 lg:p-8 mb-6" style={{ background: 'var(--surface)' }}>
          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-medium text-subtle mb-3">
              <a href={href(`/module/${mod.id}`)} className="hover:text-accent">Module {mod.id} · {mod.title}</a>
            </div>
            <div className="flex items-start gap-4">
              <span className="grid place-items-center w-12 h-12 rounded-2xl bg-accent-soft text-accent shrink-0"><TopicIcon name={topic.icon} size={22} /></span>
              <div className="min-w-0">
                <h1 className="text-2xl lg:text-3xl font-medium">{topic.title}</h1>
                <p className="text-muted mt-2 max-w-3xl">{topic.summary}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-5">
              {topic.subtopics.map((s, i) => <span key={i} className="chip chip-muted max-w-full"><span className="truncate">{s.length > 80 ? s.slice(0, 78) + '…' : s}</span></span>)}
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="sticky top-16 z-20 -mx-1 px-1 py-2 bg-bg/85 backdrop-blur-xl mb-4 flex items-center gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`tab relative ${tab === t.id ? 'text-accent' : ''}`}>
              {tab === t.id && <motion.span layoutId="topic-tab" className="absolute inset-0 rounded-[10px] bg-accent-soft" />}
              <t.icon size={16} className="relative" /><span className="relative">{t.label}</span>
              {t.id === 'animate' && <span className="relative chip !py-0 !px-1.5 !text-xs">{topic.visualizers.length}</span>}
            </button>
          ))}
          <button className="btn btn-primary btn-sm ml-auto" onClick={() => open(topic.starterCode, `${topic.title} · starter code`)}><Play size={14} fill="currentColor" />Try it Yourself</button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            {tab === 'animate' ? (
              <div className="flex flex-col gap-6">{topic.visualizers.map(v => { const V = VISUALIZERS[v].C; return <V key={v} /> })}</div>
            ) : tab === 'practice' ? (
              <Practice topicId={topic.id} />
            ) : (
              <div className="grid xl:grid-cols-[minmax(0,1fr)_220px] gap-8">
                <div className="min-w-0">
                  <div className="card p-5 mb-8" style={{ background: 'var(--surface)' }}>
                    <div className="flex items-center gap-2 font-medium mb-3"><Sparkles size={16} className="text-accent" />Key takeaways</div>
                    <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2">
                      {topic.takeaways.map((t, i) => <li key={i} className="flex gap-2 text-sm text-muted"><Check size={15} className="text-good shrink-0 mt-0.5" />{fmt(t)}</li>)}
                    </ul>
                  </div>
                  {topic.sections.map((s, i) => (
                    <section key={s.id} id={`sec-${s.id}`} className="scroll-mt-32 mb-12">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="font-mono text-xs font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
                        <h2 className={`font-medium ${s.title.length > 90 ? 'text-base leading-snug' : 'text-xl'}`}>{s.title}</h2>
                      </div>
                      <Blocks blocks={s.blocks} />
                    </section>
                  ))}
                  <div className="card-soft p-5 flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[220px]"><div className="font-medium">Ready to see it move?</div><div className="text-sm text-muted">Interactive animations, then test yourself.</div></div>
                    <button className="btn btn-primary" onClick={() => setTab('animate')}><Clapperboard size={16} />Open animations</button>
                    <button className="btn" onClick={() => setTab('practice')}><Brain size={16} />Practice</button>
                  </div>
                </div>
                <aside className="hidden xl:block">
                  <div className="sticky top-36">
                    <div className="label mb-2">On this page</div>
                    <nav className="flex flex-col border-l border-line">
                      {topic.sections.map(s => <a key={s.id} href={`#/topic/${topic.id}`} onClick={e => { e.preventDefault(); document.getElementById(`sec-${s.id}`)?.scrollIntoView({ behavior: 'smooth' }) }} className="text-[13px] text-muted hover:text-accent pl-3 py-1 -ml-px border-l border-transparent hover:border-accent leading-snug">{s.title.length > 60 ? s.title.slice(0, 58) + '…' : s.title}</a>)}
                    </nav>
                  </div>
                </aside>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* prev / next */}
        <div className="grid sm:grid-cols-2 gap-3 mt-12">
          {prev ? <a href={href(`/topic/${prev.id}`)} className="card p-4 hover:border-accent group"><div className="text-xs text-subtle flex items-center gap-1"><ChevronLeft size={14} />Previous</div><div className="font-medium group-hover:text-accent">{prev.title}</div></a> : <span />}
          {next && <a href={href(`/topic/${next.id}`)} className="card p-4 hover:border-accent text-right group"><div className="text-xs text-subtle flex items-center gap-1 justify-end">Next<ChevronRight size={14} /></div><div className="font-medium group-hover:text-accent">{next.title}</div></a>}
        </div>
      </div>
    </div>
  )
}

function Practice({ topicId }: { topicId: string }) {
  const cards = FLASHCARDS.filter(c => c.topicId === topicId)
  const qs = QUIZZES.filter(q => q.topicId === topicId)
  const [mastered, setMastered] = useMastered()
  const [flipped, setFlipped] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-6">
      <div className="card p-5 flex flex-wrap items-center gap-4">
        <span className="grid place-items-center w-11 h-11 rounded-xl bg-accent-soft text-accent"><Gamepad2 size={20} /></span>
        <div className="flex-1 min-w-[200px]"><div className="font-medium">{qs.length}-question quiz on this topic</div><div className="text-sm text-muted">MCQs + predict-the-output, instant explanations, streaks.</div></div>
        <a className="btn btn-primary" href={href(`/quiz?topic=${topicId}`)}>Start quiz</a>
        <a className="btn" href={href(`/flashcards?topic=${topicId}`)}>Full flashcard deck</a>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><div className="label">Quick flashcards · tap to flip</div><div className="text-xs text-subtle">{cards.filter(c => mastered.includes(c.id)).length}/{cards.length} mastered</div></div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {cards.map(c => {
            const f = flipped === c.id; const m = mastered.includes(c.id)
            return (
              <div key={c.id} className="flip-scene h-44 cursor-pointer" onClick={() => setFlipped(f ? null : c.id)}>
                <div className={`flip-card relative w-full h-full ${f ? 'flipped' : ''}`}>
                  <div className="flip-face card p-4 flex flex-col"><div className="text-[11px] font-semibold text-subtle mb-2">QUESTION {m && <span className="chip ml-1" style={{ color: 'var(--good)', background: 'var(--good-soft)' }}>mastered</span>}</div><div className="font-medium leading-snug">{c.front}</div><div className="mt-auto text-xs text-subtle">tap to reveal</div></div>
                  <div className="flip-face flip-back rounded-2xl p-4 flex flex-col bg-accent text-accent-fg overflow-auto"><div className="text-[11px] font-semibold opacity-70 mb-2">ANSWER</div><div className="text-sm leading-snug">{c.back}</div>
                    <button className="mt-auto self-start text-xs font-medium underline underline-offset-2" onClick={e => { e.stopPropagation(); setMastered(ms => m ? ms.filter(x => x !== c.id) : [...ms, c.id]) }}>{m ? 'Unmark mastered' : 'Mark as mastered ✓'}</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
