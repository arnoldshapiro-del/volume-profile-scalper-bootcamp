const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', poc: '#FFD700', purple: '#A78BFA',
}

const W = 760, H = 420
const padX = 16
const panelH = 95, gapY = 8
const VAH = 60, VAL = 40, POC = 50
const yMin = 32, yMax = 78

interface Phase { label: string; gen: () => { o: number, c: number, h: number, l: number }[] }

const PHASES: Phase[] = [
  { label: '1. Break above VAH', gen: () => {
    const out: { o: number, c: number, h: number, l: number }[] = []
    let p = 55
    for (let i = 0; i < 6; i++) { out.push({ o: p, c: p + 0.4, h: p + 0.8, l: p - 0.4 }); p += 0.4 }
    // Strong break
    for (let i = 0; i < 6; i++) { const o = p; const c = p + 2.2; out.push({ o, c, h: c + 0.5, l: o - 0.4 }); p = c }
    return out
  }},
  { label: '2. Fail to accept · weak follow-through', gen: () => {
    const out: { o: number, c: number, h: number, l: number }[] = []
    // Stalling above VAH
    let p = 68
    for (let i = 0; i < 14; i++) {
      const o = p
      const c = p + (i % 2 ? -0.4 : 0.3)
      out.push({ o, c, h: Math.max(o, c) + 0.5, l: Math.min(o, c) - 0.5 })
      p = c
    }
    return out
  }},
  { label: '3. Re-entry into VA', gen: () => {
    const out: { o: number, c: number, h: number, l: number }[] = []
    let p = 66
    for (let i = 0; i < 14; i++) { const o = p; const c = p - 1.2; out.push({ o, c, h: o + 0.4, l: c - 0.4 }); p = c }
    return out
  }},
  { label: '4. Strong rejection candle · reversal toward POC', gen: () => {
    const out: { o: number, c: number, h: number, l: number }[] = []
    // engulfing bear at top
    out.push({ o: 56, c: 50, h: 56.5, l: 49 })
    let p = 50
    for (let i = 0; i < 13; i++) { const o = p; const c = p - 1.4; out.push({ o, c, h: o + 0.4, l: c - 0.4 }); p = c }
    return out
  }},
]

function Panel({ y, phase }: { y: number, phase: Phase }) {
  const padIn = 14
  const candleAreaW = W - 2 * padIn - 240
  const candles = phase.gen()
  const cw = candleAreaW / candles.length
  const toPx = (price: number) => y + 8 + (panelH - 20) * (1 - (price - yMin) / (yMax - yMin))
  return (
    <g>
      <rect x={0} y={y} width={W} height={panelH} fill="#131B2E" rx="8" stroke={palette.border} />
      <rect x={padIn} y={toPx(VAH)} width={candleAreaW} height={toPx(VAL) - toPx(VAH)} fill={palette.purple} opacity="0.12" />
      <line x1={padIn} y1={toPx(VAH)} x2={padIn + candleAreaW} y2={toPx(VAH)} stroke={palette.purple} strokeDasharray="3 3" />
      <line x1={padIn} y1={toPx(VAL)} x2={padIn + candleAreaW} y2={toPx(VAL)} stroke={palette.purple} strokeDasharray="3 3" />
      <line x1={padIn} y1={toPx(POC)} x2={padIn + candleAreaW} y2={toPx(POC)} stroke={palette.poc} opacity="0.7" />
      {candles.map((c, i) => {
        const cx = padIn + i * cw + cw / 2
        const isBull = c.c >= c.o
        const color = isBull ? palette.bull : palette.bear
        return (
          <g key={i}>
            <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="0.9" />
            <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(0.8, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
          </g>
        )
      })}
      <text x={W - padIn - 4} y={y + 22} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="700" textAnchor="end">{phase.label}</text>
    </g>
  )
}

export default function FailedBreakoutSequence() {
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="Four stacked panels showing the failed breakout sequence. Panel 1: candles break above VAH with conviction. Panel 2: weak follow-through, candles stall outside VAH. Panel 3: candles drift back into the value area. Panel 4: strong rejection candle confirms reversal toward POC and beyond."
      >
        {PHASES.map((p, i) => <Panel key={i} y={i * (panelH + gapY)} phase={p} />)}
      </svg>
    </figure>
  )
}
