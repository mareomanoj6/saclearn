import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Trophy, Check, X, ArrowRight, RotateCcw, Target, Zap } from 'lucide-react'
import { QUIZZES } from '../data/quizzes'
import type { QuizQuestion } from '../data/types'
import { MODULES, topicById } from '../data/syllabus'
import { highlight } from '../lib/highlight'
import { useQuizBest } from '../lib/progress'

type Scope = { kind: 'all' } | { kind: 'module'; id: number } | { kind: 'topic'; id: string }
const scopeKey = (s: Scope) => s.kind === 'all' ? 'all' : `${s.kind}:${s.id}`
const scopeLabel = (s: Scope) => s.kind === 'all' ? 'All modules' : s.kind === 'module' ? `Module ${s.id}` : topicById(s.id)?.title ?? ''
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }

export function Quiz({ initialTopic, initialModule }: { initialTopic: string | null; initialModule: string | null }) {
  const init: Scope = initialTopic ? { kind: 'topic', id: initialTopic } : initialModule ? { kind: 'module', id: Number(initialModule) } : { kind: 'all' }
  const [scope, setScope] = useState<Scope>(init)
  const [count, setCount] = useState(10)
  const [run, setRun] = useState<QuizQuestion[] | null>(null)
  const pool = useMemo(() => QUIZZES.filter(q => scope.kind === 'all' || (scope.kind === 'module' ? topicById(q.topicId)?.moduleId === scope.id : q.topicId === scope.id)), [scope])
  const start = () => setRun(shuffle(pool).slice(0, Math.min(count, pool.length)).map(q => {
    const idx = shuffle(q.options.map((_, i) => i))
    return { ...q, options: idx.map(i => q.options[i]), answer: idx.indexOf(q.answer) }
  }))
  useEffect(() => { if (initialTopic || initialModule) start() }, [])

  if (run) return <Game key={run.map(q => q.id).join()} questions={run} scope={scope} onExit={() => setRun(null)} onRetry={start} />

  return (
    <div className="mx-auto max-w-[900px] px-4 lg:px-6 py-10">
      <div className="label">Gamified practice</div>
      <h1 className="text-3xl font-medium">Quiz arena</h1>
      <p className="text-muted mt-2">Multiple-choice and predict-the-output questions. Build a streak — every correct answer in a row multiplies your points.</p>
      <div className="card p-6 mt-8">
        <div className="label mb-3">1 · Choose scope</div>
        <div className="flex flex-wrap gap-2">
          <button className={`tab ${scope.kind === 'all' ? 'tab-active' : ''}`} onClick={() => setScope({ kind: 'all' })}>All modules</button>
          {MODULES.map(m => <button key={m.id} className={`tab ${scope.kind === 'module' && scope.id === m.id ? 'tab-active' : ''}`} onClick={() => setScope({ kind: 'module', id: m.id })}>Module {m.id}</button>)}
        </div>
        <select className="input mt-3 w-full sm:w-auto" value={scope.kind === 'topic' ? scope.id : ''} onChange={e => setScope(e.target.value ? { kind: 'topic', id: e.target.value } : { kind: 'all' })}>
          <option value="">…or pick a single topic</option>
          {MODULES.flatMap(m => m.topics).map(t => <option key={t.id} value={t.id}>M{t.moduleId} · {t.title}</option>)}
        </select>
        <div className="label mt-6 mb-3">2 · Number of questions</div>
        <div className="flex gap-2">{[5, 10, 20].map(n => <button key={n} className={`tab ${count === n ? 'tab-active' : ''}`} onClick={() => setCount(n)}>{n}</button>)}<button className={`tab ${count === 999 ? 'tab-active' : ''}`} onClick={() => setCount(999)}>All ({pool.length})</button></div>
        <button className="btn btn-primary h-11 px-6 mt-8" onClick={start} disabled={!pool.length}><Zap size={16} />Start · {Math.min(count, pool.length)} questions from {scopeLabel(scope)}</button>
      </div>
    </div>
  )
}

function Game({ questions, scope, onExit, onRetry }: { questions: QuizQuestion[]; scope: Scope; onExit: () => void; onRetry: () => void }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [wrong, setWrong] = useState<{ q: QuizQuestion; picked: number }[]>([])
  const [done, setDone] = useState(false)
  const [best, setBest] = useQuizBest()
  const q = questions[i]

  const choose = (k: number) => {
    if (picked !== null) return
    setPicked(k)
    if (k === q.answer) {
      const ns = streak + 1
      setStreak(ns); setBestStreak(b => Math.max(b, ns)); setCorrect(c => c + 1)
      setScore(s => s + 100 * Math.min(ns, 5))
    } else { setStreak(0); setWrong(w => [...w, { q, picked: k }]) }
  }
  const next = () => {
    if (i + 1 >= questions.length) {
      setDone(true)
      const pct = Math.round(((correct) / questions.length) * 100)
      const key = scopeKey(scope)
      setBest(b => ({ ...b, [key]: Math.max(b[key] ?? 0, pct) }))
    } else { setI(i + 1); setPicked(null) }
  }
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (done) return
      if (picked === null && /^[1-4]$/.test(e.key)) choose(Number(e.key) - 1)
      else if (picked !== null && (e.key === 'Enter' || e.key === 'ArrowRight')) next()
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  })

  if (done) {
    const pct = Math.round((correct / questions.length) * 100)
    const msg = pct === 100 ? 'Perfect score' : pct >= 80 ? 'Excellent work' : pct >= 50 ? 'Good effort — review the misses below.' : 'Keep going — revisit the notes and try again.'
    return (
      <div className="mx-auto max-w-[820px] px-4 lg:px-6 py-10">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-8 text-center relative overflow-hidden">
          {pct >= 80 && <Confetti />}
          <Trophy size={40} className="mx-auto text-warn" />
          <div className="text-5xl font-semibold tracking-tight mt-3">{pct}%</div>
          <div className="text-lg font-medium mt-1">{msg}</div>
          <div className="flex justify-center flex-wrap gap-3 mt-6">
            <span className="chip !text-sm !py-1.5 !px-3"><Target size={14} />{correct}/{questions.length} correct</span>
            <span className="chip !text-sm !py-1.5 !px-3"><Flame size={14} />best streak {bestStreak}</span>
            <span className="chip !text-sm !py-1.5 !px-3"><Zap size={14} />{score} pts</span>
            <span className="chip chip-muted !text-sm !py-1.5 !px-3">personal best ({scopeLabel(scope)}): {Math.max(best[scopeKey(scope)] ?? 0, pct)}%</span>
          </div>
          <div className="flex justify-center gap-3 mt-8"><button className="btn btn-primary" onClick={onRetry}><RotateCcw size={15} />Play again</button><button className="btn" onClick={onExit}>Change scope</button></div>
        </motion.div>
        {wrong.length > 0 && (
          <div className="mt-8">
            <div className="label mb-3">Review your misses</div>
            <div className="flex flex-col gap-3">
              {wrong.map(({ q, picked }) => (
                <div key={q.id} className="card p-5">
                  <div className="font-medium">{q.question}</div>
                  {q.code && <pre className="code-block p-3 my-2 text-[13px]">{highlight(q.code, q.code.includes('REPEAT') ? 'pseudo' : 'python')}</pre>}
                  <div className="text-sm mt-2"><span style={{ color: 'var(--bad)' }}>Your answer: {q.options[picked]}</span> · <span style={{ color: 'var(--good)' }}>Correct: {q.options[q.answer]}</span></div>
                  <div className="text-sm text-muted mt-1">{q.explain}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const isRight = picked === q.answer
  return (
    <div className="mx-auto max-w-[820px] px-4 lg:px-6 py-8">
      <div className="flex items-center gap-3 mb-4">
        <button className="btn btn-sm btn-ghost" onClick={onExit}><X size={14} />Quit</button>
        <div className="flex-1 h-2 rounded-full bg-surface-2 overflow-hidden"><motion.div className="h-full bg-accent rounded-full" animate={{ width: `${((i + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }} /></div>
        <span className="text-sm font-mono text-subtle">{i + 1}/{questions.length}</span>
      </div>
      <div className="flex gap-3 mb-5">
        <motion.div key={streak} initial={{ scale: streak ? 1.25 : 1 }} animate={{ scale: 1 }} className="card-soft px-3 py-2 flex items-center gap-2"><Flame size={18} style={{ color: streak >= 3 ? 'var(--warn)' : 'var(--subtle)' }} fill={streak >= 3 ? 'currentColor' : 'none'} /><span className="font-semibold">{streak}</span><span className="text-xs text-subtle">streak</span></motion.div>
        <div className="card-soft px-3 py-2 flex items-center gap-2"><Zap size={16} className="text-accent" /><span className="font-semibold tabular-nums">{score}</span><span className="text-xs text-subtle">pts {streak > 1 && <b className="text-accent">×{Math.min(streak + 1, 5)} next</b>}</span></div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.22 }} className="card p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-3"><span className="chip">{q.kind === 'output' ? 'Predict the output' : 'Multiple choice'}</span><span className="chip chip-muted">{topicById(q.topicId)?.short}</span></div>
          <h2 className="text-xl font-medium leading-snug">{q.question}</h2>
          {q.code && <pre className="code-block p-4 mt-4 text-[13.5px]">{highlight(q.code, q.code.includes('REPEAT') ? 'pseudo' : 'python')}</pre>}
          <div className="grid gap-3 mt-5">
            {q.options.map((o, k) => {
              const state = picked === null ? 'idle' : k === q.answer ? 'right' : k === picked ? 'wrong' : 'dim'
              return (
                <motion.button key={k} onClick={() => choose(k)} whileTap={picked === null ? { scale: 0.98 } : undefined}
                  animate={state === 'wrong' ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.35 }}
                  className={`text-left flex items-center gap-3 px-4 py-3 rounded-xl border font-medium ${q.kind === 'output' ? 'font-mono text-sm' : ''}`}
                  style={{ borderColor: state === 'right' ? 'var(--good)' : state === 'wrong' ? 'var(--bad)' : 'var(--line)', background: state === 'right' ? 'var(--good-soft)' : state === 'wrong' ? 'var(--bad-soft)' : 'var(--elevated)', opacity: state === 'dim' ? 0.55 : 1, cursor: picked === null ? 'pointer' : 'default' }}>
                  <span className="grid place-items-center w-7 h-7 rounded-lg text-xs font-semibold shrink-0 font-sans" style={{ background: state === 'right' ? 'var(--good)' : state === 'wrong' ? 'var(--bad)' : 'var(--surface-2)', color: state === 'right' || state === 'wrong' ? '#fff' : 'var(--muted)' }}>{state === 'right' ? <Check size={14} /> : state === 'wrong' ? <X size={14} /> : k + 1}</span>
                  <span className="whitespace-pre-wrap">{o}</span>
                </motion.button>
              )
            })}
          </div>
          <AnimatePresence>
            {picked !== null && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                <div className="mt-5 rounded-xl p-4 border" style={{ background: isRight ? 'var(--good-soft)' : 'var(--bad-soft)', borderColor: isRight ? 'var(--good)' : 'var(--bad)' }}>
                  <div className="font-semibold" style={{ color: isRight ? 'var(--good)' : 'var(--bad)' }}>{isRight ? (streak >= 3 ? `${streak} correct in a row` : 'Correct') : 'Not quite'}</div>
                  <div className="text-sm mt-1">{q.explain}</div>
                </div>
                <div className="flex justify-end mt-4"><button className="btn btn-primary" onClick={next}>{i + 1 >= questions.length ? 'See results' : 'Next question'}<ArrowRight size={15} /></button></div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="text-xs text-subtle mt-4">Keys: <span className="kbd">1</span>–<span className="kbd">4</span> answer · <span className="kbd">Enter</span> next</div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Confetti() {
  const bits = Array.from({ length: 40 }, (_, i) => i)
  const colors = ['#2563EB', '#38BDF8', '#22C55E', '#F59E0B', '#A78BFA']
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map(b => (
        <motion.span key={b} className="absolute w-2 h-3 rounded-sm" style={{ left: `${(b * 37) % 100}%`, top: -20, background: colors[b % 5] }}
          animate={{ y: [0, 420], rotate: [0, 360 * (b % 2 ? 1 : -1)], opacity: [1, 1, 0] }} transition={{ duration: 2 + (b % 5) * 0.3, delay: (b % 10) * 0.08, ease: 'easeIn' }} />
      ))}
    </div>
  )
}
