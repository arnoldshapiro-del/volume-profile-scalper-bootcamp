import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LESSONS } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import { useOnboarding } from '../hooks/useOnboarding'

function StarRow({ n }: { n: number }) {
  return (
    <span className="text-sm" role="img" aria-label={`Difficulty: ${n} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => <span aria-hidden="true" key={i} className={i < n ? 'text-poc-gold' : 'text-text-muted/30'}>★</span>)}
    </span>
  )
}

export default function Dashboard() {
  const { progress, isUnlocked, completedCount, progressPct } = useProgress()
  const { onboarding } = useOnboarding()

  const nextLesson = LESSONS.find((l) => isUnlocked(l.id) && !progress[l.id]?.completed)
  const firstName = onboarding.instrument ? `${onboarding.instrument} trader` : 'trader'

  return (
    <div className="max-w-5xl mx-auto">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 rounded-2xl border border-border-subtle overflow-hidden"
      >
        <div className="bg-gradient-to-br from-bg-card via-bg-card to-bg-elevated p-8 md:p-10">
          <div className="text-xs font-mono uppercase tracking-widest text-hvn-teal mb-3">Volume Profile · Scalper Bootcamp</div>
          <h1 className="font-head text-4xl md:text-5xl font-bold leading-tight mb-4">
            Read the auction.<br />
            <span className="bg-gradient-to-r from-hvn-teal to-poc-gold bg-clip-text text-transparent">Then take the trade.</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mb-6">
            Eleven focused lessons plus a capstone simulator. By the end, you'll classify any profile in 5 seconds and know when your Brooks setups are real — and when to skip them.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {nextLesson && (
              <Link to={`/lesson/${nextLesson.slug}`} className="btn-primary">
                {completedCount === 0 ? 'Start Lesson 0' : `Continue: ${nextLesson.title}`} →
              </Link>
            )}
            <Link to="/cheat-sheet" className="btn-secondary">View Cheat Sheet</Link>
          </div>

          <div className="mt-8 flex items-center gap-6 flex-wrap">
            <div>
              <div className="text-xs text-text-secondary font-mono uppercase tracking-wider">Progress</div>
              <div className="font-mono text-2xl"><span className="text-poc-gold font-bold">{completedCount}</span><span className="text-text-muted">/{LESSONS.length}</span></div>
            </div>
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="h-2 rounded-full bg-bg-base overflow-hidden">
                <div className="h-full bg-gradient-to-r from-hvn-teal to-poc-gold transition-all duration-700" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="text-xs text-text-muted mt-1.5 font-mono">{progressPct}% complete</div>
            </div>
            {onboarding.completed && (
              <div className="text-xs text-text-secondary">Welcome back, {firstName}.</div>
            )}
          </div>
        </div>
      </motion.section>

      <h2 className="font-head text-2xl font-bold mb-4">Curriculum</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LESSONS.map((lesson, idx) => {
          const completed = !!progress[lesson.id]?.completed
          const unlocked = isUnlocked(lesson.id)
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
            >
              {unlocked ? (
                <Link
                  to={`/lesson/${lesson.slug}`}
                  className="card card-hover block h-full group"
                >
                  <LessonCard lesson={lesson} completed={completed} unlocked locked={false} />
                </Link>
              ) : (
                <div className="card opacity-60 cursor-not-allowed">
                  <LessonCard lesson={lesson} completed={false} unlocked={false} locked />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function LessonCard({ lesson, completed, locked }: { lesson: typeof LESSONS[number], completed: boolean, unlocked: boolean, locked: boolean }) {
  return (
    <>
      <div className="flex items-start gap-4 mb-3">
        <div className="shrink-0 w-12 h-12 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center font-mono font-bold text-lg">
          {lesson.num === 'C' ? 'C' : lesson.num}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-head font-semibold text-lg leading-snug mb-1">{lesson.title}</h3>
          <div className="flex items-center gap-3 text-xs text-text-secondary font-mono">
            <span>⏱ {lesson.duration}</span>
            <StarRow n={lesson.difficulty} />
          </div>
        </div>
        <div className="shrink-0">
          {completed && <span className="text-poc-gold text-xl">✓</span>}
          {locked && <span className="text-text-muted text-xl">🔒</span>}
        </div>
      </div>
    </>
  )
}
