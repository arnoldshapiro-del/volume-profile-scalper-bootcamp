const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', lvn: '#F59E0B', purple: '#A78BFA',
}

const W = 760, H = 460
const padX = 18, padY = 30
const chartL = padX + 6
const chartR = W - padX - 200

const yMin = 28, yMax = 80
const toPx = (price: number) => padY + (H - 2 * padY) * (1 - (price - yMin) / (yMax - yMin))

const VAH = 60, VAL = 44, POC = 52
const NAKED_POC1 = 68
const NAKED_POC2 = 38

const candles = (() => {
  const out: { o: number, c: number, h: number, l: number }[] = []
  // Drift sideways above value (today's pre-market)
  let p = 64
  for (let i = 0; i < 24; i++) {
    const base = 63 + Math.sin(i * 0.6) * 1.5
    const o = p
    const c = base
    out.push({ o, c, h: Math.max(o, c) + 0.5, l: Math.min(o, c) - 0.5 })
    p = c
  }
  return out
})()
const currentPrice = candles[candles.length - 1].c

export default function PreMarketMap() {
  const cw = (chartR - chartL) / candles.length
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="A pre-market MES chart with all reference lines marked: yesterday's POC in gold, VAH and VAL in purple, two naked POCs from prior sessions, HVN clusters in teal, LVN voids in amber, and a current price line. The bias label reads ABOVE yesterday's value, bullish skew."
      >
        <text x={padX} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">Pre-market map · 5 minutes to read all of this</text>

        {/* Value area shading */}
        <rect x={chartL} y={toPx(VAH)} width={chartR - chartL} height={toPx(VAL) - toPx(VAH)} fill={palette.purple} opacity="0.12" />

        {/* HVN zones */}
        <rect x={chartL} y={toPx(58)} width={chartR - chartL} height={toPx(48) - toPx(58)} fill={palette.hvn} opacity="0.1" />

        {/* LVN voids */}
        <rect x={chartL} y={toPx(76)} width={chartR - chartL} height={toPx(70) - toPx(76)} fill={palette.lvn} opacity="0.1" />
        <rect x={chartL} y={toPx(36)} width={chartR - chartL} height={toPx(30) - toPx(36)} fill={palette.lvn} opacity="0.1" />

        {/* Reference lines */}
        <line x1={chartL} y1={toPx(VAH)} x2={chartR} y2={toPx(VAH)} stroke={palette.purple} strokeDasharray="3 3" />
        <line x1={chartL} y1={toPx(VAL)} x2={chartR} y2={toPx(VAL)} stroke={palette.purple} strokeDasharray="3 3" />
        <line x1={chartL} y1={toPx(POC)} x2={chartR} y2={toPx(POC)} stroke={palette.poc} strokeWidth="1.5" />
        <line x1={chartL} y1={toPx(NAKED_POC1)} x2={chartR} y2={toPx(NAKED_POC1)} stroke={palette.poc} strokeDasharray="4 4" opacity="0.6" />
        <line x1={chartL} y1={toPx(NAKED_POC2)} x2={chartR} y2={toPx(NAKED_POC2)} stroke={palette.poc} strokeDasharray="4 4" opacity="0.6" />

        {/* Current price */}
        <line x1={chartL} y1={toPx(currentPrice)} x2={chartR} y2={toPx(currentPrice)} stroke="#FFFFFF" strokeWidth="0.8" opacity="0.7" />

        {/* Candles */}
        {candles.map((c, i) => {
          const cx = chartL + i * cw + cw / 2
          const isBull = c.c >= c.o
          const color = isBull ? palette.bull : palette.bear
          return (
            <g key={i}>
              <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="0.9" />
              <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(0.8, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
            </g>
          )
        })}

        {/* Right side labels */}
        <text x={chartR + 8} y={toPx(NAKED_POC1) + 4} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="11" fontWeight="700">naked POC ↑</text>
        <text x={chartR + 8} y={toPx(VAH) - 2} fill={palette.purple} fontFamily="Space Mono, monospace" fontSize="11">VAH</text>
        <text x={chartR + 8} y={toPx(POC) + 4} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="11" fontWeight="700">yesterday POC</text>
        <text x={chartR + 8} y={toPx(VAL) + 12} fill={palette.purple} fontFamily="Space Mono, monospace" fontSize="11">VAL</text>
        <text x={chartR + 8} y={toPx(NAKED_POC2) + 4} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="11" fontWeight="700">naked POC ↓</text>
        <text x={chartR + 8} y={toPx(currentPrice) - 4} fill="#FFFFFF" fontFamily="Space Mono, monospace" fontSize="10">price</text>

        {/* Bias annotation */}
        <rect x={padX} y={H - 32} width={W - padX * 2} height={22} fill={palette.bull} fillOpacity="0.15" stroke={palette.bull} strokeOpacity="0.5" rx="6" />
        <text x={W / 2} y={H - 17} fill={palette.bull} fontFamily="Oxanium, sans-serif" fontSize="12" fontWeight="700" textAnchor="middle">Currently ABOVE yesterday's value — bullish skew</text>
      </svg>
    </figure>
  )
}
