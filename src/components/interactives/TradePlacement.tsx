import { useState } from 'react'
import type { CapstoneSetup, CapstoneDay } from '../../data/capstone-days'

interface Props {
  day: CapstoneDay
  setups: CapstoneSetup[]
  onComplete: (placements: Record<string, Placement>) => void
}

export interface Placement {
  entry: number
  stop: number
  t1: number
  t2: number
}

const palette = {
  bg: '#0A0E1A', bull: '#10B981', bear: '#EF4444', poc: '#FFD700', purple: '#A78BFA', hvn: '#14B8A6',
}

export default function TradePlacement({ day, setups, onComplete }: Props) {
  const [placements, setPlacements] = useState<Record<string, Placement>>(() => {
    // Initialize each setup with default placement so user can accept-and-score
    const init: Record<string, Placement> = {}
    setups.forEach((s) => { init[s.id] = initialPlacement(s) })
    return init
  })

  function updatePlacement(setupId: string, field: keyof Placement, value: number) {
    setPlacements((p) => {
      const existing = p[setupId] || initialPlacement(setups.find((s) => s.id === setupId)!)
      return { ...p, [setupId]: { ...existing, [field]: value } }
    })
  }

  const allDone = setups.every((s) => placements[s.id])

  return (
    <div className="my-8">
      <div className="mb-4">
        <h3 className="font-head font-bold text-2xl">Place your trades</h3>
        <p className="text-sm text-text-secondary">For each TAKE setup, set entry, stop, T1, T2. Use the chart and yesterday's reference levels to anchor.</p>
      </div>

      <div className="space-y-5">
        {setups.map((s) => (
          <PlacementCard
            key={s.id}
            day={day}
            setup={s}
            placement={placements[s.id] || initialPlacement(s)}
            onChange={(field, value) => updatePlacement(s.id, field, value)}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-xs text-text-secondary">Defaults are pre-filled to ideal values. Adjust if you'd place differently, then score.</p>
        <button type="button" className="btn-primary disabled:opacity-40" disabled={!allDone} onClick={() => onComplete(placements)}>Score the session →</button>
      </div>
    </div>
  )
}

function initialPlacement(setup: CapstoneSetup): Placement {
  // Neutral, non-ideal defaults — the user must think through proper placement.
  // Entry: midpoint of the location's highlighted zone (visually anchored, not necessarily ideal)
  const entry = Math.round((setup.highlightPriceMin + setup.highlightPriceMax) / 2)
  const dir = setup.direction || 'long'
  // Stop: a generic 4 points on the wrong side of trade — not at structure
  const stop = dir === 'long' ? entry - 4 : entry + 4
  // Targets: generic 5/10 points away — not tied to POC or VA edge
  const t1 = dir === 'long' ? entry + 5 : entry - 5
  const t2 = dir === 'long' ? entry + 10 : entry - 10
  return { entry, stop, t1, t2 }
}

function PlacementCard({ day, setup, placement, onChange }: {
  day: CapstoneDay
  setup: CapstoneSetup
  placement: Placement
  onChange: (field: keyof Placement, value: number) => void
}) {
  const yMin = 28, yMax = 80
  const W = 700, H = 220, padX = 14
  const toPx = (price: number) => 14 + (H - 28) * (1 - (price - yMin) / (yMax - yMin))

  const dir = setup.direction || 'long'

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-card p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h4 className="font-head font-bold text-lg">{setup.name}</h4>
          <p className="text-xs text-text-secondary">{setup.location} · {dir.toUpperCase()}</p>
        </div>
        <div className="text-xs font-mono text-poc-gold">R:R = {computeRR(placement, dir).toFixed(2)}</div>
      </div>

      <div className="rounded-lg overflow-hidden mb-4" style={{ background: palette.bg }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* Reference */}
          <rect x={padX} y={toPx(day.ySession.VAH)} width={W - 2 * padX} height={toPx(day.ySession.VAL) - toPx(day.ySession.VAH)} fill={palette.purple} opacity="0.08" />
          <line x1={padX} y1={toPx(day.ySession.VAH)} x2={W - padX} y2={toPx(day.ySession.VAH)} stroke={palette.purple} strokeDasharray="3 3" />
          <line x1={padX} y1={toPx(day.ySession.VAL)} x2={W - padX} y2={toPx(day.ySession.VAL)} stroke={palette.purple} strokeDasharray="3 3" />
          <line x1={padX} y1={toPx(day.ySession.POC)} x2={W - padX} y2={toPx(day.ySession.POC)} stroke={palette.poc} opacity="0.7" />

          {/* Placement lines */}
          <PlacementLine y={toPx(placement.entry)} color="#3B82F6" label={`Entry ${placement.entry}`} W={W} padX={padX} />
          <PlacementLine y={toPx(placement.stop)} color={palette.bear} label={`Stop ${placement.stop}`} W={W} padX={padX} />
          <PlacementLine y={toPx(placement.t1)} color={palette.hvn} label={`T1 ${placement.t1}`} W={W} padX={padX} />
          <PlacementLine y={toPx(placement.t2)} color={palette.bull} label={`T2 ${placement.t2}`} W={W} padX={padX} />

          {/* Direction arrow */}
          <g transform={`translate(${W - 60}, ${toPx(placement.entry)})`}>
            <text x={0} y={4} fill="#3B82F6" fontFamily="Oxanium, sans-serif" fontSize="11" fontWeight="700">{dir === 'long' ? '↑ LONG' : '↓ SHORT'}</text>
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <NumberInput label="Entry" color="text-accent-blue" value={placement.entry} onChange={(v) => onChange('entry', v)} />
        <NumberInput label="Stop" color="text-bear-red" value={placement.stop} onChange={(v) => onChange('stop', v)} />
        <NumberInput label="T1" color="text-hvn-teal" value={placement.t1} onChange={(v) => onChange('t1', v)} />
        <NumberInput label="T2" color="text-bull-green" value={placement.t2} onChange={(v) => onChange('t2', v)} />
      </div>

      <p className="text-[11px] text-text-muted mt-3 font-mono">
        Hint: yesterday POC <span className="text-poc-gold">{day.ySession.POC}</span> · VAH <span className="text-va-purple">{day.ySession.VAH}</span> · VAL <span className="text-va-purple">{day.ySession.VAL}</span>
      </p>
    </div>
  )
}

function NumberInput({ label, color, value, onChange }: { label: string, color: string, value: number, onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className={`text-[10px] font-mono uppercase tracking-wider ${color}`}>{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => { const n = parseFloat(e.target.value); if (!Number.isNaN(n)) onChange(n) }}
        className="mt-1 w-full px-3 py-2 rounded-md bg-bg-elevated border border-border-subtle font-mono text-sm focus:border-accent-blue focus:outline-none"
      />
    </label>
  )
}

function PlacementLine({ y, color, label, W, padX }: { y: number, color: string, label: string, W: number, padX: number }) {
  return (
    <g>
      <line x1={padX} y1={y} x2={W - padX} y2={y} stroke={color} strokeWidth="1.2" />
      <text x={padX + 4} y={y - 3} fill={color} fontFamily="Space Mono, monospace" fontSize="10" fontWeight="700">{label}</text>
    </g>
  )
}

function computeRR(p: Placement, dir: 'long' | 'short'): number {
  const risk = dir === 'long' ? p.entry - p.stop : p.stop - p.entry
  const reward = dir === 'long' ? p.t1 - p.entry : p.entry - p.t1
  if (risk <= 0) return 0
  return reward / risk
}

export function scorePlacement(setup: CapstoneSetup, placement: Placement): { score: number, max: number, notes: string[] } {
  const notes: string[] = []
  let score = 0
  const max = 4
  const tol = setup.placementTolerance ?? 2
  const dir = setup.direction || 'long'

  // Entry
  if (setup.idealEntry !== undefined) {
    if (Math.abs(placement.entry - setup.idealEntry) <= tol) {
      score += 1; notes.push(`✓ Entry close to ideal (${setup.idealEntry})`)
    } else { notes.push(`✗ Entry off — ideal near ${setup.idealEntry}`) }
  }
  // Stop direction
  if (setup.idealStop !== undefined) {
    const stopOK = dir === 'long' ? placement.stop < placement.entry : placement.stop > placement.entry
    const closeToIdeal = Math.abs(placement.stop - setup.idealStop) <= tol * 1.5
    if (stopOK && closeToIdeal) { score += 1; notes.push(`✓ Stop placed correctly (~${setup.idealStop})`) }
    else if (!stopOK) notes.push(`✗ Stop on wrong side of entry for a ${dir}`)
    else notes.push(`✗ Stop too far from ideal (~${setup.idealStop})`)
  }
  // T1 direction
  if (setup.idealT1 !== undefined) {
    const t1OK = dir === 'long' ? placement.t1 > placement.entry : placement.t1 < placement.entry
    const closeToIdeal = Math.abs(placement.t1 - setup.idealT1) <= tol * 1.5
    if (t1OK && closeToIdeal) { score += 1; notes.push(`✓ T1 at POC/structure (~${setup.idealT1})`) }
    else if (!t1OK) notes.push(`✗ T1 on wrong side for a ${dir}`)
    else notes.push(`✗ T1 off — ideal near ${setup.idealT1}`)
  }
  // T2 direction & beyond T1
  if (setup.idealT2 !== undefined) {
    const t2OK = dir === 'long' ? placement.t2 > placement.t1 : placement.t2 < placement.t1
    const closeToIdeal = Math.abs(placement.t2 - setup.idealT2) <= tol * 2
    if (t2OK && closeToIdeal) { score += 1; notes.push(`✓ T2 at opposite VA edge (~${setup.idealT2})`) }
    else if (!t2OK) notes.push(`✗ T2 should be past T1 in trade direction`)
    else notes.push(`✗ T2 off — ideal near ${setup.idealT2}`)
  }

  return { score, max, notes }
}
