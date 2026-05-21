import { useState } from 'react'

const palette = {
  bg: '#0A0E1A', border: '#2A3654', bull: '#10B981', bear: '#EF4444',
  hvn: '#14B8A6', poc: '#FFD700', lvn: '#F59E0B', text: '#E8ECF4',
}

type Zone = 'HVN' | 'LVN'
type Action = 'Bounce' | 'Breakthrough'

interface Scenario {
  id: number
  zone: Zone
  action: Action
  rationale: string
  buildProfile: () => { p: number, w: number, type: 'poc' | 'hvn' | 'lvn' }[]
  highlightRange: [number, number]
  candleApproach: 'fromAbove' | 'fromBelow'
}

function denseAt(center: number, width: number, base = 12) {
  return (p: number) => {
    const d = Math.abs(p - center)
    return d < width ? base + (1 - d / width) * 140 : base
  }
}

function gapAt(start: number, end: number) {
  return (p: number) => (p >= start && p <= end ? 14 : 130)
}

function buildBars(fn: (p: number) => number, pocAt?: number): { p: number, w: number, type: 'poc' | 'hvn' | 'lvn' }[] {
  const yMin = 20, yMax = 90
  const arr: { p: number, w: number, type: 'poc' | 'hvn' | 'lvn' }[] = []
  for (let i = 0; i < 28; i++) {
    const p = yMin + (i / 27) * (yMax - yMin)
    const w = Math.min(165, Math.max(8, fn(p)))
    const isPoc = pocAt && Math.abs(p - pocAt) < 1.5
    const type = isPoc ? 'poc' : w > 80 ? 'hvn' : 'lvn'
    arr.push({ p, w, type })
  }
  return arr
}

const SCENARIOS: Scenario[] = [
  { id: 1, zone: 'HVN', action: 'Bounce', rationale: 'Clear HVN cluster mid-range, approached from above — institutions defend.', buildProfile: () => buildBars(denseAt(50, 8), 50), highlightRange: [44, 56], candleApproach: 'fromAbove' },
  { id: 2, zone: 'LVN', action: 'Breakthrough', rationale: 'Thin section between clusters — vacuum offers no friction.', buildProfile: () => buildBars((p) => p > 38 && p < 58 ? 16 : 130, 70), highlightRange: [38, 58], candleApproach: 'fromAbove' },
  { id: 3, zone: 'HVN', action: 'Bounce', rationale: 'Single long bar at POC — magnetic center, expect bounce.', buildProfile: () => buildBars(denseAt(55, 4), 55), highlightRange: [51, 59], candleApproach: 'fromAbove' },
  { id: 4, zone: 'LVN', action: 'Breakthrough', rationale: 'Wide profile gap near session high — no resistance left.', buildProfile: () => buildBars(gapAt(70, 84), 40), highlightRange: [70, 84], candleApproach: 'fromBelow' },
  { id: 5, zone: 'HVN', action: 'Bounce', rationale: "Stacked cluster at yesterday's VAH approached from below — strong rejection expected.", buildProfile: () => buildBars(denseAt(64, 5), 64), highlightRange: [60, 68], candleApproach: 'fromBelow' },
  { id: 6, zone: 'LVN', action: 'Breakthrough', rationale: 'Sparse profile just below session low, candles breaking — acceleration.', buildProfile: () => buildBars((p) => p < 32 ? 14 : 110, 55), highlightRange: [22, 32], candleApproach: 'fromAbove' },
  { id: 7, zone: 'HVN', action: 'Breakthrough', rationale: 'HVN already broken twice — defenders exhausted, weaker bounce, often breakthrough.', buildProfile: () => buildBars(denseAt(45, 6), 45), highlightRange: [41, 49], candleApproach: 'fromAbove' },
  { id: 8, zone: 'LVN', action: 'Bounce', rationale: 'LVN already crossed once — second traversal has less acceleration.', buildProfile: () => buildBars(gapAt(48, 60), 70), highlightRange: [48, 60], candleApproach: 'fromAbove' },
]

const ZONES: Zone[] = ['HVN', 'LVN']
const ACTIONS: Action[] = ['Bounce', 'Breakthrough']

export default function MountainOrValley() {
  const [idx, setIdx] = useState(0)
  const [zoneAns, setZoneAns] = useState<(Zone | null)[]>(Array(SCENARIOS.length).fill(null))
  const [actionAns, setActionAns] = useState<(Action | null)[]>(Array(SCENARIOS.length).fill(null))
  const [revealed, setRevealed] = useState<boolean[]>(Array(SCENARIOS.length).fill(false))

  const s = SCENARIOS[idx]
  const profile = s.buildProfile()
  const W = 600, H = 280, padX = 16
  const yMin = 20, yMax = 90
  const toPx = (price: number) => 18 + (H - 36) * (1 - (price - yMin) / (yMax - yMin))

  function answer() {
    if (revealed[idx]) return
    if (!zoneAns[idx] || !actionAns[idx]) return
    const r = [...revealed]; r[idx] = true; setRevealed(r)
  }

  const score = revealed.reduce((acc, r, i) => {
    if (!r) return acc
    const ok = zoneAns[i] === SCENARIOS[i].zone && actionAns[i] === SCENARIOS[i].action
    return acc + (ok ? 1 : 0)
  }, 0)

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h4 className="font-head font-semibold text-xl">Interactive · Mountain or Valley?</h4>
        <span className="text-xs font-mono text-text-secondary">{idx + 1} / {SCENARIOS.length}</span>
      </div>

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: palette.bg }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* Highlight zone */}
          <rect x={padX} y={toPx(s.highlightRange[1])} width={W - padX * 2} height={toPx(s.highlightRange[0]) - toPx(s.highlightRange[1])} fill={palette.poc} opacity="0.08" />
          {/* Profile bars */}
          {profile.map((b, i) => {
            const color = b.type === 'poc' ? palette.poc : b.type === 'hvn' ? palette.hvn : palette.lvn
            return <rect key={i} x={padX} y={toPx(b.p) - 4} width={b.w} height={8} fill={color} opacity={b.type === 'lvn' ? 0.55 : 0.9} rx="1" />
          })}
          {/* Candle approach */}
          {Array.from({ length: 14 }).map((_, i) => {
            const cx = W - padX - 8 - (13 - i) * 24
            const direction = s.candleApproach === 'fromAbove' ? -1 : 1
            const startP = s.candleApproach === 'fromAbove' ? 84 : 24
            const p = startP - direction * i * 2
            const o = p
            const c = p + direction * 1.5
            const color = direction > 0 ? palette.bull : palette.bear
            return (
              <g key={i}>
                <line x1={cx} y1={toPx(Math.max(o, c) + 0.5)} x2={cx} y2={toPx(Math.min(o, c) - 0.5)} stroke={color} strokeWidth="0.9" />
                <rect x={cx - 5} y={toPx(Math.max(o, c))} width={10} height={Math.max(2, Math.abs(toPx(o) - toPx(c)))} fill={color} />
              </g>
            )
          })}
          <text x={padX} y={H - 8} fill={palette.text} fontFamily="Space Mono, monospace" fontSize="10">approach: {s.candleApproach === 'fromAbove' ? '↓ from above' : '↑ from below'}</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs font-mono text-text-secondary mb-2 uppercase tracking-wider">Zone type</div>
          <div className="flex gap-2">
            {ZONES.map((z) => {
              const sel = zoneAns[idx] === z
              const correct = revealed[idx] && z === s.zone
              const wrong = revealed[idx] && sel && z !== s.zone
              let cls = 'flex-1 px-3 py-2 rounded-lg border text-sm font-head font-semibold transition-all '
              if (correct) cls += 'border-bull-green bg-bull-green/20 text-bull-green'
              else if (wrong) cls += 'border-bear-red bg-bear-red/20 text-bear-red animate-shake'
              else if (sel) cls += 'border-accent-blue bg-accent-blue/15'
              else cls += 'border-border-subtle bg-bg-elevated hover:border-accent-blue'
              return (
                <button key={z} type="button" disabled={revealed[idx]} onClick={() => { const a = [...zoneAns]; a[idx] = z; setZoneAns(a) }} className={cls}>{z}</button>
              )
            })}
          </div>
        </div>
        <div>
          <div className="text-xs font-mono text-text-secondary mb-2 uppercase tracking-wider">Likely action</div>
          <div className="flex gap-2">
            {ACTIONS.map((a) => {
              const sel = actionAns[idx] === a
              const correct = revealed[idx] && a === s.action
              const wrong = revealed[idx] && sel && a !== s.action
              let cls = 'flex-1 px-3 py-2 rounded-lg border text-sm font-head font-semibold transition-all '
              if (correct) cls += 'border-bull-green bg-bull-green/20 text-bull-green'
              else if (wrong) cls += 'border-bear-red bg-bear-red/20 text-bear-red animate-shake'
              else if (sel) cls += 'border-accent-blue bg-accent-blue/15'
              else cls += 'border-border-subtle bg-bg-elevated hover:border-accent-blue'
              return (
                <button key={a} type="button" disabled={revealed[idx]} onClick={() => { const arr = [...actionAns]; arr[idx] = a; setActionAns(arr) }} className={cls}>{a}</button>
              )
            })}
          </div>
        </div>
      </div>

      {revealed[idx] && (
        <div className="p-4 rounded-lg bg-bg-elevated border border-border-subtle mb-4">
          <div className="text-xs font-mono uppercase mb-1 text-text-secondary">
            Answer: <span className="text-poc-gold">{s.zone} · {s.action}</span>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{s.rationale}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-text-secondary">
          Score: <span className="text-poc-gold font-bold">{score}</span> / {SCENARIOS.length}
        </div>
        <div className="flex gap-2">
          {!revealed[idx] && <button className="btn-primary disabled:opacity-40" disabled={!zoneAns[idx] || !actionAns[idx]} onClick={answer}>Check</button>}
          {revealed[idx] && idx < SCENARIOS.length - 1 && <button className="btn-primary" onClick={() => setIdx(idx + 1)}>Next →</button>}
        </div>
      </div>
    </div>
  )
}
