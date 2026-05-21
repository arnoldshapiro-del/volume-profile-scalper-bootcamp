// Chart 4.2 — The Tail Is the Trade (P-Shape with tail highlighted)
const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', lvn: '#F59E0B',
}

const W = 760, H = 420
const padX = 18, padY = 30
const profileLeft = padX
const profileW = 180
const chartLeft = profileLeft + profileW + 24
const chartRight = W - padX - 90

const yMin = 22, yMax = 86
const toPx = (price: number) => padY + (H - 2 * padY) * (1 - (price - yMin) / (yMax - yMin))

// P-shape profile: heavy bottom, tail up
const profile = (() => {
  const bars: { p: number, w: number, isTail: boolean, isPoc: boolean }[] = []
  for (let i = 0; i < 26; i++) {
    const p = yMin + (i / 25) * (yMax - yMin)
    let w = 14
    if (p < 50) { w = Math.max(14, 150 - (50 - p) * 4) }
    else if (p < 62) { w = 110 - (p - 50) * 4 }
    else { w = 22 - (p - 62) }
    bars.push({ p, w: Math.max(8, w), isTail: p > 62, isPoc: Math.abs(p - 44) < 1 })
  }
  return bars
})()

const candles = (() => {
  const out: { o: number, c: number, h: number, l: number }[] = []
  // First — rally up to 80
  let p = 32
  for (let i = 0; i < 16; i++) {
    const o = p
    const c = p + 3
    out.push({ o, c, h: c + 0.5, l: o - 0.5 })
    p = c
  }
  // Stall + reversal at tail top
  for (let i = 0; i < 4; i++) {
    out.push({ o: 80, c: 78, h: 81, l: 76 })
  }
  // Drop back to heavy node
  let p2 = 78
  for (let i = 0; i < 18; i++) {
    const o = p2
    const c = p2 - 2.2
    out.push({ o, c, h: o + 0.5, l: c - 0.5 })
    p2 = c
  }
  return out
})()

export default function TailIsTrade() {
  const cw = (chartRight - chartLeft) / candles.length
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="A P-shape profile with the thin upper tail highlighted in amber. The candlestick chart on the right shows price rallying into the tail, stalling, and then reversing back down to the heavy bottom node."
      >
        <text x={padX} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">P-shape · the tail = trapped buyers</text>

        {/* Tail zone highlight */}
        <rect x={profileLeft - 4} y={toPx(80)} width={chartRight - profileLeft + 8} height={toPx(62) - toPx(80)} fill={palette.lvn} opacity="0.07" />

        {/* Profile bars */}
        {profile.map((b, i) => (
          <rect key={i} x={profileLeft} y={toPx(b.p) - 4} width={b.w} height={8} fill={b.isPoc ? palette.poc : b.isTail ? palette.lvn : palette.hvn} opacity={b.isTail ? 0.9 : 0.9} rx="1" />
        ))}

        {/* Candles */}
        {candles.map((c, i) => {
          const cx = chartLeft + i * cw + cw / 2
          const isBull = c.c >= c.o
          const color = isBull ? palette.bull : palette.bear
          return (
            <g key={i}>
              <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="0.9" />
              <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(0.8, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
            </g>
          )
        })}

        {/* Annotations */}
        <text x={W - padX} y={toPx(72)} fill={palette.lvn} fontFamily="Oxanium, sans-serif" fontSize="12" fontWeight="700" textAnchor="end">TAIL — chase zone</text>
        <text x={W - padX} y={toPx(44)} fill={palette.poc} fontFamily="Oxanium, sans-serif" fontSize="12" fontWeight="700" textAnchor="end">POC — heavy node</text>
        <text x={padX} y={H - 10} fill={palette.text} fontFamily="Space Mono, monospace" fontSize="11" fontStyle="italic">Fade the tail. Trade back to the heavy node.</text>
      </svg>
    </figure>
  )
}
