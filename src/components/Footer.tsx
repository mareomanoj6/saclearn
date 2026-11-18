import { Mail } from 'lucide-react'
import { InstagramIcon, YoutubeIcon, WhatsappIcon } from './BrandIcons'
import { LINKS } from '../data/links'

export function Footer() {
  const items = [
    { label: 'Instagram', url: LINKS.instagramKsuCet, icon: <InstagramIcon width={17} height={17} /> },
    { label: 'YouTube', url: LINKS.youtube, icon: <YoutubeIcon width={17} height={17} /> },
    { label: 'Email', url: LINKS.email ? 'mailto:' + LINKS.email : '', icon: <Mail size={17} strokeWidth={1.8} /> },
    { label: 'WhatsApp', url: LINKS.whatsapp, icon: <WhatsappIcon width={17} height={17} /> },
  ]

  return (
    <footer className="border-t border-line mt-auto bg-bg/50 backdrop-blur-sm">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8 py-5 safe-bottom flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
        <div className="text-center md:text-left">
          © 2026 SAC LEARN · KSU CET Student Assist Cell
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
              className="text-subtle hover:text-accent transition-colors p-1"
            >
              {i.icon}
            </a>
          ) : (
            <span 
              key={i.label} 
              aria-label={i.label + ' (coming soon)'} 
              title={i.label + ' (coming soon)'}
              className="text-subtle/50 p-1"
            >
              {i.icon}
            </span>
          ))}
        </div>

        <div className="text-center md:text-right">
          Developed by <span className="font-medium text-fg">KSU SAC Web Team</span>
        </div>
      </div>
    </footer>
  )
}
