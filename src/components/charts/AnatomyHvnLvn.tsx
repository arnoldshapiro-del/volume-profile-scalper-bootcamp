// Chart 3.1 — Anatomy of HVN vs LVN (800×500)
const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', lvn: '#F59E0B',
}

const W = 800, H = 500
const padX = 16, padY = 30
const profileLeft = padX
const profileW = 200
const chartLeft = profileLeft + profileW + 20
const chartRight = W - padX - 100

// Price range mirror spec: 5840 to 5860 (mapped to 0..100 internal scale)
const priceMin = 5840, priceMax = 5860
const priceToY = (p: number) => {
  const u = (p - priceMin) / (priceMax - priceMin)
  return padY + (H - 2 * padY) * (1 - u)
}

// 30 profile bars
const profile = (() => {
  const bars: { p: number, w: number, isHVN: boolean, isLVN: boolean, isPOC: boolean }[] = []
  const step = (priceMax - priceMin) / 30
  for (let i = 0; i < 30; i++) {
    const p = priceMin + i * step
    let w = 18 // baseline
    // HVN cluster around 5849.75 (8 bars, length 140-180)
    if (p >= 5847.5 && p <= 5852) {
      const d = Math.abs(p - 5849.75)
      w = 140 + (1 - d / 3) * 40
    } else if (p < 5847) {
      // LVN below
      w = 15 + Math.random() * 10
    } else if (p > 5853) {
      // LVN above
      w = 15 + Math.random() * 10
    }
    const isPOC = Math.abs(p - 5849.75) < 0.4
    const isHVN = w > 120 && !isPOC
    const isLVN = w < 30
    bars.push({ p, w: Math.min(w, 180), isHVN, isLVN, isPOC })
  }
  return bars
})()

// 80 candles — approach HVN, rejection, bounce
const candles = (() => {
  const out: Array<{ o: number, h: number, l: number, c: number }> = []
  // First 30 candles: drift down from 5856 to HVN at 5850
  let p = 5856
  for (let i = 0; i < 30; i++) {
    const o = p
    const c = p - 0.18
    out.push({ o, c, h: o + 0.4, l: c - 0.4 })
    p = c
  }
  // 5 candles testing/rejecting HVN
  for (let i = 0; i < 5; i++) {
    out.push({ o: 5850.3 + i * 0.1, c: 5850.5 - i * 0.1, h: 5850.6, l: 5849.6 })
  }
  // Big rejection candle (hammer)
  out.push({ o: 5850.4, c: 5851.2, h: 5851.4, l: 5849.4 })
  // 44 candles bouncing up
  let p2 = 5851.2
  for (let i = 0; i < 44; i++) {
    const o = p2
    const c = p2 + 0.16
    out.push({ o, c, h: c + 0.4, l: o - 0.4 })
    p2 = c
  }
  return out
})()

export default function AnatomyHvnLvn() {
  const cw = (chartRight - chartLeft) / candles.length

  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="Anatomy of HVN vs LVN. A volume profile on the left shows a high-volume node cluster around price 5849.75 with the POC in gold. Above and below are low-volume node zones in amber. The candlestick chart on the right shows price drifting down to the HVN, finding rejection, and bouncing back."
      >
        <text x={padX} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">Volume Profile</text>
        <text x={chartLeft} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">5-minute MES — approach, rejection, bounce</text>

        {/* Profile bars */}
        {profile.map((b, i) => {
          const color = b.isPOC ? palette.poc : b.isHVN ? palette.hvn : palette.lvn
          return (
            <rect key={i} x={profileLeft} y={priceToY(b.p) - 5} width={b.w} height={9} fill={color} opacity={b.isLVN ? 0.65 : 0.95} rx="1" />
          )
        })}

        {/* POC dotted line across full chart */}
        <line x1={profileLeft} y1={priceToY(5849.75)} x2={chartRight} y2={priceToY(5849.75)} stroke={palette.poc} strokeDasharray="3 4" opacity="0.85" />

        {/* Candles */}
        {candles.map((c, i) => {
          const cx = chartLeft + i * cw + cw / 2
          const isBull = c.c >= c.o
          const color = isBull ? palette.bull : palette.bear
          return (
            <g key={i}>
              <line x1={cx} y1={priceToY(c.h)} x2={cx} y2={priceToY(c.l)} stroke={color} strokeWidth="0.8" />
              <rect x={cx - cw * 0.32} y={priceToY(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(0.8, Math.abs(priceToY(c.o) - priceToY(c.c)))} fill={color} />
            </g>
          )
        })}

        {/* HVN bracket label */}
        <path d={`M ${profileW + padX + 6} ${priceToY(5852)} Q ${profileW + padX + 16} ${priceToY(5849.75)} ${profileW + padX + 6} ${priceToY(5847.5)}`} stroke={palette.hvn} fill="none" strokeWidth="1.5" />
        <text x={profileW + padX + 22} y={priceToY(5849.75) + 4} fill={palette.hvn} fontFamily="Oxanium, sans-serif" fontSize="12" fontWeight="700">HVN</text>

        {/* LVN brackets */}
        <text x={profileW + padX + 36} y={priceToY(5856) + 4} fill={palette.lvn} fontFamily="Oxanium, sans-serif" fontSize="11" fontWeight="700">LVN</text>
        <text x={profileW + padX + 36} y={priceToY(5844) + 4} fill={palette.lvn} fontFamily="Oxanium, sans-serif" fontSize="11" fontWeight="700">LVN</text>

        {/* Bounce arrow */}
        <g>
          <path d={`M ${chartLeft + 36 * cw} ${priceToY(5850)} L ${chartLeft + 56 * cw} ${priceToY(5853)}`} stroke={palette.bull} fill="none" strokeWidth="1.5" strokeDasharray="3 3" />
          <polygon points={`${chartLeft + 56 * cw},${priceToY(5853)} ${chartLeft + 54 * cw},${priceToY(5853) + 4} ${chartLeft + 54 * cw},${priceToY(5853) - 4}`} fill={palette.bull} />
        </g>

        {/* Price labels right side */}
        {[5860, 5855, 5849.75, 5845, 5840].map((p) => (
          <text key={p} x={W - 6} y={priceToY(p) + 4} fill={p === 5849.75 ? palette.poc : palette.textMuted} fontFamily="Space Mono, monospace" fontSize="10" textAnchor="end" fontWeight={p === 5849.75 ? '700' : '400'}>
            {p.toFixed(2)}
          </text>
        ))}
      </svg>
    </figure>
  )
}
