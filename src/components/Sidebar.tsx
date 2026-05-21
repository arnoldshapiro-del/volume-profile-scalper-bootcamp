import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LESSONS } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 mb-6 group">
    <svg width="36" height="36" viewBox="0 0 64 64" className="shrink-0">
      <rect width="64" height="64" rx="12" fill="#0A0E1A"/>
      <rect x="8" y="14" width="14" height="36" fill="#14B8A6"/>
      <rect x="24" y="18" width="14" height="28" fill="#FFD700"/>
      <rect x="40" y="22" width="14" height="20" fill="#A78BFA"/>
    </svg>
    <div>
      <div className="font-head font-bold text-base leading-tight">VP Scalper</div>
      <div className="text-xs text-text-secondary leading-tight">Bootcamp</div>
    </div>
  </Link>
)

const Star = ({ filled }: { filled: boolean }) => (
  <span className={filled ? 'text-poc-gold' : 'text-text-muted/30'}>★</span>
)

function StarRow({ n }: { n: number }) {
  return (
    <span className="text-xs">
      {[1,2,3,4,5].map((i) => <Star key={i} filled={i <= n} />)}
    </span>
  )
}

function LessonItem({ lesson, completed, unlocked, active }: {
  lesson: typeof LESSONS[number]
  completed: boolean
  unlocked: boolean
  active: boolean
}) {
  const baseClass = "block px-3 py-2.5 rounded-lg transition-all duration-150 border"
  const stateClass = active
    ? "bg-bg-card border-accent-blue/60 text-text-primary"
    : unlocked
      ? "border-transparent text-text-primary hover:bg-bg-card/60 hover:border-border-subtle"
      : "border-transparent text-text-muted cursor-not-allowed"

  const content = (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md bg-bg-elevated border border-border-subtle text-xs font-mono font-bold">
        {lesson.num === 'C' ? 'C' : lesson.num}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold leading-snug truncate">{lesson.title}</div>
        <div className="text-[11px] mt-1 flex items-center gap-2 text-text-secondary">
          <span className="font-mono">{lesson.duration}</span>
          <StarRow n={lesson.difficulty} />
        </div>
      </div>
      <div className="shrink-0 pt-1">
        {completed && <span className="text-poc-gold" aria-label="completed">✓</span>}
        {!completed && !unlocked && <span className="text-text-muted" aria-label="locked">🔒</span>}
      </div>
    </div>
  )

  if (!unlocked) {
    return <div className={`${baseClass} ${stateClass}`} aria-disabled="true">{content}</div>
  }
  return (
    <Link to={`/lesson/${lesson.slug}`} className={`${baseClass} ${stateClass}`}>
      {content}
    </Link>
  )
}

export default function Sidebar() {
  const { progress, isUnlocked, completedCount } = useProgress()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const inner = (
    <>
      <Logo />
      <div className="mb-4 px-3">
        <div className="text-xs text-text-secondary mb-1">Progress</div>
        <div className="text-sm font-mono">
          <span className="text-poc-gold font-bold">{completedCount}</span>
          <span className="text-text-muted"> / {LESSONS.length}</span>
        </div>
      </div>
      <nav className="space-y-1.5">
        {LESSONS.map((lesson) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            completed={!!progress[lesson.id]?.completed}
            unlocked={isUnlocked(lesson.id)}
            active={location.pathname.endsWith(lesson.slug)}
          />
        ))}
      </nav>
      <div className="mt-6 pt-4 border-t border-border-subtle space-y-1">
        <Link to="/cheat-sheet" className="block px-3 py-2 text-sm text-text-secondary hover:text-poc-gold transition-colors">
          📜 Cheat Sheet
        </Link>
        <Link to="/glossary" className="block px-3 py-2 text-sm text-text-secondary hover:text-poc-gold transition-colors">
          📖 Glossary
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        className="lg:hidden fixed top-3 left-3 z-50 w-10 h-10 flex items-center justify-center rounded-lg bg-bg-elevated border border-border-subtle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <span className="text-text-primary text-xl">☰</span>
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-[280px] bg-bg-elevated border-r border-border-subtle p-4 pt-6 overflow-y-auto z-30">
        {inner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-bg-elevated border-r border-border-subtle p-4 pt-6 overflow-y-auto">
            <button
              type="button"
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-md bg-bg-card border border-border-subtle"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >✕</button>
            <div onClick={() => setMobileOpen(false)}>{inner}</div>
          </aside>
        </div>
      )}
    </>
  )
}
