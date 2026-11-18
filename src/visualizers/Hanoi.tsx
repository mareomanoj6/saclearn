import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { Stat, VisShell } from './shared'

type Peg = 0 | 1 | 2
const NAMES = ['A (Source)', 'B (Auxiliary)', 'C (Destination)']

function solve(n: number) {
  const moves: [number, Peg, Peg][] = []
  const rec = (k: number, from: Peg, to: Peg, via: Peg) => {
    if (k === 0) return
    rec(k - 1, from, via, to); moves.push([k, from, to]); rec(k - 1, via, to, from)
  }
  rec(n, 0, 2, 1)
  const frames: { pegs: number[][]; caption: string; move?: [number, Peg, Peg] }[] = []
  let pegs: number[][] = [Array.from({ length: n }, (_, i) => n - i), [], []]
  frames.push({ pegs, caption: `Start: ${n} disks on A. Goal: move them all to C — never a larger disk on a smaller one.` })
  moves.forEach((m, i) => {
    pegs = pegs.map(p => [...p]); pegs[m[1]].pop(); pegs[m[2]].push(m[0])
    frames.push({ pegs, move: m, caption: `Move ${i + 1}: disk ${m[0]} from ${'ABC'[m[1]]} → ${'ABC'[m[2]]}` })
  })
  return frames
}

export function HanoiVis() {
  const [n, setN] = useState(3)
  const frames = useMemo(() => solve(n), [n])
  const s = useStepper(frames.length, 800)
  const f = frames[s.index]
  const W = 260
  return (
    <VisShell title="Tower of Hanoi — Means-Ends Analysis"
      desc="Each move shrinks the gap between the current state and the goal. Recursive plan: move n−1 disks to B, move the largest to C, move n−1 from B to C."
      aside={<div className="flex items-center gap-2"><span className="text-sm text-subtle">Disks</span>{[1, 2, 3, 4, 5, 6].map(k => <button key={k} onClick={() => setN(k)} className={`btn btn-sm btn-icon ${n === k ? 'btn-primary' : ''}`}>{k}</button>)}</div>}>
      <div className="flex flex-wrap gap-3 mb-4">
        <Stat label="Moves made" value={s.index} />
        <Stat label="Minimum (2ⁿ−1)" value={2 ** n - 1} tone="good" />
        <Stat label="Disks on C" value={`${f.pegs[2].length}/${n}`} tone="warn" />
      </div>
      <div className="relative grid grid-cols-3 gap-4 rounded-2xl bg-surface border border-line p-4 pt-8 h-[260px] grid-bg">
        {f.pegs.map((peg, pi) => (
          <div key={pi} className="relative flex flex-col-reverse items-center">
            <div className="absolute bottom-0 w-[3px] h-[200px] rounded-full bg-line" style={{ left: 'calc(50% - 1.5px)' }} />
            <div className="absolute -bottom-1 w-full h-2 rounded-full bg-line" />
            {peg.map(d => {
              const moving = f.move && f.move[0] === d
              return (
                <motion.div key={d} layout layoutId={`disk-${d}`} transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className="relative z-10 h-6 rounded-md mb-[2px] grid place-items-center text-[11px] font-semibold text-white"
                  style={{ width: `${Math.min(W, 40 + d * 30)}px`, maxWidth: '100%', background: `hsl(${205 + d * 9} 85% ${62 - d * 4}%)`, boxShadow: moving ? '0 0 0 3px var(--accent-soft), 0 0 18px var(--accent)' : 'none' }}>
                  {d}
                </motion.div>
              )
            })}
            <div className="absolute -bottom-8 text-xs font-medium text-muted">{NAMES[pi]}</div>
          </div>
        ))}
      </div>
      <div className="h-8" />
      <PlayerControls s={s} caption={f.caption} />
    </VisShell>
  )
}
