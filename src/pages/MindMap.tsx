import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Expand, Shrink, ExternalLink } from 'lucide-react'
import { MODULES, MODULE_ACCENT, COURSE } from '../data/syllabus'
import { go } from '../lib/router'

interface MNode { id: string; label: string; depth: number; children: MNode[]; color: string; topicId?: string; full?: string }

function tree(): MNode {
  return {
    id: 'root', label: COURSE.title, depth: 0, color: '#2563EB',
    children: MODULES.map(m => ({
      id: 'm' + m.id, label: `Module ${m.id} · ${m.title}`, depth: 1, color: MODULE_ACCENT[m.id].from,
      children: m.topics.map(t => ({
        id: t.id, label: t.title, depth: 2, color: MODULE_ACCENT[m.id].from, topicId: t.id,
        children: t.subtopics.map((s, i) => ({ id: `${t.id}-s${i}`, label: s.length > 52 ? s.slice(0, 50) + '…' : s, full: s, depth: 3, color: MODULE_ACCENT[m.id].to, children: [], topicId: t.id })),
      })),
    })),
  }
}

const COLX = [20, 350, 730, 1080]
const ROW = 34
const CAP = [300, 340, 310, 340]
const textW = (s: string, d: number) => Math.min(CAP[d], s.length * (d === 0 ? 8.4 : d === 3 ? 6.4 : 7.2) + 28)

export function MindMap() {
  const root = useMemo(tree, [])
  const [open, setOpen] = useState<Set<string>>(() => new Set(['root', 'm1', 'm2', 'm3', 'm4']))
  const [zoom, setZoom] = useState(1)
  const [hover, setHover] = useState<string | null>(null)

  const layout = useMemo(() => {
    const pos: { n: MNode; x: number; y: number; parent?: MNode }[] = []
    let row = 0
    const place = (n: MNode, parent?: MNode): number => {
      const kids = open.has(n.id) ? n.children : []
      let y: number
      if (!kids.length) { y = row * ROW + 30; row++ }
      else { const ys = kids.map(k => place(k, n)); y = (ys[0] + ys[ys.length - 1]) / 2 }
      pos.push({ n, x: COLX[n.depth], y, parent })
      return y
    }
    place(root)
    return { pos, h: row * ROW + 40 }
  }, [root, open])

  const byId = new Map(layout.pos.map(p => [p.n.id, p]))
  const toggle = (id: string) => setOpen(o => { const nx = new Set(o); nx.has(id) ? nx.delete(id) : nx.add(id); return nx })
  const all = () => { const s = new Set<string>(); const walk = (n: MNode) => { s.add(n.id); n.children.forEach(walk) }; walk(root); setOpen(s) }
  const W = 1460

  return (
    <div className="mx-auto max-w-[1440px] px-4 lg:px-6 py-8">
      <div className="flex flex-wrap items-end gap-3 mb-5">
        <div><div className="label">Interactive mind map</div><h1 className="text-2xl font-medium">The whole course on one canvas</h1>
          <p className="text-sm text-muted mt-1">Click a module or topic to expand/collapse. Use the ↗ icon on a topic to open its workspace.</p></div>
        <div className="ml-auto flex gap-2">
          <button className="btn btn-sm" onClick={all}><Expand size={14} />Expand all</button>
          <button className="btn btn-sm" onClick={() => setOpen(new Set(['root']))}><Shrink size={14} />Collapse</button>
          <button className="btn btn-sm btn-icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} aria-label="Zoom out"><ZoomOut size={15} /></button>
          <button className="btn btn-sm btn-icon" onClick={() => setZoom(z => Math.min(1.6, z + 0.1))} aria-label="Zoom in"><ZoomIn size={15} /></button>
        </div>
      </div>
      <div className="card overflow-auto scrollbar-thin grid-bg" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        <svg width={W * zoom} height={layout.h * zoom} viewBox={`0 0 ${W} ${layout.h}`} className="block">
          {layout.pos.filter(p => p.parent).map(p => {
            const par = byId.get(p.parent!.id)!
            const x1 = par.x + textW(par.n.label, par.n.depth), y1 = par.y, x2 = p.x, y2 = p.y
            const mx = (x1 + x2) / 2
            return <motion.path key={'e' + p.n.id} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1, d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}` }} transition={{ duration: 0.4 }}
              fill="none" stroke={p.n.color} strokeOpacity={hover && (hover === p.n.id || hover === p.parent!.id) ? 0.9 : 0.35} strokeWidth={p.n.depth === 1 ? 2.5 : 1.6} />
          })}
          {layout.pos.map(p => {
            const w = textW(p.n.label, p.n.depth)
            const expandable = p.n.children.length > 0
            const isOpen = open.has(p.n.id)
            const strong = p.n.depth <= 1
            return (
              <motion.g key={p.n.id} initial={{ opacity: 0 }} animate={{ opacity: 1, x: p.x, y: p.y }} transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                onMouseEnter={() => setHover(p.n.id)} onMouseLeave={() => setHover(null)} style={{ cursor: expandable || p.n.topicId ? 'pointer' : 'default' }}
                onClick={() => expandable ? toggle(p.n.id) : p.n.topicId && go(`/topic/${p.n.topicId}`)}>
                <title>{p.n.full ?? p.n.label}</title>
                <rect x={0} y={-14} width={w} height={28} rx={p.n.depth === 3 ? 8 : 14}
                  fill={strong ? p.n.color : p.n.depth === 2 ? 'var(--elevated)' : 'var(--surface)'} stroke={p.n.color} strokeOpacity={strong ? 1 : 0.55} strokeWidth={hover === p.n.id ? 2.2 : 1.2} />
                <text x={14} y={4.5} fontSize={p.n.depth === 0 ? 14 : p.n.depth === 3 ? 11.5 : 12.5} fontWeight={p.n.depth <= 2 ? 700 : 500} fill={strong ? '#fff' : 'var(--fg)'}>{p.n.label}</text>
                {expandable && <g transform={`translate(${w + 10},0)`}><circle r={8} fill="var(--elevated)" stroke={p.n.color} /><text y={4} textAnchor="middle" fontSize={12} fontWeight={700} fill={p.n.color}>{isOpen ? '−' : '+'}</text></g>}
                {p.n.depth === 2 && <g transform={`translate(${w + 26},-8)`} onClick={e => { e.stopPropagation(); go(`/topic/${p.n.topicId}`) }}><rect width={16} height={16} rx={4} fill="transparent" /><foreignObject width={16} height={16}><ExternalLink size={14} color="var(--subtle)" /></foreignObject></g>}
              </motion.g>
            )
          })}
        </svg>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
        {MODULES.map(m => (
          <div key={m.id} className="card-soft p-4">
            <div className="flex items-center gap-2 mb-2"><span className="w-3 h-3 rounded-full" style={{ background: MODULE_ACCENT[m.id].from }} /><span className="font-medium text-sm">Module {m.id}</span></div>
            <div className="text-xs text-muted">{m.topics.length} topics · {m.topics.reduce((a, t) => a + t.subtopics.length, 0)} subtopics</div>
          </div>
        ))}
      </div>
    </div>
  )
}
