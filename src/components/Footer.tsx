import { Mail } from 'lucide-react'
import { InstagramIcon, YoutubeIcon, WhatsappIcon } from './BrandIcons'
import { LINKS } from '../data/links'

export function Footer() {
  const items = [
    { label: 'Instagram', url: LINKS.instagramKsuCet, icon: <InstagramIcon width={19} height={19} /> },
    { label: 'YouTube', url: LINKS.youtube, icon: <YoutubeIcon width={19} height={19} /> },
    { label: 'Email', url: LINKS.email ? 'mailto:' + LINKS.email : '', icon: <Mail size={19} strokeWidth={1.8} /> },
    { label: 'WhatsApp', url: LINKS.whatsapp, icon: <WhatsappIcon width={19} height={19} /> },
  ]

  return (
    <footer className="border-t border-line bg-surface/30 backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8 py-7 sm:py-9 flex flex-col md:flex-row items-center justify-between gap-5 text-sm">
        <div className="text-center md:text-left text-muted">
          <span className="text-accent font-semibold mr-1">©</span>
          <span className="text-fg font-medium">2026 SAC LEARN</span>
          <span className="mx-2 text-line" aria-hidden>·</span>
          <span>KSU CET Student Assist Cell</span>
        </div>

        <div className="flex items-center gap-3">
          {items.map(i => i.url ? (
            <a 
              key={i.label} 
              href={i.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={i.label} 
              title={i.label}
              className="text-accent hover:text-accent-strong p-2 rounded-lg hover:bg-accent-soft transition-all"
            >
              {i.icon}
            </a>
          ) : (
            <span 
              key={i.label} 
              aria-label={i.label + ' (coming soon)'} 
              title={i.label + ' (coming soon)'}
              className="text-subtle/40 p-2"
            >
              {i.icon}
            </span>
          ))}
        </div>

        <div className="text-center md:text-right text-muted">
          Developed by <span className="font-semibold text-accent">KSU SAC Web Team</span>
        </div>
      </div>
    </footer>
  )
}
