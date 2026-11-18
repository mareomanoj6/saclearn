import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, ShoppingBag, Shuffle, Zap } from 'lucide-react'
import { Stat, VisShell } from './shared'

const H = (n: number) => { let s = 0; for (let k = 1; k <= n; k++) s += 1 / k; return s }
const rnd = (n: number) => Math.floor(Math.random() * n)

/* ---------------- coupon collector ---------------- */
export function CouponVis() {
  const [n, setN] = useState(8)
  const [got, setGot] = useState<number[]>([])
  const [last, setLast] = useState<number | null>(null)
  const [bought, setBought] = useState(0)
  const [auto, setAuto] = useState(false)
  const [trials, setTrials] = useState<number[]>([])
  const complete = new Set(got).size === n
  const reset = () => { setGot([]); setBought(0); setLast(null); setAuto(false) }
  useEffect(reset, [n])
  const buy = () => { if (complete) return; const c = rnd(n); setLast(c); setGot(g => [...g, c]); setBought(b => b + 1) }
  useEffect(() => { if (!auto || complete) { setAuto(false); return } const t = setTimeout(buy, 260); return () => clearTimeout(t) })
  useEffect(() => { if (complete && bought) setTrials(t => [...t, bought]) }, [complete])
  const sim = (k: number) => { const out: number[] = []; for (let t = 0; t < k; t++) { const seen = new Set<number>(); let b = 0; while (seen.size < n) { seen.add(rnd(n)); b++ } out.push(b) } setTrials(tr => [...tr, ...out]) }
  const avg = trials.length ? trials.reduce((a, b) => a + b, 0) / trials.length : 0
  const counts = Array.from({ length: n }, (_, i) => got.filter(g => g === i).length)
  const max = Math.max(...trials, 1)
  const bins = 16; const hist = Array(bins).fill(0); trials.forEach(t => hist[Math.min(bins - 1, Math.floor((t / (max + 1)) * bins))]++)
  const hmax = Math.max(...hist, 1)
  return (
    <VisShell title="Coupon collector — how many jeans until a free pair?" desc={<>Each pair comes with one of <b>n</b> random coupons. Theory: expected purchases = n·Hₙ = n(1 + ½ + … + 1/n).</>}
      aside={<label className="flex items-center gap-2 text-sm"><span className="text-subtle">n = {n}</span><input type="range" min={2} max={20} value={n} onChange={e => { setN(Number(e.target.value)); setTrials([]) }} className="accent-[var(--accent)]" /></label>}>
      <div className="flex flex-wrap gap-2 mb-4">
        <button className="btn btn-primary btn-sm" onClick={buy} disabled={complete}><ShoppingBag size={14} />Buy one pair</button>
        <button className="btn btn-sm" onClick={() => setAuto(a => !a)} disabled={complete}>{auto ? <Pause size={14} /> : <Play size={14} />}{auto ? 'Pause' : 'Auto-buy'}</button>
        <button className="btn btn-sm" onClick={reset}><RotateCcw size={14} />New customer</button>
        <button className="btn btn-sm ml-auto" onClick={() => sim(1000)}><Zap size={14} />Simulate 1000 customers</button>
      </div>
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {counts.map((c, i) => (
              <motion.div key={i} animate={{ scale: last === i ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.35 }} className={`aspect-square rounded-xl grid place-items-center text-xs font-semibold border ${c ? 'bg-accent text-accent-fg border-accent' : 'border-dashed border-line text-subtle'}`}>
                <div className="text-center leading-tight">#{i + 1}{c > 1 && <div className="text-xs opacity-80">×{c}</div>}</div>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Stat label="Jeans bought" value={bought} />
            <Stat label="Unique coupons" value={`${new Set(got).size}/${n}`} tone="warn" />
            <Stat label="Expected n·Hₙ" value={(n * H(n)).toFixed(2)} tone="good" />
          </div>
          {complete && <div className="mt-3 text-sm font-medium" style={{ color: 'var(--good)' }}>All {n} coupons collected after {bought} purchases, so the next pair is free</div>}
        </div>
        <div className="card-soft p-4">
          <div className="flex justify-between items-baseline"><div className="label">Across {trials.length} customers</div><div className="text-sm">average <b className="font-mono text-accent">{avg ? avg.toFixed(2) : '—'}</b> vs theory <b className="font-mono" style={{ color: 'var(--good)' }}>{(n * H(n)).toFixed(2)}</b></div></div>
          <div className="flex items-end gap-1 h-36 mt-3">
            {hist.map((h, i) => <motion.div key={i} className="flex-1 rounded-t bg-accent" animate={{ height: `${(h / hmax) * 100}%` }} style={{ opacity: 0.4 + 0.6 * (h / hmax) }} />)}
          </div>
          <div className="flex justify-between text-[11px] text-subtle mt-1"><span>{n}</span><span>purchases needed →</span><span>{max}</span></div>
        </div>
      </div>
    </VisShell>
  )
}

/* ---------------- hat check ---------------- */
export function HatsVis() {
  const [n, setN] = useState(6)
  const [perm, setPerm] = useState<number[]>(() => Array.from({ length: 6 }, (_, i) => i))
  const [round, setRound] = useState(0)
  const [history, setHistory] = useState<number[]>([])
  const shuffle = (k = n) => { const p = Array.from({ length: k }, (_, i) => i); for (let i = k - 1; i > 0; i--) { const j = rnd(i + 1); [p[i], p[j]] = [p[j], p[i]] } return p }
  const go = () => { const p = shuffle(); setPerm(p); setRound(r => r + 1); setHistory(h => [...h, p.filter((x, i) => x === i).length]) }
  const many = (k: number) => { const out: number[] = []; for (let t = 0; t < k; t++) { const p = shuffle(); out.push(p.filter((x, i) => x === i).length) } setHistory(h => [...h, ...out]) }
  useEffect(() => { setPerm(Array.from({ length: n }, (_, i) => i)); setHistory([]); setRound(0) }, [n])
  const matches = round ? perm.filter((x, i) => x === i).length : 0
  const avg = history.length ? history.reduce((a, b) => a + b, 0) / history.length : 0
  const dist = Array.from({ length: Math.min(n, 6) + 1 }, (_, k) => history.filter(h => (k === Math.min(n, 6) ? h >= k : h === k)).length)
  const dmax = Math.max(...dist, 1)
  const hues = [210, 190, 230, 175, 250, 160, 200, 220, 185, 240, 170, 205]
  return (
    <VisShell title="Hat-check problem — expected matches" desc="A new attendant hands back n hats at random. Each person has a 1/n chance of getting their own, so the expected number of matches is n × 1/n = 1."
      aside={<label className="flex items-center gap-2 text-sm"><span className="text-subtle">people n = {n}</span><input type="range" min={3} max={12} value={n} onChange={e => setN(Number(e.target.value))} className="accent-[var(--accent)]" /></label>}>
      <div className="flex flex-wrap gap-2 mb-4">
        <button className="btn btn-primary btn-sm" onClick={go}><Shuffle size={14} />Return hats randomly</button>
        <button className="btn btn-sm" onClick={() => many(1000)}><Zap size={14} />Run 1000 parties</button>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-4 flex flex-wrap gap-3 justify-center">
        {perm.map((hat, person) => {
          const ok = round > 0 && hat === person
          return (
            <div key={person} className="flex flex-col items-center w-14">
              <motion.div key={`${round}-${person}`} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: person * 0.05 }}
                className="w-12 h-7 rounded-t-full grid place-items-center text-xs font-semibold text-white" style={{ background: `hsl(${hues[hat % 12]} 80% 50%)` }}>{hat + 1}</motion.div>
              <div className={`w-11 h-11 rounded-full grid place-items-center font-semibold text-sm border-2 ${ok ? 'border-good text-good' : 'border-line'}`} style={{ background: ok ? 'var(--good-soft)' : 'var(--elevated)' }}>P{person + 1}</div>
              {ok && <span className="text-xs font-semibold mt-0.5" style={{ color: 'var(--good)' }}>match!</span>}
            </div>
          )
        })}
      </div>
      <div className="grid md:grid-cols-[auto_1fr] gap-4 mt-4">
        <div className="flex flex-wrap md:flex-col gap-3"><Stat label="This round" value={matches} /><Stat label={`Average (${history.length})`} value={avg ? avg.toFixed(3) : '—'} tone="good" /><Stat label="Theory" value="1" tone="warn" /></div>
        <div className="card-soft p-4">
          <div className="label mb-2">How many people got their own hat?</div>
          <div className="flex items-end gap-2 h-32">
            {dist.map((d, k) => (
              <div key={k} className="flex-1 flex flex-col items-center h-full justify-end">
                <span className="text-xs text-subtle font-mono">{history.length ? ((d / history.length) * 100).toFixed(0) + '%' : ''}</span>
                <motion.div className="w-full rounded-t bg-accent" animate={{ height: `${(d / dmax) * 85}%` }} />
                <span className="text-xs font-mono mt-1">{k === Math.min(n, 6) ? `${k}+` : k}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisShell>
  )
}

/* ---------------- Monte Carlo ---------------- */
export function MonteCarloVis() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [total, setTotal] = useState(0)
  const [inside, setInside] = useState(0)
  const [auto, setAuto] = useState(false)
  const add = (k: number) => {
    const c = canvas.current?.getContext('2d'); if (!c) return
    const W = c.canvas.width
    let ins = 0
    const styles = getComputedStyle(document.documentElement)
    const inC = styles.getPropertyValue('--accent').trim() || '#2563eb'
    const outC = styles.getPropertyValue('--subtle').trim() || '#94a3b8'
    for (let i = 0; i < k; i++) {
      const x = Math.random() * 2 - 1, y = Math.random() * 2 - 1
      const hit = x * x + y * y <= 1; if (hit) ins++
      c.fillStyle = hit ? inC : outC
      c.globalAlpha = hit ? 0.85 : 0.5
      c.fillRect(((x + 1) / 2) * W - 1, ((1 - y) / 2) * W - 1, 2.2, 2.2)
    }
    setInside(v => v + ins); setTotal(v => v + k)
  }
  const clear = () => { const c = canvas.current?.getContext('2d'); if (c) c.clearRect(0, 0, c.canvas.width, c.canvas.height); setTotal(0); setInside(0); setAuto(false) }
  useEffect(() => { if (!auto) return; const id = setInterval(() => add(250), 60); return () => clearInterval(id) }, [auto])
  const est = total ? (4 * inside) / total : 0
  return (
    <VisShell title="Monte Carlo — area of the unit circle" desc="Throw random points into the 2 × 2 square. Area of circle ≈ 4 × (points inside ÷ total points), which approaches π ≈ 3.14159.">
      <div className="flex flex-wrap gap-2 mb-4">
        <button className="btn btn-sm" onClick={() => add(100)}>+100 points</button>
        <button className="btn btn-sm" onClick={() => add(1000)}>+1,000</button>
        <button className="btn btn-primary btn-sm" onClick={() => setAuto(a => !a)}>{auto ? <Pause size={14} /> : <Play size={14} />}{auto ? 'Pause' : 'Auto rain'}</button>
        <button className="btn btn-sm" onClick={clear}><RotateCcw size={14} />Clear</button>
      </div>
      <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
        <div className="relative mx-auto rounded-xl border border-line bg-surface overflow-hidden" style={{ width: 300, height: 300 }}>
          <canvas ref={canvas} width={600} height={600} className="w-full h-full" />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none"><circle cx="50" cy="50" r="49.5" fill="none" stroke="var(--accent)" strokeWidth="0.6" /></svg>
        </div>
        <div>
          <div className="flex flex-wrap gap-3">
            <Stat label="Points" value={total.toLocaleString()} />
            <Stat label="Inside" value={inside.toLocaleString()} tone="good" />
            <Stat label="Estimate" value={total ? est.toFixed(4) : '—'} tone="warn" />
            <Stat label="Error vs π" value={total ? Math.abs(est - Math.PI).toFixed(4) : '—'} tone="bad" />
          </div>
          <p className="text-sm text-muted mt-4">The more points you sample, the better the approximation — a hallmark of randomized algorithms: answers are <b className="text-fg">probabilistic</b>, but statistically predictable, and judged by average-case behaviour.</p>
        </div>
      </div>
    </VisShell>
  )
}
