import type { Module, ModuleId, Topic } from './types'
import { m1Topics } from './m1'
import { m2Topics } from './m2'
import { m3Topics } from './m3'
import { m4Topics } from './m4'

export const COURSE = {
  code: 'UCEST105',
  title: 'Algorithmic Thinking with Python',
  university: 'APJ Abdul Kalam Technological University',
  scheme: 'B.Tech 2024 · S1/S2 · Common to all branches',
  credits: 4,
  ltpr: '3 : 0 : 2 : 0',
  cie: 40,
  ese: 60,
  examHours: '2 hrs 30 min',
  objectives: [
    'A thorough understanding of algorithmic thinking and its practical applications in solving real-world problems.',
    'Explore algorithmic paradigms — brute force, divide-and-conquer, dynamic programming and heuristics — for solving complex problems.',
  ],
  outcomes: [
    { co: 'CO1', text: 'Utilize computing as a model for solving real-world problems.', kl: 'K2' },
    { co: 'CO2', text: 'Articulate a problem before attempting to solve it and prepare a clear and accurate model to represent the problem.', kl: 'K3' },
    { co: 'CO3', text: 'Use effective algorithms to solve the formulated models and translate algorithms into executable programs.', kl: 'K3' },
    { co: 'CO4', text: 'Interpret the problem-solving strategies, a systematic approach to solving computational problems, and essential Python programming skills.', kl: 'K2' },
  ],
  cieSplit: [
    { label: 'Attendance', marks: 5 },
    { label: 'Continuous assessment (programming tasks)', marks: 5 },
    { label: 'Internal exam 1 (written)', marks: 10 },
    { label: 'Internal exam 2 (written)', marks: 10 },
    { label: 'Internal exam 3 (lab)', marks: 10 },
  ],
}

export const MODULES: Module[] = [
  { id: 1, title: 'Problem Solving & Python Essentials', tagline: 'Strategies, the problem-solving process and core Python', topics: m1Topics },
  { id: 2, title: 'Algorithms, Pseudocode & Flowcharts', tagline: 'Representing algorithms with sequencing, selection and repetition', topics: m2Topics },
  { id: 3, title: 'Control Flow, Functions & Recursion', tagline: 'Selection, iteration, data structures, decomposition and recursion', topics: m3Topics },
  { id: 4, title: 'Computational Approaches to Problem-Solving', tagline: 'Brute force, divide & conquer, DP, greedy and randomized', topics: m4Topics },
]

export const ALL_TOPICS: Topic[] = MODULES.flatMap(m => m.topics)
export const topicById = (id: string) => ALL_TOPICS.find(t => t.id === id)
export const moduleById = (id: number) => MODULES.find(m => m.id === (id as ModuleId))

export const MODULE_ACCENT: Record<ModuleId, { from: string; to: string; soft: string }> = {
  1: { from: '#2563EB', to: '#38BDF8', soft: 'rgba(37,99,235,.12)' },
  2: { from: '#1D4ED8', to: '#60A5FA', soft: 'rgba(29,78,216,.12)' },
  3: { from: '#0369A1', to: '#38BDF8', soft: 'rgba(3,105,161,.12)' },
  4: { from: '#3B82F6', to: '#7DD3FC', soft: 'rgba(59,130,246,.12)' },
}

export function neighbours(id: string) {
  const i = ALL_TOPICS.findIndex(t => t.id === id)
  return { prev: ALL_TOPICS[i - 1], next: ALL_TOPICS[i + 1] }
}
