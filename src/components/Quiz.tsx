import { useState } from 'react'

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface QuizProps {
  questions: QuizQuestion[]
  onComplete: (score: number) => void
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const q = questions[currentIdx]
  const isCorrect = selected === q.correctIndex

  function submit() {
    if (selected === null) return
    setSubmitted(true)
    if (isCorrect) setScore((s) => s + 1)
  }

  function next() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setSelected(null)
      setSubmitted(false)
    } else {
      setCompleted(true)
      onComplete(isCorrect ? score + 0 : score) // score already updated
    }
  }

  if (completed) {
    const finalScore = score
    const pct = Math.round((finalScore / questions.length) * 100)
    const passed = finalScore >= Math.ceil(questions.length * 0.6)
    return (
      <div className="my-10 rounded-xl border border-border-subtle bg-bg-card p-8 text-center">
        <div className="text-5xl mb-4">{passed ? '🏆' : '📚'}</div>
        <h3 className="font-head text-3xl mb-2">Quiz Complete</h3>
        <p className="text-4xl font-mono font-bold mb-1">
          <span className={passed ? 'text-bull-green' : 'text-lvn-amber'}>{finalScore}</span>
          <span className="text-text-muted">/{questions.length}</span>
        </p>
        <p className="text-text-secondary mb-4">{pct}% — {passed ? 'Lesson unlocked.' : 'Review and retry to advance.'}</p>
        {!passed && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => { setCurrentIdx(0); setSelected(null); setSubmitted(false); setScore(0); setCompleted(false); }}
          >
            Retry Quiz
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="my-10 rounded-xl border border-border-subtle bg-bg-card p-6 md:p-8" role="region" aria-label="Lesson quiz">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs uppercase tracking-wider text-text-secondary font-mono">
          Question {currentIdx + 1} of {questions.length}
        </span>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <span
              key={i}
              className={`block w-2 h-2 rounded-full ${i < currentIdx ? 'bg-poc-gold' : i === currentIdx ? 'bg-accent-blue' : 'bg-bg-elevated'}`}
            />
          ))}
        </div>
      </div>

      <p className="text-lg font-head font-semibold mb-5 leading-snug">{q.prompt}</p>

      <div className="space-y-2.5 mb-6">
        {q.options.map((opt, i) => {
          const isSel = selected === i
          const showCorrect = submitted && i === q.correctIndex
          const showWrong = submitted && isSel && i !== q.correctIndex
          let cls = "w-full text-left px-4 py-3.5 rounded-lg border transition-all duration-200 flex items-start gap-3 "
          if (showCorrect) cls += "border-bull-green bg-bull-green/20 animate-flash"
          else if (showWrong) cls += "border-bear-red bg-bear-red/20 animate-shake"
          else if (isSel) cls += "border-accent-blue bg-accent-blue/10"
          else cls += "border-border-subtle bg-bg-elevated hover:border-accent-blue/60"

          return (
            <button
              type="button"
              key={i}
              className={cls}
              disabled={submitted}
              onClick={() => setSelected(i)}
              aria-pressed={isSel}
            >
              <span className="font-mono text-xs text-text-secondary mt-1 w-5 shrink-0">{String.fromCharCode(65 + i)})</span>
              <span className="flex-1 text-sm md:text-base">{opt}</span>
              {showCorrect && <span className="text-bull-green shrink-0">✓</span>}
              {showWrong && <span className="text-bear-red shrink-0">✗</span>}
            </button>
          )
        })}
      </div>

      {submitted && (
        <div className="mb-6 p-4 rounded-lg border border-border-subtle bg-bg-elevated">
          <div className="text-xs uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Explanation</div>
          <p className="text-sm text-text-primary leading-relaxed">{q.explanation}</p>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        {!submitted ? (
          <button type="button" className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed" disabled={selected === null} onClick={submit}>
            Submit
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={next}>
            {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} →
          </button>
        )}
      </div>
    </div>
  )
}
