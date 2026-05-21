// Chart 3.2 — The Vacuum Effect (760×360)
const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', lvn: '#F59E0B',
}

const W = 760, H = 360
const padX = 16, padY = 24
const profileLeft = padX
const profileW = 180
const chartLeft = profileLeft + profileW + 16
const chartRight = W - padX - 60

const yMin = 22, yMax = 86
const HVN_TOP_P = 70
const HVN_BOT_P = 38
const LVN_RANGE = [50, 64]

const toPx = (price: number) => padY + (H - 2 * padY) * (1 - (price - yMin) / (yMax - yMin))

// profile: two HVN clusters with LVN between
const profile = (() => {
  const bars: { p: number, w: number, kind: 'poc' | 'hvn' | 'lvn' }[] = []
  for (let i = 0; i < 26; i++) {
    const p = yMin + (i / 25) * (yMax - yMin)
    let w = 14
    let kind: 'poc' | 'hvn' | 'lvn' = 'lvn'
    if (p >= 64 && p <= 76) {
      const d = Math.abs(p - HVN_TOP_P)
      w = 110 + (1 - d / 6) * 40
      kind = Math.abs(p - HVN_TOP_P) < 1.5 ? 'poc' : 'hvn'
    } else if (p >= 32 && p <= 46) {
      const d = Math.abs(p - HVN_BOT_P)
      w = 105 + (1 - d / 6) * 40
      kind = 'hvn'
    } else {
      w = 14 + Math.random() * 8
    }
    bars.push({ p, w, kind })
  }
  return bars
})()

// candles: start at top HVN, break through to LVN, sprint through, land at bottom HVN
const candles = (() => {
  const out: Array<{ o: number, c: number, h: number, l: number }> = []
  // 8 candles ranging at top HVN around 68-72
  let p = 70
  for (let i = 0; i < 8; i++) {
    const o = p
    const c = 68 + Math.sin(i * 0.7) * 3
    out.push({ o, c, h: Math.max(o, c) + 1, l: Math.min(o, c) - 1 })
    p = c
  }
  // 1 big bear marubozu through HVN edge
  out.push({ o: 67, c: 62, h: 67.5, l: 61.5 })
  // 8 fast bear candles through LVN
  let p2 = 62
  for (let i = 0; i < 8; i++) {
    const o = p2
    const c = p2 - 1.5
    out.push({ o, c, h: o + 0.4, l: c - 0.4 })
    p2 = c
  }
  // 6 candles consolidating at bottom HVN
  let p3 = 48
  for (let i = 0; i < 6; i++) {
    const o = p3
    const c = 40 + Math.sin(i * 0.9) * 2
    out.push({ o, c, h: Math.max(o, c) + 1, l: Math.min(o, c) - 1 })
    p3 = c
  }
  return out
})()

export default function VacuumEffect() {
  const cw = (chartRight - chartLeft) / candles.length

  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="The vacuum effect. Two high-volume node clusters bracket a low-volume node zone. Candles break through the upper HVN's lower edge and sprint through the LVN with long-bodied bear candles, landing at the lower HVN."
      >
        <text x={padX} y={16} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="12" fontWeight="600">Profile</text>
        <text x={chartLeft} y={16} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="12" fontWeight="600">Price sprints through LVN to next HVN</text>

        {/* LVN region highlight on profile area */}
        <rect x={profileLeft} y={toPx(LVN_RANGE[1])} width={chartRight - profileLeft} height={toPx(LVN_RANGE[0]) - toPx(LVN_RANGE[1])} fill={palette.lvn} opacity="0.08" />

        {profile.map((b, i) => {
          const color = b.kind === 'poc' ? palette.poc : b.kind === 'hvn' ? palette.hvn : palette.lvn
          return <rect key={i} x={profileLeft} y={toPx(b.p) - 4} width={b.w} height={8} fill={color} opacity={b.kind === 'lvn' ? 0.6 : 0.9} rx="1" />
        })}

        {candles.map((c, i) => {
          const cx = chartLeft + i * cw + cw / 2
          const isBull = c.c >= c.o
          const color = isBull ? palette.bull : palette.bear
          return (
            <g key={i}>
              <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="0.8" />
              <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(0.8, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
            </g>
          )
        })}

        {/* LVN label */}
        <text x={chartRight - 16} y={toPx(57) + 4} fill={palette.lvn} fontFamily="Oxanium, sans-serif" fontSize="11" fontWeight="700" textAnchor="end">LVN — vacuum</text>

        {/* Annotation */}
        <text x={padX} y={H - 8} fill={palette.text} fontFamily="Space Mono, monospace" fontSize="11" fontStyle="italic">
          Once price clears the HVN edge, the LVN offers no friction.
        </text>
      </svg>
    </figure>
  )
}
