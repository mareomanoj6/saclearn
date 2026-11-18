import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Terminal, 
  BookOpen, 
  Cpu, 
  Sparkles, 
  Clock 
} from 'lucide-react'
import { COURSES, CourseItem } from '../data/courses'
import { LINKS } from '../data/links'

export function Portal() {
  const [filter, setFilter] = useState<'all' | 'live' | 'pipeline'>('all')

  const filteredCourses = COURSES.filter(c => {
    if (filter === 'live') return c.status === 'live'
    if (filter === 'pipeline') return c.status !== 'live'
    return true
  })

  return (
    <div className="mx-auto max-w-[1780px] px-4 sm:px-6 lg:px-10 pb-16">
      <section className="relative pt-8 pb-8 sm:pt-10 sm:pb-10 lg:pt-12 lg:pb-12 border-b border-line">
        <div className="absolute inset-0 -z-10 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 14 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent-soft text-accent border border-accent/20 mb-3"
          >
            <Sparkles size={14} />
            <span>KSU CET Academic Excellence Initiative</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08]"
          >
            Master Engineering Courses <br />
            <span className="text-accent">Through Interactive Systems.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-base sm:text-lg text-muted mt-3 max-w-3xl leading-relaxed"
          >
            SAC Learn bridges the gap between theoretical KTU syllabus requirements and intuitive comprehension. Zero-latency browser compilers, stepper execution models, and syllabus-synchronized problem banks.
          </motion.p>
        </div>
      </section>

      <section id="courses-catalog" className="pt-8 pb-16 sm:pt-10 sm:pb-20 border-b border-line scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-accent mb-1.5">Curriculum Catalog</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">Available & Upcoming Portals</h2>
            <p className="text-muted text-sm sm:text-base mt-1">Explore active interactive studios or preview the development roadmap.</p>
          </div>

          <div className="flex items-center p-1 bg-surface rounded-xl border border-line self-start sm:self-auto shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === 'all' ? 'bg-elevated text-fg shadow-sm' : 'text-muted hover:text-fg'}`}
            >
              All ({COURSES.length})
            </button>
            <button
              onClick={() => setFilter('live')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === 'live' ? 'bg-elevated text-fg shadow-sm' : 'text-muted hover:text-fg'}`}
            >
              Live ({COURSES.filter(c => c.status === 'live').length})
            </button>
            <button
              onClick={() => setFilter('pipeline')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === 'pipeline' ? 'bg-elevated text-fg shadow-sm' : 'text-muted hover:text-fg'}`}
            >
              Pipeline ({COURSES.filter(c => c.status !== 'live').length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: CourseItem) => {
            const isLive = course.status === 'live'
            const isDev = course.status === 'development'
            return (
              <div 
                key={course.id}
                className={`card flex flex-col justify-between p-6 transition-all duration-200 ${
                  isLive ? 'border-accent/50 shadow-sm hover:border-accent' : 'border-line/80 hover:border-line'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-surface text-fg border border-line">
                      {course.code}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isLive 
                        ? 'bg-good-soft text-good' 
                        : isDev 
                          ? 'bg-warn-soft text-warn' 
                          : 'bg-surface-2 text-subtle'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-good animate-pulse' : isDev ? 'bg-warn' : 'bg-subtle'}`} />
                      {isLive ? 'Live Studio' : isDev ? 'In Development' : 'Scheduled'}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold leading-snug tracking-tight mb-3">
                    {course.title}
                  </h3>

                  <p className="text-sm text-muted leading-relaxed mb-5">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {course.tags.map(t => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-surface text-subtle font-medium border border-line/60">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  {isLive ? (
                    <a 
                      href={course.route} 
                      className="btn btn-primary w-full h-11 justify-center text-sm font-medium"
                    >
                      Enter Course Workspace
                      <ArrowRight size={16} />
                    </a>
                  ) : (
                    <button 
                      disabled 
                      className="btn w-full h-11 justify-center text-sm font-medium opacity-70 cursor-not-allowed bg-surface border border-line"
                    >
                      <Clock size={15} />
                      {isDev ? 'Integration in Progress' : 'Curriculum Scheduled'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {(filter === 'all' || filter === 'pipeline') && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 card p-6 sm:p-8 border border-dashed border-accent/40 bg-surface/50 backdrop-blur-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:border-accent">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-soft text-accent border border-accent/20 mb-3">
                  <Sparkles size={13} />
                  <span>Curriculum Expansion in Progress</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2">
                  More Courses Coming Soon
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  We are actively digitizing and engineering interactive environments for additional KTU courses across branches. Stepper engines, browser compilers, and syllabus question paper analyses are in development.
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-subtle font-medium mr-1.5">Planned tracks:</span>
                  {['Database Management Systems', 'Operating Systems', 'Computer Networks', 'Formal Languages & Automata', 'Digital Electronics'].map(track => (
                    <span key={track} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-surface text-subtle border border-line">
                      {track}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0">
                <a
                  href={LINKS.suggestWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary h-11 px-5 text-xs font-semibold justify-center shadow-sm"
                >
                  <span>Suggest a Course</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="text-xs font-semibold tracking-wider uppercase text-accent mb-1.5">System Design</div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Built Different From Static PDF Notes</h2>
          <p className="text-muted text-sm sm:text-base mt-2">
            Traditional engineering study consists of reading static PDFs without runtime feedback. SAC Learn embeds computational environments directly inside the syllabus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 border border-line/80">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent grid place-items-center mb-5">
              <Terminal size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">WebAssembly In-Browser Runtimes</h3>
            <p className="text-sm text-muted leading-relaxed">
              Targeted course kernels operating purely inside client browsers via WebAssembly. Zero backend setup, zero server compute costs, and instant code verification.
            </p>
          </div>

          <div className="card p-6 border border-line/80">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent grid place-items-center mb-5">
              <Cpu size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Deterministic State Steppers</h3>
            <p className="text-sm text-muted leading-relaxed">
              Step forward and backward through recursion trees, divide-and-conquer partitions, stack frames, and state lookups with explicit variable mutation watches.
            </p>
          </div>

          <div className="card p-6 border border-line/80">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent grid place-items-center mb-5">
              <BookOpen size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">KTU Question Paper Correlation</h3>
            <p className="text-sm text-muted leading-relaxed">
              Previous year university examination problems mapped against syllabus sub-clauses, tagged with frequency trends, mark allocations, and model implementations.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
