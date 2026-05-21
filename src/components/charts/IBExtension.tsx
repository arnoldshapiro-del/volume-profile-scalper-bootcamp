const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', poc: '#FFD700', purple: '#A78BFA', accent: '#3B82F6',
}

const W = 760, H = 420
const padX = 18, padY = 30
const chartL = padX + 28
const chartR = W - padX - 8
const yMin = 24, yMax = 80
const toPx = (price: number) => padY + (H - 2 * padY) * (1 - (price - yMin) / (yMax - yMin))

// 30 candles: first 12 form IB, then break above
const candles = (() => {
  const out: { o: number, c: number, h: number, l: number }[] = []
  // IB 9:30-10:30: oscillating 45-58
  let p = 50
  for (let i = 0; i < 12; i++) {
    const o = p
    const c = 48 + Math.sin(i * 0.85) * 6
    out.push({ o, c, h: Math.max(o, c) + 1.2, l: Math.min(o, c) - 1.2 })
    p = c
  }
  // 2 base candles
  out.push({ o: 52, c: 56, h: 56.5, l: 51.5 })
  out.push({ o: 56, c: 60, h: 60.5, l: 55.5 })
  // Pullback to broken IB high
  out.push({ o: 60, c: 58.5, h: 60.5, l: 58 })
  // Strong continuation
  let p2 = 58.5
  for (let i = 0; i < 15; i++) {
    const o = p2
    const c = p2 + 1.4
    out.push({ o, c, h: c + 0.4, l: o - 0.4 })
    p2 = c
  }
  return out
})()

const IB_HIGH = 58
const IB_LOW = 42

export default function IBExtension() {
  const cw = (chartR - chartL) / candles.length
  // 10:30 line is after candle 12
  const tenThirtyX = chartL + 12 * cw

  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="The Initial Balance extension setup. Candles from 9:30 to 10:30 establish the IB high and low. After 10:30, price breaks above the IB high with strong candles. A pullback to the broken IB high acts as the entry trigger."
      >
        <text x={padX} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">IB Extension · break of IB high after 10:30</text>

        {/* IB shaded zone */}
        <rect x={chartL} y={toPx(IB_HIGH)} width={tenThirtyX - chartL} height={toPx(IB_LOW) - toPx(IB_HIGH)} fill={palette.purple} opacity="0.1" />

        {/* IB high & low lines extended */}
        <line x1={chartL} y1={toPx(IB_HIGH)} x2={chartR} y2={toPx(IB_HIGH)} stroke={palette.purple} strokeDasharray="3 3" />
        <line x1={chartL} y1={toPx(IB_LOW)} x2={chartR} y2={toPx(IB_LOW)} stroke={palette.purple} strokeDasharray="3 3" />
        <text x={chartR + 4} y={toPx(IB_HIGH) - 2} fill={palette.purple} fontFamily="Space Mono, monospace" fontSize="10" textAnchor="end">IB high</text>
        <text x={chartR + 4} y={toPx(IB_LOW) + 12} fill={palette.purple} fontFamily="Space Mono, monospace" fontSize="10" textAnchor="end">IB low</text>

        {/* 10:30 marker */}
        <line x1={tenThirtyX} y1={padY} x2={tenThirtyX} y2={H - padY} stroke={palette.poc} strokeDasharray="2 3" opacity="0.7" />
        <text x={tenThirtyX + 4} y={padY + 12} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="10">10:30 ET</text>

        {/* Candles */}
        {candles.map((c, i) => {
          const cx = chartL + i * cw + cw / 2
          const isBull = c.c >= c.o
          const color = isBull ? palette.bull : palette.bear
          return (
            <g key={i}>
              <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="1" />
              <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(1, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
            </g>
          )
        })}

        {/* Annotation arrow at pullback */}
        <g>
          <text x={chartL + 18 * cw} y={toPx(72)} fill={palette.bull} fontFamily="Space Mono, monospace" fontSize="11" textAnchor="middle">↑ pullback = entry</text>
        </g>

        <text x={padX} y={H - 10} fill={palette.text} fontFamily="Space Mono, monospace" fontSize="11" fontStyle="italic">
          IB high breach after 10:30 = directional conviction
        </text>
      </svg>
    </figure>
  )
}
