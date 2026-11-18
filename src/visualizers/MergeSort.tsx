import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { VisShell, parseNums } from './shared'

interface Seg { id: string; lo: number; hi: number; depth: number }
interface F { show: Set<string>; vals: Record<string, number[]>; state: Record<string, 'split' | 'sorted' | 'merging'>; active?: string; caption: string }

function build(arr: number[]) {
  const segs: Seg[] = []
  const frames: F[] = []
  const show = new Set<string>(); const vals: Record<string, number[]> = {}; const state: F['state'] = {}
  const snap = (caption: string, active?: string) => frames.push({ show: new Set(show), vals: { ...vals }, state: { ...state }, active, caption })
  const rec = (lo: number, hi: number, depth: number): number[] => {
    const id = `${lo}-${hi}`
    segs.push({ id, lo, hi, depth })
    show.add(id); vals[id] = arr.slice(lo, hi + 1); state[id] = 'split'
    if (lo === hi) { state[id] = 'sorted'; snap(`[${arr[lo]}] has one element — already sorted (base case).`, id); return [arr[lo]] }
    const mid = Math.floor((lo + hi) / 2)
    snap(`Divide [${vals[id].join(', ')}] at the middle → [${arr.slice(lo, mid + 1).join(', ')}] and [${arr.slice(mid + 1, hi + 1).join(', ')}].`, id)
    const L = rec(lo, mid, depth + 1); const R = rec(mid + 1, hi, depth + 1)
    const out: number[] = []; let i = 0, j = 0
    while (i < L.length && j < R.length) out.push(L[i] <= R[j] ? L[i++] : R[j++])
    out.push(...L.slice(i), ...R.slice(j))
    vals[id] = out; state[id] = 'merging'
    snap(`Merge [${L.join(', ')}] + [${R.join(', ')}] → [${out.join(', ')}] (always take the smaller front element).`, id)
    state[id] = 'sorted'
    return out
  }
  if (arr.length) rec(0, arr.length - 1, 0)
  snap('Done! The whole array is sorted. log₂n levels × n work per level = O(n log n).')
  return { segs, frames }
}

export function MergeSortVis() {
  const [raw, setRaw] = useState('38, 27, 43, 3, 9, 82, 10')
  const arr = parseNums(raw, 10)
  const { segs, frames } = useMemo(() => build(arr), [raw])
  const s = useStepper(frames.length, 1100)
  const f = frames[Math.min(s.index, frames.length - 1)]
  const depth = Math.max(0, ...segs.map(x => x.depth)) + 1
  const n = Math.max(arr.length, 1)
  return (
    <VisShell title="Merge sort — divide, conquer, merge" desc="Top half of the animation splits the array; then sorted pieces merge back upward. Each row is one level of recursion.">
      <input className="input font-mono w-full mb-4" value={raw} onChange={e => setRaw(e.target.value)} aria-label="Array" />
      <div className="rounded-2xl border border-line bg-surface grid-bg p-4 overflow-x-auto">
        <div className="relative min-w-[560px]" style={{ height: depth * 64 }}>
          {segs.filter(sg => f.show.has(sg.id)).map(sg => {
            const st = f.state[sg.id]; const active = f.active === sg.id
            const left = (sg.lo / n) * 100; const width = ((sg.hi - sg.lo + 1) / n) * 100
            return (
              <motion.div key={sg.id} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="absolute px-1" style={{ top: sg.depth * 64, left: `${left}%`, width: `${width}%` }}>
                <div className={`flex gap-1 p-1 rounded-xl border ${active ? 'border-accent' : 'border-transparent'}`} style={active ? { boxShadow: 'var(--glow)', background: 'var(--accent-soft)' } : undefined}>
                  {f.vals[sg.id].map((v, i) => (
                    <motion.div layout key={`${sg.id}-${v}-${i}`} className={`flex-1 h-10 rounded-lg grid place-items-center font-mono text-sm font-semibold border ${st === 'sorted' || st === 'merging' ? 'bg-accent text-accent-fg border-accent' : 'bg-elevated border-line'}`}
                      style={st === 'sorted' && !active ? { opacity: 0.75 } : undefined}>{v}</motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      <div className="flex gap-2 text-xs mt-3"><span className="chip chip-muted">unsorted piece</span><span className="chip">sorted piece</span></div>
      <div className="mt-3"><PlayerControls s={s} caption={f.caption} /></div>
    </VisShell>
  )
}
