import { useEffect, useState } from 'react'

type State = 'Balance' | 'Imbalance' | 'Acceptance' | 'Rejection'

interface Scenario {
  id: number
  correct: State
  rationale: string
  candles: { o: number, c: number, h: number, l: number }[]
}

const palette = {
  bg: '#0A0E1A',
  border: '#2A3654',
  bull: '#10B981',
  bear: '#EF4444',
}

function genCandles(kind: State): Scenario['candles'] {
  switch (kind) {
    case 'Balance':
      return Array.from({ length: 10 }).map((_, i) => {
        const o = 50 + Math.sin(i * 1.1) * 3
        const c = o + (i % 2 === 0 ? 1.6 : -1.6)
        return { o, c, h: Math.max(o, c) + 1.4, l: Math.min(o, c) - 1.4 }
      })
    case 'Imbalance':
      return Array.from({ length: 10 }).map((_, i) => {
        const base = 30 + i * 4
        return { o: base, c: base + 3, h: base + 3.5, l: base - 0.5 }
      })
    case 'Acceptance':
      return Array.from({ length: 10 }).map((_, i) => {
        const base = i < 4 ? 75 - i * 3 : 62 + Math.sin(i) * 2
        const o = base
        const c = o + (i % 2 === 0 ? 1 : -1)
        return { o, c, h: Math.max(o, c) + 1, l: Math.min(o, c) - 1 }
      })
    case 'Rejection':
      return Array.from({ length: 10 }).map((_, i) => {
        if (i < 5) {
          const base = 35 + i * 6
          return { o: base, c: base + 3, h: base + 3.5, l: base - 0.5 }
        } else {
          const base = 65 - (i - 5) * 7
          return { o: base, c: base - 4, h: base + 1, l: base - 5 }
        }
      })
  }
}

const SCENARIOS: Scenario[] = [
  { id: 1, correct: 'Balance', rationale: 'Sideways oscillation with no commitment — both sides agreeing on value.', candles: genCandles('Balance') },
  { id: 2, correct: 'Imbalance', rationale: 'Strong directional move, one side overwhelming — volume thins.', candles: genCandles('Imbalance') },
  { id: 3, correct: 'Rejection', rationale: 'Spike into level then sharp reversal — price refused to accept.', candles: genCandles('Rejection') },
  { id: 4, correct: 'Acceptance', rationale: 'Price returned to a prior level and oscillates — validating the node.', candles: genCandles('Acceptance') },
  { id: 5, correct: 'Imbalance', rationale: 'Aggressive directional candles — the auction is trending hard.', candles: genCandles('Imbalance') },
  { id: 6, correct: 'Balance', rationale: 'Range-bound, mean-reverting bars — agreement on value.', candles: genCandles('Balance') },
]

const OPTIONS: State[] = ['Balance', 'Imbalance', 'Acceptance', 'Rejection']

export default function SpotAuctionState() {
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState<(State | null)[]>(Array(SCENARIOS.length).fill(null))
  const [revealed, setRevealed] = useState<boolean[]>(Array(SCENARIOS.length).fill(false))
  const [showCandles, setShowCandles] = useState(0)

  const s = SCENARIOS[idx]
  const isLast = idx === SCENARIOS.length - 1
  const score = revealed.reduce((acc, r, i) => acc + (r && answered[i] === SCENARIOS[i].correct ? 1 : 0), 0)
  const allDone = revealed.every(Boolean)

  // Animated reveal of candles on scenario change
  useEffect(() => {
    setShowCandles(0)
    const t = setInterval(() => {
      setShowCandles((n) => {
        if (n >= s.candles.length) {
          clearInterval(t)
          return n
        }
        return n + 1
      })
    }, 280)
    return () => clearInterval(t)
  }, [idx, s.candles.length])

  function answer(opt: State) {
    if (revealed[idx]) return
    const newAns = [...answered]; newAns[idx] = opt; setAnswered(newAns)
    const newRev = [...revealed]; newRev[idx] = true; setRevealed(newRev)
  }

  function next() {
    if (!isLast) setIdx(idx + 1)
  }

  // SVG rendering
  const W = 600, H = 220
  const padX = 16, padY = 16
  const candleW = (W - padX * 2) / s.candles.length
  const yMin = 20, yMax = 90
  const toPx = (price: number) => H - padY - ((price - yMin) / (yMax - yMin)) * (H - 2 * padY)

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h4 className="font-head font-semibold text-xl">Interactive · Spot the Auction State</h4>
        <span className="text-xs font-mono text-text-secondary">{idx + 1} / {SCENARIOS.length}</span>
      </div>

      <div className="rounded-lg border border-border-subtle overflow-hidden mb-5" style={{ background: palette.bg }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Sequence ${idx + 1} of price action candles for classification`}>
          {[30, 50, 70].map((p) => (
            <line key={p} x1={padX} y1={toPx(p)} x2={W - padX} y2={toPx(p)} stroke={palette.border} strokeOpacity="0.4" strokeDasharray="2 4" />
          ))}
          {s.candles.slice(0, showCandles).map((c, i) => {
            const x = padX + i * candleW + candleW / 2
            const isBull = c.c >= c.o
            const color = isBull ? palette.bull : palette.bear
            return (
              <g key={`${idx}-${i}`}>
                <line x1={x} y1={toPx(c.h)} x2={x} y2={toPx(c.l)} stroke={color} strokeWidth="1.2" />
                <rect x={x - candleW * 0.34} y={toPx(Math.max(c.o, c.c))} width={candleW * 0.68} height={Math.max(1, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
              </g>
            )
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        {OPTIONS.map((opt) => {
          const isCorrect = revealed[idx] && opt === s.correct
          const isSelected = answered[idx] === opt
          const isWrong = revealed[idx] && isSelected && opt !== s.correct
          let cls = 'px-3 py-3 rounded-lg border text-sm font-head font-semibold transition-all '
          if (isCorrect) cls += 'border-bull-green bg-bull-green/20 text-bull-green'
          else if (isWrong) cls += 'border-bear-red bg-bear-red/20 text-bear-red animate-shake'
          else if (revealed[idx]) cls += 'border-border-subtle bg-bg-elevated text-text-muted opacity-60'
          else cls += 'border-border-subtle bg-bg-elevated text-text-primary hover:border-accent-blue'
          return (
            <button key={opt} type="button" className={cls} disabled={revealed[idx]} onClick={() => answer(opt)}>
              {opt}
            </button>
          )
        })}
      </div>

      {revealed[idx] && (
        <div className="p-4 rounded-lg bg-bg-elevated border border-border-subtle mb-4">
          <div className="text-xs font-mono uppercase mb-1 text-text-secondary">
            {answered[idx] === s.correct ? <span className="text-bull-green">Correct — {s.correct}</span> : <span className="text-bear-red">Not quite — answer was {s.correct}</span>}
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{s.rationale}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-text-secondary">
          Score: <span className="text-poc-gold font-bold">{score}</span> / {SCENARIOS.length}
          {allDone && score >= 5 && <span className="ml-2 text-bull-green">✓ Passed</span>}
          {allDone && score < 5 && <span className="ml-2 text-lvn-amber">Review and retry — 5 of 6 to pass</span>}
        </div>
        {!isLast && revealed[idx] && (
          <button className="btn-primary" onClick={next}>Next →</button>
        )}
        {isLast && revealed[idx] && score < 5 && (
          <button
            className="btn-secondary"
            onClick={() => { setIdx(0); setAnswered(Array(SCENARIOS.length).fill(null)); setRevealed(Array(SCENARIOS.length).fill(false)); }}
          >Retry</button>
        )}
      </div>
    </div>
  )
}
