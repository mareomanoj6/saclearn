import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { VisShell, parseNums } from './shared'

interface F { i: number; top: (number | null)[]; caption: string; changed: number }

function build(nums: number[]): F[] {
  const frames: F[] = [{ i: -1, top: [null, null, null], caption: 'first = second = third = −∞. Decomposed: scan the list, and call update_top3(x) for each element.', changed: -1 }]
  let top: (number | null)[] = [null, null, null]
  const gt = (x: number, y: number | null) => y === null || x > y
  nums.forEach((x, i) => {
    let changed = -1; let why = ''
    if (gt(x, top[0])) { top = [x, top[0], top[1]]; changed = 0; why = `${x} > first → shift down, new first` }
    else if (gt(x, top[1])) { top = [top[0], x, top[1]]; changed = 1; why = `${x} > second → new second` }
    else if (gt(x, top[2])) { top = [top[0], top[1], x]; changed = 2; why = `${x} > third → new third` }
    else why = `${x} is not larger than third (${top[2]}) → ignore`
    frames.push({ i, top: [...top], caption: `update_top3(${x}): ${why}.`, changed })
  })
  frames.push({ i: nums.length, top, caption: `Return the tuple (${top.join(', ')}) — a function with multiple return values.`, changed: -1 })
  return frames
}

export function TopThreeVis() {
  const [raw, setRaw] = useState('12, 75, 34, 99, 45, 67, 88')
  const nums = parseNums(raw, 12)
  const frames = useMemo(() => build(nums), [raw])
  const s = useStepper(frames.length, 900)
  const f = frames[Math.min(s.index, frames.length - 1)]
  const podium = [{ k: 1, h: 120, label: 'second' }, { k: 0, h: 160, label: 'first' }, { k: 2, h: 90, label: 'third' }]
  return (
    <VisShell title="Decomposition: top three integers" desc="The big problem (find top 3) is decomposed into a tiny reusable sub-problem: insert one number into a (first, second, third) triple.">
      <input className="input font-mono w-full mb-4" value={raw} onChange={e => setRaw(e.target.value)} aria-label="Numbers" />
      <div className="flex flex-wrap gap-2 mb-6">
        {nums.map((n, i) => (
          <motion.div key={i} animate={{ y: i === f.i ? -8 : 0, scale: i === f.i ? 1.1 : 1 }} className={`w-12 h-12 rounded-xl grid place-items-center font-mono font-semibold border ${i === f.i ? 'bg-accent text-accent-fg border-accent' : i < f.i ? 'bg-surface-2 text-subtle border-line' : 'bg-elevated border-line'}`}>{n}</motion.div>
        ))}
      </div>
      <div className="flex items-end justify-center gap-3 h-[200px] rounded-2xl bg-surface border border-line grid-bg px-4">
        {podium.map(p => {
          const v = f.top[p.k]
          return (
            <div key={p.k} className="flex flex-col items-center w-28">
              <motion.div key={String(v)} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`mb-2 w-14 h-14 rounded-full grid place-items-center font-mono font-semibold text-lg border-2 ${f.changed === p.k ? 'border-accent text-accent' : 'border-line'}`} style={{ background: 'var(--elevated)', boxShadow: f.changed === p.k ? 'var(--glow)' : undefined }}>{v ?? '−∞'}</motion.div>
              <div className="w-full rounded-t-xl grid place-items-start justify-center pt-2 text-xs font-semibold text-white" style={{ height: p.h - 60, background: p.k === 0 ? 'var(--accent)' : 'var(--accent-strong)', opacity: p.k === 0 ? 1 : 0.75 }}>{p.label}</div>
            </div>
          )
        })}
      </div>
      <div className="mt-4"><PlayerControls s={s} caption={f.caption} /></div>
    </VisShell>
  )
}
