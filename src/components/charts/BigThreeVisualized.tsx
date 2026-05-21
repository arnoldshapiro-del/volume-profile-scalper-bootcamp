// Chart 2.1 — The Big Three Visualized
const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', purple: '#A78BFA',
}

const W = 760, H = 480
const padX = 16, padY = 30
const profileLeft = padX
const profileW = 240
const chartLeft = profileLeft + profileW + 20
const chartRight = W - padX - 90

const yMin = 24, yMax = 86
const POC = 54
const VAH = 64
const VAL = 44

const candleAreaH = H - 2 * padY
const toPx = (price: number) => padY + candleAreaH - ((price - yMin) / (yMax - yMin)) * candleAreaH

// Profile bars — 30 buckets
const profile = (() => {
  const bars: { p: number, w: number }[] = []
  const yStep = (yMax - yMin) / 30
  for (let i = 0; i < 30; i++) {
    const p = yMin + i * yStep
    const d = Math.abs(p - POC)
    const w = Math.max(8, 195 * Math.exp(-(d * d) / 75))
    bars.push({ p, w })
  }
  return bars
})()

const candles = Array.from({ length: 30 }).map((_, i) => {
  const base = 54 + Math.sin(i * 0.35) * 11
  const o = base
  const c = base + Math.cos(i * 0.7) * 3
  return { o, c, h: Math.max(o, c) + 1.5, l: Math.min(o, c) - 1.5 }
})

export default function BigThreeVisualized() {
  const cw = (chartRight - chartLeft) / candles.length

  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="The Big Three reference levels visualized. POC shown as the longest bar in gold. Value Area High and Value Area Low marked with dotted purple lines bounding a purple shaded zone where 70% of volume traded."
      >
        <text x={padX} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">Volume Profile</text>
        <text x={chartLeft} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">5-minute candles · POC, VAH, VAL highlighted</text>

        {/* Value area shading */}
        <rect x={profileLeft} y={toPx(VAH)} width={chartRight - profileLeft} height={toPx(VAL) - toPx(VAH)} fill={palette.purple} opacity="0.13" />

        {/* Profile bars */}
        {profile.map((b, i) => {
          const isPoc = Math.abs(b.p - POC) < 1.2
          const inVA = b.p <= VAH && b.p >= VAL
          const color = isPoc ? palette.poc : inVA ? palette.hvn : palette.hvn
          return (
            <rect key={i} x={profileLeft} y={toPx(b.p) - 4} width={b.w} height={8} fill={color} opacity={inVA ? 0.95 : 0.45} rx="1" />
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

        {/* POC line */}
        <line x1={profileLeft} y1={toPx(POC)} x2={chartRight} y2={toPx(POC)} stroke={palette.poc} strokeWidth="1.5" />
        <text x={W - padX - 4} y={toPx(POC) - 4} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="11" fontWeight="700" textAnchor="end">POC</text>

        {/* VAH line */}
        <line x1={profileLeft} y1={toPx(VAH)} x2={chartRight} y2={toPx(VAH)} stroke={palette.purple} strokeWidth="1.2" strokeDasharray="4 3" />
        <text x={W - padX - 4} y={toPx(VAH) - 4} fill={palette.purple} fontFamily="Space Mono, monospace" fontSize="11" fontWeight="700" textAnchor="end">VAH</text>

        {/* VAL line */}
        <line x1={profileLeft} y1={toPx(VAL)} x2={chartRight} y2={toPx(VAL)} stroke={palette.purple} strokeWidth="1.2" strokeDasharray="4 3" />
        <text x={W - padX - 4} y={toPx(VAL) + 14} fill={palette.purple} fontFamily="Space Mono, monospace" fontSize="11" fontWeight="700" textAnchor="end">VAL</text>

        {/* Annotation */}
        <text x={padX} y={H - 12} fill={palette.purple} fontFamily="Space Mono, monospace" fontSize="11">70% of volume traded in this range</text>
      </svg>
    </figure>
  )
}
