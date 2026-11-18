import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { highlight } from '../lib/highlight'
import { VisShell } from './shared'

interface FrameBox { id: number; label: string; waiting?: string; ret?: number }
interface F { stack: FrameBox[]; log: string[]; caption: string; phase: 'call' | 'base' | 'return' | 'done'; maxDepth: number; calls: number }

interface Fn { id: string; name: string; args: string[]; defaults: number[]; limits: [number, number][]; code: string; run: (a: number[], h: Helpers) => number }
interface Helpers { call: (label: string, body: () => number, baseNote?: string) => number; wait: (s: string) => void }

const FNS: Fn[] = [
  { id: 'fact', name: 'factorial(n)', args: ['n'], defaults: [4], limits: [[1, 7]],
    code: 'def factorial(n):\n    if n == 1:          # base case\n        return 1\n    return n * factorial(n - 1)',
    run: ([n], h) => { const f = (k: number): number => h.call(`factorial(${k})`, () => { if (k <= 1) return 1; h.wait(`${k} * factorial(${k - 1})`); return k * f(k - 1) }, k <= 1 ? 'base case n == 1 → return 1' : undefined); return f(n) } },
  { id: 'fib', name: 'fib(n)', args: ['n'], defaults: [4], limits: [[0, 5]],
    code: 'def fib(n):\n    if n <= 1:          # base case\n        return n\n    return fib(n - 1) + fib(n - 2)',
    run: ([n], h) => { const f = (k: number): number => h.call(`fib(${k})`, () => { if (k <= 1) return k; h.wait(`fib(${k - 1}) + fib(${k - 2})`); const a = f(k - 1); h.wait(`${a} + fib(${k - 2})`); return a + f(k - 2) }, k <= 1 ? `base case → return ${k}` : undefined); return f(n) } },
  { id: 'gcd', name: 'gcd(a, b)', args: ['a', 'b'], defaults: [48, 18], limits: [[1, 999], [0, 999]],
    code: 'def gcd(a, b):\n    if b == 0:          # base case\n        return a\n    return gcd(b, a % b)',
    run: ([a, b], h) => { const f = (x: number, y: number): number => h.call(`gcd(${x}, ${y})`, () => { if (y === 0) return x; h.wait(`gcd(${y}, ${x} % ${y} = ${x % y})`); return f(y, x % y) }, y === 0 ? `base case b == 0 → return ${x}` : undefined); return f(a, b) } },
  { id: 'sumd', name: 'sum_digits(n)', args: ['n'], defaults: [4321], limits: [[0, 99999999]],
    code: 'def sum_digits(n):\n    if n < 10:          # base case\n        return n\n    return n % 10 + sum_digits(n // 10)',
    run: ([n], h) => { const f = (k: number): number => h.call(`sum_digits(${k})`, () => { if (k < 10) return k; h.wait(`${k % 10} + sum_digits(${Math.floor(k / 10)})`); return (k % 10) + f(Math.floor(k / 10)) }, k < 10 ? `base case n < 10 → return ${k}` : undefined); return f(n) } },
  { id: 'add', name: 'add(a, b)', args: ['a', 'b'], defaults: [4, 3], limits: [[0, 20], [0, 8]],
    code: 'def add(a, b):          # a + b using +1 / -1\n    if b == 0:          # base case\n        return a\n    return add(a + 1, b - 1)',
    run: ([a, b], h) => { const f = (x: number, y: number): number => h.call(`add(${x}, ${y})`, () => { if (y === 0) return x; h.wait(`add(${x + 1}, ${y - 1})`); return f(x + 1, y - 1) }, y === 0 ? `base case b == 0 → return ${x}` : undefined); return f(a, b) } },
]

function build(fn: Fn, args: number[]): F[] {
  const frames: F[] = []
  const stack: FrameBox[] = []
  const log: string[] = []
  let id = 0, maxDepth = 0, calls = 0
  const snap = (caption: string, phase: F['phase']) => frames.push({ stack: stack.map(s => ({ ...s })), log: [...log], caption, phase, maxDepth, calls })
  const h: Helpers = {
    call(label, body, baseNote) {
      const fr: FrameBox = { id: id++, label }
      stack.push(fr); calls++; maxDepth = Math.max(maxDepth, stack.length)
      log.push(`${'  '.repeat(stack.length - 1)}→ ${label}`)
      snap(`PUSH ${label} onto the call stack (depth ${stack.length}).`, 'call')
      if (baseNote) { snap(`${label}: ${baseNote}`, 'base') }
      const v = body()
      fr.ret = v; fr.waiting = undefined
      snap(`${label} returns ${v}.`, 'return')
      stack.pop()
      log.push(`${'  '.repeat(stack.length)}← ${label} = ${v}`)
      if (stack.length) { snap(`POP ${label}; control returns to ${stack[stack.length - 1].label}, which uses ${v}.`, 'return') }
      return v
    },
    wait(s) { stack[stack.length - 1].waiting = s },
  }
  snap(`Call ${fn.name.replace(/\(.*/, '')}(${args.join(', ')}). The stack is empty.`, 'call')
  const v = fn.run(args, h)
  snap(`Stack is empty again. Final result = ${v}. Total calls: ${calls}, maximum depth: ${maxDepth}.`, 'done')
  return frames
}

export function CallStackVis() {
  const [fid, setFid] = useState('fact')
  const fn = FNS.find(f => f.id === fid)!
  const [vals, setVals] = useState<Record<string, number[]>>({})
  const args = vals[fid] ?? fn.defaults
  const frames = useMemo(() => build(fn, args), [fn, args.join(',')])
  const s = useStepper(frames.length, 850)
  const f = frames[Math.min(s.index, frames.length - 1)]
  return (
    <VisShell title="Recursion & the call stack" desc="Every call pushes a frame (LIFO). At the base case the stack unwinds: frames pop in reverse order, each finishing its pending work with the returned value.">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {FNS.map(x => <button key={x.id} className={`btn btn-sm font-mono ${fid === x.id ? 'tab-active' : ''}`} onClick={() => setFid(x.id)}>{x.name}</button>)}
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        {fn.args.map((a, i) => (
          <label key={a} className="flex items-center gap-2 text-sm"><span className="font-mono text-subtle">{a} =</span>
            <input type="number" className="input w-24 font-mono" value={args[i]} min={fn.limits[i][0]} max={fn.limits[i][1]}
              onChange={e => { const v = Math.min(fn.limits[i][1], Math.max(fn.limits[i][0], Number(e.target.value) || 0)); const nx = [...args]; nx[i] = v; setVals(o => ({ ...o, [fid]: nx })) }} />
          </label>
        ))}
        <span className="chip chip-muted">calls so far: {f.calls}</span><span className="chip chip-muted">max depth: {f.maxDepth}</span>
      </div>
      <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
        <div>
          <pre className="code-block p-4 m-0 mb-3"><code>{highlight(fn.code)}</code></pre>
          <div className="code-block p-3 h-[200px] overflow-auto text-[12px]">
            <div className="text-[10px] uppercase tracking-widest text-code-muted font-sans font-bold mb-1">Trace</div>
            {f.log.map((l, i) => <div key={i} className={`whitespace-pre ${l.includes('←') ? 'text-code-ok' : 'text-code-acc'}`}>{l}</div>)}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface grid-bg p-4 flex flex-col">
          <div className="label mb-2 flex justify-between"><span>Call stack</span><span>top ↑</span></div>
          <div className="flex-1 flex flex-col-reverse justify-start gap-2 min-h-[300px]">
            <AnimatePresence>
              {f.stack.map((fr, i) => {
                const top = i === f.stack.length - 1
                return (
                  <motion.div key={fr.id} layout initial={{ opacity: 0, y: -30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
                    className={`rounded-xl border px-4 py-2.5 flex items-center gap-3 ${top ? 'bg-accent text-accent-fg border-accent' : 'bg-elevated border-line'}`} style={top ? { boxShadow: 'var(--glow)' } : undefined}>
                    <span className="font-mono font-bold text-sm">{fr.label}</span>
                    {fr.waiting && <span className={`text-xs font-mono ${top ? 'opacity-80' : 'text-subtle'}`}>waiting: {fr.waiting}</span>}
                    {fr.ret !== undefined && <span className="ml-auto chip" style={{ background: 'var(--good)', color: '#fff' }}>return {fr.ret}</span>}
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {f.stack.length === 0 && <div className="m-auto text-sm text-subtle">empty stack</div>}
          </div>
        </div>
      </div>
      <div className="mt-4"><PlayerControls s={s} caption={f.caption} /></div>
    </VisShell>
  )
}
