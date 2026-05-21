const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', poc: '#FFD700', accent: '#3B82F6',
}

interface Open {
  id: string
  title: string
  stars: number
  desc: string
  candles: { o: number, c: number, h: number, l: number }[]
}

function driveCandles(): { o: number, c: number, h: number, l: number }[] {
  return Array.from({ length: 14 }).map((_, i) => {
    const base = 25 + i * 4
    return { o: base, c: base + 3.4, h: base + 4, l: base - 0.4 }
  })
}
function testDriveCandles(): { o: number, c: number, h: number, l: number }[] {
  const out: { o: number, c: number, h: number, l: number }[] = []
  // 3 brief down probes
  let p = 50
  for (let i = 0; i < 3; i++) {
    out.push({ o: p, c: p - 2, h: p + 0.4, l: p - 2.4 })
    p -= 2
  }
  // Strong upward drive
  for (let i = 0; i < 11; i++) {
    const base = p + i * 3.8
    out.push({ o: base, c: base + 3, h: base + 3.5, l: base - 0.5 })
  }
  return out
}
function rejectionCandles(): { o: number, c: number, h: number, l: number }[] {
  const out: { o: number, c: number, h: number, l: number }[] = []
  // Initial up move
  let p = 38
  for (let i = 0; i < 5; i++) {
    out.push({ o: p, c: p + 3, h: p + 3.5, l: p - 0.5 })
    p += 3
  }
  // Sharp reversal candle
  out.push({ o: p, c: p - 6, h: p + 1, l: p - 6.5 })
  p -= 6
  // Follow through down
  for (let i = 0; i < 8; i++) {
    out.push({ o: p, c: p - 2.5, h: p + 0.4, l: p - 3 })
    p -= 2.5
  }
  return out
}
function auctionCandles(): { o: number, c: number, h: number, l: number }[] {
  return Array.from({ length: 14 }).map((_, i) => {
    const base = 50 + Math.sin(i * 1.2) * 4
    const o = base
    const c = base + (i % 2 ? 1.6 : -1.6)
    return { o, c, h: Math.max(o, c) + 1, l: Math.min(o, c) - 1 }
  })
}

const OPENS: Open[] = [
  { id: 'drive', title: 'Open Drive', stars: 4, desc: 'Strong directional move from bell. Join immediately.', candles: driveCandles() },
  { id: 'test', title: 'Open Test Drive', stars: 3, desc: 'Brief opposite test, then strong drive.', candles: testDriveCandles() },
  { id: 'rejection', title: 'Open Rejection Reverse', stars: 2, desc: 'Initial move, sharp rejection, follow reversal.', candles: rejectionCandles() },
  { id: 'auction', title: 'Open Auction', stars: 1, desc: 'Sideways chop. Stay small or stand aside.', candles: auctionCandles() },
]

const W = 760, H = 580
const cellW = 374, cellH = 280
const gap = 12

function Cell({ x, y, o }: { x: number, y: number, o: Open }) {
  const padX = 14, padY = 30
  const yMin = 18, yMax = 90
  const candleAreaH = cellH - padY - 70
  const toPx = (price: number) => y + padY + candleAreaH - ((price - yMin) / (yMax - yMin)) * candleAreaH
  const cw = (cellW - 2 * padX) / o.candles.length

  return (
    <g>
      <rect x={x} y={y} width={cellW} height={cellH} fill="#131B2E" stroke={palette.border} rx="10" />
      <text x={x + padX} y={y + 22} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="14" fontWeight="700">{o.title}</text>
      <text x={x + cellW - padX} y={y + 22} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="13" textAnchor="end">{'★'.repeat(o.stars) + '☆'.repeat(4 - o.stars)}</text>

      {/* 9:30 line */}
      <line x1={x + padX} y1={y + padY} x2={x + padX} y2={y + padY + candleAreaH} stroke={palette.poc} strokeDasharray="2 3" opacity="0.6" />
      <text x={x + padX + 4} y={y + padY + 12} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="9">9:30</text>

      {o.candles.map((c, i) => {
        const cx = x + padX + i * cw + cw / 2
        const isBull = c.c >= c.o
        const color = isBull ? palette.bull : palette.bear
        return (
          <g key={i}>
            <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="1" />
            <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(1, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
          </g>
        )
      })}
      <text x={x + padX} y={y + cellH - 18} fill={palette.textMuted} fontFamily="Space Mono, monospace" fontSize="11">{o.desc}</text>
    </g>
  )
}

export default function FourOpenTypes() {
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="A 2 by 2 grid showing the four open types: Open Drive with strong directional candles, Open Test Drive with a brief opposite test then strong drive, Open Rejection Reverse with an initial move then sharp reversal, and Open Auction with sideways chop."
      >
        <Cell x={0} y={0} o={OPENS[0]} />
        <Cell x={cellW + gap} y={0} o={OPENS[1]} />
        <Cell x={0} y={cellH + gap} o={OPENS[2]} />
        <Cell x={cellW + gap} y={cellH + gap} o={OPENS[3]} />
      </svg>
    </figure>
  )
}
