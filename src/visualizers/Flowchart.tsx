import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { VisShell, parseNums } from './shared'

type NT = 'term' | 'io' | 'proc' | 'dec'
interface FNode { id: string; t: NT; x: number; y: number; text: string; w?: number }
type Side = 'top' | 'bottom' | 'left' | 'right'
interface FEdge { from: string; to: string; fs?: Side; ts?: Side; via?: [number, number][]; label?: string }
interface Step { node: string; vars: Record<string, number | string>; out: string[]; note: string }
interface Chart { id: string; name: string; h: number; nodes: FNode[]; edges: FEdge[]; input: string; hint: string; run: (v: number[]) => Step[] }

const DIM: Record<NT, [number, number]> = { term: [130, 40], io: [170, 44], proc: [170, 44], dec: [180, 74] }
const size = (n: FNode): [number, number] => [n.w ?? DIM[n.t][0], DIM[n.t][1]]
function anchor(n: FNode, s: Side): [number, number] {
  const [w, h] = size(n)
  return s === 'top' ? [n.x, n.y - h / 2] : s === 'bottom' ? [n.x, n.y + h / 2] : s === 'left' ? [n.x - w / 2, n.y] : [n.x + w / 2, n.y]
}

function runner() {
  const steps: Step[] = []; const vars: Record<string, number | string> = {}; const out: string[] = []
  return { steps, vars, out, at: (node: string, note: string) => steps.push({ node, vars: { ...vars }, out: [...out], note }) }
}

const CHARTS: Chart[] = [
  {
    id: 'si', name: 'Simple interest (sequence)', h: 360, input: '10000, 8, 2', hint: 'P, R, T',
    nodes: [
      { id: 's', t: 'term', x: 260, y: 30, text: 'Start' }, { id: 'in', t: 'io', x: 260, y: 105, text: 'Input P, R, T' },
      { id: 'p', t: 'proc', x: 260, y: 180, text: 'SI = P × R × T / 100', w: 200 }, { id: 'o', t: 'io', x: 260, y: 255, text: 'Print SI' }, { id: 'e', t: 'term', x: 260, y: 330, text: 'Stop' },
    ],
    edges: [{ from: 's', to: 'in' }, { from: 'in', to: 'p' }, { from: 'p', to: 'o' }, { from: 'o', to: 'e' }],
    run: ([P = 0, R = 0, T = 0]) => {
      const r = runner(); r.at('s', 'Start.'); Object.assign(r.vars, { P, R, T }); r.at('in', `Read P = ${P}, R = ${R}, T = ${T}.`)
      r.vars.SI = (P * R * T) / 100; r.at('p', `SI = ${P} × ${R} × ${T} / 100 = ${r.vars.SI}.`); r.out.push(String(r.vars.SI)); r.at('o', `Print ${r.vars.SI}.`); r.at('e', 'Stop. Pure sequence — every symbol executed once, in order.'); return r.steps
    },
  },
  {
    id: 'larger', name: 'Larger of two (decision)', h: 420, input: '12, 30', hint: 'a, b',
    nodes: [
      { id: 's', t: 'term', x: 260, y: 30, text: 'Start' }, { id: 'in', t: 'io', x: 260, y: 105, text: 'Input a, b' }, { id: 'd', t: 'dec', x: 260, y: 200, text: 'a > b ?' },
      { id: 'pa', t: 'io', x: 100, y: 300, text: 'Print a', w: 140 }, { id: 'pb', t: 'io', x: 420, y: 300, text: 'Print b', w: 140 }, { id: 'e', t: 'term', x: 260, y: 385, text: 'Stop' },
    ],
    edges: [{ from: 's', to: 'in' }, { from: 'in', to: 'd' }, { from: 'd', to: 'pa', fs: 'left', via: [[100, 200]], label: 'Yes' }, { from: 'd', to: 'pb', fs: 'right', via: [[420, 200]], label: 'No' },
      { from: 'pa', to: 'e', ts: 'left', via: [[100, 385]] }, { from: 'pb', to: 'e', ts: 'right', via: [[420, 385]] }],
    run: ([a = 0, b = 0]) => {
      const r = runner(); r.at('s', 'Start.'); Object.assign(r.vars, { a, b }); r.at('in', `Read a = ${a}, b = ${b}.`)
      const yes = a > b; r.at('d', `Decision: is ${a} > ${b}? ${yes ? 'Yes → left branch' : 'No → right branch'}.`)
      r.out.push(String(yes ? a : b)); r.at(yes ? 'pa' : 'pb', `Print ${yes ? a : b}.`); r.at('e', 'Stop. Only one branch ran.'); return r.steps
    },
  },
  {
    id: 'smallest', name: 'Smallest of three (nested decision)', h: 510, input: '42, 17, 29', hint: 'a, b, c',
    nodes: [
      { id: 's', t: 'term', x: 240, y: 30, text: 'Start' }, { id: 'in', t: 'io', x: 240, y: 105, text: 'Input a, b, c' }, { id: 'd1', t: 'dec', x: 240, y: 195, text: 'a<b and a<c ?', w: 190 },
      { id: 'pa', t: 'io', x: 85, y: 300, text: 'Print a', w: 130 }, { id: 'd2', t: 'dec', x: 395, y: 300, text: 'b < c ?', w: 160 },
      { id: 'pb', t: 'io', x: 300, y: 400, text: 'Print b', w: 130 }, { id: 'pc', t: 'io', x: 480, y: 400, text: 'Print c', w: 130 }, { id: 'e', t: 'term', x: 240, y: 475, text: 'Stop' },
    ],
    edges: [{ from: 's', to: 'in' }, { from: 'in', to: 'd1' }, { from: 'd1', to: 'pa', fs: 'left', via: [[85, 195]], label: 'Yes' }, { from: 'd1', to: 'd2', fs: 'right', via: [[395, 195]], label: 'No' },
      { from: 'd2', to: 'pb', fs: 'left', via: [[300, 300]], label: 'Yes' }, { from: 'd2', to: 'pc', fs: 'right', via: [[480, 300]], label: 'No' },
      { from: 'pa', to: 'e', ts: 'left', via: [[85, 475]] }, { from: 'pb', to: 'e', via: [[300, 440], [240, 440]] }, { from: 'pc', to: 'e', ts: 'right', via: [[480, 475]] }],
    run: ([a = 0, b = 0, c = 0]) => {
      const r = runner(); r.at('s', 'Start.'); Object.assign(r.vars, { a, b, c }); r.at('in', `Read a = ${a}, b = ${b}, c = ${c}.`)
      const y1 = a < b && a < c; r.at('d1', `Is ${a} smaller than both ${b} and ${c}? ${y1 ? 'Yes' : 'No'}.`)
      if (y1) { r.out.push(String(a)); r.at('pa', `Print ${a}.`) } else {
        const y2 = b < c; r.at('d2', `Is ${b} < ${c}? ${y2 ? 'Yes' : 'No'}.`)
        r.out.push(String(y2 ? b : c)); r.at(y2 ? 'pb' : 'pc', `Print ${y2 ? b : c}.`)
      }
      r.at('e', 'Stop.'); return r.steps
    },
  },
  {
    id: 'fact', name: 'Factorial (loop)', h: 480, input: '4', hint: 'n',
    nodes: [
      { id: 's', t: 'term', x: 220, y: 30, text: 'Start' }, { id: 'in', t: 'io', x: 220, y: 100, text: 'Input n' }, { id: 'init', t: 'proc', x: 220, y: 170, text: 'fact = 1, i = 1' },
      { id: 'd', t: 'dec', x: 220, y: 260, text: 'i ≤ n ?' }, { id: 'm', t: 'proc', x: 220, y: 355, text: 'fact = fact × i' }, { id: 'inc', t: 'proc', x: 220, y: 425, text: 'i = i + 1' },
      { id: 'o', t: 'io', x: 440, y: 355, text: 'Print fact', w: 150 }, { id: 'e', t: 'term', x: 440, y: 440, text: 'Stop' },
    ],
    edges: [{ from: 's', to: 'in' }, { from: 'in', to: 'init' }, { from: 'init', to: 'd' }, { from: 'd', to: 'm', label: 'Yes' }, { from: 'm', to: 'inc' },
      { from: 'inc', to: 'd', fs: 'left', ts: 'left', via: [[60, 425], [60, 260]] }, { from: 'd', to: 'o', fs: 'right', via: [[440, 260]], label: 'No' }, { from: 'o', to: 'e' }],
    run: ([n = 0]) => {
      n = Math.min(Math.max(0, Math.floor(n)), 8)
      const r = runner(); r.at('s', 'Start.'); r.vars.n = n; r.at('in', `Read n = ${n}.`)
      r.vars.fact = 1; r.vars.i = 1; r.at('init', 'Initialise fact = 1 and counter i = 1.')
      let fact = 1, i = 1
      while (true) {
        r.at('d', `Is i (${i}) ≤ n (${n})? ${i <= n ? 'Yes → loop body' : 'No → exit loop'}.`)
        if (i > n) break
        fact *= i; r.vars.fact = fact; r.at('m', `fact = ${fact / i} × ${i} = ${fact}.`)
        i++; r.vars.i = i; r.at('inc', `i = ${i}. Flow line goes back up to the decision.`)
      }
      r.out.push(String(fact)); r.at('o', `Print ${fact}.`); r.at('e', 'Stop.'); return r.steps
    },
  },
]

function Shape({ n, active, visited }: { n: FNode; active: boolean; visited: boolean }) {
  const [w, h] = size(n)
  const fill = active ? 'var(--accent)' : visited ? 'var(--accent-soft)' : 'var(--elevated)'
  const stroke = active || visited ? 'var(--accent)' : 'var(--subtle)'
  const p = { fill, stroke, strokeWidth: active ? 2.5 : 1.6 }
  const x = n.x - w / 2, y = n.y - h / 2
  let shape
  if (n.t === 'term') shape = <rect x={x} y={y} width={w} height={h} rx={h / 2} {...p} />
  else if (n.t === 'proc') shape = <rect x={x} y={y} width={w} height={h} rx={4} {...p} />
  else if (n.t === 'io') shape = <polygon points={`${x + 16},${y} ${x + w},${y} ${x + w - 16},${y + h} ${x},${y + h}`} {...p} />
  else shape = <polygon points={`${n.x},${y} ${x + w},${n.y} ${n.x},${y + h} ${x},${n.y}`} {...p} />
  return (
    <g>
      {active && <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={14} fill="var(--accent)" opacity={0.12} />}
      {shape}
      <text x={n.x} y={n.y + 4.5} textAnchor="middle" fontSize={13} fontWeight={600} fill={active ? 'var(--accent-fg)' : 'var(--fg)'}>{n.text}</text>
    </g>
  )
}

export function FlowchartVis() {
  const [cid, setCid] = useState('fact')
  const chart = CHARTS.find(c => c.id === cid)!
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const inp = inputs[cid] ?? chart.input
  const steps = useMemo(() => chart.run(parseNums(inp, 3)), [chart, inp])
  const s = useStepper(steps.length, 900)
  const st = steps[Math.min(s.index, steps.length - 1)]
  const byId = Object.fromEntries(chart.nodes.map(n => [n.id, n]))
  const visited = new Set(steps.slice(0, s.index + 1).map(x => x.node))
  const cur = byId[st.node]
  return (
    <VisShell title="Flowchart animator" desc="A token travels through the flowchart exactly as the algorithm executes. Change the input and watch a different branch light up.">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {CHARTS.map(c => <button key={c.id} className={`btn btn-sm ${cid === c.id ? 'tab-active' : ''}`} onClick={() => setCid(c.id)}>{c.name}</button>)}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
        <span className="text-subtle">Input ({chart.hint}):</span>
        <input className="input font-mono w-48" value={inp} onChange={e => setInputs(o => ({ ...o, [cid]: e.target.value }))} />
      </div>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className="rounded-2xl border border-line bg-surface grid-bg p-2">
          <svg viewBox={`0 0 560 ${chart.h}`} className="w-full" style={{ maxHeight: 520 }}>
            <defs><marker id="fc-arr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="var(--subtle)" /></marker></defs>
            {chart.edges.map((e, i) => {
              const a = anchor(byId[e.from], e.fs ?? 'bottom'); const b = anchor(byId[e.to], e.ts ?? 'top')
              const pts = [a, ...(e.via ?? []), b]
              const lp = e.via?.[0] ?? [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
              return (
                <g key={i}>
                  <polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke="var(--subtle)" strokeWidth={1.6} markerEnd="url(#fc-arr)" />
                  {e.label && <text x={lp[0] + (e.fs === 'left' ? -8 : e.fs === 'right' ? 8 : 10)} y={lp[1] - 7} textAnchor={e.fs === 'left' ? 'end' : 'start'} fontSize={12} fontWeight={700} fill={e.label === 'Yes' ? 'var(--good)' : 'var(--bad)'}>{e.label}</text>}
                </g>
              )
            })}
            {chart.nodes.map(n => <Shape key={n.id} n={n} active={n.id === st.node} visited={visited.has(n.id)} />)}
            <motion.circle r={7} fill="var(--warn)" stroke="#fff" strokeWidth={2} initial={false} animate={{ cx: cur.x + size(cur)[0] / 2 + 4, cy: cur.y - size(cur)[1] / 2 + 2 }} transition={{ type: 'spring', stiffness: 170, damping: 20 }} />
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          <div className="card overflow-hidden">
            <div className="px-4 py-2 bg-surface border-b border-line label">Variables</div>
            <table className="tbl"><tbody>
              {Object.entries(st.vars).map(([k, v]) => <tr key={k}><td className="font-mono">{k}</td><td><motion.span key={String(v)} initial={{ color: 'var(--accent)' }} animate={{ color: 'var(--muted)' }} className="font-mono font-bold">{v}</motion.span></td></tr>)}
              {Object.keys(st.vars).length === 0 && <tr><td className="text-subtle">— none yet —</td></tr>}
            </tbody></table>
          </div>
          <div className="code-block p-3 min-h-[70px]">
            <div className="text-[10px] uppercase tracking-widest text-code-muted font-sans font-bold mb-1">Output</div>
            <div className="text-code-ok">{st.out.join(' ') || ' '}</div>
          </div>
          <div className="card-soft p-3 text-xs text-muted space-y-1">
            <div><b className="text-fg">Oval</b> start/stop · <b className="text-fg">Parallelogram</b> input/output</div>
            <div><b className="text-fg">Rectangle</b> process · <b className="text-fg">Diamond</b> decision</div>
          </div>
        </div>
      </div>
      <div className="mt-4"><PlayerControls s={s} caption={st.note} /></div>
    </VisShell>
  )
}
