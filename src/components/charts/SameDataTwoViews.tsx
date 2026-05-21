// Chart 1.1 — Same Data, Two Views
const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', accent: '#3B82F6',
}

const candles = Array.from({ length: 22 }).map((_, i) => {
  const base = 50 + Math.sin(i * 0.6) * 8 + (i > 14 ? (i - 14) * 1.5 : 0)
  const o = base
  const c = base + (Math.cos(i * 0.9) * 2)
  return { o, c, h: Math.max(o, c) + 1.5, l: Math.min(o, c) - 1.5, vol: 40 + Math.abs(Math.sin(i * 0.7)) * 60 }
})

const W = 760, H = 400, gap = 14
const panelW = (W - gap) / 2
const padX = 12, padY = 18, axisH = 60

function PanelCandles({ x }: { x: number }) {
  const cw = (panelW - padX * 2) / candles.length
  const yMin = 25, yMax = 80
  const candleAreaH = H - axisH - padY * 2
  const toPx = (price: number) => padY + candleAreaH - ((price - yMin) / (yMax - yMin)) * candleAreaH
  const maxVol = Math.max(...candles.map((c) => c.vol))
  return (
    <g transform={`translate(${x}, 0)`}>
      <text x={padX} y={14} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="12" fontWeight="600">Standard candles + volume bars</text>
      {/* Candles */}
      {candles.map((c, i) => {
        const cx = padX + i * cw + cw / 2
        const isBull = c.c >= c.o
        const color = isBull ? palette.bull : palette.bear
        return (
          <g key={i}>
            <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="1" />
            <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(1, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
          </g>
        )
      })}
      {/* Volume bars at bottom */}
      <line x1={padX} y1={H - axisH + 4} x2={panelW - padX} y2={H - axisH + 4} stroke={palette.border} />
      {candles.map((c, i) => {
        const cx = padX + i * cw + cw / 2
        const h = (c.vol / maxVol) * (axisH - 14)
        return <rect key={i} x={cx - cw * 0.32} y={H - h - 4} width={cw * 0.64} height={h} fill={palette.accent} opacity="0.85" />
      })}
      <text x={padX} y={H - 4} fill={palette.accent} fontFamily="Space Mono, monospace" fontSize="10">vol per TIME</text>
    </g>
  )
}

function PanelProfile({ x }: { x: number }) {
  const cw = (panelW - padX * 2 - 80) / candles.length
  const yMin = 25, yMax = 80
  const candleAreaH = H - axisH - padY * 2
  const toPx = (price: number) => padY + candleAreaH - ((price - yMin) / (yMax - yMin)) * candleAreaH
  // Profile bars derived from candles
  const profile: { p: number, w: number }[] = []
  for (let p = yMin; p <= yMax; p += 3) {
    let w = 0
    candles.forEach((c) => {
      if (p >= c.l && p <= c.h) w += 6
    })
    profile.push({ p, w })
  }
  return (
    <g transform={`translate(${x}, 0)`}>
      <text x={padX} y={14} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="12" fontWeight="600">Same data, profile view</text>
      {/* Profile histogram on left of panel */}
      {profile.map((b, i) => {
        const isPoc = b.w >= Math.max(...profile.map((x) => x.w))
        return (
          <rect key={i} x={padX} y={toPx(b.p) - 5} width={b.w} height={10} fill={isPoc ? palette.poc : palette.hvn} opacity={isPoc ? 1 : 0.75} rx="1" />
        )
      })}
      {/* Candles compressed to right */}
      {candles.map((c, i) => {
        const cx = padX + 80 + i * cw + cw / 2
        const isBull = c.c >= c.o
        const color = isBull ? palette.bull : palette.bear
        return (
          <g key={i}>
            <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="1" />
            <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(1, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
          </g>
        )
      })}
      <text x={padX} y={H - 4} fill={palette.hvn} fontFamily="Space Mono, monospace" fontSize="10">vol per PRICE</text>
    </g>
  )
}

export default function SameDataTwoViews() {
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H + 30}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="Two side-by-side panels showing the same MES price data. The left panel uses standard candlesticks with time-based volume bars below. The right panel rotates the volume into a horizontal histogram showing volume per price level."
      >
        <PanelCandles x={0} />
        <line x1={panelW} y1={padY + 20} x2={panelW} y2={H - axisH - 4} stroke={palette.border} strokeDasharray="2 4" />
        <PanelProfile x={panelW + gap} />
        {/* Bridge label */}
        <g transform={`translate(${W / 2 - 90}, ${H + 12})`}>
          <text x={0} y={10} fill={palette.text} fontFamily="Space Mono, monospace" fontSize="12">Volume per TIME ⇄ Volume per PRICE</text>
        </g>
      </svg>
    </figure>
  )
}
