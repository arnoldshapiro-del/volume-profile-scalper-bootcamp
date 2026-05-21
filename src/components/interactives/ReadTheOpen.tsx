import { useEffect, useState } from 'react'

type OpenType = 'Open Drive' | 'Open Test Drive' | 'Open Rejection Reverse' | 'Open Auction'
type Decision = 'TAKE' | 'SKIP'

interface Scenario {
  id: number
  open: OpenType
  decision: Decision
  rationale: string
  candles: { o: number, c: number, h: number, l: number }[]
}

const palette = { bg: '#0A0E1A', border: '#2A3654', bull: '#10B981', bear: '#EF4444', poc: '#FFD700' }

function driveUp(): { o: number, c: number, h: number, l: number }[] {
  return Array.from({ length: 16 }).map((_, i) => {
    const base = 30 + i * 3
    return { o: base, c: base + 2.5, h: base + 3, l: base - 0.3 }
  })
}
function driveDown(): { o: number, c: number, h: number, l: number }[] {
  return Array.from({ length: 16 }).map((_, i) => {
    const base = 75 - i * 3
    return { o: base, c: base - 2.5, h: base + 0.3, l: base - 3 }
  })
}
function testDrive(): { o: number, c: number, h: number, l: number }[] {
  const out: { o: number, c: number, h: number, l: number }[] = []
  let p = 55
  for (let i = 0; i < 4; i++) { out.push({ o: p, c: p - 1.5, h: p + 0.3, l: p - 1.8 }); p -= 1.5 }
  for (let i = 0; i < 12; i++) { const base = p + i * 2.6; out.push({ o: base, c: base + 2.2, h: base + 2.5, l: base - 0.3 }) }
  return out
}
function rejection(): { o: number, c: number, h: number, l: number }[] {
  const out: { o: number, c: number, h: number, l: number }[] = []
  let p = 45
  for (let i = 0; i < 5; i++) { out.push({ o: p, c: p + 2.5, h: p + 3, l: p - 0.3 }); p += 2.5 }
  out.push({ o: p, c: p - 5, h: p + 1, l: p - 5.5 }); p -= 5
  for (let i = 0; i < 10; i++) { out.push({ o: p, c: p - 2, h: p + 0.3, l: p - 2.3 }); p -= 2 }
  return out
}
function auction(): { o: number, c: number, h: number, l: number }[] {
  return Array.from({ length: 16 }).map((_, i) => {
    const base = 50 + Math.sin(i * 1.1) * 4
    const o = base
    const c = base + (i % 2 ? 1.4 : -1.4)
    return { o, c, h: Math.max(o, c) + 1, l: Math.min(o, c) - 1 }
  })
}

const SCENARIOS: Scenario[] = [
  { id: 1, open: 'Open Drive', decision: 'TAKE', rationale: 'Strong directional candles from the bell, no pullback — highest-conviction setup, join immediately.', candles: driveUp() },
  { id: 2, open: 'Open Auction', decision: 'SKIP', rationale: "Sideways chop, no commitment either side — stay small or stand aside.", candles: auction() },
  { id: 3, open: 'Open Test Drive', decision: 'TAKE', rationale: 'Brief opposite probe, then strong drive in the original direction — wait for reversal candle then join.', candles: testDrive() },
  { id: 4, open: 'Open Rejection Reverse', decision: 'TAKE', rationale: 'Sharp reversal candle through opening print — follow the reversal direction.', candles: rejection() },
  { id: 5, open: 'Open Drive', decision: 'TAKE', rationale: 'Strong directional move from open with no meaningful pullback — drive lower.', candles: driveDown() },
  { id: 6, open: 'Open Auction', decision: 'SKIP', rationale: 'Range-bound bars with no commitment — wait it out.', candles: auction() },
]

const OPEN_OPTIONS: OpenType[] = ['Open Drive', 'Open Test Drive', 'Open Rejection Reverse', 'Open Auction']

export default function ReadTheOpen() {
  const [idx, setIdx] = useState(0)
  const [openAns, setOpenAns] = useState<(OpenType | null)[]>(Array(SCENARIOS.length).fill(null))
  const [decAns, setDecAns] = useState<(Decision | null)[]>(Array(SCENARIOS.length).fill(null))
  const [revealed, setRevealed] = useState<boolean[]>(Array(SCENARIOS.length).fill(false))
  const [showCount, setShowCount] = useState(0)

  const s = SCENARIOS[idx]
  useEffect(() => {
    setShowCount(0)
    const t = setInterval(() => setShowCount((n) => n >= s.candles.length ? (clearInterval(t), n) : n + 1), 220)
    return () => clearInterval(t)
  }, [idx, s.candles.length])

  function reveal() {
    if (!openAns[idx] || !decAns[idx]) return
    const r = [...revealed]; r[idx] = true; setRevealed(r)
  }
  const score = revealed.reduce((acc, r, i) => acc + (r && openAns[i] === SCENARIOS[i].open && decAns[i] === SCENARIOS[i].decision ? 1 : 0), 0)

  const W = 600, H = 240, padX = 16
  const yMin = 22, yMax = 84
  const toPx = (price: number) => 18 + (H - 36) * (1 - (price - yMin) / (yMax - yMin))
  const cw = (W - 2 * padX) / s.candles.length

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h4 className="font-head font-semibold text-xl">Interactive · Read the Open</h4>
        <span className="text-xs font-mono text-text-secondary">{idx + 1} / {SCENARIOS.length}</span>
      </div>

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: palette.bg }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {s.candles.slice(0, showCount).map((c, i) => {
            const cx = padX + i * cw + cw / 2
            const isBull = c.c >= c.o
            const color = isBull ? palette.bull : palette.bear
            return (
              <g key={`${idx}-${i}`}>
                <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="1" />
                <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(1, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
              </g>
            )
          })}
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs font-mono text-text-secondary uppercase mb-2 tracking-wider">Open type</div>
          <div className="grid grid-cols-2 gap-2">
            {OPEN_OPTIONS.map((o) => {
              const sel = openAns[idx] === o
              const correct = revealed[idx] && o === s.open
              const wrong = revealed[idx] && sel && o !== s.open
              let cls = 'px-2.5 py-2 rounded-lg border text-xs font-head font-semibold transition-all '
              if (correct) cls += 'border-bull-green bg-bull-green/20 text-bull-green'
              else if (wrong) cls += 'border-bear-red bg-bear-red/20 text-bear-red animate-shake'
              else if (sel) cls += 'border-accent-blue bg-accent-blue/15'
              else cls += 'border-border-subtle bg-bg-elevated hover:border-accent-blue'
              return <button key={o} type="button" disabled={revealed[idx]} onClick={() => { const a = [...openAns]; a[idx] = o; setOpenAns(a) }} className={cls}>{o}</button>
            })}
          </div>
        </div>
        <div>
          <div className="text-xs font-mono text-text-secondary uppercase mb-2 tracking-wider">Decision</div>
          <div className="flex gap-2">
            {(['TAKE', 'SKIP'] as Decision[]).map((d) => {
              const sel = decAns[idx] === d
              const correct = revealed[idx] && d === s.decision
              const wrong = revealed[idx] && sel && d !== s.decision
              let cls = 'flex-1 px-3 py-3 rounded-lg border font-head font-semibold transition-all '
              if (correct) cls += 'border-bull-green bg-bull-green/20 text-bull-green'
              else if (wrong) cls += 'border-bear-red bg-bear-red/20 text-bear-red animate-shake'
              else if (sel) cls += 'border-accent-blue bg-accent-blue/15'
              else cls += 'border-border-subtle bg-bg-elevated hover:border-accent-blue'
              return <button key={d} type="button" disabled={revealed[idx]} onClick={() => { const a = [...decAns]; a[idx] = d; setDecAns(a) }} className={cls}>{d}</button>
            })}
          </div>
        </div>
      </div>

      {revealed[idx] && (
        <div className="p-3 rounded-lg bg-bg-elevated border border-border-subtle mb-3">
          <div className="text-xs font-mono uppercase mb-1 text-text-secondary">Answer: <span className="text-poc-gold">{s.open}</span> · <span className="text-poc-gold">{s.decision}</span></div>
          <p className="text-sm">{s.rationale}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-text-secondary">
          Score: <span className="text-poc-gold font-bold">{score}</span> / {SCENARIOS.length} {revealed.every(Boolean) && score >= 5 && <span className="text-bull-green ml-2">✓ Passed</span>}
        </div>
        <div className="flex gap-2">
          {!revealed[idx] && <button className="btn-primary disabled:opacity-40" disabled={!openAns[idx] || !decAns[idx]} onClick={reveal}>Reveal</button>}
          {revealed[idx] && idx < SCENARIOS.length - 1 && <button className="btn-primary" onClick={() => setIdx(idx + 1)}>Next →</button>}
        </div>
      </div>
    </div>
  )
}
