import { usePersistent } from './storage'

export const useMastered = () => usePersistent<string[]>('atp-mastered', [])
export const useVisited = () => usePersistent<string[]>('atp-visited', [])
export const useQuizBest = () => usePersistent<Record<string, number>>('atp-quiz-best', {})
