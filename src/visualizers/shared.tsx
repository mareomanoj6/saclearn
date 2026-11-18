import type { ReactNode } from 'react'

export function VisShell({ title, desc, children, aside }: { title: string; desc?: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="card p-5 lg:p-6">
      <div className="flex flex-wrap items-start gap-3 mb-4">
        <div className="min-w-[240px] flex-1">
          <h3 className="font-bold text-lg tracking-tight">{title}</h3>
          {desc && <p className="text-sm text-muted mt-1 max-w-3xl">{desc}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="flex items-center gap-2 text-sm"><span className="text-subtle font-medium">{label}</span>{children}</label>
}

export function Stat({ label, value, tone = 'accent' }: { label: string; value: ReactNode; tone?: 'accent' | 'good' | 'warn' | 'bad' }) {
  return (
    <div className="card-soft px-3 py-2 min-w-[96px]">
      <div className="text-[11px] text-subtle font-semibold uppercase tracking-wider">{label}</div>
      <div className="text-lg font-bold tabular-nums" style={{ color: `var(--${tone})` }}>{value}</div>
    </div>
  )
}

export const parseNums = (s: string, max = 12) => s.split(/[\s,]+/).map(Number).filter(n => Number.isFinite(n)).slice(0, max)
