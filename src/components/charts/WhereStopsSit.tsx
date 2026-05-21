const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', poc: '#FFD700', purple: '#A78BFA',
}

const W = 760, H = 380
const padX = 18, padY = 28
const chartL = padX
const chartR = W - padX - 90
const VAH = 60, VAL = 40, POC = 50
const yMin = 30, yMax = 80
const toPx = (price: number) => padY + (H - 2 * padY) * (1 - (price - yMin) / (yMax - yMin))

const candles = (() => {
  const out: { o: number, c: number, h: number, l: number }[] = []
  // Pre-breakout
  let p = 55
  for (let i = 0; i < 4; i++) { out.push({ o: p, c: p + 0.5, h: p + 0.8, l: p - 0.4 }); p += 0.5 }
  // Strong break above VAH
  for (let i = 0; i < 5; i++) { const o = p; const c = p + 2.4; out.push({ o, c, h: c + 0.3, l: o - 0.3 }); p = c }
  // Stall
  for (let i = 0; i < 5; i++) { out.push({ o: p, c: p + (i % 2 ? -0.3 : 0.2), h: p + 0.6, l: p - 0.6 }) }
  // Bear engulfing at top
  out.push({ o: p, c: p - 4, h: p + 0.5, l: p - 4.5 })
  p -= 4
  // Reversal cascade
  for (let i = 0; i < 14; i++) { const o = p; const c = p - 1.2; out.push({ o, c, h: o + 0.3, l: c - 0.3 }); p = c }
  return out
})()

const STOP_TRIANGLES = [
  { x: 0.42, y: VAH + 1.6 },
  { x: 0.46, y: VAH + 2.4 },
  { x: 0.5, y: VAH + 1.2 },
  { x: 0.54, y: VAH + 2.8 },
  { x: 0.58, y: VAH + 1.8 },
  { x: 0.62, y: VAH + 2.2 },
]

export default function WhereStopsSit() {
  const cw = (chartR - chartL) / candles.length
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="A single failed breakout above VAH visualized in detail. Small red stop-loss triangles cluster just above the VAH where breakout buyers placed their stops. The reversal candle drops back through VAH triggering the cluster in cascade."
      >
        <text x={padX} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">Where the trapped stops sit</text>

        <rect x={chartL} y={toPx(VAH)} width={chartR - chartL} height={toPx(VAL) - toPx(VAH)} fill={palette.purple} opacity="0.12" />
        <line x1={chartL} y1={toPx(VAH)} x2={chartR} y2={toPx(VAH)} stroke={palette.purple} strokeDasharray="3 3" />
        <line x1={chartL} y1={toPx(VAL)} x2={chartR} y2={toPx(VAL)} stroke={palette.purple} strokeDasharray="3 3" />
        <line x1={chartL} y1={toPx(POC)} x2={chartR} y2={toPx(POC)} stroke={palette.poc} opacity="0.8" />

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

        {/* Stop triangles cluster above VAH */}
        {STOP_TRIANGLES.map((s, i) => {
          const x = chartL + s.x * (chartR - chartL)
          const y = toPx(s.y)
          return <polygon key={i} points={`${x},${y - 4} ${x - 4},${y + 3} ${x + 4},${y + 3}`} fill={palette.bear} opacity="0.9" />
        })}

        <text x={chartR + 4} y={toPx(VAH + 2.5)} fill={palette.bear} fontFamily="Space Mono, monospace" fontSize="10" textAnchor="start">↓ trapped stops</text>

        <text x={padX} y={H - 8} fill={palette.text} fontFamily="Space Mono, monospace" fontSize="11" fontStyle="italic">Their exits become your trade's fuel.</text>
      </svg>
    </figure>
  )
}
