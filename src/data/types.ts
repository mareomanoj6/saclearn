/* ------------------------------------------------------------------
 * Data layer. Everything in the UI (explorer, notes, slides, mind map,
 * flashcards, quizzes, playground starters and the PYQ mapper) is driven
 * from these shapes, which are filled from the UCEST105 syllabus + notes.
 * ------------------------------------------------------------------ */

export type Tone = 'blue' | 'green' | 'amber' | 'red' | 'violet'

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { type: 'code'; code: string; lang?: 'python' | 'pseudo' | 'text'; title?: string; output?: string; runnable?: boolean }
  | { type: 'flow'; title?: string; steps: { label: string; desc?: string }[] }
  | { type: 'compare'; items: { title: string; tone?: Tone; points: string[] }[] }
  | { type: 'callout'; tone: 'tip' | 'exam' | 'warn' | 'key'; title?: string; text: string }
  | { type: 'defs'; items: { k: string; v: string }[] }
  | { type: 'widget'; name: 'flowSymbols' | 'memoryHierarchy' | 'vonNeumann' }

export interface Section {
  id: string
  /** Subtopic title exactly as it appears in the syllabus */
  title: string
  blocks: Block[]
}

export type VisKey =
  | 'hanoi' | 'backtrack' | 'cpu' | 'precedence' | 'pseudo' | 'flowchart'
  | 'range' | 'slicing' | 'topthree' | 'callstack' | 'padlock' | 'mergesort'
  | 'fibdp' | 'greedy' | 'coins' | 'coupon' | 'hats' | 'montecarlo'

export interface Topic {
  id: string
  moduleId: ModuleId
  /** Syllabus heading */
  title: string
  short: string
  icon: string
  summary: string
  /** Every subtopic listed under this heading in the syllabus */
  subtopics: string[]
  sections: Section[]
  takeaways: string[]
  /** Used by the PYQ analyzer to map past questions to this topic */
  keywords: string[]
  visualizers: VisKey[]
  starterCode: string
}

export type ModuleId = 1 | 2 | 3 | 4

export interface Module {
  id: ModuleId
  title: string
  tagline: string
  topics: Topic[]
}

export interface Flashcard { id: string; topicId: string; front: string; back: string }

export interface QuizQuestion {
  id: string
  topicId: string
  kind: 'mcq' | 'output'
  question: string
  code?: string
  options: string[]
  answer: number
  explain: string
}

/* ------------------------- PYQ (phase 2) ------------------------- */
export interface PyqQuestion {
  id: string
  /** e.g. "Dec 2024", "May 2025 (Supply)" */
  exam: string
  /** 'A' / 'B' as printed; '?' when the source (a question bank) does not say */
  part: 'A' | 'B' | '?'
  /** Question number as printed, e.g. "1", "11 a" */
  number: string
  marks: number
  /** true when marks are an estimate (question-bank entries carry no marks) */
  est?: boolean
  module?: ModuleId
  text: string
  /** Filled by the mapper (or set manually) */
  topicIds?: string[]
}

export interface PyqPaper { exam: string; year: number; questions: PyqQuestion[] }
