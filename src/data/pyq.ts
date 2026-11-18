/* ------------------------------------------------------------------
 * PYQ Analyzer – data layer (phase 2 ready)
 *
 * Drop real KTU question papers into `PYQ_PAPERS` (or import JSON from
 * the PYQ page). Each question is mapped to syllabus topics by keyword
 * matching against `Topic.keywords`, then aggregated into frequencies.
 * ------------------------------------------------------------------ */
import type { PyqPaper, PyqQuestion, Topic } from './types'
import { ALL_TOPICS, MODULES } from './syllabus'
import { REAL_PAPERS } from './pyq-papers'

/** Bundled real papers (see pyq-papers.ts). */
export const PYQ_PAPERS: PyqPaper[] = REAL_PAPERS

/** A tiny illustrative paper so the analyzer UI can be explored before real data arrives. */
export const DEMO_PAPER: PyqPaper = {
  exam: 'Demo paper (sample format)',
  year: 2025,
  questions: [
    { id: 'd1', exam: 'Demo', part: 'A', number: '1', marks: 3, module: 1, text: 'Differentiate between well-defined and ill-defined problems with examples.' },
    { id: 'd2', exam: 'Demo', part: 'A', number: '2', marks: 3, module: 1, text: 'What is the output of print(2 + 3 * 4 ** 2)? Explain operator precedence.' },
    { id: 'd3', exam: 'Demo', part: 'A', number: '3', marks: 3, module: 2, text: 'Write pseudocode to find the largest of three numbers.' },
    { id: 'd4', exam: 'Demo', part: 'A', number: '4', marks: 3, module: 2, text: 'Draw the flowchart symbols for decision and input/output.' },
    { id: 'd5', exam: 'Demo', part: 'A', number: '5', marks: 3, module: 3, text: 'Differentiate between list and tuple in Python.' },
    { id: 'd6', exam: 'Demo', part: 'A', number: '6', marks: 3, module: 3, text: 'What is the role of the base case in recursion?' },
    { id: 'd7', exam: 'Demo', part: 'A', number: '7', marks: 3, module: 4, text: 'Explain the brute force approach with the padlock example.' },
    { id: 'd8', exam: 'Demo', part: 'A', number: '8', marks: 3, module: 4, text: 'Compare greedy algorithms and dynamic programming.' },
    { id: 'd9', exam: 'Demo', part: 'B', number: '9 a', marks: 5, module: 1, text: 'Explain means-ends analysis using the Tower of Hanoi problem.' },
    { id: 'd10', exam: 'Demo', part: 'B', number: '11 b', marks: 4, module: 2, text: 'Write pseudocode using a REPEAT-UNTIL loop to find the sum of n numbers.' },
    { id: 'd11', exam: 'Demo', part: 'B', number: '13 a', marks: 5, module: 3, text: 'Write a recursive function to find the GCD of two numbers and explain the call stack.' },
    { id: 'd12', exam: 'Demo', part: 'B', number: '15 a', marks: 6, module: 4, text: 'Explain merge sort as a divide and conquer algorithm with an example.' },
    { id: 'd13', exam: 'Demo', part: 'B', number: '16 b', marks: 3, module: 4, text: 'Using a randomized approach, find the expected number of people who get back their hats.' },
  ],
}

export interface TopicHit { topic: Topic; score: number }

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+*/%&|^<>=\-. ]/g, ' ').replace(/\s+/g, ' ')

/** Rank topics for a question by keyword hits (longer keywords weigh more). */
export function mapQuestion(q: Pick<PyqQuestion, 'text' | 'module'>): TopicHit[] {
  const text = ' ' + norm(q.text) + ' '
  const hits: TopicHit[] = []
  for (const t of ALL_TOPICS) {
    let score = 0
    for (const k of t.keywords) if (text.includes(norm(k))) score += 1 + Math.min(k.length, 20) / 10
    if (q.module && q.module === t.moduleId) score *= 1.5
    if (score > 0) hits.push({ topic: t, score })
  }
  hits.sort((a, b) => b.score - a.score)
  if (!hits.length && q.module) {
    const m = MODULES.find(m => m.id === q.module)
    if (m) return [{ topic: m.topics[0], score: 0.1 }]
  }
  return hits
}

export function mapTopicIds(q: PyqQuestion): string[] {
  if (q.topicIds?.length) return q.topicIds
  const hits = mapQuestion(q)
  if (!hits.length) return []
  const top = hits[0].score
  return hits.filter(h => h.score >= top * 0.6).slice(0, 2).map(h => h.topic.id)
}

export interface TopicStat { topicId: string; count: number; marks: number; exams: Set<string>; questions: PyqQuestion[] }

export function analyse(papers: PyqPaper[]) {
  const stats = new Map<string, TopicStat>()
  for (const t of ALL_TOPICS) stats.set(t.id, { topicId: t.id, count: 0, marks: 0, exams: new Set(), questions: [] })
  const unmapped: PyqQuestion[] = []
  for (const p of papers) for (const q of p.questions) {
    const ids = mapTopicIds(q)
    if (!ids.length) { unmapped.push(q); continue }
    for (const id of ids) {
      const s = stats.get(id)!
      s.count++; s.marks += q.marks / ids.length; s.exams.add(q.exam || p.exam); s.questions.push(q)
    }
  }
  return { stats: [...stats.values()], unmapped, totalQuestions: papers.reduce((a, p) => a + p.questions.length, 0) }
}

/** Template shown/downloaded on the PYQ page */
export const PYQ_TEMPLATE: PyqPaper[] = [
  {
    exam: 'Dec 2024 (Regular)',
    year: 2024,
    questions: [
      { id: 'dec24-1', exam: 'Dec 2024 (Regular)', part: 'A', number: '1', marks: 3, module: 1, text: 'Question text here…' },
      { id: 'dec24-9a', exam: 'Dec 2024 (Regular)', part: 'B', number: '9 a', marks: 5, module: 1, text: 'Question text here…', topicIds: ['m1-strategies'] },
    ],
  },
]

/* ------------------------------------------------------------------
 * Recurring question patterns, counted live from the loaded papers.
 * ------------------------------------------------------------------ */
export interface QPattern { id: string; label: string; topicId: string; test: (q: PyqQuestion) => boolean; tip: string }
const has = (q: PyqQuestion, re: RegExp) => re.test(q.text)

export const PATTERNS: QPattern[] = [
  { id: 'greedy-dp', label: 'Compare greedy and dynamic programming', topicId: 'm4-greedy', test: q => has(q, /greedy/i) && has(q, /dynamic programming/i) && has(q, /compar|contrast/i), tip: 'Learn a 3-point table: approach, optimality guarantee, cost – plus the coin-change {1,3,4} counter-example.' },
  { id: 'six-steps', label: 'Six problem-solving steps on a simple task', topicId: 'm1-process', test: q => has(q, /six (problem-solving )?steps/i), tip: 'Same template every time: define → model → algorithm → code → test → evaluate. Practise area/largest/roots.' },
  { id: 'mea', label: 'Means-ends analysis scenario', topicId: 'm1-strategies', test: q => has(q, /means[- ]end/i), tip: 'Always write: current state, goal state, differences, operators/sub-goals, repeat.' },
  { id: 'heuristic', label: 'Heuristic approach scenario', topicId: 'm1-strategies', test: q => has(q, /heuristic/i), tip: 'Name the rule of thumb (nearest city, ratings/reviews) and say it is fast but not guaranteed optimal.' },
  { id: 'expr', label: 'Predict the output of Python expressions', topicId: 'm1-python', test: q => has(q, /output|result|evaluate/i) && has(q, /\*\*|range\(|\bnot \(|True and|relational|bitwise/), tip: 'Precedence: ** (right-to-left) → * / // % → + − → comparisons → not → and → or.' },
  { id: 'minmax', label: 'Largest / smallest of a list', topicId: 'm2-pseudocode', test: q => has(q, /largest|smallest|minimum and maximum/i) && !has(q, /dynamic|greedy/i), tip: 'Initialise with the first element, loop once, update on a better value.' },
  { id: 'digits', label: 'Palindrome / reverse the digits', topicId: 'm2-pseudocode', test: q => has(q, /palindrome|reverse the digits|reverse a three-digit/i), tip: 'Loop: d = n % 10, rev = rev×10 + d, n = n // 10.' },
  { id: 'sentinel', label: 'Average / sum with a sentinel value', topicId: 'm2-pseudocode', test: q => has(q, /ends when|stops the input|until the user/i), tip: 'Read before the loop, test the sentinel, process, read again; guard against division by zero.' },
  { id: 'recursion-trace', label: 'Recursion: trace the call stack', topicId: 'm3-recursion', test: q => has(q, /call stack|trace/i) && q.topicIds?.includes('m3-recursion') === true, tip: 'Draw the stack growing to the base case, then unwinding with the returned values.' },
  { id: 'gcd-lcm', label: 'Recursive GCD / LCM', topicId: 'm3-recursion', test: q => has(q, /\bgcd\b|\blcm\b/i), tip: 'gcd(a, b) = a if b == 0 else gcd(b, a % b); lcm = a×b / gcd.' },
  { id: 'padlock', label: 'Brute force: padlock / password', topicId: 'm4-bruteforce', test: q => has(q, /padlock|password/i), tip: '10^k attempts for a k-digit code; worst case = all of them.' },
  { id: 'merge', label: 'Merge sort', topicId: 'm4-divide', test: q => has(q, /merge sort/i), tip: 'Draw the split tree, then the merge tree; state O(n log n).' },
  { id: 'memo-tab', label: 'Memoization vs tabulation', topicId: 'm4-dp', test: q => has(q, /memoiz|tabulation/i), tip: 'Top-down + cache vs bottom-up table; both turn exponential Fibonacci into O(n).' },
  { id: 'greedy-algo', label: 'Write a greedy algorithm', topicId: 'm4-greedy', test: q => has(q, /greedy/i) && has(q, /algorithm|implement|develop|give/i) && !has(q, /compar|contrast/i) && q.topicIds?.[0] === 'm4-greedy', tip: 'State the greedy choice (sort by time / weight / value per unit) and why it is safe.' },
]

export function countPatterns(papers: PyqPaper[]) {
  return PATTERNS.map(p => {
    const qs = papers.flatMap(pp => pp.questions).filter(p.test)
    return { ...p, count: qs.length, papers: new Set(qs.map(q => q.exam)).size, questions: qs }
  }).sort((a, b) => b.papers - a.papers || b.count - a.count)
}
