// SVG Chart 0.1 — "The Auction in One Picture"
// Canvas 760×440, left half = 5-min candles, right half = profile histogram

const palette = {
  bg: '#0A0E1A',
  border: '#2A3654',
  text: '#E8ECF4',
  textMuted: '#8B95B0',
  bull: '#10B981',
  bear: '#EF4444',
  hvn: '#14B8A6',
  poc: '#FFD700',
  lvn: '#F59E0B',
  accent: '#3B82F6',
}

// 40 candles: a ranging consolidation, then a breakout
// We work in price-space normalized 0..100 (display only)
const candles = (() => {
  const out: Array<{ o: number, h: number, l: number, c: number }> = []
  // First 24 candles: range between 38 and 52, building the HVN
  let price = 45
  for (let i = 0; i < 24; i++) {
    const range = 4 + Math.sin(i * 0.7) * 2
    const o = price
    const c = 42 + ((i * 1.7) % 8)
    const h = Math.max(o, c) + 1 + Math.abs(Math.cos(i)) * 1.5
    const l = Math.min(o, c) - 1 - Math.abs(Math.sin(i)) * 1.5
    out.push({ o, h, l, c })
    price = c
    if (Math.abs(price - 45) > range) price = 45 + (Math.random() - 0.5) * 3
  }
  // Next 16 candles: breakout up to 75
  let p = 47
  for (let i = 0; i < 16; i++) {
    const o = p
    const c = p + 1.8 + Math.sin(i * 0.4)
    const h = c + 0.8
    const l = o - 0.6
    out.push({ o, h, l, c })
    p = c
  }
  return out
})()

// Profile bars: 18 horizontal bars on the right half
// Heavy cluster around 42-50 (HVN), thin above
const profileBars = (() => {
  const bars: Array<{ y: number, w: number }> = []
  // 18 buckets from price 30 (top of y) to 90
  for (let i = 0; i < 22; i++) {
    const priceLevel = 30 + i * 3
    // Bell shape around 46
    const dist = Math.abs(priceLevel - 46)
    let w = Math.max(8, 130 * Math.exp(-(dist * dist) / 60))
    // Add a secondary mini-cluster at 70 (breakout consolidation)
    if (priceLevel >= 65 && priceLevel <= 78) w = Math.max(w, 40)
    bars.push({ y: priceLevel, w })
  }
  return bars
})()

// Coordinate helpers (y inverts price 0=bottom)
const W = 760, H = 440
const padX = 36, padY = 28
const chartLeft = padX, chartRight = 410
const chartW = chartRight - chartLeft
const profileLeft = 460, profileRight = W - padX
const profileBarMax = 150
const yMin = 25, yMax = 95
const yToPx = (price: number) => H - padY - ((price - yMin) / (yMax - yMin)) * (H - 2 * padY)

export default function AuctionInOnePicture() {
  const candleW = (chartW - 10) / candles.length

  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="The same market data shown as a 5-minute candlestick chart on the left and a volume profile histogram on the right. A high-volume node cluster on the profile corresponds to a consolidation zone on the candlestick chart."
      >
        {/* Title bar */}
        <text x={padX} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">5-min candles</text>
        <text x={profileLeft} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">Volume profile</text>

        {/* Grid lines */}
        {[35, 45, 55, 65, 75, 85].map((p) => (
          <line key={p} x1={chartLeft} y1={yToPx(p)} x2={profileRight} y2={yToPx(p)} stroke={palette.border} strokeOpacity="0.35" strokeDasharray="2 4" />
        ))}

        {/* Candles */}
        {candles.map((c, i) => {
          const x = chartLeft + i * candleW + candleW / 2
          const isBull = c.c >= c.o
          const color = isBull ? palette.bull : palette.bear
          return (
            <g key={i}>
              <line x1={x} y1={yToPx(c.h)} x2={x} y2={yToPx(c.l)} stroke={color} strokeWidth="1" />
              <rect
                x={x - candleW * 0.35}
                y={yToPx(Math.max(c.o, c.c))}
                width={candleW * 0.7}
                height={Math.max(1, Math.abs(yToPx(c.o) - yToPx(c.c)))}
                fill={color}
              />
            </g>
          )
        })}

        {/* Consolidation zone highlight on candle chart */}
        <ellipse
          cx={chartLeft + (candleW * 12)}
          cy={yToPx(46)}
          rx={candleW * 12}
          ry={36}
          fill="none"
          stroke={palette.hvn}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.7"
        />
        <text x={chartLeft + 6} y={yToPx(46) + 60} fill={palette.hvn} fontFamily="Space Mono, monospace" fontSize="11">consolidation zone</text>

        {/* Profile histogram bars */}
        {profileBars.map((b, i) => {
          const isPOC = Math.abs(b.y - 46) < 1.6
          const isHVN = b.w > 70
          const color = isPOC ? palette.poc : isHVN ? palette.hvn : palette.lvn
          return (
            <rect
              key={i}
              x={profileLeft}
              y={yToPx(b.y) - 6}
              width={b.w}
              height={12}
              fill={color}
              opacity={isPOC || isHVN ? 0.95 : 0.6}
              rx="2"
            />
          )
        })}

        {/* POC dotted line extension into chart area */}
        <line
          x1={chartLeft}
          y1={yToPx(46)}
          x2={profileLeft - 6}
          y2={yToPx(46)}
          stroke={palette.poc}
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.8"
        />
        <text x={profileLeft + profileBarMax + 6} y={yToPx(46) + 4} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="11" fontWeight="700">POC</text>

        {/* Connecting annotation arrow + label between panels */}
        <g transform={`translate(${(chartRight + profileLeft) / 2 - 60}, 220)`}>
          <line x1={-10} y1={0} x2={70} y2={0} stroke={palette.accent} strokeWidth="1.5" />
          <polygon points="70,-4 78,0 70,4" fill={palette.accent} />
          <text x={-12} y={-8} fill={palette.text} fontFamily="Space Mono, monospace" fontSize="11">Same market.</text>
          <text x={-12} y={16} fill={palette.textMuted} fontFamily="Space Mono, monospace" fontSize="11">Different lens.</text>
        </g>

        {/* HVN label on profile */}
        <text x={profileLeft + profileBarMax + 6} y={yToPx(40) + 4} fill={palette.hvn} fontFamily="Space Mono, monospace" fontSize="11">HVN</text>
        <text x={profileLeft + profileBarMax + 6} y={yToPx(86) + 4} fill={palette.lvn} fontFamily="Space Mono, monospace" fontSize="11">LVN</text>

        {/* Price axis labels */}
        {[35, 50, 65, 80].map((p) => (
          <text key={p} x={W - 18} y={yToPx(p) + 4} fill={palette.textMuted} fontFamily="Space Mono, monospace" fontSize="9" textAnchor="end" opacity="0.7">
            {(5800 + p * 0.5).toFixed(2)}
          </text>
        ))}
      </svg>
    </figure>
  )
}
