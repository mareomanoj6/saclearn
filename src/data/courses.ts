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
    status: 'live',
    description: 'Comprehensive KTU curriculum coverage with in-browser Python execution, visual recursion traces, flashcards, and exam-mapped previous year solutions.',
    route: '/courses/atp/',
    accentColor: '#2563eb',
    tags: ['Python', 'Algorithms', 'Interactive Visualizers', 'PYQ Analysis'],
    metrics: {
      modules: 4,
      topics: 16,
      visualizers: 14
    }
  },
  {
    id: 'dsa',
    code: 'PCCST303 & PCEOT303',
    title: 'Data Structures & Algorithms (Atlas)',
    semester: 'S3',
    scheme: 'KTU 2024 Scheme',
    credits: 4,
    category: 'Computer Science & Engineering',
    status: 'live',
    description: 'Atlas: Data structures and algorithms explained with step-by-step visual simulations, asymptotic complexity analyzers, and C code execution.',
    route: '/courses/dsa/',
    accentColor: '#059669',
    tags: ['Trees & Graphs', 'Visual Simulations', 'Memory Allocation', 'C Code', 'Sorting'],
    metrics: {
      modules: 5,
      topics: 24,
      visualizers: 18
    }
  },
  {
    id: 'daa',
    code: 'PCCST502',
    title: 'Design and Analysis of Algorithms',
    semester: 'S5',
    scheme: 'KTU 2024 Scheme',
    credits: 4,
    category: 'Computer Science & Engineering',
    status: 'live',
    description: 'Interactive algorithm benches, asymptotic growth comparisons, loop step calculators, and syllabus-synchronized mock examinations. Master dynamic programming, greedy paradigms, and complexity bounds by watching algorithms execute step by step.',
    route: '/courses/daa/',
    accentColor: '#7c3aed',
    tags: ['Algorithm Benches', 'Asymptotic Proofs', 'Dynamic Programming', 'Loop Analysis', 'Mock Exams'],
    metrics: {
      modules: 5,
      topics: 28,
      visualizers: 20
    }
  },
  {
    id: 'oop',
    code: 'PBCST304 & PBEOT404',
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
