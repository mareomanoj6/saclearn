import { motion } from 'framer-motion'
import { Lightbulb, GraduationCap, TriangleAlert, KeyRound, ArrowRight } from 'lucide-react'
import type { Block, Tone } from '../data/types'
import { fmt } from '../lib/format'
import { CodeBlock } from './CodeBlock'
import { FlowSymbols, MemoryHierarchy, VonNeumann } from './Widgets'

export const TONE: Record<Tone, { c: string; bg: string }> = {
  blue: { c: 'var(--accent)', bg: 'var(--accent-soft)' },
  green: { c: 'var(--good)', bg: 'var(--good-soft)' },
  amber: { c: 'var(--warn)', bg: 'var(--warn-soft)' },
  red: { c: 'var(--bad)', bg: 'var(--bad-soft)' },
  violet: { c: 'var(--violet)', bg: 'var(--violet-soft)' },
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return <div className="prose-atp">{blocks.map((b, i) => <BlockView key={i} b={b} />)}</div>
}

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case 'p': return <p className="my-3 text-muted [&_strong]:text-fg">{fmt(b.text)}</p>
    case 'h': return <h4 className="mt-6 mb-2 font-semibold text-[15px]">{fmt(b.text)}</h4>
    case 'list': {
      const L = b.ordered ? 'ol' : 'ul'
      return (
        <L className={`my-3 space-y-1.5 ${b.ordered ? 'list-decimal' : ''} pl-5 text-muted [&_strong]:text-fg marker:text-accent`}>
          {b.items.map((it, i) => <li key={i} className={b.ordered ? 'pl-1' : 'list-disc'}>{fmt(it)}</li>)}
        </L>
      )
    }
    case 'table': return (
      <div className="my-5">
        {b.caption && <div className="label mb-2">{b.caption}</div>}
        <div className="card overflow-x-auto"><table className="tbl">
          <thead><tr>{b.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
          <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{fmt(c)}</td>)}</tr>)}</tbody>
        </table></div>
      </div>
    )
    case 'code': return <CodeBlock code={b.code} lang={b.lang} title={b.title} output={b.output} runnable={b.runnable} />
    case 'flow': return (
      <div className="my-5">
        {b.title && <div className="label mb-2">{b.title}</div>}
        <div className="flex flex-wrap items-stretch gap-y-2">
          {b.steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card-soft px-3 py-2 min-w-[110px] max-w-[200px]">
                <div className="flex items-center gap-2"><span className="grid place-items-center w-5 h-5 rounded-full bg-accent text-accent-fg text-[11px] font-bold shrink-0">{i + 1}</span><span className="font-semibold text-sm leading-tight">{s.label}</span></div>
                {s.desc && <div className="text-xs text-muted mt-1 leading-snug">{s.desc}</div>}
              </motion.div>
              {i < b.steps.length - 1 && <ArrowRight size={16} className="text-accent mx-1.5 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    )
    case 'compare': return (
      <div className={`my-5 grid gap-3 ${b.items.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : b.items.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {b.items.map((it, i) => {
          const t = TONE[it.tone ?? 'blue']
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border p-4" style={{ borderColor: `color-mix(in srgb, ${t.c} 30%, var(--line))`, background: t.bg }}>
              <div className="font-semibold text-sm mb-2" style={{ color: t.c }}>{it.title}</div>
              <ul className="space-y-1 text-[13px] text-fg/90">
                {it.points.map((p, j) => <li key={j} className={/^\s/.test(p) || /[=():]/.test(p) && p.length < 48 ? 'font-mono text-[12px] whitespace-pre-wrap' : ''}>{fmt(p)}</li>)}
              </ul>
            </motion.div>
          )
        })}
      </div>
    )
    case 'callout': {
      const m = { tip: [Lightbulb, 'var(--accent)', 'var(--accent-soft)', 'Tip'], exam: [GraduationCap, 'var(--violet)', 'var(--violet-soft)', 'Exam focus'], warn: [TriangleAlert, 'var(--warn)', 'var(--warn-soft)', 'Watch out'], key: [KeyRound, 'var(--good)', 'var(--good-soft)', 'Key idea'] } as const
      const [I, c, bg, def] = m[b.tone]
      return (
        <div className="my-5 rounded-2xl p-4 flex gap-3 border" style={{ background: bg, borderColor: `color-mix(in srgb, ${c} 30%, transparent)` }}>
          <I size={18} style={{ color: c }} className="shrink-0 mt-0.5" />
          <div><div className="font-semibold text-sm mb-0.5" style={{ color: c }}>{b.title ?? def}</div><div className="text-sm [&_strong]:text-fg">{fmt(b.text)}</div></div>
        </div>
      )
    }
    case 'defs': return (
      <dl className="my-4 grid sm:grid-cols-2 gap-3">
        {b.items.map((d, i) => <div key={i} className="card-soft p-3"><dt className="font-semibold text-sm text-accent">{d.k}</dt><dd className="text-sm text-muted mt-0.5">{fmt(d.v)}</dd></div>)}
      </dl>
    )
    case 'widget':
      if (b.name === 'flowSymbols') return <FlowSymbols />
      if (b.name === 'vonNeumann') return <VonNeumann />
      return <MemoryHierarchy />
  }
}
