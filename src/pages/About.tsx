import { ExternalLink, Globe, Mail, Users } from 'lucide-react'
import { InstagramIcon, YoutubeIcon, WhatsappIcon } from '../components/BrandIcons'
import { LINKS, MANAGERS, Manager } from '../data/links'

const WHAT_WE_DO = [
  ['Interactive notes', 'Syllabus-based study notes for every topic, with key takeaways up front.'],
  ['Step-by-step animations', 'Watch algorithms such as recursion, sorting and the Tower of Hanoi run one step at a time.'],
  ['Flashcards and quizzes', 'Practise recall and predict-the-output questions, with a streak to keep it fun.'],
  ['Past question papers', 'Real KTU papers analysed by module, plus practice questions in the same pattern.'],
  ['Python playground', 'Write and run Python in the browser, with nothing to install.'],
]

function Card({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line p-5 sm:p-6 lg:p-7 flex flex-col h-full bg-surface">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-accent">
        {icon}
        {title}
      </h2>
      <div className="flex-1 flex flex-col justify-between">
        {children}
      </div>
    </section>
  )
}

function LinkRow({ icon, name, sub, url }: { icon: React.ReactNode; name: string; sub: string; url: string }) {
  const inner = (
    <>
      <span className="w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-accent-soft text-accent">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-sm text-fg">{name}</span>
        <span className="block text-xs text-subtle truncate">{url ? sub : 'Link coming soon'}</span>
      </span>
      {url && <ExternalLink size={15} className="text-subtle group-hover:text-accent transition-colors shrink-0" />}
    </>
  )
  const cls = 'group min-w-0 flex items-center gap-3 rounded-xl border border-line p-3 bg-elevated'
  return url
    ? <a href={url} target="_blank" rel="noopener noreferrer" className={cls + ' hover:border-accent transition-colors'}>{inner}</a>
    : <div className={cls + ' opacity-70'}>{inner}</div>
}

function ManagerCard({ name, phone, waUrl }: Manager) {
  return (
    <div className="rounded-xl border border-line p-4 bg-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-accent transition-colors">
      <div>
        <div className="font-semibold text-fg text-sm">{name}</div>
        <div className="text-xs text-subtle mt-0.5">Website Manager</div>
      </div>
      <a 
        href={waUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label={`Chat with ${name} on WhatsApp`}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-good-soft text-good hover:bg-good hover:text-white transition-colors self-start sm:self-auto shrink-0"
      >
        <WhatsappIcon width={14} height={14} />
        <span>{phone}</span>
      </a>
    </div>
  )
}

export function About() {
  return (
    <div className="mx-auto max-w-[1780px] px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
      <div className="text-xs font-semibold tracking-wider uppercase text-accent mb-1.5">About Us</div>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-8">About SAC LEARN</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <Card title="Our mission">
          <div>
            <p className="text-muted leading-relaxed mb-6 text-sm sm:text-base">
              KSU CET SAC Learn was created by students, for students. We make it effortless to find study materials, past question papers, and the academic support you need to succeed through interactive and fun methods.
            </p>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-accent mb-3">What we do on this website</h3>
            <ul className="grid grid-cols-1 gap-3">
              {WHAT_WE_DO.map(([t, d]) => (
                <li key={t} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-accent" />
                  <span><span className="font-medium text-fg">{t}:</span> <span className="text-muted">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card title="Connect with us">
          <div className="grid grid-cols-1 gap-2.5">
            <LinkRow icon={<InstagramIcon />} name="KSU CET Unit" sub="instagram.com/ksu.cet" url={LINKS.instagramKsuCet} />
            <LinkRow icon={<InstagramIcon />} name="SAC CET" sub="instagram.com/studentassistcell_cet" url={LINKS.instagramSacCet} />
            <LinkRow icon={<Globe size={20} strokeWidth={1.8} />} name="SAC website" sub="sac.ksucet.in" url={LINKS.sacWebsite} />
            <LinkRow icon={<YoutubeIcon />} name="YouTube" sub={LINKS.youtube.replace(/^https?:\/\//, '')} url={LINKS.youtube} />
            <LinkRow icon={<WhatsappIcon />} name="WhatsApp" sub="Chat with us" url={LINKS.whatsapp} />
            <LinkRow icon={<Mail size={20} strokeWidth={1.8} />} name="Email" sub={LINKS.email} url={'mailto:' + LINKS.email} />
          </div>
        </Card>

        <Card title="Website Managers" icon={<Users size={20} />}>
          <div>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Direct contact lines for website managers regarding portal technical issues, feature feedback, or KTU content additions.
            </p>
            <div className="grid grid-cols-1 gap-3">
              {MANAGERS.map(m => <ManagerCard key={m.name} {...m} />)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
