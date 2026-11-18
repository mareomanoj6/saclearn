import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Shuffle, Check, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { FLASHCARDS } from '../data/flashcards'
import { MODULES, topicById } from '../data/syllabus'
import { useMastered } from '../lib/progress'

export function Flashcards({ initialTopic, initialModule }: { initialTopic: string | null; initialModule: string | null }) {
  const [mod, setMod] = useState<number | 0>(initialTopic ? topicById(initialTopic)?.moduleId ?? 0 : Number(initialModule) || 0)
  const [topic, setTopic] = useState<string>(initialTopic ?? '')
  const [hideMastered, setHideMastered] = useState(false)
  const [order, setOrder] = useState<string[] | null>(null)
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [dir, setDir] = useState(1)
  const [mastered, setMastered] = useMastered()

  const deck = useMemo(() => {
    let d = FLASHCARDS.filter(c => (!topic || c.topicId === topic) && (!mod || topicById(c.topicId)?.moduleId === mod))
    if (hideMastered) d = d.filter(c => !mastered.includes(c.id))
    if (order) d = [...d].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    return d
  }, [mod, topic, hideMastered, order, mastered])
  useEffect(() => { setI(0); setFlipped(false) }, [mod, topic, hideMastered, order])
  const card = deck[Math.min(i, deck.length - 1)]
  const isM = card ? mastered.includes(card.id) : false
  const total = FLASHCARDS.filter(c => (!topic || c.topicId === topic) && (!mod || topicById(c.topicId)?.moduleId === mod))
  const doneCount = total.filter(c => mastered.includes(c.id)).length

  const move = useCallback((d: number) => { setDir(d); setFlipped(false); setI(x => (x + d + deck.length) % Math.max(1, deck.length)) }, [deck.length])
  const toggleM = useCallback(() => { if (!card) return; setMastered(ms => ms.includes(card.id) ? ms.filter(x => x !== card.id) : [...ms, card.id]) }, [card, setMastered])

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLSelectElement) return
      if (e.key === 'ArrowRight') move(1)
      else if (e.key === 'ArrowLeft') move(-1)
      else if (e.key === ' ') { e.preventDefault(); setFlipped(f => !f) }
      else if (e.key.toLowerCase() === 'm') toggleM()
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [move, toggleM])

  const topics = MODULES.filter(m => !mod || m.id === mod).flatMap(m => m.topics)

  return (
    <div className="mx-auto max-w-[920px] px-4 lg:px-6 py-8">
      <div className="label">Active recall</div>
      <h1 className="text-2xl font-medium mb-5">Flashcards</h1>
      <div className="flex flex-wrap gap-2 mb-3">
        {[0, 1, 2, 3, 4].map(m => <button key={m} className={`tab ${mod === m ? 'tab-active' : ''}`} onClick={() => { setMod(m); setTopic('') }}>{m === 0 ? 'All modules' : `Module ${m}`}</button>)}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <select className="input w-full sm:w-auto" value={topic} onChange={e => setTopic(e.target.value)} aria-label="Topic filter">
          <option value="">All topics</option>
          {topics.map(t => <option key={t.id} value={t.id}>M{t.moduleId} · {t.title}</option>)}
        </select>
        <button className="btn btn-sm" onClick={() => setOrder(FLASHCARDS.map(c => c.id).sort(() => Math.random() - 0.5))}><Shuffle size={14} />Shuffle</button>
        {order && <button className="btn btn-sm" onClick={() => setOrder(null)}><RotateCcw size={14} />In order</button>}
        <button className={`btn btn-sm ${hideMastered ? 'tab-active' : ''}`} onClick={() => setHideMastered(h => !h)}>{hideMastered ? <EyeOff size={14} /> : <Eye size={14} />}Hide mastered</button>
        <div className="ml-auto text-sm text-muted">{doneCount}/{total.length} mastered</div>
      </div>
      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden mb-6"><motion.div className="h-full bg-good rounded-full" animate={{ width: `${(doneCount / Math.max(1, total.length)) * 100}%` }} /></div>

      {!card ? (
        <div className="card p-12 text-center"><Check size={28} className="mx-auto mb-3 text-good" /><div className="font-medium">Everything here is mastered</div><button className="btn mt-4" onClick={() => setHideMastered(false)}>Show all cards</button></div>
      ) : (
        <>
          <div className="flip-scene h-[340px] sm:h-[320px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={card.id} custom={dir} initial={{ opacity: 0, x: dir * 80, rotate: dir * 3 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: dir * -80, rotate: dir * -3 }} transition={{ duration: 0.25 }} className="w-full h-full">
                <div className={`flip-card relative w-full h-full cursor-pointer ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
                  <div className="flip-face card p-8 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-subtle font-medium"><span className="chip">{topicById(card.topicId)?.short}</span>Question {Math.min(i, deck.length - 1) + 1} of {deck.length}{isM && <span className="chip ml-auto" style={{ color: 'var(--good)', background: 'var(--good-soft)' }}><Check size={12} />mastered</span>}</div>
                    <div className="flex-1 grid place-items-center text-center"><div className="text-xl sm:text-2xl font-semibold leading-snug max-w-xl">{card.front}</div></div>
                    <div className="text-center text-xs text-subtle">Click or press <span className="kbd">Space</span> to flip</div>
                  </div>
                  <div className="flip-face flip-back rounded-2xl p-8 flex flex-col" style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>
                    <div className="text-xs font-medium opacity-80">Answer</div>
                    <div className="flex-1 grid place-items-center text-center"><div className="text-lg sm:text-xl font-medium leading-relaxed max-w-xl">{card.back}</div></div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button className="btn btn-icon h-11 w-11 rounded-full" onClick={() => move(-1)} aria-label="Previous"><ChevronLeft /></button>
            <button className={`btn h-11 px-5 ${isM ? '' : 'btn-primary'}`} onClick={toggleM}><Check size={16} />{isM ? 'Unmark' : 'Mark as mastered'} <span className="kbd !bg-transparent !text-current !border-current/40">M</span></button>
            <button className="btn btn-icon h-11 w-11 rounded-full" onClick={() => move(1)} aria-label="Next"><ChevronRight /></button>
          </div>
        </>
      )}
    </div>
  )
}
