import { motion } from 'framer-motion'
import { ArrowRight, Presentation, Network, StickyNote, Gamepad2, Terminal, TrendingUp, Clapperboard, GraduationCap, Clock, Award } from 'lucide-react'
import { COURSE, MODULES, MODULE_ACCENT, ALL_TOPICS } from '../data/syllabus'
import { FLASHCARDS } from '../data/flashcards'
import { QUIZZES } from '../data/quizzes'
import { VISUALIZERS } from '../visualizers'
import { href } from '../lib/router'
import { useMastered, useVisited } from '../lib/progress'
import { TopicIcon } from '../components/Icon'

const FEATURES = [
  { to: '/slides/1', icon: Presentation, title: 'Slide decks', text: 'Distraction-free summaries per module. ← → to navigate.' },
  { to: '/mindmap', icon: Network, title: 'Mind map', text: 'See how every module branches into topics and strategies.' },
  { to: '/flashcards', icon: StickyNote, title: 'Flashcards', text: `${FLASHCARDS.length} flip cards with “mastered” tracking.` },
  { to: '/quiz', icon: Gamepad2, title: 'Quizzes', text: `${QUIZZES.length} MCQ & output-prediction questions with streaks.` },
  { to: '/playground', icon: Terminal, title: 'Python playground', text: 'Real Python 3 in your browser — no install.' },
  { to: '/pyq', icon: TrendingUp, title: 'PYQ analyzer', text: 'Map KTU previous-year questions to syllabus topics.' },
]

export function Home() {
  const [mastered] = useMastered()
  const [visited] = useVisited()
  const lastVisited = ALL_TOPICS.find(t => t.id === visited[visited.length - 1])
  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
      {/* hero */}
      <section className="relative pt-14 pb-12 lg:pt-20 lg:pb-16">
        <div className="absolute inset-0 -z-10 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -z-10 left-1/2 -translate-x-1/2 top-0 w-[700px] h-[300px] rounded-full blur-3xl opacity-25" style={{ background: 'radial-gradient(var(--accent), transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="chip">{COURSE.code}</span><span className="chip chip-muted">{COURSE.scheme}</span><span className="chip chip-muted">{COURSE.credits} credits</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Algorithmic Thinking<br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, var(--accent-strong), var(--accent))' }}>with Python</span>
          </h1>
          <p className="text-lg text-muted mt-5 max-w-2xl">Your interactive study studio for KTU UCEST105 — clean notes, step-by-step algorithm animations, slides, mind maps, flashcards, quizzes and a real Python compiler, all built from the official syllabus.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href={href(lastVisited ? `/topic/${lastVisited.id}` : '/topic/m1-strategies')} className="btn btn-primary h-11 px-5 text-[15px]">{lastVisited ? 'Continue studying' : 'Start Module 1'}<ArrowRight size={17} /></a>
            <a href={href('/playground')} className="btn h-11 px-5 text-[15px]"><Terminal size={17} />Open playground</a>
          </div>
          {lastVisited && <div className="text-sm text-subtle mt-3">Last opened: <a className="text-accent" href={href(`/topic/${lastVisited.id}`)}>{lastVisited.title}</a></div>}
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-12">
          {[['4', 'Modules'], [String(ALL_TOPICS.length), 'Topics'], [String(Object.keys(VISUALIZERS).length), 'Animations'], [String(FLASHCARDS.length), 'Flashcards'], [String(QUIZZES.length), 'Quiz questions']].map(([n, l], i) => (
            <motion.div key={l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="card-soft px-4 py-3">
              <div className="text-2xl font-extrabold tracking-tight">{n}</div><div className="text-xs text-subtle font-semibold">{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* modules */}
      <section className="pb-14">
        <div className="flex items-end justify-between mb-5">
          <div><div className="label mb-1">Module explorer</div><h2 className="text-2xl font-bold tracking-tight">Pick a module, open a topic</h2></div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {MODULES.map((m, i) => {
            const acc = MODULE_ACCENT[m.id]
            const ids = new Set(m.topics.map(t => t.id))
            const deck = FLASHCARDS.filter(c => ids.has(c.topicId))
            const pct = Math.round((deck.filter(c => mastered.includes(c.id)).length / Math.max(1, deck.length)) * 100)
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="card p-6 relative overflow-hidden group hover:border-accent transition-colors">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-2xl opacity-20 group-hover:opacity-35 transition-opacity" style={{ background: acc.to }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="grid place-items-center w-11 h-11 rounded-xl text-white font-extrabold text-lg" style={{ background: `linear-gradient(135deg, ${acc.from}, ${acc.to})` }}>{m.id}</span>
                    <div className="min-w-0"><div className="label">Module {m.id}</div><a href={href(`/module/${m.id}`)} className="font-bold text-lg leading-tight hover:text-accent">{m.title}</a></div>
                  </div>
                  <p className="text-sm text-muted mb-4">{m.tagline}</p>
                  <div className="flex flex-col gap-1.5">
                    {m.topics.map(t => (
                      <a key={t.id} href={href(`/topic/${t.id}`)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface border border-transparent hover:border-line">
                        <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent-soft text-accent shrink-0"><TopicIcon name={t.icon} size={16} /></span>
                        <span className="flex-1 min-w-0"><span className="block text-sm font-semibold truncate">{t.title}</span><span className="block text-xs text-subtle truncate">{t.subtopics.length} subtopics · {t.visualizers.map(v => VISUALIZERS[v].label).join(', ')}</span></span>
                        {visited.includes(t.id) && <span className="w-1.5 h-1.5 rounded-full bg-good" />}
                        <ArrowRight size={15} className="text-subtle" />
                      </a>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden"><div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} /></div>
                    <span className="text-xs text-subtle">{pct}% flashcards mastered</span>
                    <a href={href(`/slides/${m.id}`)} className="btn btn-sm"><Presentation size={14} />Slides</a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* features */}
      <section className="pb-14">
        <div className="label mb-1">Study modes</div>
        <h2 className="text-2xl font-bold tracking-tight mb-5">Learn it five different ways</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <a key={f.to} href={href(f.to)} className="card p-5 hover:border-accent hover:-translate-y-0.5 transition-all group">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent-soft text-accent mb-3 group-hover:scale-110 transition-transform"><f.icon size={19} /></span>
              <div className="font-semibold">{f.title}</div><div className="text-sm text-muted mt-1">{f.text}</div>
            </a>
          ))}
          <a href={href('/topic/m1-strategies?tab=animate')} className="card p-5 hover:border-accent hover:-translate-y-0.5 transition-all group sm:col-span-2 lg:col-span-3 flex flex-wrap items-center gap-4" style={{ background: 'var(--surface)' }}>
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent text-accent-fg"><Clapperboard size={19} /></span>
            <div className="flex-1 min-w-[220px]"><div className="font-semibold">{Object.keys(VISUALIZERS).length} interactive algorithm animations</div><div className="text-sm text-muted">Play, pause, step forward/back and change speed: {Object.values(VISUALIZERS).slice(0, 9).map(v => v.label).join(' · ')} …</div></div>
            <ArrowRight className="text-accent" />
          </a>
        </div>
      </section>

      {/* exam */}
      <section className="pb-16 grid lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 font-semibold mb-4"><GraduationCap size={18} className="text-accent" />End semester exam · {COURSE.ese} marks · <Clock size={15} className="text-subtle" /> {COURSE.examHours}</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card-soft p-4"><div className="label mb-1">Part A · 24 marks</div><div className="text-sm text-muted">2 questions from each module → <b className="text-fg">8 × 3 marks</b>. Answer all.</div></div>
            <div className="card-soft p-4"><div className="label mb-1">Part B · 36 marks</div><div className="text-sm text-muted">2 questions per module, answer 1 → <b className="text-fg">4 × 9 marks</b>. Up to 3 sub-divisions each.</div></div>
          </div>
          <div className="label mt-6 mb-2">Course outcomes</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {COURSE.outcomes.map(c => <div key={c.co} className="flex gap-3 text-sm"><span className="chip shrink-0 h-6">{c.co}</span><span className="text-muted">{c.text} <span className="text-subtle">({c.kl})</span></span></div>)}
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2 font-semibold mb-4"><Award size={18} className="text-accent" />Internal evaluation · {COURSE.cie} marks</div>
          <div className="flex flex-col gap-3">
            {COURSE.cieSplit.map(c => (
              <div key={c.label}>
                <div className="flex justify-between text-sm"><span className="text-muted">{c.label}</span><span className="font-semibold">{c.marks}</span></div>
                <div className="h-1.5 rounded-full bg-surface-2 mt-1"><div className="h-full rounded-full bg-accent" style={{ width: `${(c.marks / 10) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
