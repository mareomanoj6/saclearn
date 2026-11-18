import {
  Lightbulb, Cpu, Terminal, FileText, Workflow, Repeat, Boxes, Layers, Lock, Split, Table, Coins, Dices, BookOpen,
  type LucideIcon,
} from 'lucide-react'

const MAP: Record<string, LucideIcon> = { Lightbulb, Cpu, Terminal, FileText, Workflow, Repeat, Boxes, Layers, Lock, Split, Table, Coins, Dices }

export function TopicIcon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  const I = MAP[name] ?? BookOpen
  return <I size={size} className={className} strokeWidth={2} />
}
