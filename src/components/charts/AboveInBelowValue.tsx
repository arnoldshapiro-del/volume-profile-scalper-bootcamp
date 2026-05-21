// Chart 2.2 — Above / In / Below Value (3 horizontal panels)
const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', purple: '#A78BFA',
}

const PANEL_W = 760, PANEL_H = 140
const gapY = 12
const FULL_H = PANEL_H * 3 + gapY * 2

const POC = 50, VAH = 60, VAL = 40

function Panel({ y, label, color, candleBaseline, summary }: { y: number, label: string, color: string, candleBaseline: number, summary: string }) {
  const padX = 14, padY = 14
  const yMin = 20, yMax = 80
  const candleAreaW = PANEL_W - padX * 2 - 220
  const candleAreaH = PANEL_H - padY * 2
  const toPx = (price: number) => y + padY + candleAreaH - ((price - yMin) / (yMax - yMin)) * candleAreaH
  const candles = Array.from({ length: 24 }).map((_, i) => {
    const base = candleBaseline + Math.sin(i * 0.6) * 4
    const o = base
    const c = base + Math.cos(i * 0.9) * 1.2
    return { o, c, h: Math.max(o, c) + 1, l: Math.min(o, c) - 1 }
  })
  const cw = candleAreaW / candles.length

  return (
    <g>
      {/* Background panel */}
      <rect x={0} y={y} width={PANEL_W} height={PANEL_H} fill="#131B2E" stroke={palette.border} rx="8" />

      {/* VA shading across entire panel */}
      <rect x={padX} y={toPx(VAH)} width={PANEL_W - padX * 2} height={toPx(VAL) - toPx(VAH)} fill={palette.purple} opacity="0.15" />
      {/* VAH, VAL, POC lines */}
      <line x1={padX} y1={toPx(VAH)} x2={PANEL_W - padX} y2={toPx(VAH)} stroke={palette.purple} strokeDasharray="3 3" />
      <line x1={padX} y1={toPx(VAL)} x2={PANEL_W - padX} y2={toPx(VAL)} stroke={palette.purple} strokeDasharray="3 3" />
      <line x1={padX} y1={toPx(POC)} x2={PANEL_W - padX} y2={toPx(POC)} stroke={palette.poc} />

      {/* Candles */}
      {candles.map((c, i) => {
        const cx = padX + i * cw + cw / 2
        const isBull = c.c >= c.o
        const cc = isBull ? palette.bull : palette.bear
        return (
          <g key={i}>
            <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={cc} strokeWidth="1" />
            <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(1, Math.abs(toPx(c.o) - toPx(c.c)))} fill={cc} />
          </g>
        )
      })}

      {/* Labels */}
      <text x={PANEL_W - padX - 200} y={y + 22} fill={color} fontFamily="Oxanium, sans-serif" fontSize="14" fontWeight="700">{label}</text>
      <text x={PANEL_W - padX - 200} y={y + 40} fill={palette.textMuted} fontFamily="Space Mono, monospace" fontSize="11">{summary}</text>
      <text x={PANEL_W - padX - 200} y={y + 60} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="10">POC</text>
      <text x={PANEL_W - padX - 200} y={y + 75} fill={palette.purple} fontFamily="Space Mono, monospace" fontSize="10">VAH · VAL</text>
    </g>
  )
}

export default function AboveInBelowValue() {
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${PANEL_W} ${FULL_H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="Three stacked panels showing price candles above, inside, and below yesterday's value area, each labeled with its bias: bullish skew, balance, and bearish skew."
      >
        <Panel y={0} label="ABOVE VALUE — Bullish skew" color={palette.bull} candleBaseline={72} summary="market valuing higher than yesterday" />
        <Panel y={PANEL_H + gapY} label="IN VALUE — Balance" color={palette.purple} candleBaseline={50} summary="mean reversion bias — fade extremes" />
        <Panel y={(PANEL_H + gapY) * 2} label="BELOW VALUE — Bearish skew" color={palette.bear} candleBaseline={30} summary="market valuing lower than yesterday" />
      </svg>
    </figure>
  )
}
