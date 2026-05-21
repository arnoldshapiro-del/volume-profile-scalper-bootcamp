// Chart 1.2 — Anatomy of a Volume Profile (760×480)
const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', lvn: '#F59E0B', accent: '#3B82F6', purple: '#A78BFA',
}

const W = 760, H = 480
const padX = 16, padY = 30
const profileW = 240
const profileLeft = padX
const chartLeft = profileLeft + profileW + 24
const chartRight = W - 100 // leave room for annotations

// Profile bars (28 buckets, 25..85 price range)
const yMin = 22, yMax = 88
const profile = (() => {
  const bars: { p: number, w: number }[] = []
  const yStep = (yMax - yMin) / 28
  for (let i = 0; i < 28; i++) {
    const p = yMin + i * yStep
    // POC at 50 with bell, secondary cluster at 70
    const d1 = Math.abs(p - 50)
    const d2 = Math.abs(p - 70)
    const w = Math.max(8, 165 * Math.exp(-(d1 * d1) / 70) + 60 * Math.exp(-(d2 * d2) / 30))
    bars.push({ p, w })
  }
  return bars
})()

const candleAreaH = H - 2 * padY
const toPx = (price: number) => padY + candleAreaH - ((price - yMin) / (yMax - yMin)) * candleAreaH

const candles = Array.from({ length: 28 }).map((_, i) => {
  const base = 50 + Math.sin(i * 0.55) * 6 + (i > 16 ? (i - 16) * 1.4 : 0)
  const o = base
  const c = base + Math.cos(i * 0.7) * 2
  return { o, c, h: Math.max(o, c) + 1.2, l: Math.min(o, c) - 1.2 }
})

export default function AnatomyOfProfile() {
  const cw = (chartRight - chartLeft) / candles.length
  const pocPrice = 50
  const hvn2Price = 70
  const lvnPrice = 60

  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="Anatomy of a Volume Profile. A volume histogram on the left shows a Point of Control at the longest bar in gold, a high-volume node cluster in teal, and a low-volume node gap in amber. The candlestick chart on the right shows the price action that produced these levels."
      >
        <text x={padX} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">Volume Profile</text>
        <text x={chartLeft} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">5-minute candles</text>

        {/* Grid */}
        {[30, 45, 60, 75].map((p) => (
          <line key={p} x1={profileLeft} y1={toPx(p)} x2={chartRight} y2={toPx(p)} stroke={palette.border} strokeOpacity="0.35" strokeDasharray="2 4" />
        ))}

        {/* Profile bars */}
        {profile.map((b, i) => {
          const isPoc = Math.abs(b.p - pocPrice) < 1.5
          const isHvn = b.w > 90
          const isLvn = b.w < 30
          const color = isPoc ? palette.poc : isHvn ? palette.hvn : isLvn ? palette.lvn : palette.hvn
          return (
            <rect key={i} x={profileLeft} y={toPx(b.p) - 4} width={b.w} height={8} fill={color} opacity={isLvn ? 0.55 : 0.85} rx="1" />
          )
        })}

        {/* Candles */}
        {candles.map((c, i) => {
          const cx = chartLeft + i * cw + cw / 2
          const isBull = c.c >= c.o
          const color = isBull ? palette.bull : palette.bear
          return (
            <g key={i}>
              <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="1" />
              <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(1, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
            </g>
          )
        })}

        {/* POC dotted line */}
        <line x1={profileLeft} y1={toPx(pocPrice)} x2={chartRight} y2={toPx(pocPrice)} stroke={palette.poc} strokeDasharray="3 4" opacity="0.8" />

        {/* Annotation labels and leader lines */}
        {/* POC */}
        <g>
          <line x1={profileLeft + 175} y1={toPx(pocPrice)} x2={W - padX - 8} y2={toPx(pocPrice) - 2} stroke={palette.poc} strokeWidth="0.8" />
          <text x={W - padX} y={toPx(pocPrice) - 4} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="11" fontWeight="700" textAnchor="end">POC — most volume</text>
        </g>
        {/* HVN cluster (second peak) */}
        <g>
          <line x1={profileLeft + 80} y1={toPx(hvn2Price)} x2={W - padX - 8} y2={toPx(hvn2Price - 8)} stroke={palette.hvn} strokeWidth="0.8" />
          <text x={W - padX} y={toPx(hvn2Price - 8)} fill={palette.hvn} fontFamily="Space Mono, monospace" fontSize="11" textAnchor="end">HVN — agreement zone</text>
        </g>
        {/* LVN */}
        <g>
          <line x1={profileLeft + 25} y1={toPx(lvnPrice)} x2={W - padX - 8} y2={toPx(lvnPrice + 4)} stroke={palette.lvn} strokeWidth="0.8" />
          <text x={W - padX} y={toPx(lvnPrice + 4) + 12} fill={palette.lvn} fontFamily="Space Mono, monospace" fontSize="11" textAnchor="end">LVN — rejection zone</text>
        </g>
        {/* Profile outline */}
        <g>
          <text x={padX} y={H - 8} fill={palette.purple} fontFamily="Space Mono, monospace" fontSize="11">Today's auction signature</text>
        </g>
      </svg>
    </figure>
  )
}
