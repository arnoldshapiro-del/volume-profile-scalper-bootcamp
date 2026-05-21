import { useState } from 'react'

const palette = { bg: '#0A0E1A', text: '#E8ECF4', textMuted: '#8B95B0', hvn: '#14B8A6', poc: '#FFD700', bull: '#10B981', bear: '#EF4444' }

interface Session {
  pocPrice: number
  tested: boolean
  range: [number, number]
}

interface Scenario {
  id: number
  sessions: Session[]
}

const SCENARIOS: Scenario[] = [
  { id: 1, sessions: [
    { pocPrice: 35, tested: true, range: [28, 50] },
    { pocPrice: 48, tested: false, range: [40, 56] },
    { pocPrice: 62, tested: true, range: [54, 70] },
    { pocPrice: 76, tested: false, range: [68, 82] },
    { pocPrice: 56, tested: true, range: [50, 64] },
  ]},
  { id: 2, sessions: [
    { pocPrice: 42, tested: false, range: [36, 50] },
    { pocPrice: 58, tested: true, range: [48, 64] },
    { pocPrice: 70, tested: true, range: [62, 76] },
    { pocPrice: 50, tested: false, range: [44, 58] },
    { pocPrice: 38, tested: true, range: [30, 46] },
  ]},
  { id: 3, sessions: [
    { pocPrice: 64, tested: true, range: [58, 70] },
    { pocPrice: 44, tested: true, range: [38, 52] },
    { pocPrice: 72, tested: false, range: [66, 78] },
    { pocPrice: 56, tested: true, range: [50, 62] },
    { pocPrice: 32, tested: false, range: [26, 42] },
  ]},
  { id: 4, sessions: [
    { pocPrice: 50, tested: true, range: [42, 58] },
    { pocPrice: 66, tested: false, range: [60, 74] },
    { pocPrice: 38, tested: true, range: [32, 46] },
    { pocPrice: 78, tested: false, range: [70, 84] },
    { pocPrice: 54, tested: true, range: [48, 60] },
  ]},
  { id: 5, sessions: [
    { pocPrice: 60, tested: false, range: [52, 68] },
    { pocPrice: 40, tested: true, range: [34, 50] },
    { pocPrice: 72, tested: true, range: [66, 78] },
    { pocPrice: 50, tested: true, range: [44, 58] },
    { pocPrice: 36, tested: false, range: [28, 44] },
  ]},
  { id: 6, sessions: [
    { pocPrice: 46, tested: true, range: [38, 54] },
    { pocPrice: 68, tested: false, range: [62, 76] },
    { pocPrice: 54, tested: true, range: [48, 60] },
    { pocPrice: 32, tested: true, range: [26, 40] },
    { pocPrice: 70, tested: false, range: [64, 78] },
  ]},
]

export default function SpotTheNakedPOC() {
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<Record<number, Set<number>>>({})
  const [revealed, setRevealed] = useState<boolean[]>(Array(SCENARIOS.length).fill(false))

  const s = SCENARIOS[idx]
  const pickedSet = picked[s.id] || new Set<number>()

  function toggle(sessionIdx: number) {
    if (revealed[idx]) return
    const next = new Set(pickedSet)
    if (next.has(sessionIdx)) next.delete(sessionIdx); else next.add(sessionIdx)
    setPicked({ ...picked, [s.id]: next })
  }

  function reveal() {
    const r = [...revealed]; r[idx] = true; setRevealed(r)
  }

  const correct = (s: Scenario, picks: Set<number>) => {
    const nakedIdx = new Set(s.sessions.map((x, i) => x.tested ? -1 : i).filter((x) => x >= 0))
    if (picks.size !== nakedIdx.size) return false
    for (const i of picks) if (!nakedIdx.has(i)) return false
    return true
  }

  const score = SCENARIOS.reduce((acc, sc, i) => acc + (revealed[i] && correct(sc, picked[sc.id] || new Set()) ? 1 : 0), 0)

  // SVG
  const W = 600, H = 260, padX = 12, padY = 14
  const sessionW = (W - 2 * padX) / 5
  const yMin = 22, yMax = 86
  const toPx = (price: number) => padY + (H - 2 * padY) * (1 - (price - yMin) / (yMax - yMin))

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h4 className="font-head font-semibold text-xl">Interactive · Spot the Naked POC</h4>
        <span className="text-xs font-mono text-text-secondary">{idx + 1} / {SCENARIOS.length}</span>
      </div>
      <p className="text-xs text-text-secondary mb-3">Click each session whose POC is naked (untested by subsequent sessions).</p>

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: palette.bg }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {s.sessions.map((session, i) => {
            const x = padX + i * sessionW
            const isPicked = pickedSet.has(i)
            const showCorrect = revealed[idx] && !session.tested
            const showWrong = revealed[idx] && isPicked && session.tested

            return (
              <g key={i} style={{ cursor: revealed[idx] ? 'default' : 'pointer' }} onClick={() => toggle(i)}>
                <rect x={x + 4} y={padY} width={sessionW - 8} height={H - 2 * padY} fill={isPicked ? '#1A2540' : '#131B2E'} stroke={showCorrect ? '#10B981' : showWrong ? '#EF4444' : (isPicked ? '#3B82F6' : '#2A3654')} strokeWidth={(showCorrect || showWrong) ? 2 : 1} rx="6" />
                {/* mini profile */}
                {Array.from({ length: 14 }).map((_, j) => {
                  const p = session.range[0] + (j / 13) * (session.range[1] - session.range[0])
                  const d = Math.abs(p - session.pocPrice)
                  const w = Math.max(4, 38 * Math.exp(-(d * d) / 28))
                  const isPoc = Math.abs(p - session.pocPrice) < 2
                  return <rect key={j} x={x + 8} y={toPx(p) - 2} width={w} height={4} fill={isPoc ? palette.poc : palette.hvn} opacity={isPoc ? 1 : 0.7} rx="1" />
                })}
                <text x={x + sessionW / 2} y={H - 4} fill={palette.textMuted} fontFamily="Space Mono, monospace" fontSize="9" textAnchor="middle">D-{5 - i}</text>
                <text x={x + sessionW - 6} y={toPx(session.pocPrice) - 4} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="9" textAnchor="end">POC</text>
                {revealed[idx] && (
                  <text x={x + sessionW / 2} y={padY + 18} fill={session.tested ? palette.textMuted : palette.poc} fontFamily="Space Mono, monospace" fontSize="10" textAnchor="middle" fontWeight="700">
                    {session.tested ? 'tested' : 'NAKED'}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-text-secondary">
          Score: <span className="text-poc-gold font-bold">{score}</span> / {SCENARIOS.length}
        </div>
        <div className="flex gap-2">
          {!revealed[idx] && <button className="btn-primary" onClick={reveal}>Reveal</button>}
          {revealed[idx] && idx < SCENARIOS.length - 1 && <button className="btn-primary" onClick={() => setIdx(idx + 1)}>Next →</button>}
        </div>
      </div>
    </div>
  )
}
