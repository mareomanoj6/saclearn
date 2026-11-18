import type { ComponentType } from 'react'
import type { VisKey } from '../data/types'
import { HanoiVis } from './Hanoi'
import { BacktrackVis } from './Backtrack'
import { CpuVis } from './Cpu'
import { PrecedenceVis } from './Precedence'
import { PseudoTracerVis } from './PseudoTracer'
import { FlowchartVis } from './Flowchart'
import { RangeVis, SlicingVis } from './RangeSlice'
import { TopThreeVis } from './TopThree'
import { CallStackVis } from './CallStack'
import { PadlockVis } from './Padlock'
import { MergeSortVis } from './MergeSort'
import { FibDPVis } from './FibDP'
import { GreedyVis, CoinsVis } from './Greedy'
import { CouponVis, HatsVis, MonteCarloVis } from './Random'

export const VISUALIZERS: Record<VisKey, { label: string; C: ComponentType }> = {
  hanoi: { label: 'Tower of Hanoi', C: HanoiVis },
  backtrack: { label: 'Backtracking', C: BacktrackVis },
  cpu: { label: 'Instruction cycle', C: CpuVis },
  precedence: { label: 'Precedence evaluator', C: PrecedenceVis },
  pseudo: { label: 'Pseudocode tracer', C: PseudoTracerVis },
  flowchart: { label: 'Flowchart animator', C: FlowchartVis },
  range: { label: 'for + range()', C: RangeVis },
  slicing: { label: 'Slicing', C: SlicingVis },
  topthree: { label: 'Top three', C: TopThreeVis },
  callstack: { label: 'Call stack', C: CallStackVis },
  padlock: { label: 'Padlock', C: PadlockVis },
  mergesort: { label: 'Merge sort', C: MergeSortVis },
  fibdp: { label: 'Fibonacci DP', C: FibDPVis },
  greedy: { label: 'Task scheduling', C: GreedyVis },
  coins: { label: 'Coin change', C: CoinsVis },
  coupon: { label: 'Coupon collector', C: CouponVis },
  hats: { label: 'Hat check', C: HatsVis },
  montecarlo: { label: 'Monte Carlo π', C: MonteCarloVis },
}
