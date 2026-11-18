import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { Stat, VisShell } from './shared'

type Mode = 'naive' | 'memo' | 'tab'
interface TNode { id: number; n: number; x: number; y: number; parent?: number; cached?: boolean }
interface F { visible: number; done: Set<number>; memo: (number | null)[]; caption: string; active?: number; calls: number }

function buildTree(n: number, memo: boolean) {
  const nodes: TNode[] = []; const frames: F[] = []
  const done = new Set<number>(); const table: (number | null)[] = Array(n + 1).fill(null)
  let calls = 0
  // order of creation = DFS call order
  const rec = (k: number, depth: number, parent?: number): number => {
    const id = nodes.length
    const cached = memo && table[k] !== null
    nodes.push({ id, n: k, x: 0, y: depth, parent, cached }); calls++
    frames.push({ visible: nodes.length, done: new Set(done), memo: [...table], active: id, calls, caption: cached ? `fib(${k}) is already in the memo table → return ${table[k]} instantly (no recursion).` : `Call fib(${k}).` })
    let v: number
    if (cached) v = table[k]!
    else if (k <= 1) v = k
    else v = rec(k - 1, depth + 1, id) + rec(k - 2, depth + 1, id)
    if (memo) table[k] = v
    done.add(id)
    frames.push({ visible: nodes.length, done: new Set(done), memo: [...table], active: id, calls, caption: `fib(${k}) = ${v}` + (k > 1 && !cached ? `  (= fib(${k - 1}) + fib(${k - 2}))` : k <= 1 ? '  (base case)' : '') })
    return v
  }
  const total = rec(n, 0)
  // layout: leaves get consecutive x
  let leaf = 0
  const kids = (id: number) => nodes.filter(x => x.parent === id)
  const place = (id: number): number => { const ch = kids(id); const nd = nodes[id]; nd.x = ch.length ? ch.map(c => place(c.id)).reduce((a, b) => a + b) / ch.length : leaf++; return nd.x }
  place(0)
  frames.push({ visible: nodes.length, done: new Set(done), memo: [...table], calls, caption: `Result fib(${n}) = ${total} using ${calls} calls.` })
  return { nodes, frames, leaves: Math.max(leaf, 1), depth: Math.max(...nodes.map(x => x.y)) + 1 }
}

function buildTab(n: number) {
  const frames: F[] = []; const t: (number | null)[] = Array(n + 1).fill(null)
  frames.push({ visible: 0, done: new Set(), memo: [...t], calls: 0, caption: 'Tabulation (bottom-up): create a table and fill it from the smallest sub-problem.' })
  for (let i = 0; i <= n; i++) {
    t[i] = i <= 1 ? i : t[i - 1]! + t[i - 2]!
    frames.push({ visible: 0, done: new Set(), memo: [...t], active: i, calls: i + 1, caption: i <= 1 ? `table[${i}] = ${i} (base value)` : `table[${i}] = table[${i - 1}] + table[${i - 2}] = ${t[i - 1]} + ${t[i - 2]} = ${t[i]}` })
  }
  frames.push({ visible: 0, done: new Set(), memo: [...t], calls: n + 1, caption: `fib(${n}) = ${t[n]} — each value computed exactly once, no recursion at all.` })
  return frames
}

export function FibDPVis() {
  const [n, setN] = useState(5)
  const [mode, setMode] = useState<Mode>('naive')
  const tree = useMemo(() => buildTree(n, mode === 'memo'), [n, mode])
  const frames = mode === 'tab' ? buildTab(n) : tree.frames
  const s = useStepper(frames.length, mode === 'tab' ? 900 : 550)
  const f = frames[Math.min(s.index, frames.length - 1)]
  const naiveCalls = useMemo(() => buildTree(n, false).nodes.length, [n])
  const W = 640, H = tree.depth * 62 + 20
  const sx = (x: number) => 30 + (x / Math.max(1, tree.leaves - 1)) * (W - 60)
  const repeated = (k: number, id: number) => mode === 'naive' && tree.nodes.some(o => o.n === k && o.id < id)
  return (
    <VisShell title="Dynamic programming: Fibonacci" desc="Plain recursion recomputes the same sub-problems (red). Memoization caches them; tabulation fills a table bottom-up."
      aside={<div className="flex items-center gap-1.5"><span className="text-sm text-subtle">n</span>{[3, 4, 5, 6].map(k => <button key={k} onClick={() => setN(k)} className={`btn btn-sm btn-icon ${n === k ? 'btn-primary' : ''}`}>{k}</button>)}</div>}>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {([['naive', 'Plain recursion'], ['memo', 'Memoization (top-down)'], ['tab', 'Tabulation (bottom-up)']] as const).map(([m, l]) => <button key={m} className={`btn btn-sm ${mode === m ? 'tab-active' : ''}`} onClick={() => setMode(m)}>{l}</button>)}
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Stat label="Calls / steps" value={f.calls} />
        <Stat label="Plain recursion needs" value={naiveCalls} tone="bad" />
        <Stat label="DP needs" value={n + 1} tone="good" />
      </div>
      {mode !== 'tab' && (
        <div className="rounded-2xl border border-line bg-surface grid-bg p-2 overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[520px]">
            {tree.nodes.slice(0, f.visible).map(nd => nd.parent !== undefined && (
              <line key={'e' + nd.id} x1={sx(tree.nodes[nd.parent].x)} y1={tree.nodes[nd.parent].y * 62 + 30} x2={sx(nd.x)} y2={nd.y * 62 + 30} stroke="var(--line)" strokeWidth={2} />
            ))}
            {tree.nodes.slice(0, f.visible).map(nd => {
              const rep = repeated(nd.n, nd.id); const isDone = f.done.has(nd.id); const act = f.active === nd.id
              const fill = act ? 'var(--accent)' : nd.cached ? 'var(--good)' : rep ? 'var(--bad-soft)' : isDone ? 'var(--accent-soft)' : 'var(--elevated)'
              return (
                <motion.g key={nd.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: `${sx(nd.x)}px ${nd.y * 62 + 30}px` }}>
                  <rect x={sx(nd.x) - 26} y={nd.y * 62 + 16} width={52} height={28} rx={14} fill={fill} stroke={rep ? 'var(--bad)' : act ? 'var(--accent)' : 'var(--line)'} strokeWidth={1.5} />
                  <text x={sx(nd.x)} y={nd.y * 62 + 35} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="JetBrains Mono, monospace" fill={act || nd.cached ? '#fff' : rep ? 'var(--bad)' : 'var(--fg)'}>f({nd.n})</text>
                </motion.g>
              )
            })}
          </svg>
        </div>
      )}
      <div className="mt-4">
        <div className="label mb-2">{mode === 'naive' ? 'No table — nothing is remembered' : mode === 'memo' ? 'Memo table (cache)' : 'DP table'}</div>
        <div className="flex flex-wrap gap-2">
          {f.memo.map((v, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-[11px] font-mono text-subtle">[{i}]</span>
              <motion.div key={String(v)} initial={v !== null ? { scale: 1.3 } : false} animate={{ scale: 1 }} className={`w-12 h-11 rounded-lg grid place-items-center font-mono font-bold border ${v === null ? 'border-dashed border-line text-subtle' : (mode === 'tab' && f.active === i) ? 'bg-accent text-accent-fg border-accent' : 'bg-good-soft border-good text-good'}`}>{mode === 'naive' ? '–' : v ?? '?'}</motion.div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs mt-3"><span className="chip" style={{ color: 'var(--bad)', background: 'var(--bad-soft)' }}>repeated work</span><span className="chip" style={{ color: '#fff', background: 'var(--good)' }}>memo hit</span></div>
      <div className="mt-3"><PlayerControls s={s} caption={f.caption} /></div>
    </VisShell>
  )
}
