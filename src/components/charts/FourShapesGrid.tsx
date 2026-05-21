// Chart 4.1 — The Four Shapes Side by Side
const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', lvn: '#F59E0B',
}

interface CellShape {
  id: string
  title: string
  strategy: string
  // Shape generator returns bar widths array (top->bottom indices 0..21)
  profile: number[]
  candles: { o: number, c: number, h: number, l: number }[]
  pocIdx: number
}

function makeBalancedProfile(): number[] {
  const out: number[] = []
  for (let i = 0; i < 22; i++) {
    const d = Math.abs(i - 10.5)
    out.push(Math.max(8, 95 * Math.exp(-(d * d) / 18)))
  }
  return out
}

function makePShape(): number[] {
  // Heavy bottom, thin tail up
  const out: number[] = []
  for (let i = 0; i < 22; i++) {
    if (i > 12) out.push(Math.max(8, 90 - (i - 12) * 8))
    else out.push(15 + (i / 12) * 8)
  }
  return out
}

function makeBShape(): number[] {
  // Heavy top, thin tail down
  const out: number[] = []
  for (let i = 0; i < 22; i++) {
    if (i < 10) out.push(Math.max(8, 90 - (10 - i) * 8))
    else out.push(15 + ((21 - i) / 12) * 8)
  }
  return out
}

function makeTrendProfile(): number[] {
  // Thin elongated
  const out: number[] = []
  for (let i = 0; i < 22; i++) {
    out.push(20 + Math.sin(i * 0.5) * 8)
  }
  return out
}

function balancedCandles(): { o: number, c: number, h: number, l: number }[] {
  return Array.from({ length: 22 }).map((_, i) => {
    const base = 50 + Math.sin(i * 0.7) * 5
    const o = base
    const c = base + (i % 2 === 0 ? 1.6 : -1.6)
    return { o, c, h: Math.max(o, c) + 1.2, l: Math.min(o, c) - 1.2 }
  })
}

function pShapeCandles(): { o: number, c: number, h: number, l: number }[] {
  return Array.from({ length: 22 }).map((_, i) => {
    if (i < 8) { const base = 30 + i * 1.5; return { o: base, c: base + 1, h: base + 1.5, l: base - 0.5 } }
    if (i < 14) { const base = 42 + (i - 8) * 5; return { o: base, c: base + 4, h: base + 4.5, l: base - 0.5 } }
    // Top tail — slow drift down
    const base = 72 - (i - 14) * 2.5
    return { o: base, c: base - 1.5, h: base + 0.5, l: base - 2 }
  })
}

function bShapeCandles(): { o: number, c: number, h: number, l: number }[] {
  return Array.from({ length: 22 }).map((_, i) => {
    if (i < 8) { const base = 70 - i * 1.5; return { o: base, c: base - 1, h: base + 0.5, l: base - 1.5 } }
    if (i < 14) { const base = 58 - (i - 8) * 5; return { o: base, c: base - 4, h: base + 0.5, l: base - 4.5 } }
    // Bottom tail — slow drift up
    const base = 28 + (i - 14) * 2.5
    return { o: base, c: base + 1.5, h: base + 2, l: base - 0.5 }
  })
}

function trendCandles(): { o: number, c: number, h: number, l: number }[] {
  return Array.from({ length: 22 }).map((_, i) => {
    const base = 25 + i * 2.6
    return { o: base, c: base + 2.2, h: base + 2.8, l: base - 0.4 }
  })
}

const CELLS: CellShape[] = [
  { id: 'D', title: 'D-Shape · Balanced', strategy: 'Mean reversion · fade extremes · target POC', profile: makeBalancedProfile(), candles: balancedCandles(), pocIdx: 10 },
  { id: 'P', title: 'P-Shape · Short Cover', strategy: 'Fade the top of the tail · heavy bottom is real', profile: makePShape(), candles: pShapeCandles(), pocIdx: 16 },
  { id: 'b', title: 'b-Shape · Long Liq.', strategy: 'Fade the bottom of the tail · heavy top is real', profile: makeBShape(), candles: bShapeCandles(), pocIdx: 6 },
  { id: 'Trend', title: 'Trend Day · Directional', strategy: 'NEVER fade · join on pullbacks to developing POC', profile: makeTrendProfile(), candles: trendCandles(), pocIdx: 11 },
]

const W = 760, H = 580
const cellW = 380 - 10, cellH = 280
const gap = 10

function Cell({ x, y, c }: { x: number, y: number, c: CellShape }) {
  const padX = 12, padY = 30
  const profileX = padX
  const profileW = 90
  const candleX = profileX + profileW + 14
  const candleW = cellW - (candleX - 0) - padX
  const yMin = 18, yMax = 92
  const candleAreaH = cellH - padY - 50
  const toPx = (price: number) => y + padY + candleAreaH - ((price - yMin) / (yMax - yMin)) * candleAreaH
  const cw = candleW / c.candles.length
  return (
    <g>
      <rect x={x} y={y} width={cellW} height={cellH} fill="#131B2E" stroke={palette.border} rx="10" />
      <text x={x + 14} y={y + 22} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="15" fontWeight="700">{c.title}</text>
      {/* Profile */}
      {c.profile.map((w, i) => {
        const price = yMin + ((c.profile.length - 1 - i) / (c.profile.length - 1)) * (yMax - yMin)
        const isPoc = i === c.pocIdx
        return (
          <rect key={i} x={x + profileX} y={toPx(price) - 4} width={w} height={8} fill={isPoc ? palette.poc : palette.hvn} opacity={isPoc ? 1 : 0.8} rx="1" />
        )
      })}
      {/* Candles */}
      {c.candles.map((cand, i) => {
        const cx = x + candleX + i * cw + cw / 2
        const isBull = cand.c >= cand.o
        const col = isBull ? palette.bull : palette.bear
        return (
          <g key={i}>
            <line x1={cx} y1={toPx(cand.h)} x2={cx} y2={toPx(cand.l)} stroke={col} strokeWidth="0.9" />
            <rect x={cx - cw * 0.32} y={toPx(Math.max(cand.o, cand.c))} width={cw * 0.64} height={Math.max(0.8, Math.abs(toPx(cand.o) - toPx(cand.c)))} fill={col} />
          </g>
        )
      })}
      {/* Strategy footer */}
      <text x={x + 14} y={y + cellH - 18} fill={palette.textMuted} fontFamily="Space Mono, monospace" fontSize="10.5">
        <tspan fill={palette.poc}>Strategy:</tspan> {c.strategy}
      </text>
    </g>
  )
}

export default function FourShapesGrid() {
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="A 2 by 2 grid showing the four profile shapes: D-shape balanced bell, P-shape short covering with heavy bottom and thin tail up, b-shape long liquidation with heavy top and thin tail down, and trend day with thin elongated profile."
      >
        <Cell x={0} y={0} c={CELLS[0]} />
        <Cell x={cellW + gap} y={0} c={CELLS[1]} />
        <Cell x={0} y={cellH + gap} c={CELLS[2]} />
        <Cell x={cellW + gap} y={cellH + gap} c={CELLS[3]} />
      </svg>
    </figure>
  )
}
