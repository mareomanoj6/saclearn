import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { Stat, VisShell, parseNums } from './shared'

interface Task { id: number; t: number }
interface F { order: Task[]; status: Record<number, 'idle' | 'taken' | 'reject' | 'check'>; total: number; count: number; caption: string }

function build(times: number[], T: number): F[] {
  const tasks = times.map((t, id) => ({ id, t }))
  const frames: F[] = []
  const status: F['status'] = {}
  tasks.forEach(x => (status[x.id] = 'idle'))
  frames.push({ order: tasks, status: { ...status }, total: 0, count: 0, caption: `Tasks need ${times.join(', ')} units. Available time = ${T}. Greedy idea: always do the shortest task next.` })
  const sorted = [...tasks].sort((a, b) => a.t - b.t)
  frames.push({ order: sorted, status: { ...status }, total: 0, count: 0, caption: `Step 1 — sort by completion time: [${sorted.map(x => x.t).join(', ')}].` })
  let total = 0, count = 0
  for (const x of sorted) {
    status[x.id] = 'check'
    frames.push({ order: sorted, status: { ...status }, total, count, caption: `Can we fit ${x.t}? ${total} + ${x.t} = ${total + x.t} ${total + x.t <= T ? '≤' : '>'} ${T}.` })
    if (total + x.t <= T) { total += x.t; count++; status[x.id] = 'taken'; frames.push({ order: sorted, status: { ...status }, total, count, caption: `Take it (locally best choice). total_time = ${total}, task_count = ${count}.` }) }
    else { status[x.id] = 'reject'; frames.push({ order: sorted, status: { ...status }, total, count, caption: `Doesn’t fit → break. Every remaining task is even longer.` }); break }
  }
  frames.push({ order: sorted, status: { ...status }, total, count, caption: `Maximum number of tasks = ${count} (using ${total} of ${T} units).` })
  return frames
}

export function GreedyVis() {
  const [raw, setRaw] = useState('2, 3, 1, 4, 6')
  const [T, setT] = useState(8)
  const times = parseNums(raw, 10).filter(x => x > 0)
  const frames = useMemo(() => build(times, T), [raw, T])
  const s = useStepper(frames.length, 1000)
  const f = frames[Math.min(s.index, frames.length - 1)]
  const C: Record<string, string> = { idle: 'var(--elevated)', taken: 'var(--good)', reject: 'var(--bad)', check: 'var(--warn)' }
  return (
    <VisShell title="Greedy: maximum tasks in limited time" desc="The syllabus example. Sorting shortest-first and taking tasks while they fit gives the optimal count for this problem.">
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <label className="flex items-center gap-2 text-sm"><span className="text-subtle">completion_times</span><input className="input font-mono w-56" value={raw} onChange={e => setRaw(e.target.value)} /></label>
        <label className="flex items-center gap-2 text-sm"><span className="text-subtle">available_time</span><input type="number" className="input font-mono w-20" value={T} min={1} max={60} onChange={e => setT(Math.max(1, Math.min(60, Number(e.target.value) || 1)))} /></label>
      </div>
      <div className="flex flex-wrap gap-3 mb-4"><Stat label="total_time" value={f.total} /><Stat label="task_count" value={f.count} tone="good" /><Stat label="available" value={T} tone="warn" /></div>
      <div className="flex flex-wrap gap-2 mb-5 min-h-[56px]">
        {f.order.map(x => (
          <motion.div layout key={x.id} transition={{ type: 'spring', stiffness: 300, damping: 28 }} className="h-14 rounded-xl grid place-items-center font-mono font-semibold border px-3"
            style={{ width: 36 + x.t * 14, background: C[f.status[x.id]], color: f.status[x.id] === 'idle' ? 'var(--fg)' : '#fff', borderColor: f.status[x.id] === 'idle' ? 'var(--line)' : 'transparent' }}>{x.t}</motion.div>
        ))}
      </div>
      <div className="label mb-1">Timeline (0 → {T})</div>
      <div className="relative h-10 rounded-xl bg-surface-2 overflow-hidden border border-line">
        {(() => { let acc = 0; return f.order.filter(x => f.status[x.id] === 'taken').map(x => { const left = (acc / T) * 100; acc += x.t; return <motion.div key={x.id} initial={{ width: 0 }} animate={{ width: `${(x.t / T) * 100}%` }} className="absolute top-0 bottom-0 grid place-items-center text-xs font-semibold text-white border-r-2 border-bg" style={{ left: `${left}%`, background: 'var(--good)' }}>{x.t}</motion.div> }) })()}
      </div>
      <div className="mt-4"><PlayerControls s={s} caption={f.caption} /></div>
    </VisShell>
  )
}

/* ------------------------- coin change ------------------------- */
function optimal(amount: number, coins: number[]) {
  const dp = Array(amount + 1).fill(Infinity); const from = Array(amount + 1).fill(-1); dp[0] = 0
  for (let a = 1; a <= amount; a++) for (const c of coins) if (c <= a && dp[a - c] + 1 < dp[a]) { dp[a] = dp[a - c] + 1; from[a] = c }
  const used: number[] = []; let a = amount
  while (a > 0 && from[a] > 0) { used.push(from[a]); a -= from[a] }
  return used
}

export function CoinsVis() {
  const SETS = { 'Indian ₹ {1, 2, 5, 10}': [10, 5, 2, 1], 'Tricky {1, 3, 4}': [4, 3, 1], 'US ¢ {1, 5, 10, 25}': [25, 10, 5, 1] } as const
  const [setName, setSetName] = useState<keyof typeof SETS>('Indian ₹ {1, 2, 5, 10}')
  const [amount, setAmount] = useState(18)
  const coins = [...SETS[setName]]
  const frames = useMemo(() => {
    const fr: { picked: number[]; left: number; caption: string; try?: number }[] = [{ picked: [], left: amount, caption: `Make ${amount} with as few coins as possible. Greedy: always grab the largest coin that fits.` }]
    let left = amount; const picked: number[] = []
    for (const c of coins) {
      while (left >= c) { left -= c; picked.push(c); fr.push({ picked: [...picked], left, try: c, caption: `Take ${c} (largest ≤ ${left + c}). Remaining ${left}.` }) }
    }
    const opt = optimal(amount, coins)
    fr.push({ picked: [...picked], left, caption: `Greedy used ${picked.length} coin(s). Optimal (DP) needs ${opt.length}: [${opt.join(' + ')}]. ${opt.length < picked.length ? 'Greedy is NOT optimal here!' : 'Greedy is optimal for this coin system.'}` })
    return fr
  }, [amount, setName])
  const s = useStepper(frames.length, 800)
  const f = frames[Math.min(s.index, frames.length - 1)]
  return (
    <VisShell title="Greedy coin change" desc="Works perfectly for standard currency — but try the {1, 3, 4} set with amount 6 to see greedy fail.">
      <div className="flex flex-wrap gap-1.5 mb-3">{(Object.keys(SETS) as (keyof typeof SETS)[]).map(k => <button key={k} className={`btn btn-sm ${setName === k ? 'tab-active' : ''}`} onClick={() => { setSetName(k); if (k === 'Tricky {1, 3, 4}') setAmount(6) }}>{k}</button>)}</div>
      <label className="flex items-center gap-3 text-sm mb-5"><span className="text-subtle">Amount</span><input type="range" min={1} max={99} value={amount} onChange={e => setAmount(Number(e.target.value))} className="flex-1 max-w-sm accent-[var(--accent)]" /><span className="font-mono font-semibold text-accent w-10">{amount}</span></label>
      <div className="flex flex-wrap gap-3 items-center min-h-[84px] rounded-2xl bg-surface border border-line p-4">
        {f.picked.map((c, i) => (
          <motion.div key={i} initial={{ y: -40, opacity: 0, rotate: -40 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="rounded-full grid place-items-center font-semibold text-white shadow-md" style={{ width: 34 + Math.min(c, 25) * 1.4, height: 34 + Math.min(c, 25) * 1.4, background: `radial-gradient(circle at 30% 30%, #fde68a, #d97706)` }}>{c}</motion.div>
        ))}
        {f.picked.length === 0 && <span className="text-sm text-subtle">No coins yet</span>}
        <span className="ml-auto chip chip-muted">remaining {f.left}</span>
      </div>
      <div className="mt-4"><PlayerControls s={s} caption={f.caption} /></div>
    </VisShell>
  )
}
