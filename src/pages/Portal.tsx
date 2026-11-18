import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Terminal, 
  BookOpen, 
  Cpu, 
  Sparkles, 
  Clock, 
  Info
} from 'lucide-react'
import { COURSES, CourseItem } from '../data/courses'
import { href } from '../lib/router'

export function Portal() {
  const [filter, setFilter] = useState<'all' | 'live' | 'pipeline'>('all')

  const filteredCourses = COURSES.filter(c => {
    if (filter === 'live') return c.status === 'live'
    if (filter === 'pipeline') return c.status !== 'live'
    return true
  })

  return (
    <div className="mx-auto max-w-[1440px] px-4 lg:px-8 pb-20">
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-line">
        <div className="absolute inset-0 -z-10 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 14 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent-soft text-accent border border-accent/20 mb-6"
          >
            <Sparkles size={14} />
            <span>KSU CET Academic Excellence Initiative</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.04]"
          >
            Master Engineering Courses <br />
            <span className="text-accent">Through Interactive Systems.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-lg sm:text-xl text-muted mt-6 max-w-2xl leading-relaxed"
          >
            SAC Learn bridges the gap between theoretical KTU syllabus requirements and intuitive comprehension. Zero-latency browser compilers, stepper execution models, and syllabus-synchronized problem banks.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.35, delay: 0.15 }}
            className="flex flex-wrap items-center gap-3 mt-8"
          >
            <a href="/courses/dsa/" className="btn btn-primary h-12 px-6 text-[15px] font-medium shadow-sm">
              Launch Atlas DSA Studio
              <ArrowRight size={17} />
            </a>
            <a href="#courses-catalog" className="btn h-12 px-6 text-[15px] font-medium">
              Browse Course Catalog
            </a>
            <a href={href('/about')} className="btn h-12 px-5 text-[15px] font-medium text-muted hover:text-fg">
              <Info size={16} />
              About SAC Learn
            </a>
          </motion.div>
        </div>
      </section>

      <section id="courses-catalog" className="pt-16 pb-20 border-b border-line scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-accent mb-2">Curriculum Catalog</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Available & Upcoming Portals</h2>
            <p className="text-muted text-sm sm:text-base mt-2">Explore active interactive studios or preview the development roadmap.</p>
          </div>

          <div className="flex items-center p-1 bg-surface rounded-xl border border-line self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === 'all' ? 'bg-elevated text-fg shadow-sm' : 'text-muted hover:text-fg'}`}
            >
              All ({COURSES.length})
            </button>
            <button
              onClick={() => setFilter('live')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === 'live' ? 'bg-elevated text-fg shadow-sm' : 'text-muted hover:text-fg'}`}
            >
              Live ({COURSES.filter(c => c.status === 'live').length})
            </button>
            <button
              onClick={() => setFilter('pipeline')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === 'pipeline' ? 'bg-elevated text-fg shadow-sm' : 'text-muted hover:text-fg'}`}
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

                  <h3 className="text-xl font-semibold leading-snug tracking-tight mb-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-subtle mb-4">
                    {course.category} · {course.semester} · {course.credits} Credits
                  </p>

                  <p className="text-sm text-muted leading-relaxed mb-6">
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

                <div>
                  {isLive && course.metrics && (
                    <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-lg bg-surface border border-line mb-4 text-center">
                      <div>
                        <div className="text-sm font-semibold">{course.metrics.modules}</div>
                        <div className="text-[10px] text-subtle uppercase">Modules</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{course.metrics.topics}</div>
                        <div className="text-[10px] text-subtle uppercase">Topics</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{course.metrics.visualizers}</div>
                        <div className="text-[10px] text-subtle uppercase">Visualizers</div>
                      </div>
                    </div>
                  )}

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
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider uppercase text-accent mb-2">System Design</div>
          <h2 className="text-3xl font-semibold tracking-tight">Built Different From Static PDF Notes</h2>
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
