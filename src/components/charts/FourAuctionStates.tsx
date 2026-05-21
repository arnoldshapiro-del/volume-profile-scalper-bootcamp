// SVG Chart 0.2 — "The Four Auction States" — 2x2 grid, 360×200 each

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
}

const W = 760, H = 440
const cellW = 360, cellH = 200
const gap = 20

interface Cell {
  label: string
  caption: string
  candles: { o: number; c: number; h: number; l: number }[]
  profile: number[] // bar widths from top to bottom
}

const cells: Cell[] = [
  {
    label: '01 · Balance',
    caption: 'sideways candles + bell profile',
    candles: Array.from({ length: 18 }).map((_, i) => {
      const base = 50 + Math.sin(i * 0.9) * 4 - 2
      const o = base
      const c = base + (i % 2 === 0 ? 2 : -2)
      return { o, c, h: Math.max(o, c) + 2, l: Math.min(o, c) - 2 }
    }),
    // Bell shape
    profile: [10, 14, 20, 30, 45, 60, 78, 90, 95, 90, 78, 60, 45, 30, 20, 14, 10],
  },
  {
    label: '02 · Imbalance',
    caption: 'strong directional + thin profile',
    candles: Array.from({ length: 18 }).map((_, i) => {
      const base = 25 + i * 3
      const o = base
      const c = base + 3 // bull marubozu
      return { o, c, h: c + 0.5, l: o - 0.5 }
    }),
    // Thin elongated profile
    profile: [25, 22, 20, 18, 17, 16, 15, 16, 17, 18, 20, 22, 24, 22, 20, 18, 16],
  },
  {
    label: '03 · Acceptance',
    caption: 'returning + oscillating in HVN',
    candles: Array.from({ length: 18 }).map((_, i) => {
      // First half drifts down to HVN, second half oscillates at it
      const base = i < 9 ? 70 - i * 2 : 52 + Math.sin(i * 1.1) * 3
      const o = base
      const c = base + (i % 2 === 0 ? 1.5 : -1.5)
      return { o, c, h: Math.max(o, c) + 1.2, l: Math.min(o, c) - 1.2 }
    }),
    profile: [12, 14, 18, 24, 30, 38, 50, 70, 85, 95, 85, 70, 50, 38, 30, 24, 18],
  },
  {
    label: '04 · Rejection',
    caption: 'spike into level + sharp reversal',
    candles: Array.from({ length: 18 }).map((_, i) => {
      // Spike up then reversal
      if (i < 8) {
        const base = 35 + i * 4
        return { o: base, c: base + 3, h: base + 4, l: base - 1 }
      } else {
        const base = 67 - (i - 8) * 4
        return { o: base, c: base - 3, h: base + 1, l: base - 4 }
      }
    }),
    profile: [10, 10, 12, 16, 22, 30, 42, 56, 70, 82, 88, 80, 65, 48, 32, 20, 12],
  },
]

function CellSVG({ cell, x, y }: { cell: Cell, x: number, y: number }) {
  const padding = 14
  const titleH = 28
  const candleAreaX = x + padding
  const candleAreaY = y + titleH + 4
  const candleAreaW = 200
  const candleAreaH = cellH - titleH - padding * 2
  const candleW = candleAreaW / cell.candles.length
  const profileX = candleAreaX + candleAreaW + 12
  const profileW = 90

  const yPriceMin = 20, yPriceMax = 95
  const toPx = (price: number) => candleAreaY + candleAreaH - ((price - yPriceMin) / (yPriceMax - yPriceMin)) * candleAreaH

  return (
    <g>
      {/* Cell background */}
      <rect x={x} y={y} width={cellW} height={cellH} fill="#131B2E" stroke={palette.border} rx="8" />
      <text x={x + 14} y={y + 22} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="14" fontWeight="700">
        {cell.label}
      </text>
      <text x={x + 14} y={y + cellH - 8} fill={palette.textMuted} fontFamily="Space Mono, monospace" fontSize="10">
        {cell.caption}
      </text>
      {/* Candles */}
      {cell.candles.map((c, i) => {
        const cx = candleAreaX + i * candleW + candleW / 2
        const isBull = c.c >= c.o
        const color = isBull ? palette.bull : palette.bear
        return (
          <g key={i}>
            <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="1" />
            <rect x={cx - candleW * 0.32} y={toPx(Math.max(c.o, c.c))} width={candleW * 0.64} height={Math.max(1, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
          </g>
        )
      })}
      {/* Profile bars */}
      {cell.profile.map((w, i) => {
        const priceMid = yPriceMin + (cell.profile.length - 1 - i) * ((yPriceMax - yPriceMin) / cell.profile.length) + 2.5
        const ratio = w / 100
        const isPeak = w >= Math.max(...cell.profile)
        return (
          <rect
            key={i}
            x={profileX}
            y={toPx(priceMid) - 4}
            width={Math.max(2, profileW * ratio)}
            height={8}
            fill={isPeak ? palette.poc : palette.hvn}
            opacity={isPeak ? 1 : 0.7}
            rx="1"
          />
        )
      })}
    </g>
  )
}

export default function FourAuctionStates() {
  const positions = [
    { x: 0, y: 0, c: cells[0] },
    { x: cellW + gap, y: 0, c: cells[1] },
    { x: 0, y: cellH + gap, c: cells[2] },
    { x: cellW + gap, y: cellH + gap, c: cells[3] },
  ]
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="The four auction states shown as a 2 by 2 grid. Balance shows sideways candles with a bell-shaped profile. Imbalance shows strong directional candles with a thin profile. Acceptance shows price returning to a previous high-volume node and oscillating. Rejection shows price spiking into a level and reversing sharply."
      >
        {positions.map((p, i) => <CellSVG key={i} cell={p.c} x={p.x} y={p.y} />)}
      </svg>
    </figure>
  )
}
