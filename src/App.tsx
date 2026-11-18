import { useRoute } from './lib/router'
import { Navbar } from './components/Navbar'
import { TryItProvider } from './components/TryIt'
import { Home } from './pages/Home'
import { ModulePage } from './pages/ModulePage'
import { TopicPage } from './pages/TopicPage'
import { Slides } from './pages/Slides'
import { MindMap } from './pages/MindMap'
import { Flashcards } from './pages/Flashcards'
import { Quiz } from './pages/Quiz'
import { Playground } from './pages/Playground'
import { PyqAnalyzer } from './pages/PyqAnalyzer'

export default function App() {
  const { path, query } = useRoute()
  const section = path[0] ?? ''

  let page
  switch (section) {
    case 'module': page = <ModulePage id={Number(path[1]) || 1} />; break
    case 'topic': page = <TopicPage id={path[1] ?? ''} tab={query.get('tab') ?? 'notes'} />; break
    case 'slides': page = <Slides moduleId={Number(path[1]) || 1} />; break
    case 'mindmap': page = <MindMap />; break
    case 'flashcards': page = <Flashcards key={query.toString()} initialTopic={query.get('topic')} initialModule={query.get('module')} />; break
    case 'quiz': page = <Quiz key={query.toString()} initialTopic={query.get('topic')} initialModule={query.get('module')} />; break
    case 'playground': page = <Playground />; break
    case 'pyq': page = <PyqAnalyzer />; break
    default: page = <Home />
  }

  return (
    <TryItProvider>
      <div className="min-h-screen flex flex-col">
        {section !== 'slides' && <Navbar section={section} />}
        <main className="flex-1">{page}</main>
      </div>
    </TryItProvider>
  )
}
