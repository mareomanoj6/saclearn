import { useEffect } from 'react'
import { useRoute } from './lib/router'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { About } from './pages/About'
import { Portal } from './pages/Portal'

export default function App() {
  const { path } = useRoute()
  const section = path[0] ?? ''

  useEffect(() => {
    const token = import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN
    if (!token) return
    const script = document.createElement('script')
    script.defer = true
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    script.setAttribute('data-cf-beacon', JSON.stringify({ token }))
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [])

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
