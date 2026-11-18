import { useRoute } from './lib/router'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { About } from './pages/About'
import { Portal } from './pages/Portal'

export default function App() {
  const { path } = useRoute()
  const section = path[0] ?? ''

  let page
  switch (section) {
    case 'about':
      page = <About />
      break
    case '':
    case 'portal':
    case 'courses':
    default:
      page = <Portal />
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar section={section} />
      <main className="flex-1">{page}</main>
      <Footer />
    </div>
  )
}
