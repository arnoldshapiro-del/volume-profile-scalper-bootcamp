const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', hvn: '#14B8A6', poc: '#FFD700', lvn: '#F59E0B', purple: '#A78BFA',
}

const W = 760, H = 440
const padX = 18
const panelW = (W - 3 * padX) / 2
const VAH = 60, VAL = 40, POC = 50

function takeCandles(): { o: number, c: number, h: number, l: number }[] {
  // H2 setup at VAL (40) — pullback then break
  const out: { o: number, c: number, h: number, l: number }[] = []
  // Drift down to VAL
  let p = 50
  for (let i = 0; i < 6; i++) { out.push({ o: p, c: p - 1.5, h: p + 0.5, l: p - 2 }); p -= 1.5 }
  // First low at VAL
  out.push({ o: 41, c: 39, h: 41, l: 38 })
  // Pullback up (HL1)
  for (let i = 0; i < 3; i++) { out.push({ o: 39 + i, c: 41 + i, h: 41.5 + i, l: 38.5 + i }) }
  // Pullback down
  for (let i = 0; i < 3; i++) { out.push({ o: 43 - i, c: 41 - i, h: 43.5 - i, l: 40 - i }) }
  // Second low at VAL — H2!
  out.push({ o: 41, c: 40, h: 41, l: 39 })
  // H2 trigger — break above pullback high
  for (let i = 0; i < 8; i++) { const o = 40 + i * 1.5; out.push({ o, c: o + 1.2, h: o + 1.5, l: o - 0.4 }) }
  return out
}

function skipCandles(): { o: number, c: number, h: number, l: number }[] {
  // H2 setup at random spot (LVN, no structure)
  const out: { o: number, c: number, h: number, l: number }[] = []
  let p = 70
  // Drift down to 52 (inside LVN, no VAL nearby)
  for (let i = 0; i < 8; i++) { out.push({ o: p, c: p - 1.3, h: p + 0.5, l: p - 1.8 }); p -= 1.3 }
  // First low
  out.push({ o: 60, c: 58, h: 60, l: 57 })
  // Pullback up
  for (let i = 0; i < 3; i++) { out.push({ o: 58 + i * 0.8, c: 60 + i * 0.8, h: 60.5 + i * 0.8, l: 57.5 + i * 0.8 }) }
  // Pullback down
  for (let i = 0; i < 3; i++) { out.push({ o: 61 - i, c: 59 - i, h: 61.5 - i, l: 58 - i }) }
  // Second low (H2)
  out.push({ o: 58, c: 57, h: 58.5, l: 56.5 })
  // No bounce — drifts through, no edge
  for (let i = 0; i < 8; i++) { const o = 57 - i * 0.4; out.push({ o, c: o - 0.3, h: o + 0.3, l: o - 0.7 }) }
  return out
}

function Panel({ x, candles, title, verdict, verdictColor, sub, profilePeakAt }: { x: number, candles: ReturnType<typeof takeCandles>, title: string, verdict: string, verdictColor: string, sub: string, profilePeakAt: number }) {
  const padIn = 12, padTop = 36
  const panelH = H - 24
  const profileX = padIn
  const profileW = 60
  const chartX = profileX + profileW + 8
  const chartW = panelW - chartX - padIn
  const yMin = 28, yMax = 76
  const candleAreaH = panelH - padTop - 50
  const toPx = (price: number) => 12 + padTop + candleAreaH - ((price - yMin) / (yMax - yMin)) * candleAreaH
  const cw = chartW / candles.length

  // Profile data
  const profile: { p: number, w: number }[] = []
  for (let i = 0; i < 18; i++) {
    const p = yMin + (i / 17) * (yMax - yMin)
    const d = Math.abs(p - profilePeakAt)
    const w = Math.max(6, 50 * Math.exp(-(d * d) / 40))
    profile.push({ p, w })
  }

  return (
    <g transform={`translate(${x}, 0)`}>
      <rect x={0} y={12} width={panelW} height={panelH} fill="#131B2E" rx="8" stroke={palette.border} />
      <text x={padIn} y={32} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="14" fontWeight="700">{title}</text>
      <text x={panelW - padIn} y={32} fill={verdictColor} fontFamily="Oxanium, sans-serif" fontSize="14" fontWeight="700" textAnchor="end">{verdict}</text>

      {/* Profile */}
      {profile.map((b, i) => (
        <rect key={i} x={profileX} y={toPx(b.p) - 3} width={b.w} height={6} fill={Math.abs(b.p - profilePeakAt) < 2 ? palette.poc : palette.hvn} opacity={Math.abs(b.p - profilePeakAt) < 2 ? 1 : 0.75} rx="1" />
      ))}

      {/* VA shading */}
      <rect x={chartX} y={toPx(VAH)} width={chartW} height={toPx(VAL) - toPx(VAH)} fill={palette.purple} opacity="0.1" />
      <line x1={chartX} y1={toPx(VAH)} x2={chartX + chartW} y2={toPx(VAH)} stroke={palette.purple} strokeDasharray="3 3" />
      <line x1={chartX} y1={toPx(VAL)} x2={chartX + chartW} y2={toPx(VAL)} stroke={palette.purple} strokeDasharray="3 3" />
      <line x1={chartX} y1={toPx(POC)} x2={chartX + chartW} y2={toPx(POC)} stroke={palette.poc} opacity="0.8" />

      {/* Candles */}
      {candles.map((c, i) => {
        const cx = chartX + i * cw + cw / 2
        const isBull = c.c >= c.o
        const color = isBull ? palette.bull : palette.bear
        return (
          <g key={i}>
            <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="0.9" />
            <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(0.8, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
          </g>
        )
      })}

      <text x={padIn} y={panelH - 4} fill={palette.textMuted} fontFamily="Space Mono, monospace" fontSize="10">{sub}</text>
    </g>
  )
}

export default function BrooksSameSetupTwoDays() {
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="Two side-by-side panels showing the same H2 long Brooks setup at two different profile locations. The left panel shows the H2 at yesterday's VAL with a bounce, marked TAKE. The right panel shows the same pattern inside an LVN with no structure, marked SKIP."
      >
        <Panel x={padX} candles={takeCandles()} title="H2 long at VAL" verdict="TAKE ✓" verdictColor={palette.bull} sub="institutional floor — H2 confirmed buyers stepping in" profilePeakAt={40} />
        <Panel x={padX * 2 + panelW} candles={skipCandles()} title="Same H2, in LVN" verdict="SKIP ✗" verdictColor={palette.bear} sub="no nearby HVN — chart says yes, profile says nothing" profilePeakAt={72} />
      </svg>
    </figure>
  )
}
