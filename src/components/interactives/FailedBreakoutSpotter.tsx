import { useEffect, useState } from 'react'

const palette = { bg: '#0A0E1A', bull: '#10B981', bear: '#EF4444', poc: '#FFD700', purple: '#A78BFA' }
const VAH = 60, VAL = 40, POC = 50, yMin = 28, yMax = 80

type V = 'FAILED_BREAKOUT' | 'NOT'
interface Scenario { id: number; verdict: V; rationale: string; candles: { o: number, c: number, h: number, l: number }[] }

function failedAboveVAH(): Scenario['candles'] {
  const out: Scenario['candles'] = []
  let p = 56
  for (let i = 0; i < 5; i++) { const o = p; const c = p + 2.2; out.push({ o, c, h: c + 0.4, l: o - 0.4 }); p = c }
  for (let i = 0; i < 5; i++) { out.push({ o: p, c: p + (i % 2 ? -0.4 : 0.2), h: p + 0.5, l: p - 0.5 }) }
  for (let i = 0; i < 4; i++) { const o = p; const c = p - 1.6; out.push({ o, c, h: o + 0.4, l: c - 0.4 }); p = c }
  out.push({ o: p, c: p - 3.5, h: p + 0.5, l: p - 4 })
  p -= 3.5
  for (let i = 0; i < 8; i++) { out.push({ o: p, c: p - 1.2, h: p + 0.3, l: p - 1.6 }); p -= 1.2 }
  return out
}
function genuineAcceptance(): Scenario['candles'] {
  const out: Scenario['candles'] = []
  let p = 56
  for (let i = 0; i < 5; i++) { const o = p; const c = p + 2.2; out.push({ o, c, h: c + 0.4, l: o - 0.4 }); p = c }
  // Holds above VAH and continues
  for (let i = 0; i < 14; i++) { const o = p; const c = p + 0.8; out.push({ o, c, h: c + 0.4, l: o - 0.4 }); p = c }
  return out
}
function failedBelowVAL(): Scenario['candles'] {
  const out: Scenario['candles'] = []
  let p = 44
  for (let i = 0; i < 5; i++) { const o = p; const c = p - 2.2; out.push({ o, c, h: o + 0.4, l: c - 0.4 }); p = c }
  for (let i = 0; i < 5; i++) { out.push({ o: p, c: p + (i % 2 ? 0.3 : -0.3), h: p + 0.5, l: p - 0.5 }) }
  for (let i = 0; i < 4; i++) { const o = p; const c = p + 1.6; out.push({ o, c, h: c + 0.4, l: o - 0.4 }); p = c }
  out.push({ o: p, c: p + 3.5, h: p + 4, l: p - 0.4 })
  p += 3.5
  for (let i = 0; i < 8; i++) { out.push({ o: p, c: p + 1.2, h: p + 1.6, l: p - 0.3 }); p += 1.2 }
  return out
}
function newsHold(): Scenario['candles'] {
  const out: Scenario['candles'] = []
  let p = 56
  for (let i = 0; i < 4; i++) { const o = p; const c = p + 2.2; out.push({ o, c, h: c + 0.4, l: o - 0.4 }); p = c }
  // News candle that holds above
  out.push({ o: 64, c: 70, h: 71, l: 63 })
  p = 70
  for (let i = 0; i < 12; i++) { out.push({ o: p, c: p + 0.4, h: p + 0.6, l: p - 0.3 }); p += 0.4 }
  return out
}
function partial(): Scenario['candles'] {
  // Break + stall + re-entry but no rejection candle yet
  const out: Scenario['candles'] = []
  let p = 56
  for (let i = 0; i < 5; i++) { const o = p; const c = p + 2.2; out.push({ o, c, h: c + 0.4, l: o - 0.4 }); p = c }
  for (let i = 0; i < 7; i++) { out.push({ o: p, c: p + (i % 2 ? -0.3 : 0.2), h: p + 0.5, l: p - 0.5 }) }
  for (let i = 0; i < 5; i++) { const o = p; const c = p - 1; out.push({ o, c, h: o + 0.3, l: c - 0.3 }); p = c }
  // Stays mid-VA, no engulfing
  for (let i = 0; i < 6; i++) { out.push({ o: p, c: p - 0.2, h: p + 0.4, l: p - 0.5 }); p -= 0.2 }
  return out
}

const SCENARIOS: Scenario[] = [
  { id: 1, verdict: 'FAILED_BREAKOUT', rationale: 'Break above VAH, weak follow-through, re-entry, strong bear engulfing — textbook failed breakout.', candles: failedAboveVAH() },
  { id: 2, verdict: 'NOT', rationale: 'Genuine acceptance — break holds and continues higher. No reversal.', candles: genuineAcceptance() },
  { id: 3, verdict: 'FAILED_BREAKOUT', rationale: 'Same pattern below VAL with bullish rejection candle confirming reversal.', candles: failedBelowVAL() },
  { id: 4, verdict: 'NOT', rationale: 'News-driven move that finds acceptance — no failure. Stays outside VA.', candles: newsHold() },
  { id: 5, verdict: 'FAILED_BREAKOUT', rationale: 'Clear 4-step pattern, re-entry confirmed by strong bear candle.', candles: failedAboveVAH() },
  { id: 6, verdict: 'NOT', rationale: 'Re-entry without a rejection candle — pattern incomplete. Wait.', candles: partial() },
  { id: 7, verdict: 'FAILED_BREAKOUT', rationale: 'Below-VAL variant with bullish reversal — flip the same setup.', candles: failedBelowVAL() },
  { id: 8, verdict: 'NOT', rationale: 'Strong continuation above VAH with sustained acceptance.', candles: genuineAcceptance() },
]

export default function FailedBreakoutSpotter() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(V | null)[]>(Array(SCENARIOS.length).fill(null))
  const [revealed, setRevealed] = useState<boolean[]>(Array(SCENARIOS.length).fill(false))
  const [showCount, setShowCount] = useState(0)

  const s = SCENARIOS[idx]
  useEffect(() => {
    setShowCount(0)
    const t = setInterval(() => setShowCount((n) => n >= s.candles.length ? (clearInterval(t), n) : n + 1), 70)
    return () => clearInterval(t)
  }, [idx, s.candles.length])

  function pick(v: V) {
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
        <h4 className="font-head font-semibold text-xl">Interactive · Failed Breakout Spotter</h4>
        <span className="text-xs font-mono text-text-secondary">{idx + 1} / {SCENARIOS.length} · pass 6/8</span>
      </div>

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: palette.bg }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          <rect x={padX} y={toPx(VAH)} width={W - 2 * padX} height={toPx(VAL) - toPx(VAH)} fill={palette.purple} opacity="0.12" />
          <line x1={padX} y1={toPx(VAH)} x2={W - padX} y2={toPx(VAH)} stroke={palette.purple} strokeDasharray="3 3" />
          <line x1={padX} y1={toPx(VAL)} x2={W - padX} y2={toPx(VAL)} stroke={palette.purple} strokeDasharray="3 3" />
          <line x1={padX} y1={toPx(POC)} x2={W - padX} y2={toPx(POC)} stroke={palette.poc} opacity="0.7" />
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
        {(['FAILED_BREAKOUT', 'NOT'] as V[]).map((v) => {
          const sel = answers[idx] === v
          const correct = revealed[idx] && v === s.verdict
          const wrong = revealed[idx] && sel && v !== s.verdict
          let cls = 'px-4 py-3 rounded-lg border font-head font-semibold text-sm transition-all '
          if (correct) cls += 'border-bull-green bg-bull-green/20 text-bull-green'
          else if (wrong) cls += 'border-bear-red bg-bear-red/20 text-bear-red animate-shake'
          else cls += 'border-border-subtle bg-bg-elevated text-text-primary hover:border-accent-blue'
          return <button key={v} type="button" disabled={revealed[idx]} onClick={() => pick(v)} className={cls}>{v === 'NOT' ? 'NOT A FAILED BREAKOUT' : 'FAILED BREAKOUT'}</button>
        })}
      </div>

      {revealed[idx] && (
        <div className="p-3 rounded-lg bg-bg-elevated border border-border-subtle mb-3">
          <div className="text-xs font-mono uppercase mb-1 text-text-secondary">Answer: <span className="text-poc-gold">{s.verdict === 'NOT' ? 'NOT A FAILED BREAKOUT' : 'FAILED BREAKOUT'}</span></div>
          <p className="text-sm">{s.rationale}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-text-secondary">
          Score: <span className="text-poc-gold font-bold">{score}</span> / {SCENARIOS.length}
        </div>
        <div className="flex gap-2">
          {revealed[idx] && idx < SCENARIOS.length - 1 && <button className="btn-primary" onClick={() => setIdx(idx + 1)}>Next →</button>}
        </div>
      </div>
    </div>
  )
}
