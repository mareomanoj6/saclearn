import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { VisShell } from './shared'

/* ---------------- a tiny Python expression engine ---------------- */
type PyVal = { v: number | boolean; t: 'int' | 'float' | 'bool' }
type Node =
  | { id: number; k: 'lit'; val: PyVal; text: string }
  | { id: number; k: 'var'; name: string }
  | { id: number; k: 'bin'; op: string; l: Node; r: Node }
  | { id: number; k: 'un'; op: string; e: Node }
  | { id: number; k: 'paren'; e: Node }

const LEVEL: Record<string, number> = { or: 13, and: 12, not: 11, '<': 10, '>': 10, '<=': 10, '>=': 10, '==': 10, '!=': 10, '|': 9, '^': 8, '&': 7, '<<': 6, '>>': 6, '+': 5, '-': 5, '*': 4, '/': 4, '//': 4, '%': 4, 'u-': 3, 'u+': 3, '~': 3, '**': 2 }

function tokenize(src: string): string[] {
  const re = /\s*(\d+\.\d*|\.\d+|\d+|[A-Za-z_]\w*|\*\*|\/\/|<<|>>|<=|>=|==|!=|[-+*/%()<>&|^~])/y
  const out: string[] = []
  let i = 0
  src = src.trim()
  while (i < src.length) {
    re.lastIndex = i
    const m = re.exec(src)
    if (!m) throw new Error(`Unexpected character "${src[i]}"`)
    out.push(m[1]); i = re.lastIndex
    while (src[i] === ' ') i++
  }
  return out
}

function parse(src: string): Node {
  const toks = tokenize(src)
  let p = 0, id = 0
  const peek = () => toks[p]
  const eat = (t?: string) => { const x = toks[p]; if (t && x !== t) throw new Error(`Expected "${t}"`); p++; return x }
  const binLevel = (ops: string[], next: () => Node) => () => {
    let l = next()
    while (ops.includes(peek())) { const op = eat(); const r = next(); l = { id: id++, k: 'bin', op, l, r } }
    return l
  }
  const atom = (): Node => {
    const t = peek()
    if (t === undefined) throw new Error('Unexpected end of expression')
    if (t === '(') { eat('('); const e = orE(); eat(')'); return { id: id++, k: 'paren', e } }
    eat()
    if (/^\d|^\./.test(t)) return { id: id++, k: 'lit', text: t, val: t.includes('.') ? { v: parseFloat(t), t: 'float' } : { v: parseInt(t), t: 'int' } }
    if (t === 'True' || t === 'False') return { id: id++, k: 'lit', text: t, val: { v: t === 'True', t: 'bool' } }
    if (/^[A-Za-z_]/.test(t)) return { id: id++, k: 'var', name: t }
    throw new Error(`Unexpected "${t}"`)
  }
  const power = (): Node => { const b = atom(); if (peek() === '**') { eat(); const e = unary(); return { id: id++, k: 'bin', op: '**', l: b, r: e } } return b }
  const unary = (): Node => { const t = peek(); if (t === '-' || t === '+' || t === '~') { eat(); return { id: id++, k: 'un', op: t === '~' ? '~' : 'u' + t, e: unary() } } return power() }
  const term = binLevel(['*', '/', '//', '%'], unary)
  const arith = binLevel(['+', '-'], term)
  const shift = binLevel(['<<', '>>'], arith)
  const band = binLevel(['&'], shift)
  const bxor = binLevel(['^'], band)
  const bor = binLevel(['|'], bxor)
  const cmp = binLevel(['<', '>', '<=', '>=', '==', '!='], bor)
  const notE = (): Node => { if (peek() === 'not') { eat(); return { id: id++, k: 'un', op: 'not', e: notE() } } return cmp() }
  const andE = binLevel(['and'], notE)
  const orE: () => Node = binLevel(['or'], andE)
  const root = orE()
  if (p < toks.length) throw new Error(`Unexpected "${toks[p]}"`)
  return root
}

const num = (x: PyVal) => (typeof x.v === 'boolean' ? (x.v ? 1 : 0) : x.v)
const truthy = (x: PyVal) => (typeof x.v === 'boolean' ? x.v : x.v !== 0)
export const repr = (x: PyVal) => x.t === 'bool' ? (x.v ? 'True' : 'False') : x.t === 'float' ? (Number.isInteger(x.v as number) ? (x.v as number).toFixed(1) : String(+(x.v as number).toPrecision(12))) : String(x.v)

function apply(op: string, a: PyVal, b: PyVal): PyVal {
  const fl = a.t === 'float' || b.t === 'float'
  const x = num(a), y = num(b)
  const n = (v: number, f = fl): PyVal => ({ v, t: f ? 'float' : 'int' })
  switch (op) {
    case '+': return n(x + y)
    case '-': return n(x - y)
    case '*': return n(x * y)
    case '/': if (y === 0) throw new Error('ZeroDivisionError: division by zero'); return n(x / y, true)
    case '//': if (y === 0) throw new Error('ZeroDivisionError: integer division by zero'); return n(Math.floor(x / y))
    case '%': if (y === 0) throw new Error('ZeroDivisionError: modulo by zero'); return n(((x % y) + y) % y)
    case '**': return n(x ** y, fl || y < 0)
    case '<': return { v: x < y, t: 'bool' }
    case '>': return { v: x > y, t: 'bool' }
    case '<=': return { v: x <= y, t: 'bool' }
    case '>=': return { v: x >= y, t: 'bool' }
    case '==': return { v: x === y, t: 'bool' }
    case '!=': return { v: x !== y, t: 'bool' }
    case '&': return n(x & y, false)
    case '|': return n(x | y, false)
    case '^': return n(x ^ y, false)
    case '<<': return n(x << y, false)
    case '>>': return n(x >> y, false)
  }
  throw new Error('Unknown operator ' + op)
}

interface Frame { reduced: Map<number, PyVal>; skipped: Set<number>; active?: number; op?: string; caption: string; error?: boolean }

function evaluate(root: Node, vars: Record<string, PyVal>): Frame[] {
  const frames: Frame[] = []
  const reduced = new Map<number, PyVal>(); const skipped = new Set<number>()
  const snap = (caption: string, active?: number, op?: string, error = false) => frames.push({ reduced: new Map(reduced), skipped: new Set(skipped), active, op, caption, error })
  const skipAll = (n: Node) => { skipped.add(n.id); if (n.k === 'bin') { skipAll(n.l); skipAll(n.r) } else if (n.k === 'un' || n.k === 'paren') skipAll(n.e) }
  snap('Original expression. Python applies operators by precedence (see the ladder), left to right within a level — except ** which is right-to-left.')
  const used = new Set<string>()
  const collect = (n: Node) => { if (n.k === 'var') used.add(n.name); else if (n.k === 'bin') { collect(n.l); collect(n.r) } else if (n.k === 'un' || n.k === 'paren') collect(n.e) }
  collect(root)
  if (used.size) {
    const subst = (n: Node) => { if (n.k === 'var') { const v = vars[n.name]; if (!v) throw new Error(`NameError: name '${n.name}' is not defined`); reduced.set(n.id, v) } else if (n.k === 'bin') { subst(n.l); subst(n.r) } else if (n.k === 'un' || n.k === 'paren') subst(n.e) }
    subst(root)
    snap('Substitute the variable values: ' + [...used].map(u => `${u} = ${repr(vars[u])}`).join(', '))
  }
  const ev = (n: Node): PyVal => {
    if (reduced.has(n.id)) return reduced.get(n.id)!
    if (n.k === 'lit') return n.val
    if (n.k === 'var') return vars[n.name]
    if (n.k === 'paren') { const v = ev(n.e); reduced.set(n.id, v); snap(`Parentheses resolved → ${repr(v)}`, n.id, '( )'); return v }
    if (n.k === 'un') {
      const v = ev(n.e)
      let r: PyVal
      if (n.op === 'not') r = { v: !truthy(v), t: 'bool' }
      else if (n.op === '~') r = { v: ~num(v), t: 'int' }
      else r = { v: n.op === 'u-' ? -num(v) : num(v), t: v.t === 'float' ? 'float' : 'int' }
      reduced.set(n.id, r)
      snap(`${n.op === 'not' ? 'not ' : n.op.replace('u', '')}${repr(v)} → ${repr(r)}  (${n.op === 'not' ? 'logical NOT' : 'unary'})`, n.id, n.op === 'not' ? 'not' : n.op.startsWith('u') ? 'u-' : '~')
      return r
    }
    if (n.op === 'and' || n.op === 'or') {
      const a = ev(n.l)
      const short = n.op === 'and' ? !truthy(a) : truthy(a)
      if (short) { skipAll(n.r); reduced.set(n.id, a); snap(`${repr(a)} ${n.op} … → ${repr(a)}  (short-circuit: the right side is never evaluated)`, n.id, n.op); return a }
      const b = ev(n.r); reduced.set(n.id, b)
      snap(`${repr(a)} ${n.op} ${repr(b)} → ${repr(b)}`, n.id, n.op); return b
    }
    const a = ev(n.l), b = ev(n.r)
    let r: PyVal
    try { r = apply(n.op, a, b) } catch (e) { snap((e as Error).message, n.id, n.op, true); throw e }
    reduced.set(n.id, r)
    snap(`${repr(a)} ${n.op} ${repr(b)} → ${repr(r)}`, n.id, n.op)
    return r
  }
  try { const v = ev(root); snap(`Final value: ${repr(v)}`, root.id) } catch { /* error frame already recorded */ }
  return frames
}

function render(n: Node, f: Frame): ReactNode {
  if (f.skipped.has(n.id)) return <span className="opacity-35 line-through decoration-1">{plain(n)}</span>
  if (f.reduced.has(n.id) && n.k !== 'lit') {
    const active = f.active === n.id
    return <motion.span key={`${n.id}-${active}`} initial={active ? { scale: 1.25 } : false} animate={{ scale: 1 }} className={`inline-block px-1.5 rounded-md font-semibold ${active ? (f.error ? 'bg-bad text-white' : 'bg-accent text-accent-fg') : 'bg-accent-soft text-accent'}`}>{repr(f.reduced.get(n.id)!)}</motion.span>
  }
  switch (n.k) {
    case 'lit': return <span>{n.text}</span>
    case 'var': return <span className="text-violet font-medium">{n.name}</span>
    case 'paren': return <span>({render(n.e, f)})</span>
    case 'un': return <span>{n.op === 'not' ? 'not ' : n.op.replace('u', '')}{render(n.e, f)}</span>
    case 'bin': return <span>{render(n.l, f)} <span className={f.active === n.id ? 'text-accent font-semibold' : 'text-subtle'}>{n.op}</span> {render(n.r, f)}</span>
  }
}
function plain(n: Node): string {
  switch (n.k) { case 'lit': return n.text; case 'var': return n.name; case 'paren': return `(${plain(n.e)})`; case 'un': return (n.op === 'not' ? 'not ' : n.op.replace('u', '')) + plain(n.e); case 'bin': return `${plain(n.l)} ${n.op} ${plain(n.r)}` }
}

function parseVars(s: string): Record<string, PyVal> {
  const out: Record<string, PyVal> = {}
  for (const part of s.split(/[,;\n]/)) {
    const m = part.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.+?)\s*$/)
    if (!m) continue
    const raw = m[2]
    if (raw === 'True' || raw === 'False') out[m[1]] = { v: raw === 'True', t: 'bool' }
    else if (!Number.isNaN(Number(raw))) out[m[1]] = raw.includes('.') ? { v: Number(raw), t: 'float' } : { v: Number(raw), t: 'int' }
  }
  return out
}

const PRESETS = [
  { e: 'A + 3 < B * 1 or C and D', v: 'A=1, B=5, C=-1, D=True', label: 'Notes example 5.4' },
  { e: 'a + b * c', v: 'a=2, b=3, c=4', label: 'd = a + b * c' },
  { e: '2 + 3 * 4 ** 2', v: '', label: 'Power first' },
  { e: '2 ** 3 ** 2', v: '', label: 'Right-assoc **' },
  { e: '7 // 2 + 7 % 2 * 10', v: '', label: '// and %' },
  { e: '(10 - 4) / 2 > 2 and not False', v: '', label: 'Logic' },
  { e: '60 & 13 | 1 << 2', v: '', label: 'Bitwise' },
]
const LADDER: [string, string[]][] = [['( )', ['( )']], ['**', ['**']], ['+x −x ~x', ['u-', '~']], ['* / // %', ['*', '/', '//', '%']], ['+ −', ['+', '-']], ['<< >>', ['<<', '>>']], ['&', ['&']], ['^', ['^']], ['|', ['|']], ['comparisons', ['<', '>', '<=', '>=', '==', '!=']], ['not', ['not']], ['and', ['and']], ['or', ['or']]]

export function PrecedenceVis() {
  const [expr, setExpr] = useState(PRESETS[0].e)
  const [vars, setVars] = useState(PRESETS[0].v)
  const result = useMemo(() => {
    try { const ast = parse(expr); return { ast, frames: evaluate(ast, parseVars(vars)) } } catch (e) { return { error: (e as Error).message } }
  }, [expr, vars])
  const frames = 'frames' in result && result.frames ? result.frames : [{ reduced: new Map(), skipped: new Set<number>(), caption: '' } as Frame]
  const s = useStepper(frames.length, 1300)
  const f = frames[Math.min(s.index, frames.length - 1)]
  return (
    <VisShell title="Operator precedence — step-by-step evaluator" desc="Type any Python expression (numbers, variables, + − * / // % **, comparisons, and/or/not, & | ^ << >>). Each step shows which operator Python applies next.">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {PRESETS.map(p => <button key={p.e} className={`btn btn-sm ${expr === p.e ? 'tab-active' : ''}`} onClick={() => { setExpr(p.e); setVars(p.v) }}>{p.label}</button>)}
      </div>
      <div className="grid sm:grid-cols-[1fr_260px] gap-2 mb-4">
        <input className="input font-mono" value={expr} onChange={e => setExpr(e.target.value)} aria-label="Expression" spellCheck={false} />
        <input className="input font-mono" value={vars} onChange={e => setVars(e.target.value)} placeholder="variables e.g. a=2, b=3" aria-label="Variables" spellCheck={false} />
      </div>
      <div className="grid lg:grid-cols-[1fr_200px] gap-4">
        <div className="rounded-2xl border border-line bg-surface grid-bg p-6 min-h-[150px] flex items-center justify-center">
          {'error' in result ? <div className="text-bad font-mono text-sm">SyntaxError: {result.error}</div> : (
            <div className="font-mono text-xl sm:text-2xl leading-loose text-center break-words">{render(result.ast!, f)}</div>
          )}
        </div>
        <div className="card-soft p-3">
          <div className="label mb-2">Precedence ladder</div>
          {LADDER.map(([label, ops], i) => {
            const on = f.op ? ops.includes(f.op) || (f.op === 'u-' && ops.includes('u-')) : false
            return <div key={label} className={`flex items-center gap-2 text-xs font-mono px-2 py-1 rounded-md ${on ? 'bg-accent text-accent-fg font-semibold' : 'text-muted'}`}><span className="w-4 text-right opacity-60">{i + 1}</span>{label}</div>
          })}
        </div>
      </div>
      <div className="mt-4"><PlayerControls s={s} caption={f.caption} /></div>
    </VisShell>
  )
}
