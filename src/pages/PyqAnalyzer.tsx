import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, FileJson, WandSparkles, Trash2, Database, ChevronDown, Info, Plus, Repeat, Dumbbell, Eye, EyeOff, CircleCheck, Circle } from 'lucide-react'
import { DEMO_PAPER, PYQ_PAPERS, PYQ_TEMPLATE, analyse, countPatterns, mapQuestion } from '../data/pyq'
import { PRACTICE } from '../data/practice'
import { CodeBlock } from '../components/CodeBlock'
import type { PyqPaper, PyqQuestion } from '../data/types'
import { MODULES, topicById } from '../data/syllabus'
import { usePersistent } from '../lib/storage'
import { href } from '../lib/router'

export function PyqAnalyzer() {
  const [imported, setImported] = usePersistent<PyqPaper[]>('atp-pyq', [])
  const [demo, setDemo] = useState(PYQ_PAPERS.length === 0 && imported.length === 0)
  const [paste, setPaste] = useState('')
  const [err, setErr] = useState('')
  const [probe, setProbe] = useState('Write a recursive function to find the nth Fibonacci number and explain the call stack.')
  const [openTopic, setOpenTopic] = useState<string | null>(null)
  const file = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<'analysis' | 'practice'>('analysis')

  const papers = useMemo(() => [...PYQ_PAPERS, ...imported, ...(demo ? [DEMO_PAPER] : [])], [imported, demo])
  const { stats, unmapped, totalQuestions } = useMemo(() => analyse(papers), [papers])
  const maxCount = Math.max(1, ...stats.map(s => s.count))
  const ranked = [...stats].sort((a, b) => b.count - a.count || b.marks - a.marks)
  const patterns = useMemo(() => countPatterns(papers).filter(p => p.count > 0), [papers])
  const hits = useMemo(() => mapQuestion({ text: probe }).slice(0, 4), [probe])

  const ingest = (raw: string) => {
    try {
      const data = JSON.parse(raw)
      const arr: PyqPaper[] = Array.isArray(data) ? data : [data]
      for (const p of arr) { if (!p.exam || !Array.isArray(p.questions)) throw new Error('Each paper needs "exam" and a "questions" array') }
      arr.forEach(p => p.questions.forEach((q: PyqQuestion, i: number) => { q.id ||= `${p.exam}-${i}`; q.exam ||= p.exam }))
      setImported(cur => [...cur.filter(c => !arr.some(a => a.exam === c.exam)), ...arr]); setErr(''); setPaste(''); setDemo(false)
    } catch (e) { setErr((e as Error).message) }
  }
  const download = () => {
    const blob = new Blob([JSON.stringify(PYQ_TEMPLATE, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ktu-pyq-template.json'; a.click()
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8">
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <div className="label">Previous Year Questions</div>
          <h1 className="text-3xl font-medium">PYQ Analyzer</h1>
          <p className="text-muted mt-1 max-w-2xl">Real UCEST105 papers mapped to syllabus topics — see which topics and question patterns repeat most, then practise with a fresh set of questions written in the same style.</p>
        </div>
        <span className="chip ml-auto"><Database size={12} />{papers.length} paper(s) · {totalQuestions} questions</span>
      </div>

      <div className="flex gap-2 mb-5">
        <button className={`tab ${tab === 'analysis' ? 'tab-active' : ''}`} onClick={() => setTab('analysis')}><Database size={14} />Analysis</button>
        <button className={`tab ${tab === 'practice' ? 'tab-active' : ''}`} onClick={() => setTab('practice')}><Dumbbell size={14} />Practice set <span className="chip chip-muted ml-1">{PRACTICE.length}</span></button>
      </div>

      {tab === 'practice' ? <Practice /> : (<>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 mb-8">
        {/* heatmap */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4"><div className="font-medium">Topic heatmap</div><div className="text-xs text-subtle">darker = asked more often</div></div>
          <div className="flex flex-col gap-3">
            {MODULES.map(m => (
              <div key={m.id} className="flex gap-3 items-stretch">
                <div className="w-10 shrink-0 grid place-items-center rounded-lg bg-surface-2 text-xs font-semibold">M{m.id}</div>
                <div className="flex-1 min-w-0 grid gap-2" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(92px, 1fr))` }}>
                  {m.topics.map(t => {
                    const s = stats.find(x => x.topicId === t.id)!
                    const a = s.count / maxCount
                    return (
                      <button key={t.id} onClick={() => setOpenTopic(openTopic === t.id ? null : t.id)} className="rounded-xl p-3 text-left border transition-transform hover:-translate-y-0.5"
                        style={{ background: `color-mix(in srgb, var(--accent) ${Math.round(8 + a * 72)}%, var(--elevated))`, borderColor: openTopic === t.id ? 'var(--accent)' : 'var(--line)', color: a > 0.55 ? '#fff' : 'var(--fg)' }}>
                        <div className="text-[11px] font-medium leading-tight line-clamp-2">{t.short}</div>
                        <div className="text-xl font-semibold mt-1">{s.count}</div>
                        <div className="text-xs opacity-80">{s.marks.toFixed(0)} marks</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ranking */}
        <div className="card p-5">
          <div className="font-medium mb-4">Most repeated topics</div>
          <div className="flex flex-col gap-3">
            {ranked.slice(0, 8).map((s, i) => {
              const t = topicById(s.topicId)!
              return (
                <button key={s.topicId} onClick={() => setOpenTopic(s.topicId)} className="text-left">
                  <div className="flex justify-between text-sm"><span className="truncate"><span className="text-subtle font-mono mr-2">{i + 1}</span>{t.title}</span><span className="font-medium tabular-nums">{s.count}</span></div>
                  <div className="h-2 rounded-full bg-surface-2 mt-1 overflow-hidden"><motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${(s.count / maxCount) * 100}%` }} transition={{ delay: i * 0.04 }} /></div>
                </button>
              )
            })}
            {totalQuestions === 0 && <div className="text-sm text-subtle">No questions yet — import a paper or enable the demo.</div>}
          </div>
        </div>
      </div>

      {openTopic && (() => {
        const s = stats.find(x => x.topicId === openTopic)!; const t = topicById(openTopic)!
        return (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5 mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-3"><div className="font-medium">{t.title}</div><span className="chip">{s.count} question(s)</span><span className="chip chip-muted">{s.exams.size} exam(s)</span><a className="btn btn-sm ml-auto" href={href(`/topic/${t.id}`)}>Study this topic</a><button className="btn btn-sm btn-ghost" onClick={() => setOpenTopic(null)}>Close</button></div>
            <div className="flex flex-col divide-y divide-[var(--line)]">
              {s.questions.map(q => <div key={q.id + q.exam} className="py-3 flex gap-3 text-sm"><span className="chip chip-muted shrink-0 h-6">{q.exam} · {q.part === '?' ? '' : q.part}{q.number}</span><span className="flex-1">{q.text}</span><span className="text-subtle shrink-0">{q.est ? '≈' : ''}{q.marks}m</span></div>)}
              {!s.questions.length && <div className="text-sm text-subtle py-2">Not asked in the loaded papers yet.</div>}
            </div>
          </motion.div>
        )
      })()}

      <div className="card p-5 mb-8">
        <div className="flex items-center gap-2 font-medium mb-1"><Repeat size={16} className="text-accent" />Questions that keep coming back</div>
        <p className="text-sm text-muted mb-4">Counted from the loaded papers — master these patterns first.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {patterns.map(p => (
            <a key={p.id} href={href(`/topic/${p.topicId}`)} className="rounded-xl border border-line p-3 hover:border-accent transition-colors">
              <div className="flex items-start gap-2"><span className="text-sm font-medium flex-1">{p.label}</span><span className="chip shrink-0">{p.papers} paper{p.papers > 1 ? 's' : ''}</span></div>
              <div className="text-xs text-muted mt-1">{p.tip}</div>
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* mapper probe */}
        <div className="card p-5">
          <div className="flex items-center gap-2 font-medium mb-1"><WandSparkles size={16} className="text-accent" />Live topic mapper</div>
          <p className="text-sm text-muted mb-3">Type or paste any exam question to see which syllabus topics it maps to.</p>
          <textarea className="w-full rounded-xl border border-line bg-surface p-3 text-sm outline-none focus:border-accent" rows={3} value={probe} onChange={e => setProbe(e.target.value)} />
          <div className="flex flex-col gap-2 mt-3">
            {hits.map((h, i) => (
              <div key={h.topic.id} className="flex items-center gap-3">
                <span className={`chip ${i ? 'chip-muted' : ''}`}>M{h.topic.moduleId}</span>
                <a href={href(`/topic/${h.topic.id}`)} className="text-sm font-medium flex-1 hover:text-accent">{h.topic.title}</a>
                <div className="w-24 h-1.5 rounded-full bg-surface-2"><div className="h-full rounded-full bg-accent" style={{ width: `${(h.score / hits[0].score) * 100}%` }} /></div>
              </div>
            ))}
            {!hits.length && <div className="text-sm text-subtle">No confident match — add the module number when importing.</div>}
          </div>
        </div>
        {/* import */}
        <div className="card p-5">
          <div className="flex items-center gap-2 font-medium mb-1"><FileJson size={16} className="text-accent" />Import question papers</div>
          <p className="text-sm text-muted mb-3">JSON: one paper or an array of papers. Optional <code className="font-mono text-xs">topicIds</code> override the automatic mapping.</p>
          <textarea className="w-full rounded-xl border border-line bg-surface p-3 font-mono text-xs outline-none focus:border-accent" rows={5} placeholder='[{"exam":"Dec 2024","year":2024,"questions":[{"part":"A","number":"1","marks":3,"module":1,"text":"…"}]}]' value={paste} onChange={e => setPaste(e.target.value)} />
          {err && <div className="text-sm mt-2" style={{ color: 'var(--bad)' }}>{err}</div>}
          <div className="flex flex-wrap gap-2 mt-3">
            <button className="btn btn-primary btn-sm" onClick={() => ingest(paste)} disabled={!paste.trim()}><Plus size={14} />Import JSON</button>
            <button className="btn btn-sm" onClick={() => file.current?.click()}><Upload size={14} />Upload .json</button>
            <input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) ingest(await f.text()); e.target.value = '' }} />
            <button className="btn btn-sm" onClick={download}><Download size={14} />Template</button>
            <button className={`btn btn-sm ${demo ? 'tab-active' : ''}`} onClick={() => setDemo(d => !d)}>Demo paper {demo ? 'on' : 'off'}</button>
          </div>
          {imported.length > 0 && (
            <div className="mt-4 flex flex-col gap-1.5">
              <div className="label">Imported</div>
              {imported.map(p => <div key={p.exam} className="flex items-center gap-2 text-sm"><span className="flex-1">{p.exam}</span><span className="text-subtle">{p.questions.length} q</span><button className="btn btn-sm btn-ghost btn-icon" onClick={() => setImported(cur => cur.filter(c => c.exam !== p.exam))} aria-label="Remove"><Trash2 size={13} /></button></div>)}
            </div>
          )}
        </div>
      </div>

      {unmapped.length > 0 && (
        <details className="card p-5 mt-5">
          <summary className="font-medium cursor-pointer flex items-center gap-2"><ChevronDown size={15} />{unmapped.length} question(s) could not be mapped</summary>
          <ul className="mt-3 text-sm text-muted list-disc pl-5">{unmapped.map(q => <li key={q.id}>{q.text} — add <code className="font-mono text-xs">module</code> or <code className="font-mono text-xs">topicIds</code></li>)}</ul>
        </details>
      )}
      </>)}
    </div>
  )
}

function Practice() {
  const [done, setDone] = usePersistent<string[]>('atp-practice-done', [])
  const [mod, setMod] = useState(0)
  const [part, setPart] = useState<'all' | 'A' | 'B'>('all')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const list = PRACTICE.filter(q => (!mod || q.module === mod) && (part === 'all' || q.part === part))
  const toggle = (id: string) => setDone(d => (d.includes(id) ? d.filter(x => x !== id) : [...d, id]))
  return (
    <div>
      <div className="rounded-2xl border p-4 mb-5 flex gap-3 text-sm" style={{ background: 'var(--accent-soft)', borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)' }}>
        <Info size={18} className="text-accent shrink-0 mt-0.5" />
        <div><b>New questions, old patterns.</b> These are not past-paper questions — each one is modelled on a pattern that repeats in the real papers, with a worked answer. Every answer was checked by running it in Python. Try the question first, then reveal the answer.</div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {[0, 1, 2, 3, 4].map(m => <button key={m} className={`btn btn-sm ${mod === m ? 'tab-active' : ''}`} onClick={() => setMod(m)}>{m ? `Module ${m}` : 'All modules'}</button>)}
        <span className="w-px h-5 bg-[var(--line)] mx-1" />
        {(['all', 'A', 'B'] as const).map(x => <button key={x} className={`btn btn-sm ${part === x ? 'tab-active' : ''}`} onClick={() => setPart(x)}>{x === 'all' ? 'Part A + B' : x === 'A' ? 'Part A (3 marks)' : 'Part B (5–6 marks)'}</button>)}
        <span className="chip ml-auto">{done.filter(id => PRACTICE.some(q => q.id === id)).length}/{PRACTICE.length} done</span>
      </div>
      <div className="flex flex-col gap-3">
        {list.map((q, i) => {
          const t = topicById(q.topicId)
          const isOpen = !!open[q.id]
          const isDone = done.includes(q.id)
          return (
            <div key={q.id} className="card p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="chip">M{q.module}</span>
                <span className="chip chip-muted">{t?.short}</span>
                <span className="chip chip-muted">Part {q.part} · {q.marks} marks</span>
                <span className="text-xs text-subtle ml-auto">{i + 1}</span>
              </div>
              <p className="font-medium">{q.text}</p>
              <div className="text-xs text-subtle mt-1">Pattern: {q.pattern}</div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-sm" onClick={() => setOpen(o => ({ ...o, [q.id]: !o[q.id] }))}>{isOpen ? <EyeOff size={14} /> : <Eye size={14} />}{isOpen ? 'Hide answer' : 'Show answer'}</button>
                <button className={`btn btn-sm ${isDone ? 'tab-active' : ''}`} onClick={() => toggle(q.id)}>{isDone ? <CircleCheck size={14} /> : <Circle size={14} />}{isDone ? 'Done' : 'Mark done'}</button>
                <a className="btn btn-sm btn-ghost ml-auto" href={href(`/topic/${q.topicId}`)}>Study topic</a>
              </div>
              {isOpen && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 border-t border-line pt-4">
                  <div className="label mb-2">Model answer</div>
                  <ul className="flex flex-col gap-1.5 text-sm">
                    {q.answer.map((a, k) => a.includes('\n')
                      ? <li key={k}><pre className="font-mono text-xs rounded-lg bg-surface-2 p-3 overflow-x-auto">{a}</pre></li>
                      : <li key={k} className="flex gap-2"><span className="text-accent">•</span><span>{a}</span></li>)}
                  </ul>
                  {q.code && <CodeBlock code={q.code} title="Verified program" />}
                </motion.div>
              )}
            </div>
          )
        })}
        {!list.length && <div className="text-sm text-subtle">No questions match this filter.</div>}
      </div>
    </div>
  )
}
