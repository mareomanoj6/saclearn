import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useStepper } from '../lib/useStepper'
import { PlayerControls } from '../components/PlayerControls'
import { VisShell } from './shared'

const POS: Record<string, [number, number]> = { X: [60, 150], A: [200, 70], B: [340, 30], C: [340, 110], D: [200, 230], E: [340, 190], F: [340, 270], G: [480, 270] }
const ADJ: Record<string, string[]> = { X: ['A', 'D'], A: ['B', 'C'], D: ['E', 'F'], F: ['G'], B: [], C: [], E: [], G: [] }
const EDGES = Object.entries(ADJ).flatMap(([a, bs]) => bs.map(b => [a, b] as const))

interface Frame { path: string[]; dead: string[]; tried: string[]; caption: string; found?: boolean }

function build(): Frame[] {
  const frames: Frame[] = []
  const dead = new Set<string>(); const tried = new Set<string>()
  const snap = (path: string[], caption: string, found = false) => frames.push({ path: [...path], dead: [...dead], tried: [...tried], caption, found })
  const dfs = (node: string, path: string[]): boolean => {
    tried.add(node)
    snap(path, path.length === 1 ? `Start at ${node}.` : `Move forward to ${node}. Path: ${path.join(' → ')}`)
    if (node === 'G') { snap(path, `Reached G — success! Final path ${path.join(' → ')}`, true); return true }
    for (const nx of ADJ[node]) { if (dfs(nx, [...path, nx])) return true }
    dead.add(node)
    if (path.length > 1) snap(path.slice(0, -1), `${node} is a dead end, so backtrack to ${path[path.length - 2]} and try another option.`)
    return false
  }
  dfs('X', ['X'])
  return frames
}

export function BacktrackVis() {
  const frames = useMemo(build, [])
  const s = useStepper(frames.length, 1000)
  const f = frames[s.index]
  const cur = f.path[f.path.length - 1]
  const onPath = (a: string, b: string) => { const i = f.path.indexOf(a); return i >= 0 && f.path[i + 1] === b }
  return (
    <VisShell title="Backtracking — find a path from X to G" desc="Go as deep as possible; on a dead end, undo the last step and try the next unexplored option.">
      <div className="rounded-2xl bg-surface border border-line grid-bg overflow-hidden">
        <svg viewBox="0 0 540 300" className="w-full max-h-[320px]">
          {EDGES.map(([a, b]) => {
            const active = onPath(a, b)
            return <motion.line key={a + b} x1={POS[a][0]} y1={POS[a][1]} x2={POS[b][0]} y2={POS[b][1]} strokeWidth={active ? 4 : 2}
              animate={{ stroke: active ? (f.found ? 'var(--good)' : 'var(--accent)') : 'var(--line)' }} strokeLinecap="round" />
          })}
          {Object.entries(POS).map(([k, [x, y]]) => {
            const isDead = f.dead.includes(k); const isCur = k === cur; const inPath = f.path.includes(k)
            const fill = k === 'G' && f.found ? 'var(--good)' : isDead ? 'var(--bad)' : isCur ? 'var(--accent)' : inPath ? 'var(--accent-soft)' : 'var(--elevated)'
            return (
              <g key={k}>
                {isCur && <motion.circle cx={x} cy={y} r={30} fill="none" stroke="var(--accent)" strokeWidth={2} initial={{ opacity: 0.8, scale: 0.8 }} animate={{ opacity: [0.7, 0], scale: [0.9, 1.3] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ transformOrigin: `${x}px ${y}px` }} />}
                <motion.circle cx={x} cy={y} r={22} animate={{ fill }} stroke={isCur ? 'var(--accent)' : 'var(--line)'} strokeWidth={2} />
                <text x={x} y={y + 5} textAnchor="middle" fontWeight={700} fontSize={15} fill={isDead || isCur || (k === 'G' && f.found) ? '#fff' : 'var(--fg)'}>{k}</text>
                {isDead && <text x={x} y={y - 30} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--bad)">dead end</text>}
                {k === 'X' && <text x={x} y={y + 40} textAnchor="middle" fontSize={11} fill="var(--subtle)">start</text>}
                {k === 'G' && <text x={x} y={y + 40} textAnchor="middle" fontSize={11} fill="var(--subtle)">goal</text>}
              </g>
            )
          })}
        </svg>
      </div>
      <div className="flex flex-wrap gap-2 my-3 text-xs">
        <span className="chip">● current</span><span className="chip" style={{ color: 'var(--bad)', background: 'var(--bad-soft)' }}>● dead end</span><span className="chip" style={{ color: 'var(--good)', background: 'var(--good-soft)' }}>● success</span>
        <span className="chip chip-muted font-mono">Path: {f.path.join(' → ')}</span>
      </div>
      <PlayerControls s={s} caption={f.caption} />
    </VisShell>
  )
}
