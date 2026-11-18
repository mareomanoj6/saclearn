import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, LockOpen, Play, Pause, RotateCcw } from 'lucide-react'
import { Stat, VisShell } from './shared'

export function PadlockVis() {
  const [secret, setSecret] = useState('302')
  const [tries, setTries] = useState(0)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(40) // guesses per second
  const raf = useRef<number | null>(null)
  const last = useRef(0)
  const target = Math.min(999, Math.max(0, parseInt(secret) || 0))
  const guess = Math.min(tries, target)
  const open = tries > target
  const digits = String(open ? target : guess).padStart(3, '0').split('')

  useEffect(() => {
    if (!running) return
    const tick = (t: number) => {
      if (!last.current) last.current = t
      const n = Math.floor(((t - last.current) / 1000) * speed)
      if (n > 0) { last.current = t; setTries(x => Math.min(x + n, target + 1)) }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current); last.current = 0 }
  }, [running, speed, target])
  useEffect(() => { if (open) setRunning(false) }, [open])

  return (
    <VisShell title="Brute force: cracking a 3-dial padlock" desc="Try 000, 001, 002 … until the lock opens. Guaranteed to succeed — but the worst case is all 1000 combinations.">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <label className="flex items-center gap-2 text-sm"><span className="text-subtle">Secret code</span>
          <input className="input w-20 font-mono text-center" maxLength={3} value={secret} onChange={e => { setSecret(e.target.value.replace(/\D/g, '')); setTries(0); setRunning(false) }} /></label>
        <button className="btn btn-primary btn-sm" onClick={() => { if (open) setTries(0); setRunning(r => !r) }}>{running ? <Pause size={14} /> : <Play size={14} />}{running ? 'Pause' : open ? 'Again' : 'Start cracking'}</button>
        <button className="btn btn-sm" onClick={() => { setTries(0); setRunning(false) }}><RotateCcw size={14} />Reset</button>
        <label className="flex items-center gap-2 text-sm ml-auto"><span className="text-subtle">Speed</span>
          <input type="range" min={5} max={400} value={speed} onChange={e => setSpeed(Number(e.target.value))} className="accent-[var(--accent)]" /><span className="font-mono text-xs w-20">{speed} tries/s</span></label>
      </div>
      <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
        <div className="mx-auto flex flex-col items-center">
          <motion.div animate={{ y: open ? -14 : 0, rotate: open ? -12 : 0 }} transition={{ type: 'spring', stiffness: 200 }} className="w-24 h-16 border-[10px] border-b-0 rounded-t-full -mb-1" style={{ borderColor: open ? 'var(--good)' : 'var(--subtle)', transformOrigin: '10% 100%' }} />
          <div className="rounded-3xl p-5 flex gap-3 border-2" style={{ background: 'var(--surface-2)', borderColor: open ? 'var(--good)' : 'var(--line)' }}>
            {digits.map((d, i) => (
              <div key={i} className="w-14 h-20 rounded-xl bg-elevated border border-line overflow-hidden relative grid place-items-center">
                <motion.span key={d + i} initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.08 }} className="font-mono text-4xl font-bold" style={{ color: open ? 'var(--good)' : 'var(--fg)' }}>{d}</motion.span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 font-semibold" style={{ color: open ? 'var(--good)' : 'var(--subtle)' }}>{open ? <LockOpen size={18} /> : <Lock size={18} />}{open ? `Opened with ${String(target).padStart(3, '0')}!` : running ? 'Trying…' : 'Locked'}</div>
        </div>
        <div>
          <div className="flex flex-wrap gap-3 mb-4">
            <Stat label="Attempts" value={Math.min(tries, target + 1)} />
            <Stat label="Search space" value="1000" tone="warn" />
            <Stat label="Worst case" value="1000" tone="bad" />
          </div>
          <div className="label mb-1">Search space explored</div>
          <div className="h-3 rounded-full bg-surface-2 overflow-hidden"><motion.div className="h-full rounded-full" style={{ background: open ? 'var(--good)' : 'var(--accent)' }} animate={{ width: `${(Math.min(tries, target + 1) / 1000) * 100}%` }} /></div>
          <div className="flex justify-between text-xs text-subtle mt-1"><span>000</span><span>999</span></div>
          <PasswordCalc />
        </div>
      </div>
    </VisShell>
  )
}

function PasswordCalc() {
  const [len, setLen] = useState(6)
  const [sets, setSets] = useState({ lower: true, upper: true, digits: true, symbols: true })
  const size = (sets.lower ? 26 : 0) + (sets.upper ? 26 : 0) + (sets.digits ? 10 : 0) + (sets.symbols ? 33 : 0)
  const combos = Math.pow(size || 1, len)
  const secs = combos / 1e9
  const human = secs < 1 ? `${(secs * 1000).toFixed(2)} ms` : secs < 60 ? `${secs.toFixed(1)} s` : secs < 3600 ? `${(secs / 60).toFixed(1)} min` : secs < 86400 ? `${(secs / 3600).toFixed(1)} hours` : secs < 3.15e7 ? `${(secs / 86400).toFixed(1)} days` : `${(secs / 3.15e7).toExponential(2)} years`
  return (
    <div className="card-soft p-4 mt-5">
      <div className="font-semibold text-sm mb-2">Password guessing — how big is the search space?</div>
      <div className="flex flex-wrap gap-2 mb-3">
        {(Object.keys(sets) as (keyof typeof sets)[]).map(k => (
          <button key={k} onClick={() => setSets(s => ({ ...s, [k]: !s[k] }))} className={`btn btn-sm ${sets[k] ? 'tab-active' : ''}`}>{k} ({k === 'lower' || k === 'upper' ? 26 : k === 'digits' ? 10 : 33})</button>
        ))}
      </div>
      <label className="flex items-center gap-3 text-sm"><span className="text-subtle">Length {len}</span><input type="range" min={1} max={16} value={len} onChange={e => setLen(Number(e.target.value))} className="flex-1 accent-[var(--accent)]" /></label>
      <div className="mt-3 text-sm"><span className="font-mono">{size}<sup>{len}</sup></span> = <b className="font-mono">{combos < 1e15 ? Math.round(combos).toLocaleString() : combos.toExponential(2)}</b> combinations · at 1 billion guesses/s ≈ <b style={{ color: secs > 3.15e7 ? 'var(--good)' : 'var(--bad)' }}>{human}</b></div>
    </div>
  )
}
