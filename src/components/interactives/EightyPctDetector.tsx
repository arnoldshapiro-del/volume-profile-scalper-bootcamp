import { useEffect, useState } from 'react'

const palette = { bg: '#0A0E1A', bull: '#10B981', bear: '#EF4444', poc: '#FFD700', purple: '#A78BFA' }
const VAH = 60, VAL = 40, POC = 50, yMin = 28, yMax = 78

type Verdict = 'SETUP_CONFIRMED' | 'FALSE_POSITIVE'

interface Scenario {
  id: number
  verdict: Verdict
  rationale: string
  candles: { o: number, c: number, h: number, l: number }[]
}

function clean(): Scenario['candles'] {
  const out: Scenario['candles'] = []
  let p = 68
  for (let i = 0; i < 4; i++) out.push({ o: p, c: p - 0.5, h: p + 1, l: p - 1 })
  for (let i = 0; i < 5; i++) { const o = p; const c = p - 2.2; out.push({ o, c, h: o + 0.4, l: c - 0.4 }); p = c }
  for (let i = 0; i < 14; i++) { const base = 50 + Math.sin(i) * 4; out.push({ o: base, c: base + (i % 2 ? 1 : -1), h: base + 1.5, l: base - 1.5 }) }
  let p2 = 50
  for (let i = 0; i < 6; i++) { out.push({ o: p2, c: p2 - 1.4, h: p2 + 0.4, l: p2 - 1.8 }); p2 -= 1.4 }
  return out
}
function falseQuick(): Scenario['candles'] {
  const out: Scenario['candles'] = []
  let p = 68
  for (let i = 0; i < 5; i++) out.push({ o: p, c: p - 0.4, h: p + 1, l: p - 1 })
  out.push({ o: 67, c: 56, h: 67, l: 55 })
  let p2 = 56
  for (let i = 0; i < 14; i++) { const o = p2; const c = p2 + 1; out.push({ o, c, h: c + 0.4, l: o - 0.3 }); p2 = c }
  for (let i = 0; i < 6; i++) { const base = 70 + i * 0.6; out.push({ o: base, c: base + 0.5, h: base + 1, l: base - 0.4 }) }
  return out
}
function newsWick(): Scenario['candles'] {
  const out: Scenario['candles'] = []
  let p = 68
  for (let i = 0; i < 6; i++) out.push({ o: p, c: p - 0.3, h: p + 1, l: p - 1 })
  // News wick
  out.push({ o: 67, c: 48, h: 67, l: 46 })
  // Re-exit
  for (let i = 0; i < 6; i++) { const base = 50 + i * 2; out.push({ o: base, c: base + 1.8, h: base + 2, l: base - 0.4 }) }
  return out
}
function below(): Scenario['candles'] {
  const out: Scenario['candles'] = []
  let p = 32
  for (let i = 0; i < 4; i++) out.push({ o: p, c: p + 0.5, h: p + 1, l: p - 1 })
  for (let i = 0; i < 5; i++) { const o = p; const c = p + 2.2; out.push({ o, c, h: c + 0.5, l: o - 0.3 }); p = c }
  for (let i = 0; i < 14; i++) { const base = 50 + Math.sin(i) * 4; out.push({ o: base, c: base + (i % 2 ? 1 : -1), h: base + 1.5, l: base - 1.5 }) }
  let p2 = 50
  for (let i = 0; i < 6; i++) { out.push({ o: p2, c: p2 + 1.4, h: p2 + 1.8, l: p2 - 0.4 }); p2 += 1.4 }
  return out
}
function partial(): Scenario['candles'] {
  const out: Scenario['candles'] = []
  let p = 68
  for (let i = 0; i < 4; i++) out.push({ o: p, c: p - 0.5, h: p + 1, l: p - 1 })
  for (let i = 0; i < 5; i++) { const o = p; const c = p - 2.2; out.push({ o, c, h: o + 0.4, l: c - 0.4 }); p = c }
  for (let i = 0; i < 6; i++) { const base = 52; out.push({ o: base, c: base + (i % 2 ? 1 : -1), h: base + 1.2, l: base - 1.2 }) }
  // Re-exits before 2nd period complete
  for (let i = 0; i < 5; i++) { const base = 60 + i * 1.5; out.push({ o: base, c: base + 1, h: base + 1.2, l: base - 0.4 }) }
  return out
}

const SCENARIOS: Scenario[] = [
  { id: 1, verdict: 'SETUP_CONFIRMED', rationale: 'Clean open above VAH, gradual re-entry, two full 30-min periods inside. Take it.', candles: clean() },
  { id: 2, verdict: 'FALSE_POSITIVE', rationale: 'Quick wick re-entry that immediately re-exits — no acceptance.', candles: falseQuick() },
  { id: 3, verdict: 'SETUP_CONFIRMED', rationale: 'Below-VAL setup with gradual re-entry and two periods inside. Same mechanic.', candles: below() },
  { id: 4, verdict: 'FALSE_POSITIVE', rationale: 'News-driven wick re-entry that exits before the second 30-min period. Skip.', candles: newsWick() },
  { id: 5, verdict: 'SETUP_CONFIRMED', rationale: 'Open above, full acceptance, traversal toward POC. Textbook.', candles: clean() },
  { id: 6, verdict: 'FALSE_POSITIVE', rationale: 'Partial acceptance — only one 30-min period inside before re-exit. Wait next time.', candles: partial() },
]

export default function EightyPctDetector() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(Verdict | null)[]>(Array(SCENARIOS.length).fill(null))
  const [revealed, setRevealed] = useState<boolean[]>(Array(SCENARIOS.length).fill(false))
  const [showCount, setShowCount] = useState(0)

  const s = SCENARIOS[idx]
  useEffect(() => {
    setShowCount(0)
    const t = setInterval(() => setShowCount((n) => n >= s.candles.length ? (clearInterval(t), n) : n + 1), 90)
    return () => clearInterval(t)
  }, [idx, s.candles.length])

  function answer(v: Verdict) {
    if (revealed[idx]) return
    const a = [...answers]; a[idx] = v; setAnswers(a)
    const r = [...revealed]; r[idx] = true; setRevealed(r)
  }

  const score = revealed.reduce((acc, r, i) => acc + (r && answers[i] === SCENARIOS[i].verdict ? 1 : 0), 0)

  const W = 600, H = 240, padX = 14
  const cw = (W - 2 * padX) / s.candles.length
  const toPx = (price: number) => 14 + (H - 28) * (1 - (price - yMin) / (yMax - yMin))

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h4 className="font-head font-semibold text-xl">Interactive · 80% Rule Detector</h4>
        <span className="text-xs font-mono text-text-secondary">{idx + 1} / {SCENARIOS.length}</span>
      </div>

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: palette.bg }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          <rect x={padX} y={toPx(VAH)} width={W - 2 * padX} height={toPx(VAL) - toPx(VAH)} fill={palette.purple} opacity="0.12" />
          <line x1={padX} y1={toPx(VAH)} x2={W - padX} y2={toPx(VAH)} stroke={palette.purple} strokeDasharray="3 3" />
          <line x1={padX} y1={toPx(VAL)} x2={W - padX} y2={toPx(VAL)} stroke={palette.purple} strokeDasharray="3 3" />
          <line x1={padX} y1={toPx(POC)} x2={W - padX} y2={toPx(POC)} stroke={palette.poc} opacity="0.8" />
          {s.candles.slice(0, showCount).map((c, i) => {
            const cx = padX + i * cw + cw / 2
            const isBull = c.c >= c.o
            const color = isBull ? palette.bull : palette.bear
            return (
              <g key={`${idx}-${i}`}>
                <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="0.9" />
                <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(0.8, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
              </g>
            )
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {(['SETUP_CONFIRMED', 'FALSE_POSITIVE'] as Verdict[]).map((v) => {
          const sel = answers[idx] === v
          const correct = revealed[idx] && v === s.verdict
          const wrong = revealed[idx] && sel && v !== s.verdict
          let cls = 'px-4 py-3 rounded-lg border font-head font-semibold text-sm transition-all '
          if (correct) cls += 'border-bull-green bg-bull-green/20 text-bull-green'
          else if (wrong) cls += 'border-bear-red bg-bear-red/20 text-bear-red animate-shake'
          else cls += 'border-border-subtle bg-bg-elevated text-text-primary hover:border-accent-blue'
          return <button key={v} type="button" disabled={revealed[idx]} onClick={() => answer(v)} className={cls}>{v.replace('_', ' ')}</button>
        })}
      </div>

      {revealed[idx] && (
        <div className="p-3 rounded-lg bg-bg-elevated border border-border-subtle mb-3">
          <div className="text-xs font-mono uppercase mb-1 text-text-secondary">Answer: <span className="text-poc-gold">{s.verdict.replace('_', ' ')}</span></div>
          <p className="text-sm">{s.rationale}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-text-secondary">
          Score: <span className="text-poc-gold font-bold">{score}</span> / {SCENARIOS.length} {revealed.every(Boolean) && score >= 5 && <span className="text-bull-green ml-2">✓ Passed</span>}
        </div>
        <div className="flex gap-2">
          {revealed[idx] && idx < SCENARIOS.length - 1 && <button className="btn-primary" onClick={() => setIdx(idx + 1)}>Next →</button>}
        </div>
      </div>
    </div>
  )
}
