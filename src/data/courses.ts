export interface CourseItem {
  id: string
  code: string
  title: string
  semester: string
  scheme: string
  credits: number
  category: string
  status: 'live' | 'development' | 'planned'
  description: string
  route: string
  accentColor: string
  tags: string[]
  metrics?: {
    modules: number
    topics: number
    visualizers: number
  }
}

export const COURSES: CourseItem[] = [
  {
    id: 'atp',
    code: 'UCEST105',
    title: 'Algorithmic Thinking with Python',
    semester: 'S1 / S2',
    scheme: 'KTU 2024 Scheme',
    credits: 4,
    category: 'Computer Science & Engineering',
    status: 'development',
    description: 'Comprehensive KTU curriculum coverage with in-browser Python execution, visual recursion traces, flashcards, and exam-mapped previous year solutions.',
    route: '#',
    accentColor: '#2563eb',
    tags: ['Python', 'Algorithms', 'Interactive Visualizers', 'PYQ Analysis']
  },
  {
    id: 'dsa',
    code: 'CST201',
    title: 'Data Structures & Algorithms',
    semester: 'S3',
    scheme: 'KTU 2024 Scheme',
    credits: 4,
    category: 'Computer Science & Engineering',
    status: 'development',
    description: 'Step-through animation of linear and non-linear data structures, asymptotic complexity visualizer, and dynamic programming memory matrices.',
    route: '#',
    accentColor: '#059669',
    tags: ['Trees & Graphs', 'Memory Allocation', 'Sorting', 'DP']
  },
  {
    id: 'oop',
    code: 'CST205',
    title: 'Object-Oriented Programming (Java)',
    semester: 'S3',
    scheme: 'KTU 2024 Scheme',
    credits: 4,
    category: 'Computer Science & Engineering',
    status: 'planned',
    description: 'Heap and stack memory visualizations, polymorphism diagnostics, multithreading lifecycle monitors, and JVM execution traces.',
    route: '#',
    accentColor: '#dc2626',
    tags: ['Java', 'OOP Patterns', 'JVM Internals', 'Concurrency']
  }
]
