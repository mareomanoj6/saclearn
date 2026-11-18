import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

/** SVG gallery of the flowchart symbols listed in the syllabus */
export function FlowSymbols() {
  const S = 'var(--accent)'
  const F = 'var(--accent-soft)'
  const items: { name: string; use: string; shape: ReactNode }[] = [
    { name: 'Terminal (Start / End)', use: 'Beginning or end of the flowchart', shape: <rect x="10" y="18" width="100" height="44" rx="22" fill={F} stroke={S} strokeWidth="2" /> },
    { name: 'Process', use: 'Arithmetic calculation / assignment', shape: <rect x="10" y="18" width="100" height="44" rx="3" fill={F} stroke={S} strokeWidth="2" /> },
    { name: 'Input / Output', use: 'Read input or print output', shape: <polygon points="28,18 110,18 92,62 10,62" fill={F} stroke={S} strokeWidth="2" /> },
    { name: 'Decision', use: 'Selection — Yes / No branch', shape: <polygon points="60,10 110,40 60,70 10,40" fill={F} stroke={S} strokeWidth="2" /> },
    { name: 'Module name (Call)', use: 'Predefined process / sub-routine', shape: <g><rect x="10" y="18" width="100" height="44" rx="3" fill={F} stroke={S} strokeWidth="2" /><line x1="22" y1="18" x2="22" y2="62" stroke={S} strokeWidth="2" /><line x1="98" y1="18" x2="98" y2="62" stroke={S} strokeWidth="2" /></g> },
    { name: 'For loop (Hexagon)', use: 'Preparation — loop counter set-up', shape: <polygon points="30,18 90,18 110,40 90,62 30,62 10,40" fill={F} stroke={S} strokeWidth="2" /> },
    { name: 'Flow-lines', use: 'Direction of control flow', shape: <g><defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={S} /></marker></defs><line x1="15" y1="40" x2="100" y2="40" stroke={S} strokeWidth="2.5" markerEnd="url(#arr)" /></g> },
    { name: 'On-page connector', use: 'Join flow on the same page', shape: <g><circle cx="60" cy="40" r="20" fill={F} stroke={S} strokeWidth="2" /><text x="60" y="45" textAnchor="middle" fontSize="14" fontWeight="700" fill={S}>A</text></g> },
    { name: 'Off-page connector', use: 'Continue on another page', shape: <g><polygon points="38,14 82,14 82,48 60,68 38,48" fill={F} stroke={S} strokeWidth="2" /><text x="60" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill={S}>P2</text></g> },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
      {items.map((it, i) => (
        <motion.div key={it.name} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
          className="card-soft p-3 flex flex-col items-center text-center hover:-translate-y-0.5 transition-transform">
          <svg viewBox="0 0 120 80" className="w-28 h-20">{it.shape}</svg>
          <div className="text-sm font-semibold mt-1">{it.name}</div>
          <div className="text-xs text-muted mt-0.5">{it.use}</div>
        </motion.div>
      ))}
    </div>
  )
}

export function VonNeumann() {
  const box = 'card-soft px-4 py-3 text-center'
  return (
    <div className="my-5 grid grid-cols-[1fr_auto_1.6fr_auto_1fr] items-center gap-2 text-sm">
      <div className={box}><div className="font-semibold">Input</div><div className="text-xs text-muted">Keyboard, mouse, scanner, mic</div></div>
      <Arrow />
      <div className="card p-3">
        <div className="label text-center mb-2">CPU</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-lg bg-accent-soft text-accent font-semibold p-2 text-center">ALU</div>
          <div className="rounded-lg bg-accent-soft text-accent font-semibold p-2 text-center">Control Unit</div>
          <div className="rounded-lg bg-accent-soft text-accent font-semibold p-2 text-center">Registers</div>
        </div>
        <div className="flex justify-center my-1 text-subtle">⇅</div>
        <div className="rounded-lg border border-dashed border-line p-2 text-center text-xs font-semibold">Memory (RAM · ROM · Cache)</div>
      </div>
      <Arrow />
      <div className={box}><div className="font-semibold">Output</div><div className="text-xs text-muted">Monitor, printer, speaker</div></div>
    </div>
  )
}
function Arrow() {
  return <motion.div className="text-accent text-xl font-bold" animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>→</motion.div>
}

export function MemoryHierarchy() {
  const rows = [
    ['Registers', 'Fastest · smallest · inside CPU'], ['Cache memory', 'Between CPU and RAM'], ['Main memory (RAM/ROM)', 'Primary memory'],
    ['Magnetic disk', 'Hard disk'], ['Optical disk', 'CD / DVD'], ['Magnetic tape', 'Slowest · largest · sequential'],
  ]
  return (
    <div className="my-5">
      <div className="label mb-2">Memory hierarchy</div>
      <div className="flex flex-col items-center gap-1.5">
        {rows.map(([n, d], i) => (
          <motion.div key={n} initial={{ opacity: 0, scaleX: 0.6 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="rounded-lg text-center py-2 px-3 text-sm border border-line"
            style={{ width: `${40 + i * 12}%`, background: `color-mix(in srgb, var(--accent) ${28 - i * 4}%, transparent)` }}>
            <span className="font-semibold">{n}</span> <span className="text-xs text-muted">· {d}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-subtle mt-2 px-2"><span>▲ faster, costlier per byte</span><span>larger capacity ▼</span></div>
    </div>
  )
}
