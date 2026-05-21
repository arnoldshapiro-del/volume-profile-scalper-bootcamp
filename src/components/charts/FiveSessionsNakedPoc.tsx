const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', lvn: '#F59E0B', accent: '#3B82F6',
}

const W = 800, H = 460
const padX = 20, padY = 30

// 5 sessions across left 600px, today on right 180px
const sessionW = 110
const sessionGap = 6
const todayLeft = padX + 5 * (sessionW + sessionGap) + 14

const yMin = 30, yMax = 80
const toPx = (price: number) => padY + (H - padY * 2 - 40) * (1 - (price - yMin) / (yMax - yMin))

interface Session {
  label: string
  pocPrice: number
  isNaked: boolean
  candleRange: [number, number]
}

const SESSIONS: Session[] = [
  { label: 'D-5', pocPrice: 38, isNaked: false, candleRange: [34, 60] },
  { label: 'D-4', pocPrice: 52, isNaked: false, candleRange: [42, 60] },
  { label: 'D-3', pocPrice: 70, isNaked: true, candleRange: [58, 76] },
  { label: 'D-2', pocPrice: 44, isNaked: false, candleRange: [38, 62] },
  { label: 'D-1', pocPrice: 58, isNaked: true, candleRange: [50, 64] },
]

const TODAY_PRICE = 55

function sessionCandles(range: [number, number], pocPrice: number): { o: number, c: number, h: number, l: number }[] {
  // 8 candles spanning the range, oscillating near POC
  return Array.from({ length: 8 }).map((_, i) => {
    const t = i / 7
    const base = range[0] + t * (range[1] - range[0])
    const o = pocPrice + (base - pocPrice) * 0.6
    const c = o + Math.sin(i * 1.4) * 3
    return { o, c, h: Math.max(o, c) + 1, l: Math.min(o, c) - 1 }
  })
}

function sessionProfile(pocPrice: number, range: [number, number]): { p: number, w: number }[] {
  const bars: { p: number, w: number }[] = []
  const step = (range[1] - range[0]) / 16
  for (let i = 0; i < 16; i++) {
    const p = range[0] + i * step
    const d = Math.abs(p - pocPrice)
    const w = Math.max(6, 70 * Math.exp(-(d * d) / 24))
    bars.push({ p, w })
  }
  return bars
}

export default function FiveSessionsNakedPoc() {
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="Five prior sessions shown left to right, each with its own profile and candles. Three sessions have had their POCs retested (shown struck through). Two sessions (D-3 and D-1) have naked POCs that extend as gold dotted lines all the way to today's chart on the right."
      >
        <text x={padX} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">5 prior sessions</text>
        <text x={todayLeft} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">Today</text>

        {/* Sessions */}
        {SESSIONS.map((s, idx) => {
          const x = padX + idx * (sessionW + sessionGap)
          const profile = sessionProfile(s.pocPrice, s.candleRange)
          const candles = sessionCandles(s.candleRange, s.pocPrice)
          const cw = (sessionW - 60) / candles.length
          return (
            <g key={s.label}>
              <rect x={x} y={padY - 6} width={sessionW} height={H - padY * 2 - 30} fill="#131B2E" rx="6" stroke={palette.border} strokeOpacity="0.5" />
              <text x={x + sessionW / 2} y={H - padY - 10} fill={palette.textMuted} fontFamily="Space Mono, monospace" fontSize="10" textAnchor="middle">{s.label}</text>
              {/* mini profile */}
              {profile.map((b, i) => (
                <rect key={i} x={x + 8} y={toPx(b.p) - 3} width={b.w * 0.55} height={5} fill={Math.abs(b.p - s.pocPrice) < 2 ? palette.poc : palette.hvn} opacity={Math.abs(b.p - s.pocPrice) < 2 ? 1 : 0.7} rx="1" />
              ))}
              {/* candles */}
              {candles.map((c, i) => {
                const cx = x + 50 + i * cw + cw / 2
                const isBull = c.c >= c.o
                const color = isBull ? palette.bull : palette.bear
                return (
                  <g key={i}>
                    <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="0.7" />
                    <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(0.7, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
                  </g>
                )
              })}
              {/* POC label inside session */}
              <text x={x + 4} y={toPx(s.pocPrice) - 6} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="9">POC</text>
              {!s.isNaked && (
                <line x1={x + 4} y1={toPx(s.pocPrice)} x2={x + sessionW - 4} y2={toPx(s.pocPrice) - 1} stroke={palette.textMuted} strokeWidth="1" />
              )}
            </g>
          )
        })}

        {/* Naked POC lines extending to today */}
        {SESSIONS.filter((s) => s.isNaked).map((s, idx) => {
          const startX = padX + SESSIONS.indexOf(s) * (sessionW + sessionGap) + 8
          return (
            <g key={s.label}>
              <line x1={startX} y1={toPx(s.pocPrice)} x2={W - padX - 8} y2={toPx(s.pocPrice)} stroke={palette.poc} strokeDasharray="4 4" opacity="0.9" />
              <text x={W - padX - 8} y={toPx(s.pocPrice) - 4} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="11" textAnchor="end" fontWeight="700">
                naked POC {idx + 1}
              </text>
            </g>
          )
        })}

        {/* Today panel */}
        <rect x={todayLeft} y={padY - 6} width={W - todayLeft - padX} height={H - padY * 2 - 30} fill="#131B2E" rx="6" stroke={palette.accent} strokeOpacity="0.6" />
        {/* Today price arrow */}
        <line x1={todayLeft + 12} y1={toPx(TODAY_PRICE)} x2={W - padX - 8} y2={toPx(TODAY_PRICE)} stroke={palette.text} strokeWidth="1.2" />
        <text x={todayLeft + 12} y={toPx(TODAY_PRICE) - 4} fill={palette.text} fontFamily="Space Mono, monospace" fontSize="10">current price</text>
      </svg>
    </figure>
  )
}
