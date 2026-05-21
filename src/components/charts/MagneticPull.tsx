const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', poc: '#FFD700',
}

const W = 760, H = 400
const padX = 18, padY = 26
const chartL = padX
const chartR = W - padX - 80
const yMin = 30, yMax = 80
const toPx = (price: number) => padY + (H - 2 * padY) * (1 - (price - yMin) / (yMax - yMin))

const NAKED_POC = 70

const candles = (() => {
  const out: { o: number, c: number, h: number, l: number }[] = []
  // 20 candles drifting up through balance from 45 to 60
  let p = 45
  for (let i = 0; i < 20; i++) {
    const o = p
    const c = p + 0.7 + Math.sin(i * 0.6) * 0.5
    out.push({ o, c, h: Math.max(o, c) + 0.6, l: Math.min(o, c) - 0.6 })
    p = c
  }
  // 6 strong bull candles accelerating to 70
  let p2 = 60
  for (let i = 0; i < 6; i++) {
    const o = p2
    const c = p2 + 1.8
    out.push({ o, c, h: c + 0.4, l: o - 0.4 })
    p2 = c
  }
  // Touch + 4 reversal candles
  out.push({ o: 70.5, c: 69.5, h: 71, l: 69 })
  for (let i = 0; i < 8; i++) {
    const o = 69.5 - i * 0.9
    const c = o - 1.2
    out.push({ o, c, h: o + 0.4, l: c - 0.4 })
  }
  return out
})()

export default function MagneticPull() {
  const cw = (chartR - chartL) / candles.length
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="A naked POC line shown as gold dotted across the top of the chart. Candles drift up through balance, accelerate to touch the naked POC, then mean-revert back down."
      >
        <text x={padX} y={18} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">The Magnetic Pull</text>
        {/* Naked POC line */}
        <line x1={chartL} y1={toPx(NAKED_POC)} x2={chartR} y2={toPx(NAKED_POC)} stroke={palette.poc} strokeDasharray="4 4" strokeWidth="1.4" />
        <text x={W - padX} y={toPx(NAKED_POC) - 4} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="11" fontWeight="700" textAnchor="end">naked POC</text>

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

        {/* Magnet arrow */}
        <g>
          <path d={`M ${chartL + 16 * cw} ${toPx(58)} Q ${chartL + 21 * cw} ${toPx(68)} ${chartL + 25 * cw} ${toPx(70)}`} stroke={palette.poc} strokeDasharray="2 3" fill="none" />
          <polygon points={`${chartL + 25 * cw},${toPx(70)} ${chartL + 23 * cw},${toPx(70) + 4} ${chartL + 23 * cw},${toPx(70) - 4}`} fill={palette.poc} />
        </g>
        <text x={padX} y={H - 10} fill={palette.text} fontFamily="Space Mono, monospace" fontSize="11" fontStyle="italic">Magnet completes the touch — then mean-reverts.</text>
      </svg>
    </figure>
  )
}
