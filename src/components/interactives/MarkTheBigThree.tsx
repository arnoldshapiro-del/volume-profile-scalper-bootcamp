import { useState } from 'react'

const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  hvn: '#14B8A6', poc: '#FFD700', purple: '#A78BFA',
}

interface Diagram {
  id: number
  poc: number
  vah: number
  val: number
}

const DIAGRAMS: Diagram[] = [
  { id: 1, poc: 50, vah: 60, val: 40 },
  { id: 2, poc: 45, vah: 55, val: 35 },
  { id: 3, poc: 58, vah: 66, val: 48 },
  { id: 4, poc: 40, vah: 50, val: 32 },
]

type Label = 'POC' | 'VAH' | 'VAL'
type Target = 'poc' | 'vah' | 'val'
const LABELS: Label[] = ['POC', 'VAH', 'VAL']

type Assignments = Record<number, Partial<Record<Label, Target>>>
type Feedback = Record<number, Partial<Record<Label, 'ok' | 'no'>>>

export default function MarkTheBigThree() {
  const [idx, setIdx] = useState(0)
  const [activeLabel, setActiveLabel] = useState<Label>('POC')
  const [assignments, setAssignments] = useState<Assignments>({})
  const [feedback, setFeedback] = useState<Feedback>({})

  const diagram = DIAGRAMS[idx]
  const dAssign = assignments[diagram.id] || {}
  const dFeedback = feedback[diagram.id] || {}

  function assign(target: Target) {
    const correct = (activeLabel === 'POC' && target === 'poc') ||
                    (activeLabel === 'VAH' && target === 'vah') ||
                    (activeLabel === 'VAL' && target === 'val')
    setAssignments((a) => ({ ...a, [diagram.id]: { ...(a[diagram.id] || {}), [activeLabel]: target } }))
    setFeedback((f) => ({ ...f, [diagram.id]: { ...(f[diagram.id] || {}), [activeLabel]: correct ? 'ok' : 'no' } }))

    // Auto-advance the active label to the next un-correct one
    const labelOrder: Label[] = ['POC', 'VAH', 'VAL']
    const nextFeedback = { ...(feedback[diagram.id] || {}), [activeLabel]: correct ? 'ok' : 'no' }
    const nextLabel = labelOrder.find((l) => nextFeedback[l] !== 'ok')
    if (nextLabel) setActiveLabel(nextLabel)
  }

  const allCorrect = (id: number) => {
    const f = feedback[id]
    return !!f && f.POC === 'ok' && f.VAH === 'ok' && f.VAL === 'ok'
  }
  const score = DIAGRAMS.filter((d) => allCorrect(d.id)).length

  function goTo(n: number) {
    if (n < 0 || n >= DIAGRAMS.length) return
    setIdx(n)
    setActiveLabel('POC')
  }

  const W = 600, H = 320
  const padX = 24
  const profileW = 200
  const yMin = 22, yMax = 80
  const toPx = (price: number) => 30 + (H - 60) - ((price - yMin) / (yMax - yMin)) * (H - 60)
  const profile = (() => {
    const bars: { p: number, w: number }[] = []
    const yStep = (yMax - yMin) / 24
    for (let i = 0; i < 24; i++) {
      const p = yMin + i * yStep
      const d = Math.abs(p - diagram.poc)
      const w = Math.max(8, 160 * Math.exp(-(d * d) / 65))
      bars.push({ p, w })
    }
    return bars
  })()

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h4 className="font-head font-semibold text-xl">Interactive · Mark the Big Three</h4>
        <span className="text-xs font-mono text-text-secondary">Diagram {idx + 1} / {DIAGRAMS.length}</span>
      </div>
      <p className="text-sm text-text-secondary mb-4">1) Select a label below. 2) Click the matching position on the profile.</p>

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: palette.bg }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Profile diagram ${idx + 1}: click to place the POC, VAH, or VAL label.`}>
          {profile.map((b, i) => {
            const isPoc = Math.abs(b.p - diagram.poc) < 1.5
            return (
              <g key={i}>
                <rect x={padX} y={toPx(b.p) - 4} width={b.w} height={8} fill={palette.hvn} opacity="0.85" rx="1" />
                {isPoc && <rect x={padX} y={toPx(b.p) - 5} width={b.w + 4} height={10} fill={palette.poc} opacity="0.95" rx="1" />}
              </g>
            )
          })}
          <line x1={padX} y1={toPx(diagram.vah)} x2={padX + profileW + 30} y2={toPx(diagram.vah)} stroke={palette.purple} strokeDasharray="3 3" opacity="0.8" />
          <line x1={padX} y1={toPx(diagram.val)} x2={padX + profileW + 30} y2={toPx(diagram.val)} stroke={palette.purple} strokeDasharray="3 3" opacity="0.8" />

          {/* Click zones */}
          {(['poc', 'vah', 'val'] as Target[]).map((t) => {
            const price = t === 'poc' ? diagram.poc : t === 'vah' ? diagram.vah : diagram.val
            return (
              <rect
                key={t}
                x={padX + profileW}
                y={toPx(price) - 14}
                width={W - padX - profileW - 30}
                height={28}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onClick={() => assign(t)}
                aria-label={`Place ${activeLabel} at ${t.toUpperCase()} position`}
              />
            )
          })}

          {/* Render placed labels */}
          {LABELS.map((lbl) => {
            const tgt = dAssign[lbl]
            if (!tgt) return null
            const price = tgt === 'poc' ? diagram.poc : tgt === 'vah' ? diagram.vah : diagram.val
            const ok = dFeedback[lbl] === 'ok'
            return (
              <text
                key={lbl}
                x={W - padX - 20}
                y={toPx(price) + 4}
                fill={ok ? '#10B981' : '#EF4444'}
                fontFamily="Oxanium, sans-serif"
                fontSize="14"
                fontWeight="700"
                textAnchor="end"
              >
                {lbl} {ok ? '✓' : '✗'}
              </text>
            )
          })}
        </svg>
      </div>

      <div>
        <div className="text-xs font-mono uppercase text-text-secondary mb-2 tracking-wider">Active label</div>
        <div className="flex gap-2">
          {LABELS.map((l) => {
            const f = dFeedback[l]
            let cls = 'px-4 py-2 rounded-lg border font-head font-semibold text-sm transition-all '
            if (f === 'ok') cls += 'border-bull-green bg-bull-green/20 text-bull-green'
            else if (activeLabel === l) cls += 'border-poc-gold bg-poc-gold/20 text-poc-gold'
            else cls += 'border-border-subtle bg-bg-elevated text-text-primary hover:border-accent-blue'
            return (
              <button type="button" key={l} className={cls} onClick={() => setActiveLabel(l)}>
                {l} {f === 'ok' && '✓'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs font-mono text-text-secondary">
          Score: <span className="text-poc-gold font-bold">{score}</span> / {DIAGRAMS.length}
          {score === DIAGRAMS.length && <span className="ml-2 text-bull-green">✓ Perfect</span>}
        </div>
        <div className="flex gap-2">
          {idx > 0 && <button className="btn-secondary" onClick={() => goTo(idx - 1)}>← Prev</button>}
          {idx < DIAGRAMS.length - 1 && allCorrect(diagram.id) && <button className="btn-primary" onClick={() => goTo(idx + 1)}>Next →</button>}
        </div>
      </div>
    </div>
  )
}
