import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { LESSONS } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import KeyTermsPopout from './KeyTermsPopout'

interface Props {
  lessonId: string
  children: React.ReactNode
  glossaryTerms?: string[]
}

function StarRow({ n }: { n: number }) {
  return <span>{Array.from({ length: 5 }).map((_, i) => <span key={i} className={i < n ? 'text-poc-gold' : 'text-text-muted/30'}>★</span>)}</span>
}

export default function LessonLayout({ lessonId, children, glossaryTerms }: Props) {
  const lesson = LESSONS.find((l) => l.id === lessonId)!
  const lessonIdx = LESSONS.findIndex((l) => l.id === lessonId)
  const prev = lessonIdx > 0 ? LESSONS[lessonIdx - 1] : null
  const next = lessonIdx < LESSONS.length - 1 ? LESSONS[lessonIdx + 1] : null
  const { isCompleted } = useProgress()
  const completed = isCompleted(lessonId)
  const firedConfetti = useRef(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (completed && !firedConfetti.current) {
      firedConfetti.current = true
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#14B8A6', '#A78BFA', '#3B82F6'],
        })
      } catch { /* noop */ }
      setShowToast(true)
      const t = setTimeout(() => setShowToast(false), 4000)
      return () => clearTimeout(t)
    }
  }, [completed])

  return (
    <div className="flex gap-6">
      <article className="flex-1 min-w-0 max-w-[880px] mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 pb-6 border-b border-border-subtle"
        >
          <div className="flex items-center gap-3 text-xs text-text-secondary mb-3 font-mono">
            <Link to="/" className="hover:text-poc-gold">Home</Link>
            <span>›</span>
            <span>Lesson {lesson.num}</span>
          </div>
          <h1 className="font-head font-bold text-3xl md:text-4xl leading-tight mb-3">{lesson.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-mono text-text-secondary">⏱ {lesson.duration}</span>
            <span className="text-sm"><StarRow n={lesson.difficulty} /></span>
            {completed && <span className="badge bg-bull-green/15 text-bull-green border border-bull-green/30">Completed</span>}
          </div>
        </motion.header>

        {children}

        <nav className="mt-12 pt-6 border-t border-border-subtle flex justify-between gap-4">
          {prev ? (
            <Link to={`/lesson/${prev.slug}`} className="btn-secondary !justify-start text-left max-w-[44%]">
              <div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider">← Previous</div>
                <div className="text-sm">{prev.title}</div>
              </div>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/lesson/${next.slug}`} className="btn-secondary !justify-end text-right max-w-[44%]">
              <div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider">Next →</div>
                <div className="text-sm">{next.title}</div>
              </div>
            </Link>
          ) : <span />}
        </nav>
      </article>

      {glossaryTerms && <KeyTermsPopout terms={glossaryTerms} />}

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-poc-gold/60 bg-bg-card px-5 py-3 shadow-xl shadow-poc-gold/10 animate-fade-up">
          <div className="font-head font-bold text-poc-gold">🏆 Lesson Complete!</div>
          <div className="text-xs text-text-secondary">{next ? 'Next lesson unlocked.' : 'You finished the bootcamp.'}</div>
        </div>
      )}
    </div>
  )
}
