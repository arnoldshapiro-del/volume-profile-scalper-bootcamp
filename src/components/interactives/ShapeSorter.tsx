import { useState } from 'react'

type Shape = 'D' | 'P' | 'b' | 'Trend'

interface Sample {
  id: number
  shape: Shape
  rationale: string
  // Profile widths length 20, top->bottom
  profile: number[]
}

const palette = {
  bg: '#0A0E1A', hvn: '#14B8A6', poc: '#FFD700',
}

function bell(): number[] {
  const out: number[] = []
  for (let i = 0; i < 20; i++) {
    const d = Math.abs(i - 9.5)
    out.push(Math.max(8, 95 * Math.exp(-(d * d) / 16)))
  }
  return out
}
function pShape(): number[] {
  // heavy bottom, tail up
  const out: number[] = []
  for (let i = 0; i < 20; i++) {
    if (i < 8) out.push(15 + (i / 8) * 10)
    else out.push(Math.max(8, 90 - (i - 8) * 6))
  }
  return out
}
function bShape(): number[] {
  const out: number[] = []
  for (let i = 0; i < 20; i++) {
    if (i > 12) out.push(15 + ((19 - i) / 8) * 10)
    else out.push(Math.max(8, 90 - (12 - i) * 6))
  }
  return out
}
function trend(): number[] {
  return Array.from({ length: 20 }).map((_, i) => 22 + Math.sin(i * 0.4) * 6)
}

// Slight variations:
function bellSkewP(): number[] {
  const b = bell()
  // small skew adding low-end weight
  return b.map((w, i) => i > 12 ? w * 1.15 : w * 0.95)
}
function midTrend(): number[] {
  // narrow elongated with tiny peak
  return Array.from({ length: 20 }).map((_, i) => 28 + (i === 12 ? 18 : 0) + Math.sin(i * 0.6) * 5)
}

const SAMPLES: Sample[] = [
  { id: 1, shape: 'D', rationale: 'Symmetrical bell, POC in middle. Classic balanced day.', profile: bell() },
  { id: 2, shape: 'P', rationale: 'Heavy bottom cluster, tail extending up. Short covering exhaustion.', profile: pShape() },
  { id: 3, shape: 'b', rationale: 'Heavy top cluster, tail down. Long liquidation exhaustion.', profile: bShape() },
  { id: 4, shape: 'Trend', rationale: 'Thin elongated profile with no clear value zone. Pure directional.', profile: trend() },
  { id: 5, shape: 'D', rationale: 'Slight skew but still bell-shaped — balanced.', profile: bellSkewP() },
  { id: 6, shape: 'Trend', rationale: 'Narrow elongated band — trend day signature.', profile: midTrend() },
  { id: 7, shape: 'P', rationale: 'Bottom cluster dominates with skinny tail — P-shape.', profile: pShape() },
  { id: 8, shape: 'b', rationale: 'Top cluster dominates with skinny tail down — b-shape.', profile: bShape() },
  { id: 9, shape: 'D', rationale: 'Clean bell — fade extremes, target POC.', profile: bell() },
  { id: 10, shape: 'Trend', rationale: 'No HVN cluster, thin all the way through.', profile: trend() },
  { id: 11, shape: 'P', rationale: 'Tail at top is unmistakable.', profile: pShape() },
  { id: 12, shape: 'b', rationale: 'Tail at bottom — liquidation pattern.', profile: bShape() },
]

const OPTIONS: Shape[] = ['D', 'P', 'b', 'Trend']

export default function ShapeSorter() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(Shape | null)[]>(Array(SAMPLES.length).fill(null))
  const [revealed, setRevealed] = useState<boolean[]>(Array(SAMPLES.length).fill(false))

  const s = SAMPLES[idx]
  const W = 220, H = 280, padX = 18, padY = 16

  const pocIdx = s.profile.indexOf(Math.max(...s.profile))

  function choose(opt: Shape) {
    if (revealed[idx]) return
    const a = [...answers]; a[idx] = opt; setAnswers(a)
    const r = [...revealed]; r[idx] = true; setRevealed(r)
  }

  const score = revealed.reduce((acc, r, i) => acc + (r && answers[i] === SAMPLES[i].shape ? 1 : 0), 0)

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h4 className="font-head font-semibold text-xl">Interactive · Shape Sorter</h4>
        <span className="text-xs font-mono text-text-secondary">{idx + 1} / {SAMPLES.length} · pass 9 of 12</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start mb-4">
        <div className="rounded-lg overflow-hidden mx-auto" style={{ background: palette.bg }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {s.profile.map((w, i) => {
              const yPx = padY + (i / (s.profile.length - 1)) * (H - 2 * padY)
              return <rect key={i} x={padX} y={yPx - 5} width={w} height={10} fill={i === pocIdx ? palette.poc : palette.hvn} opacity={i === pocIdx ? 1 : 0.85} rx="1" />
            })}
          </svg>
        </div>

        <div>
          <div className="text-xs font-mono text-text-secondary mb-2 uppercase tracking-wider">Classify the shape</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {OPTIONS.map((o) => {
              const sel = answers[idx] === o
              const correct = revealed[idx] && o === s.shape
              const wrong = revealed[idx] && sel && o !== s.shape
              let cls = 'px-4 py-3 rounded-lg border font-head font-semibold text-sm transition-all '
              if (correct) cls += 'border-bull-green bg-bull-green/20 text-bull-green'
              else if (wrong) cls += 'border-bear-red bg-bear-red/20 text-bear-red animate-shake'
              else if (sel) cls += 'border-accent-blue bg-accent-blue/15'
              else cls += 'border-border-subtle bg-bg-elevated hover:border-accent-blue'
              return <button key={o} type="button" disabled={revealed[idx]} onClick={() => choose(o)} className={cls}>{o}</button>
            })}
          </div>
          {revealed[idx] && (
            <div className="p-3 rounded-lg bg-bg-elevated border border-border-subtle">
              <div className="text-xs font-mono text-text-secondary mb-1">Answer: <span className="text-poc-gold">{s.shape}</span></div>
              <p className="text-sm">{s.rationale}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-text-secondary">
          Score: <span className="text-poc-gold font-bold">{score}</span> / {SAMPLES.length}
          {revealed.every(Boolean) && score >= 9 && <span className="ml-2 text-bull-green">✓ Passed</span>}
        </div>
        <div className="flex gap-2">
          {idx > 0 && <button className="btn-secondary" onClick={() => setIdx(idx - 1)}>← Prev</button>}
          {idx < SAMPLES.length - 1 && <button className="btn-secondary" onClick={() => setIdx(idx + 1)}>Next →</button>}
        </div>
      </div>
    </div>
  )
}
