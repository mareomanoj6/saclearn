import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react'
import type { Stepper } from '../lib/useStepper'

const SPEEDS = [0.5, 1, 1.5, 2, 4]

/** Shared transport bar: play/pause, step back/forward, jump, speed and a scrubber. */
export function PlayerControls({ s, caption }: { s: Stepper; caption?: string }) {
  return (
    <div className="card-soft p-3 flex flex-col gap-3">
      {caption !== undefined && (
        <div className="text-sm min-h-[2.75rem] flex items-center px-1" aria-live="polite">
          <span className="chip mr-2 shrink-0">Step {s.index + 1}/{s.total}</span>
          <span className="text-fg">{caption}</span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn btn-sm btn-icon" onClick={() => s.setIndex(0)} disabled={s.index === 0} title="First step"><ChevronsLeft size={15} /></button>
        <button className="btn btn-sm btn-icon" onClick={s.prev} disabled={s.index === 0} title="Step back"><SkipBack size={15} /></button>
        <button className="btn btn-sm btn-primary px-4" onClick={s.toggle} title={s.playing ? 'Pause' : 'Play'}>
          {s.playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}{s.playing ? 'Pause' : s.atEnd ? 'Replay' : 'Play'}
        </button>
        <button className="btn btn-sm btn-icon" onClick={s.next} disabled={s.atEnd} title="Step forward"><SkipForward size={15} /></button>
        <button className="btn btn-sm btn-icon" onClick={() => s.setIndex(s.total - 1)} disabled={s.atEnd} title="Last step"><ChevronsRight size={15} /></button>
        <button className="btn btn-sm btn-icon" onClick={s.reset} title="Reset"><RotateCcw size={14} /></button>
        <input type="range" min={0} max={Math.max(0, s.total - 1)} value={s.index} onChange={e => { s.setPlaying(false); s.setIndex(Number(e.target.value)) }}
          className="flex-1 min-w-[120px] accent-[var(--accent)]" aria-label="Scrub steps" />
        <div className="flex items-center gap-1 text-xs">
          <span className="text-subtle mr-1">Speed</span>
          {SPEEDS.map(v => (
            <button key={v} onClick={() => s.setSpeed(v)} className={`px-2 h-7 rounded-md font-medium ${s.speed === v ? 'bg-accent text-accent-fg' : 'text-muted hover:bg-surface-2'}`}>{v}×</button>
          ))}
        </div>
      </div>
    </div>
  )
}
