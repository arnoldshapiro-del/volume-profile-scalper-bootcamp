import { useState } from 'react'

const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  hvn: '#14B8A6', poc: '#FFD700', purple: '#A78BFA',
}

interface Diagram {
  id: number
  // profile is array of {price, width}
  poc: number   // price for POC
  vah: number
  val: number
}

const DIAGRAMS: Diagram[] = [
  { id: 1, poc: 50, vah: 60, val: 40 },
  { id: 2, poc: 45, vah: 55, val: 35 },
  { id: 3, poc: 58, vah: 66, val: 48 },
  { id: 4, poc: 40, vah: 50, val: 32 },
]

const LABELS = ['POC', 'VAH', 'VAL'] as const
type Label = (typeof LABELS)[number]

export default function MarkTheBigThree() {
  const [idx, setIdx] = useState(0)
  const [assignments, setAssignments] = useState<Record<number, Partial<Record<Label, 'poc' | 'vah' | 'val'>>>>({})
  const [feedback, setFeedback] = useState<Record<number, Record<Label, 'ok' | 'no' | null>>>({})

  const diagram = DIAGRAMS[idx]

  function assign(label: Label, target: 'poc' | 'vah' | 'val') {
    const next = { ...(assignments[diagram.id] || {}), [label]: target }
    setAssignments({ ...assignments, [diagram.id]: next })
    const correct = (label === 'POC' && target === 'poc') || (label === 'VAH' && target === 'vah') || (label === 'VAL' && target === 'val')
    setFeedback((f) => ({ ...f, [diagram.id]: { ...(f[diagram.id] || { POC: null, VAH: null, VAL: null } as any), [label]: correct ? 'ok' : 'no' } }))
  }

  const allCorrect = (id: number) => {
    const f = feedback[id]
    return !!f && f.POC === 'ok' && f.VAH === 'ok' && f.VAL === 'ok'
  }
  const score = DIAGRAMS.filter((d) => allCorrect(d.id)).length

  // SVG
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
      <p className="text-sm text-text-secondary mb-4">Click each label, then click the matching position on the profile.</p>

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: palette.bg }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* Profile bars */}
          {profile.map((b, i) => {
            const isPoc = Math.abs(b.p - diagram.poc) < 1.5
            const isVAH = Math.abs(b.p - diagram.vah) < 1.5
            const isVAL = Math.abs(b.p - diagram.val) < 1.5
            return (
              <g key={i}>
                <rect x={padX} y={toPx(b.p) - 4} width={b.w} height={8} fill={palette.hvn} opacity="0.85" rx="1" />
                {isPoc && (
                  <g style={{ cursor: 'pointer' }} onClick={() => activeLabel && assign(activeLabel, 'poc')}>
                    <rect x={padX} y={toPx(b.p) - 5} width={b.w + 4} height={10} fill={palette.poc} opacity="0.95" rx="1" />
                  </g>
                )}
              </g>
            )
          })}
          {/* VAH/VAL horizontal click zones */}
          <line x1={padX} y1={toPx(diagram.vah)} x2={padX + profileW + 30} y2={toPx(diagram.vah)} stroke={palette.purple} strokeDasharray="3 3" opacity="0.8" />
          <line x1={padX} y1={toPx(diagram.val)} x2={padX + profileW + 30} y2={toPx(diagram.val)} stroke={palette.purple} strokeDasharray="3 3" opacity="0.8" />
          {/* Invisible click rects */}
          <rect x={padX + profileW} y={toPx(diagram.poc) - 14} width={W - padX - profileW - 30} height={28} fill="transparent" style={{ cursor: 'pointer' }} onClick={() => activeLabel && assign(activeLabel, 'poc')} />
          <rect x={padX + profileW} y={toPx(diagram.vah) - 14} width={W - padX - profileW - 30} height={28} fill="transparent" style={{ cursor: 'pointer' }} onClick={() => activeLabel && assign(activeLabel, 'vah')} />
          <rect x={padX + profileW} y={toPx(diagram.val) - 14} width={W - padX - profileW - 30} height={28} fill="transparent" style={{ cursor: 'pointer' }} onClick={() => activeLabel && assign(activeLabel, 'val')} />
          {/* Show user labels at the right side */}
          {(['POC', 'VAH', 'VAL'] as const).map((lbl) => {
            const tgt = assignments[diagram.id]?.[lbl]
            const px = tgt === 'poc' ? toPx(diagram.poc) : tgt === 'vah' ? toPx(diagram.vah) : tgt === 'val' ? toPx(diagram.val) : null
            if (px === null) return null
            const ok = feedback[diagram.id]?.[lbl] === 'ok'
            return (
              <g key={lbl} style={{ opacity: ok ? 1 : 0.7 }}>
                <text x={W - padX - 20} y={px + 4} fill={ok ? '#10B981' : '#EF4444'} fontFamily="Oxanium, sans-serif" fontSize="14" fontWeight="700" textAnchor="end">
                  {lbl} {ok ? '✓' : '✗'}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <ActiveLabelChooser
        onSelect={() => {}}
        feedback={feedback[diagram.id] || {}}
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs font-mono text-text-secondary">
          Score: <span className="text-poc-gold font-bold">{score}</span> / {DIAGRAMS.length}
        </div>
        <div className="flex gap-2">
          {idx > 0 && <button className="btn-secondary" onClick={() => setIdx(idx - 1)}>← Prev</button>}
          {idx < DIAGRAMS.length - 1 && allCorrect(diagram.id) && <button className="btn-primary" onClick={() => setIdx(idx + 1)}>Next →</button>}
        </div>
      </div>
    </div>
  )

  // (Active label state intentionally hoisted into nested component below — see below)
}

let activeLabel: Label | null = 'POC' // module-level fallback; replaced by component state

function ActiveLabelChooser({ onSelect, feedback }: { onSelect: (l: Label) => void, feedback: Partial<Record<Label, 'ok' | 'no' | null>> }) {
  const [sel, setSel] = useState<Label>('POC')
  // mirror to module-level so SVG clicks can read it
  activeLabel = sel
  return (
    <div>
      <div className="text-xs font-mono uppercase text-text-secondary mb-2">1. Select label · 2. Click target on profile</div>
      <div className="flex gap-2">
        {LABELS.map((l) => {
          const f = feedback[l]
          let cls = "px-4 py-2 rounded-lg border font-head font-semibold text-sm transition-all "
          if (f === 'ok') cls += 'border-bull-green bg-bull-green/20 text-bull-green'
          else if (sel === l) cls += 'border-poc-gold bg-poc-gold/20 text-poc-gold'
          else cls += 'border-border-subtle bg-bg-elevated text-text-primary hover:border-accent-blue'
          return (
            <button type="button" key={l} className={cls} onClick={() => { setSel(l); onSelect(l) }}>
              {l} {f === 'ok' && '✓'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
