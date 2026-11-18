import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { VisShell } from './shared'

type Phase = 'FETCH' | 'DECODE' | 'EXECUTE' | 'STORE' | 'HALT' | 'START'
interface F { pc: number; ir: string; acc: number; mem: (string | number)[]; phase: Phase; hl: number[]; caption: string; out?: string }

const PROGRAM: (string | number)[] = ['LOAD 5', 'ADD 6', 'STORE 7', 'PRINT 7', 'HALT', 7, 5, 0]

function build(): F[] {
  const frames: F[] = []
  let pc = 0, ir = '', acc = 0, out: string | undefined
  const mem = [...PROGRAM]
  const push = (phase: Phase, hl: number[], caption: string) => frames.push({ pc, ir, acc, mem: [...mem], phase, hl, caption, out })
  push('START', [], 'Program and data are both stored in memory (stored-program / Von Neumann idea). PC = 0.')
  for (let guard = 0; guard < 10; guard++) {
    const addr = pc
    ir = String(mem[pc]); pc++
    push('FETCH', [addr], `FETCH: copy memory[${addr}] = "${ir}" into IR, then PC → ${pc}.`)
    const [op, a] = ir.split(' '); const x = Number(a)
    if (op === 'HALT') { push('HALT', [], 'DECODE: HALT — the program ends.'); break }
    const meaning: Record<string, string> = { LOAD: `ACC ← memory[${x}]`, ADD: `ACC ← ACC + memory[${x}]`, STORE: `memory[${x}] ← ACC`, PRINT: `output memory[${x}]` }
    push('DECODE', [], `DECODE: control unit interprets "${ir}" as ${meaning[op]}.`)
    if (op === 'LOAD') { acc = Number(mem[x]); push('EXECUTE', [x], `EXECUTE: ACC = ${acc}.`) }
    if (op === 'ADD') { const v = Number(mem[x]); acc += v; push('EXECUTE', [x], `EXECUTE: ALU adds ${acc - v} + ${v} = ${acc} → ACC.`) }
    if (op === 'STORE') { push('EXECUTE', [], 'EXECUTE: prepare to write ACC back to memory.'); mem[x] = acc; push('STORE', [x], `STORE: memory[${x}] = ${acc}.`); continue }
    if (op === 'PRINT') { push('EXECUTE', [x], `EXECUTE: read memory[${x}].`); out = String(mem[x]); push('STORE', [], `STORE/OUTPUT: send ${out} to the output device.`); continue }
    push('STORE', [], 'STORE: result kept in the accumulator. Cycle repeats for the next instruction.')
  }
  return frames
}

const PHASES: Phase[] = ['FETCH', 'DECODE', 'EXECUTE', 'STORE']

export function CpuVis() {
  const frames = useMemo(build, [])
  const s = useStepper(frames.length, 1100)
  const f = frames[s.index]
  return (
    <VisShell title="Inside the CPU — the instruction execution cycle" desc="A 5-instruction program adds 7 + 5 and prints 12. Watch PC, IR and ACC change in every Fetch → Decode → Execute → Store cycle.">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="flex justify-between mb-3">
            {PHASES.map(p => (
              <motion.div key={p} animate={{ scale: f.phase === p ? 1.06 : 1 }} className={`flex-1 mx-1 text-center rounded-xl py-2 text-xs font-bold ${f.phase === p ? 'bg-accent text-accent-fg' : 'bg-elevated text-subtle border border-line'}`} style={f.phase === p ? { boxShadow: 'var(--glow)' } : undefined}>{p}</motion.div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {([['PC', f.pc, 'Program Counter'], ['IR', f.ir || '—', 'Instruction Register'], ['ACC', f.acc, 'Accumulator']] as const).map(([k, v, d]) => (
              <div key={k} className="card p-3 text-center">
                <div className="text-[11px] font-bold text-subtle">{k}</div>
                <motion.div key={String(v)} initial={{ scale: 1.3, color: 'var(--accent)' }} animate={{ scale: 1, color: 'var(--fg)' }} className="font-mono text-xl font-bold my-1">{v}</motion.div>
                <div className="text-[10px] text-subtle">{d}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="card p-3 text-center"><div className="text-[11px] font-bold text-subtle">ALU</div><div className={`text-sm mt-1 ${f.phase === 'EXECUTE' ? 'text-accent font-semibold' : 'text-muted'}`}>{f.phase === 'EXECUTE' ? 'working…' : 'idle'}</div></div>
            <div className="card p-3 text-center"><div className="text-[11px] font-bold text-subtle">Output device</div><div className="font-mono text-lg font-bold" style={{ color: 'var(--good)' }}>{f.out ?? '—'}</div></div>
          </div>
        </div>
        <div className="rounded-2xl border border-line overflow-hidden">
          <div className="px-4 py-2 bg-surface border-b border-line label">Main memory</div>
          {f.mem.map((m, i) => {
            const isPc = i === f.pc && f.phase !== 'HALT'
            const hl = f.hl.includes(i)
            return (
              <motion.div key={i} animate={{ backgroundColor: hl ? 'var(--accent-soft)' : 'rgba(0,0,0,0)' }} className="flex items-center px-4 h-9 border-b border-line last:border-0 font-mono text-sm">
                <span className="w-8 text-subtle">{i}</span>
                <span className={typeof m === 'number' ? 'text-warn' : ''}>{m}</span>
                <span className="ml-auto text-[11px] text-subtle">{typeof m === 'number' ? 'data' : 'instruction'}</span>
                {isPc && <motion.span layoutId="pc-arrow" className="ml-2 chip">PC</motion.span>}
              </motion.div>
            )
          })}
        </div>
      </div>
      <div className="mt-4"><PlayerControls s={s} caption={f.caption} /></div>
    </VisShell>
  )
}
