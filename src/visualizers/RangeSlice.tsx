import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { VisShell } from './shared'

function pyRange(a: number, b: number, c: number) {
  const out: number[] = []
  if (c === 0) return out
  for (let i = a; c > 0 ? i < b : i > b; i += c) { out.push(i); if (out.length > 60) break }
  return out
}

function Slider({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number }) {
  return (
    <label className="flex-1 min-w-[150px]">
      <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-muted">{label}</span><span className="font-mono font-bold text-accent">{value}</span></div>
      <input type="range" min={min} max={max} value={value} onChange={e => set(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
    </label>
  )
}

export function RangeVis() {
  const [start, setStart] = useState(1)
  const [stop, setStop] = useState(10)
  const [step, setStep] = useState(2)
  const [body, setBody] = useState<'print' | 'sum' | 'square'>('sum')
  const nums = useMemo(() => pyRange(start, stop, step), [start, stop, step])
  const s = useStepper(nums.length + 1, 650)
  const k = s.index // number of iterations completed
  const done = nums.slice(0, k)
  const acc = done.reduce((a, b) => a + b, 0)
  const caption = step === 0 ? 'ValueError: range() arg 3 must not be zero'
    : nums.length === 0 ? `range(${start}, ${stop}, ${step}) is empty — the loop body never runs.`
    : k === 0 ? 'Before the loop. Press Play to iterate.'
    : k <= nums.length ? `Iteration ${k}: i = ${nums[k - 1]}` + (body === 'sum' ? ` → total = ${acc}` : body === 'square' ? ` → prints ${nums[k - 1] ** 2}` : ` → prints ${nums[k - 1]}`) + (k === nums.length ? '  · loop ends (stop is excluded).' : '') : ''
  const code = body === 'sum' ? `total = 0\nfor i in range(${start}, ${stop}, ${step}):\n    total += i\nprint(total)` : body === 'square' ? `for i in range(${start}, ${stop}, ${step}):\n    print(i * i)` : `for i in range(${start}, ${stop}, ${step}):\n    print(i, end=" ")`
  return (
    <VisShell title="for loop + range() explorer" desc="Drag start / stop / step. The boxes are the values range() generates; the loop visits them one by one. Note: stop is never included.">
      <div className="flex flex-wrap gap-5 mb-4">
        <Slider label="start" value={start} set={setStart} min={-10} max={20} />
        <Slider label="stop" value={stop} set={setStop} min={-10} max={30} />
        <Slider label="step" value={step} set={setStep} min={-5} max={5} />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(['sum', 'print', 'square'] as const).map(b => <button key={b} className={`btn btn-sm ${body === b ? 'tab-active' : ''}`} onClick={() => setBody(b)}>{b === 'sum' ? 'total += i' : b === 'print' ? 'print(i)' : 'print(i*i)'}</button>)}
      </div>
      <div className="grid lg:grid-cols-[1fr_300px] gap-4">
        <div className="rounded-2xl border border-line bg-surface p-4 min-h-[140px]">
          <div className="font-mono text-sm mb-3 text-muted">list(range({start}, {stop}, {step})) =</div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence initial={false}>
              {nums.map((n, i) => {
                const cur = i === k - 1; const past = i < k - 1
                return (
                  <motion.div layout key={`${n}-${i}`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: cur ? 1.15 : 1 }} exit={{ opacity: 0, scale: 0.6 }}
                    className={`w-12 h-12 rounded-xl grid place-items-center font-mono font-bold border ${cur ? 'bg-accent text-accent-fg border-accent' : past ? 'bg-accent-soft text-accent border-transparent' : 'bg-elevated border-line'}`}
                    style={cur ? { boxShadow: 'var(--glow)' } : undefined}>{n}</motion.div>
                )
              })}
            </AnimatePresence>
            {nums.length === 0 && <div className="text-sm text-subtle">[ ] — empty range</div>}
          </div>
          {body === 'sum' && <div className="mt-4 text-sm">total = <span className="font-mono font-bold text-accent text-lg">{acc}</span></div>}
          {body !== 'sum' && <div className="mt-4 font-mono text-sm text-muted">output: {done.map(n => (body === 'square' ? n * n : n)).join(' ')}</div>}
        </div>
        <pre className="code-block p-4 m-0 text-[13px]">{code}</pre>
      </div>
      <div className="mt-4"><PlayerControls s={s} caption={caption} /></div>
    </VisShell>
  )
}

/* ---------------- list slicing ---------------- */
function sliceIdx(len: number, a: string, b: string, c: string): number[] | string {
  const step = c.trim() === '' ? 1 : parseInt(c)
  if (Number.isNaN(step)) return 'step must be an integer'
  if (step === 0) return 'ValueError: slice step cannot be zero'
  const norm = (v: string, def: number, lo: number, hi: number) => {
    if (v.trim() === '') return def
    let x = parseInt(v); if (Number.isNaN(x)) return def
    if (x < 0) x += len
    return Math.min(Math.max(x, lo), hi)
  }
  const start = step > 0 ? norm(a, 0, 0, len) : norm(a, len - 1, -1, len - 1)
  const stop = step > 0 ? norm(b, len, 0, len) : norm(b, -1, -1, len - 1)
  const out: number[] = []
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) out.push(i)
  return out
}

export function SlicingVis() {
  const [items, setItems] = useState('Alice, Bob, Charlie, David, Emmanuel, Fiona')
  const [a, setA] = useState('1'); const [b, setB] = useState('4'); const [c, setC] = useState('')
  const list = items.split(',').map(x => x.trim()).filter(Boolean).slice(0, 10)
  const res = sliceIdx(list.length, a, b, c)
  const sel = Array.isArray(res) ? res : []
  const presets: [string, string, string, string][] = [['names[1:4]', '1', '4', ''], ['names[:3]', '', '3', ''], ['names[-3:]', '-3', '', ''], ['names[::2]', '', '', '2'], ['names[::-1]', '', '', '-1'], ['names[4:1:-1]', '4', '1', '-1']]
  const expr = `names[${a}:${b}${c ? ':' + c : ''}]`
  return (
    <VisShell title="List / string slicing explorer" desc="Positive indices count from the front (0…), negative from the back (−1…). The slice includes start, excludes stop.">
      <input className="input w-full font-mono mb-3" value={items} onChange={e => setItems(e.target.value)} aria-label="List items" />
      <div className="flex flex-wrap gap-1.5 mb-4">
        {presets.map(p => <button key={p[0]} className="btn btn-sm font-mono" onClick={() => { setA(p[1]); setB(p[2]); setC(p[3]) }}>{p[0]}</button>)}
      </div>
      <div className="rounded-2xl border border-line bg-surface p-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {list.map((x, i) => {
            const on = sel.includes(i); const order = sel.indexOf(i)
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-mono text-subtle">{i}</span>
                <motion.div animate={{ y: on ? -6 : 0, scale: on ? 1.04 : 1 }} className={`relative px-3 h-12 min-w-[64px] rounded-xl grid place-items-center font-semibold text-sm border ${on ? 'bg-accent text-accent-fg border-accent' : 'bg-elevated border-line text-muted'}`} style={on ? { boxShadow: 'var(--glow)' } : undefined}>
                  {x}
                  {on && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-warn text-white text-[10px] grid place-items-center">{order + 1}</span>}
                </motion.div>
                <span className="text-[11px] font-mono text-subtle">{i - list.length}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-4 font-mono text-sm">
        <span>names[</span><input className="input w-16 text-center" value={a} onChange={e => setA(e.target.value)} placeholder="start" />
        <span>:</span><input className="input w-16 text-center" value={b} onChange={e => setB(e.target.value)} placeholder="stop" />
        <span>:</span><input className="input w-16 text-center" value={c} onChange={e => setC(e.target.value)} placeholder="step" /><span>]</span>
      </div>
      <div className="code-block p-4 mt-4 text-sm">
        <span className="text-code-muted">&gt;&gt;&gt; </span>{expr}<br />
        {Array.isArray(res) ? <span className="text-code-ok">[{sel.map(i => `'${list[i]}'`).join(', ')}]</span> : <span className="text-code-err">{res}</span>}
      </div>
    </VisShell>
  )
}
