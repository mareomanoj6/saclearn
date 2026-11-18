import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { highlight } from '../lib/highlight'
import { VisShell, parseNums } from './shared'

type Vars = Record<string, string | number>
interface Frame { line: number; vars: Vars; out: string[]; note: string }

interface Program { id: string; name: string; lines: string[]; input: string; inputHint: string; run: (inp: number[], t: Tracer) => void }

class Tracer {
  frames: Frame[] = []
  vars: Vars = {}
  out: string[] = []
  at(line: number, note: string) { this.frames.push({ line, vars: { ...this.vars }, out: [...this.out], note }); if (this.frames.length > 400) throw new Error('too many steps') }
  print(s: string | number) { this.out.push(String(s)) }
}

const grade = (m: number) => m >= 90 ? 'S' : m >= 85 ? 'A+' : m >= 80 ? 'A' : m >= 75 ? 'B+' : m >= 70 ? 'B' : m >= 65 ? 'C+' : m >= 60 ? 'C' : m >= 55 ? 'D' : m >= 50 ? 'P' : 'F'

const PROGRAMS: Program[] = [
  {
    id: 'for', name: 'Sum of n — FOR', input: '4, 10, 20, 30, 40', inputHint: 'n, then n numbers',
    lines: ['START', 'INPUT n', 'SET sum = 0', 'FOR i = 1 TO n', '    INPUT x', '    sum = sum + x', 'ENDFOR', 'PRINT sum', 'STOP'],
    run: ([n = 0, ...xs], t) => {
      t.at(0, 'Begin.'); t.vars.n = n; t.at(1, `Read n = ${n}.`); t.vars.sum = 0; t.at(2, 'Initialise the accumulator.')
      for (let i = 1; i <= n; i++) {
        t.vars.i = i; t.at(3, `Loop variable i = ${i} (≤ ${n}), enter the body.`)
        const x = xs[i - 1] ?? 0; t.vars.x = x; t.at(4, `Read x = ${x}.`)
        t.vars.sum = Number(t.vars.sum) + x; t.at(5, `sum = ${Number(t.vars.sum) - x} + ${x} = ${t.vars.sum}.`); t.at(6, 'End of body — go back to FOR.')
      }
      t.vars.i = n + 1; t.at(3, `i = ${n + 1} > n, the loop ends (definite iteration: exactly n passes).`)
      t.print(t.vars.sum); t.at(7, `Output ${t.vars.sum}.`); t.at(8, 'Done.')
    },
  },
  {
    id: 'while', name: 'Sum of n — WHILE', input: '4, 10, 20, 30, 40', inputHint: 'n, then n numbers',
    lines: ['START', 'INPUT n', 'SET sum = 0, i = 1', 'WHILE i <= n', '    INPUT x', '    sum = sum + x', '    i = i + 1', 'ENDWHILE', 'PRINT sum', 'STOP'],
    run: ([n = 0, ...xs], t) => {
      t.at(0, 'Begin.'); t.vars.n = n; t.at(1, `Read n = ${n}.`); t.vars.sum = 0; t.vars.i = 1; t.at(2, 'Initialise sum and the counter.')
      let i = 1
      while (true) {
        t.at(3, `Check i <= n → ${i} <= ${n} is ${i <= n ? 'TRUE: enter' : 'FALSE: exit (entry-controlled — checked first)'}.`)
        if (i > n) break
        const x = xs[i - 1] ?? 0; t.vars.x = x; t.at(4, `Read x = ${x}.`)
        t.vars.sum = Number(t.vars.sum) + x; t.at(5, `sum = ${t.vars.sum}.`)
        i++; t.vars.i = i; t.at(6, `i = ${i}.`); t.at(7, 'Back to the WHILE test.')
      }
      t.print(t.vars.sum); t.at(8, `Output ${t.vars.sum}.`); t.at(9, 'Done.')
    },
  },
  {
    id: 'repeat', name: 'Sum of n — REPEAT-UNTIL', input: '4, 10, 20, 30, 40', inputHint: 'n, then n numbers',
    lines: ['START', 'INPUT n', 'SET sum = 0, i = 1', 'REPEAT', '    INPUT x', '    sum = sum + x', '    i = i + 1', 'UNTIL i > n', 'PRINT sum', 'STOP'],
    run: ([n = 0, ...xs], t) => {
      t.at(0, 'Begin.'); t.vars.n = n; t.at(1, `Read n = ${n}.`); t.vars.sum = 0; t.vars.i = 1; t.at(2, 'Initialise sum and the counter.')
      let i = 1
      while (true) {
        t.at(3, 'REPEAT — the body runs before any test (exit-controlled).')
        const x = xs[i - 1] ?? 0; t.vars.x = x; t.at(4, `Read x = ${x}.`)
        t.vars.sum = Number(t.vars.sum) + x; t.at(5, `sum = ${t.vars.sum}.`)
        i++; t.vars.i = i; t.at(6, `i = ${i}.`)
        t.at(7, `UNTIL i > n → ${i} > ${n} is ${i > n ? 'TRUE: stop' : 'FALSE: repeat'}.`)
        if (i > n) break
      }
      t.print(t.vars.sum); t.at(8, `Output ${t.vars.sum}.`); t.at(9, 'Done.')
    },
  },
  {
    id: 'fact', name: 'Factorial', input: '5', inputHint: 'n',
    lines: ['START', 'INPUT n', 'SET fact = 1', 'FOR i = 1 TO n', '    fact = fact * i', 'ENDFOR', 'PRINT fact', 'STOP'],
    run: ([n = 0], t) => {
      t.at(0, 'Begin.'); t.vars.n = n; t.at(1, `Read n = ${n}.`); t.vars.fact = 1; t.at(2, 'fact starts at 1 (the multiplicative identity).')
      for (let i = 1; i <= n; i++) { t.vars.i = i; t.at(3, `i = ${i}.`); t.vars.fact = Number(t.vars.fact) * i; t.at(4, `fact = ${Number(t.vars.fact) / i} × ${i} = ${t.vars.fact}.`); t.at(5, 'Next i.') }
      t.vars.i = n + 1; t.at(3, 'Loop finished.'); t.print(t.vars.fact); t.at(6, `Output ${t.vars.fact}.`); t.at(7, 'Done.')
    },
  },
  {
    id: 'largest', name: 'Largest of n', input: '5, 12, 75, 34, 99, 45', inputHint: 'n, then n numbers',
    lines: ['START', 'INPUT n', 'INPUT x', 'SET largest = x', 'FOR i = 2 TO n', '    INPUT x', '    IF x > largest THEN', '        largest = x', '    ENDIF', 'ENDFOR', 'PRINT largest', 'STOP'],
    run: ([n = 0, ...xs], t) => {
      t.at(0, 'Begin.'); t.vars.n = n; t.at(1, `Read n = ${n}.`)
      t.vars.x = xs[0] ?? 0; t.at(2, `Read the first number x = ${t.vars.x}.`); t.vars.largest = t.vars.x; t.at(3, 'Assume the first number is the largest so far.')
      for (let i = 2; i <= n; i++) {
        t.vars.i = i; t.at(4, `i = ${i}.`); const x = xs[i - 1] ?? 0; t.vars.x = x; t.at(5, `Read x = ${x}.`)
        const big = x > Number(t.vars.largest); t.at(6, `Is ${x} > ${t.vars.largest}? ${big ? 'YES' : 'NO'}.`)
        if (big) { t.vars.largest = x; t.at(7, `New largest = ${x}.`) }
        t.at(8, 'End IF.')
      }
      t.at(9, 'Loop finished.'); t.print(t.vars.largest); t.at(10, `Output ${t.vars.largest}.`); t.at(11, 'Done.')
    },
  },
  {
    id: 'smallest3', name: 'Smallest of three', input: '42, 17, 29', inputHint: 'a, b, c',
    lines: ['START', 'INPUT a, b, c', 'IF a < b AND a < c THEN', '    PRINT a', 'ELSE IF b < c THEN', '    PRINT b', 'ELSE', '    PRINT c', 'ENDIF', 'STOP'],
    run: ([a = 0, b = 0, c = 0], t) => {
      t.at(0, 'Begin.'); Object.assign(t.vars, { a, b, c }); t.at(1, `Read a = ${a}, b = ${b}, c = ${c}.`)
      const c1 = a < b && a < c; t.at(2, `${a} < ${b} AND ${a} < ${c} → ${c1 ? 'TRUE' : 'FALSE'}.`)
      if (c1) { t.print(a); t.at(3, `Output ${a}.`) } else {
        const c2 = b < c; t.at(4, `${b} < ${c} → ${c2 ? 'TRUE' : 'FALSE'}.`)
        if (c2) { t.print(b); t.at(5, `Output ${b}.`) } else { t.at(6, 'Otherwise…'); t.print(c); t.at(7, `Output ${c}.`) }
      }
      t.at(8, 'End of selection.'); t.at(9, 'Done.')
    },
  },
  {
    id: 'grade', name: 'KTU grade (CASE)', input: '87', inputHint: 'marks out of 100',
    lines: ['START', 'INPUT marks', 'SET band = marks / 5   // integer part', 'SWITCH (band)', '  CASE 20,19,18: PRINT "S"   BREAK', '  CASE 17: PRINT "A+"  BREAK', '  CASE 16: PRINT "A"   BREAK', '  CASE 15: PRINT "B+"  BREAK', '  CASE 14: PRINT "B"   BREAK', '  CASE 13: PRINT "C+"  BREAK', '  CASE 12: PRINT "C"   BREAK', '  CASE 11: PRINT "D"   BREAK', '  CASE 10: PRINT "P"   BREAK', '  DEFAULT: PRINT "F"', 'ENDSWITCH', 'STOP'],
    run: ([m = 0], t) => {
      t.at(0, 'Begin.'); t.vars.marks = m; t.at(1, `Read marks = ${m}.`)
      const band = Math.floor(Math.min(100, Math.max(0, m)) / 5); t.vars.band = band; t.at(2, `band = ${m} / 5 = ${band}.`)
      t.at(3, `Compare band = ${band} with each CASE.`)
      const g = grade(m); const order = ['S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'P']
      const idx = order.indexOf(g)
      for (let k = 0; k < (idx < 0 ? order.length : idx); k++) t.at(4 + k, 'No match — next case.')
      if (idx >= 0) { t.print(g); t.at(4 + idx, `Match! Grade ${g}. BREAK leaves the switch.`) } else { t.print('F'); t.at(13, 'No case matched → DEFAULT: grade F.') }
      t.at(14, 'End of switch.'); t.at(15, 'Done.')
    },
  },
  {
    id: 'desc', name: 'Print 50 → 1', input: '50', inputHint: 'start value',
    lines: ['START', 'FOR i = 50 DOWNTO 1', '    PRINT i', 'ENDFOR', 'STOP'],
    run: ([n = 50], t) => {
      n = Math.min(Math.max(1, n), 60)
      t.at(0, 'Begin.')
      for (let i = n; i >= 1; i--) { t.vars.i = i; t.at(1, `i = ${i}.`); t.print(i); t.at(2, `Print ${i}.`) }
      t.vars.i = 0; t.at(3, 'i = 0 < 1 → loop ends.'); t.at(4, 'Done.')
    },
  },
]

export function PseudoTracerVis() {
  const [pid, setPid] = useState('for')
  const prog = PROGRAMS.find(p => p.id === pid)!
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const inp = inputs[pid] ?? prog.input
  const frames = useMemo(() => {
    const t = new Tracer()
    try { prog.run(parseNums(inp, 20), t) } catch { /* step cap */ }
    return t.frames.length ? t.frames : [{ line: 0, vars: {}, out: [], note: '' }]
  }, [prog, inp])
  const s = useStepper(frames.length, 700)
  const f = frames[Math.min(s.index, frames.length - 1)]
  return (
    <VisShell title="Pseudocode tracer" desc="Pick a KTU sample problem, change the input, and watch the current line, the variable table and the output — like a dry run on paper.">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {PROGRAMS.map(p => <button key={p.id} className={`btn btn-sm ${pid === p.id ? 'tab-active' : ''}`} onClick={() => setPid(p.id)}>{p.name}</button>)}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
        <span className="text-subtle">Input ({prog.inputHint}):</span>
        <input className="input font-mono w-64" value={inp} onChange={e => setInputs(o => ({ ...o, [pid]: e.target.value }))} />
      </div>
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-4">
        <div className="code-block py-3">
          {prog.lines.map((l, i) => (
            <div key={i} className="relative flex px-4 py-[3px]">
              {f.line === i && <motion.div layoutId="pseudo-line" className="absolute inset-0 bg-[#38bdf8]/15 border-l-[3px] border-[#38bdf8]" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative w-7 text-[#475569] select-none">{i + 1}</span>
              <span className="relative whitespace-pre">{highlight(l, 'pseudo')}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="card overflow-hidden">
            <div className="px-4 py-2 bg-surface border-b border-line label">Variables</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3">
              {Object.keys(f.vars).length === 0 && <div className="text-sm text-subtle col-span-3">— none yet —</div>}
              {Object.entries(f.vars).map(([k, v]) => (
                <div key={k} className="rounded-lg border border-line px-3 py-1.5">
                  <div className="text-[11px] text-subtle font-mono">{k}</div>
                  <motion.div key={String(v)} initial={{ color: 'var(--accent)', scale: 1.15 }} animate={{ color: 'var(--fg)', scale: 1 }} className="font-mono font-bold">{v}</motion.div>
                </div>
              ))}
            </div>
          </div>
          <div className="code-block p-3 min-h-[90px] max-h-[160px] overflow-auto">
            <div className="text-[10px] uppercase tracking-widest text-code-muted font-sans font-bold mb-1">Output</div>
            <div className="text-code-ok break-words">{f.out.join(' ') || ' '}</div>
          </div>
        </div>
      </div>
      <div className="mt-4"><PlayerControls s={s} caption={f.note} /></div>
    </VisShell>
  )
}
