import { useState } from 'react'
import { FlaskConical, BookOpen, Search } from 'lucide-react'
import { Compiler } from '../compiler/Compiler'
import { LABS } from '../data/labs'
import { ALL_TOPICS } from '../data/syllabus'
import { load, save } from '../lib/storage'

const WELCOME = `# Welcome to the SAC LEARN Python Playground 🐍
# Real CPython (via WebAssembly) runs right here in your browser.
# Press Run ▶ or Ctrl + Enter. Put input() values in the Input box.

name = input("What's your name? ")
print(f"Hello, {name}! Let's think algorithmically.")

squares = [n * n for n in range(1, 11)]
print("Squares:", squares)
print("Sum of squares:", sum(squares))
`

export function Playground() {
  const saved = load<{ code: string; stdin: string } | null>('atp-playground', null)
  const [sel, setSel] = useState<{ key: string; code: string; stdin: string }>(() => ({ key: 'saved', code: saved?.code ?? WELCOME, stdin: saved?.stdin ?? (saved ? '' : 'Student') }))
  const [q, setQ] = useState('')
  const pick = (key: string, code: string, stdin = '') => setSel({ key: key + Date.now(), code, stdin })
  const match = (s: string) => s.toLowerCase().includes(q.toLowerCase())

  return (
    <div className="mx-auto max-w-[1600px] px-4 lg:px-6 py-6 grid xl:grid-cols-[290px_minmax(0,1fr)] gap-5">
      <aside className="card p-3 xl:max-h-[calc(100vh-120px)] overflow-auto scrollbar-thin order-2 xl:order-1">
        <div className="relative mb-3"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" /><input className="input w-full pl-8" placeholder="Search examples" value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="label flex items-center gap-1.5 px-2 mb-1"><FlaskConical size={13} />Syllabus lab experiments</div>
        {LABS.filter(l => match(l.title)).map(l => (
          <button key={l.n} onClick={() => pick('lab' + l.n, l.code, l.stdin)} className="w-full text-left flex gap-2 px-2 py-1.5 rounded-lg hover:bg-surface text-[13px]">
            <span className="font-mono text-subtle w-5 shrink-0">{l.n}</span><span className="text-muted hover:text-fg leading-snug">{l.title}</span>
          </button>
        ))}
        <div className="label flex items-center gap-1.5 px-2 mt-4 mb-1"><BookOpen size={13} />Topic starters</div>
        {ALL_TOPICS.filter(t => match(t.title)).map(t => (
          <button key={t.id} onClick={() => pick(t.id, t.starterCode)} className="w-full text-left flex gap-2 px-2 py-1.5 rounded-lg hover:bg-surface text-[13px]">
            <span className="font-mono text-subtle w-5 shrink-0">M{t.moduleId}</span><span className="text-muted leading-snug">{t.title}</span>
          </button>
        ))}
        <button onClick={() => pick('welcome', WELCOME, 'Student')} className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-surface text-[13px] text-muted mt-2">↺ Welcome example</button>
      </aside>
      <div className="order-1 xl:order-2 min-w-0">
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Python Playground</h1>
        </div>
        <Compiler key={sel.key} initialCode={sel.code} initialStdin={sel.stdin} height="calc(100vh - 210px)"
          onChange={c => save('atp-playground', { code: c, stdin: '' })} />
      </div>
    </div>
  )
}
