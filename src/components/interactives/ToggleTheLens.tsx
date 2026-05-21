import { useState } from 'react'

const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', accent: '#3B82F6',
}

const W = 720, H = 400
const padX = 16, padY = 20

// 2-minute MES candles — ranging then breakout
const candles = Array.from({ length: 36 }).map((_, i) => {
  const base = 50 + Math.sin(i * 0.4) * 5 + (i > 22 ? (i - 22) * 1.2 : 0)
  const o = base
  const c = base + Math.cos(i * 0.6) * 1.6
  return { o, c, h: Math.max(o, c) + 1, l: Math.min(o, c) - 1, vol: 30 + Math.abs(Math.sin(i * 0.55)) * 70 }
})

const yMin = 28, yMax = 88
const chartAreaH = H - padY * 2 - 50
const toPx = (price: number) => padY + chartAreaH - ((price - yMin) / (yMax - yMin)) * chartAreaH

// EMAs
function ema(values: number[], period: number) {
  const k = 2 / (period + 1)
  const out: number[] = []
  let prev = values[0]
  values.forEach((v, i) => { prev = i === 0 ? v : v * k + prev * (1 - k); out.push(prev) })
  return out
}
const closes = candles.map((c) => c.c)
const ema20 = ema(closes, 20)
const ema50 = ema(closes, 50)

// Trend line — fit through last 14 candles
const trendStartX = padX + 14 * ((W - padX * 2 - 100) / candles.length) + 8
const trendEndX = padX + 35 * ((W - padX * 2 - 100) / candles.length) + 8
const trendStartY = toPx(closes[14])
const trendEndY = toPx(closes[35] - 3)

const profile = (() => {
  const bars: { p: number, w: number }[] = []
  for (let p = yMin; p <= yMax; p += 2) {
    let w = 0
    candles.forEach((c) => {
      if (p >= c.l && p <= c.h) w += 4
    })
    bars.push({ p, w })
  }
  return bars
})()

const TOGGLES = [
  { id: 'ema20', label: '20-EMA', color: palette.bull },
  { id: 'ema50', label: '50-EMA', color: palette.accent },
  { id: 'trend', label: 'Trend line', color: palette.bear },
  { id: 'volume', label: 'Volume bars', color: palette.accent },
  { id: 'profile', label: 'Volume Profile', color: palette.hvn },
] as const

type ToggleId = (typeof TOGGLES)[number]['id']

export default function ToggleTheLens() {
  const [active, setActive] = useState<Record<ToggleId, boolean>>({
    ema20: false, ema50: false, trend: false, volume: false, profile: true,
  })

  const toggle = (id: ToggleId) => setActive((a) => ({ ...a, [id]: !a[id] }))

  const cw = (W - padX * 2 - (active.profile ? 100 : 0)) / candles.length
  const chartLeftX = padX + (active.profile ? 100 : 0)

  const maxVol = Math.max(...candles.map((c) => c.vol))

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-card p-6">
      <div className="mb-4">
        <h4 className="font-head font-semibold text-xl">Interactive · Toggle the Lens</h4>
        <p className="text-xs text-text-secondary mt-1">Notice what Volume Profile shows that the others miss.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TOGGLES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => toggle(t.id)}
            className={`px-3 py-1.5 rounded-md border text-xs font-mono transition-all ${
              active[t.id]
                ? 'border-accent-blue bg-accent-blue/15 text-text-primary'
                : 'border-border-subtle bg-bg-elevated text-text-muted hover:text-text-primary'
            }`}
            aria-pressed={active[t.id]}
          >
            <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ background: t.color }} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border-subtle overflow-hidden" style={{ background: palette.bg }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* Profile (if active) on left */}
          {active.profile && profile.map((b, i) => (
            <rect key={i} x={padX} y={toPx(b.p) - 3} width={Math.min(85, b.w)} height={6} fill={palette.hvn} opacity="0.75" rx="1" />
          ))}

          {/* Candles */}
          {candles.map((c, i) => {
            const cx = chartLeftX + i * cw + cw / 2
            const isBull = c.c >= c.o
            const color = isBull ? palette.bull : palette.bear
            return (
              <g key={i}>
                <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="1" />
                <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(1, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
              </g>
            )
          })}

          {/* EMA 20 */}
          {active.ema20 && (
            <polyline
              fill="none"
              stroke={palette.bull}
              strokeWidth="1.5"
              points={ema20.map((v, i) => `${chartLeftX + i * cw + cw / 2},${toPx(v)}`).join(' ')}
            />
          )}
          {/* EMA 50 */}
          {active.ema50 && (
            <polyline
              fill="none"
              stroke={palette.accent}
              strokeWidth="1.5"
              points={ema50.map((v, i) => `${chartLeftX + i * cw + cw / 2},${toPx(v)}`).join(' ')}
            />
          )}
          {/* Trend line */}
          {active.trend && (
            <line x1={trendStartX + (active.profile ? 92 : 0)} y1={trendStartY} x2={trendEndX + (active.profile ? 92 : 0)} y2={trendEndY} stroke={palette.bear} strokeWidth="1.5" strokeDasharray="4 3" />
          )}

          {/* Volume bars */}
          {active.volume && (
            <g>
              <line x1={chartLeftX} y1={H - 28} x2={W - padX} y2={H - 28} stroke={palette.border} />
              {candles.map((c, i) => {
                const cx = chartLeftX + i * cw + cw / 2
                const h = (c.vol / maxVol) * 30
                return <rect key={i} x={cx - cw * 0.32} y={H - 28 - h + 28} width={cw * 0.64} height={h} fill={palette.accent} opacity="0.65" />
              })}
            </g>
          )}
        </svg>
      </div>

      <p className="text-xs text-text-secondary mt-3 italic">
        Other tools tell you where price went. The profile tells you where money actually traded.
      </p>
    </div>
  )
}
