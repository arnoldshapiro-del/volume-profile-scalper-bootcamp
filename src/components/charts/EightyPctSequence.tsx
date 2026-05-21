const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', poc: '#FFD700', purple: '#A78BFA',
}

const W = 760, H = 460
const padX = 16
const panelH = 100, gapY = 8

// Yesterday's VA: VAH=60, VAL=40, POC=50
const VAH = 60, VAL = 40, POC = 50
const yMin = 30, yMax = 78

interface Phase {
  label: string
  generate: () => { o: number, c: number, h: number, l: number }[]
}

const PHASES: Phase[] = [
  { label: '1. Open above VAH', generate: () => Array.from({ length: 18 }).map((_, i) => {
    const base = 68 + Math.sin(i * 0.8) * 2
    return { o: base, c: base + (i % 2 ? 1 : -1), h: base + 1.5, l: base - 1.5 }
  })},
  { label: '2. Re-entry into VA', generate: () => Array.from({ length: 18 }).map((_, i) => {
    const base = 68 - i * 1.2
    return { o: base, c: base - 0.8, h: base + 0.6, l: base - 1.4 }
  })},
  { label: '3. Acceptance · two 30-min periods inside', generate: () => Array.from({ length: 18 }).map((_, i) => {
    const base = 50 + Math.sin(i * 1.2) * 5
    return { o: base, c: base + (i % 2 ? 1.5 : -1.5), h: base + 2, l: base - 2 }
  })},
  { label: '4. Target traversal · price travels to opposite VA edge', generate: () => Array.from({ length: 18 }).map((_, i) => {
    const base = 55 - i * 1
    return { o: base, c: base - 0.7, h: base + 0.6, l: base - 1.3 }
  })},
]

function Panel({ y, phase, showMarkers }: { y: number, phase: Phase, showMarkers: 'periods' | null }) {
  const candles = phase.generate()
  const padInX = 14
  const candleAreaW = W - 2 * padInX - 120
  const cw = candleAreaW / candles.length
  const toPx = (price: number) => y + 8 + (panelH - 20) * (1 - (price - yMin) / (yMax - yMin))
  return (
    <g>
      <rect x={0} y={y} width={W} height={panelH} fill="#131B2E" rx="8" stroke={palette.border} />
      {/* VA shading */}
      <rect x={padInX} y={toPx(VAH)} width={candleAreaW} height={toPx(VAL) - toPx(VAH)} fill={palette.purple} opacity="0.13" />
      <line x1={padInX} y1={toPx(VAH)} x2={padInX + candleAreaW} y2={toPx(VAH)} stroke={palette.purple} strokeDasharray="3 3" />
      <line x1={padInX} y1={toPx(VAL)} x2={padInX + candleAreaW} y2={toPx(VAL)} stroke={palette.purple} strokeDasharray="3 3" />
      <line x1={padInX} y1={toPx(POC)} x2={padInX + candleAreaW} y2={toPx(POC)} stroke={palette.poc} opacity="0.8" />

      {candles.map((c, i) => {
        const cx = padInX + i * cw + cw / 2
        const isBull = c.c >= c.o
        const color = isBull ? palette.bull : palette.bear
        return (
          <g key={i}>
            <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="0.9" />
            <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(0.8, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
          </g>
        )
      })}

      {showMarkers === 'periods' && (
        <g>
          <rect x={padInX + cw * 6} y={y + 4} width={cw * 6} height={panelH - 8} fill="none" stroke={palette.bull} strokeDasharray="3 3" strokeOpacity="0.8" />
          <rect x={padInX + cw * 12} y={y + 4} width={cw * 6} height={panelH - 8} fill="none" stroke={palette.bull} strokeDasharray="3 3" strokeOpacity="0.8" />
          <text x={padInX + cw * 9} y={y + panelH - 4} fill={palette.bull} fontFamily="Space Mono, monospace" fontSize="9" textAnchor="middle">30-min #1</text>
          <text x={padInX + cw * 15} y={y + panelH - 4} fill={palette.bull} fontFamily="Space Mono, monospace" fontSize="9" textAnchor="middle">30-min #2</text>
        </g>
      )}

      <text x={W - padInX - 4} y={y + 22} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="700" textAnchor="end">{phase.label}</text>
    </g>
  )
}

export default function EightyPctSequence() {
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="Four stacked panels showing the 80% Rule sequence. Panel 1: price opens above VAH. Panel 2: price drops back into the value area. Panel 3: acceptance — two 30-minute periods inside, marked. Panel 4: price travels through POC to the opposite VAL."
      >
        <Panel y={0} phase={PHASES[0]} showMarkers={null} />
        <Panel y={panelH + gapY} phase={PHASES[1]} showMarkers={null} />
        <Panel y={(panelH + gapY) * 2} phase={PHASES[2]} showMarkers="periods" />
        <Panel y={(panelH + gapY) * 3} phase={PHASES[3]} showMarkers={null} />
      </svg>
    </figure>
  )
}
