const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', poc: '#FFD700', purple: '#A78BFA',
}

const W = 760, H = 380
const padX = 18, panelW = (W - 3 * padX) / 2

const VAH = 60, VAL = 40, POC = 50
const yMin = 28, yMax = 78

function trueSetup(): { o: number, c: number, h: number, l: number }[] {
  const out: { o: number, c: number, h: number, l: number }[] = []
  // Open above
  let p = 68
  for (let i = 0; i < 5; i++) { out.push({ o: p, c: p + (i % 2 ? -1 : 1), h: p + 1, l: p - 1 }) }
  // Gradual re-entry
  for (let i = 0; i < 6; i++) { const o = p; const c = p - 2; out.push({ o, c, h: o + 0.5, l: c - 0.5 }); p = c }
  // Acceptance: 12 candles inside (~2 periods)
  for (let i = 0; i < 12; i++) {
    const base = 50 + Math.sin(i * 1.0) * 5
    out.push({ o: base, c: base + (i % 2 ? 1 : -1), h: base + 1.5, l: base - 1.5 })
  }
  // Traversal
  let p2 = 50
  for (let i = 0; i < 8; i++) { out.push({ o: p2, c: p2 - 1.5, h: p2 + 0.4, l: p2 - 2 }); p2 -= 1.5 }
  return out
}

function falseSetup(): { o: number, c: number, h: number, l: number }[] {
  const out: { o: number, c: number, h: number, l: number }[] = []
  let p = 68
  for (let i = 0; i < 6; i++) { out.push({ o: p, c: p + (i % 2 ? -1 : 1), h: p + 1, l: p - 1 }) }
  // Quick wick re-entry
  out.push({ o: 67, c: 56, h: 67, l: 55 })
  // Immediate re-exit
  for (let i = 0; i < 10; i++) {
    const base = 56 + i * 1.4
    out.push({ o: base, c: base + 1.2, h: base + 1.5, l: base - 0.5 })
  }
  // Push higher
  let p2 = 70
  for (let i = 0; i < 14; i++) { out.push({ o: p2, c: p2 + 0.9, h: p2 + 1.1, l: p2 - 0.2 }); p2 += 0.9 }
  return out
}

function Panel({ x, candles, title, verdictGood, verdict, sub }: { x: number, candles: ReturnType<typeof trueSetup>, title: string, verdictGood: boolean, verdict: string, sub: string }) {
  const padInX = 12
  const padTop = 36
  const panelH = H - 24
  const candleAreaW = panelW - padInX * 2
  const candleAreaH = panelH - padTop - 50
  const cw = candleAreaW / candles.length
  const toPx = (price: number) => 12 + padTop + candleAreaH - ((price - yMin) / (yMax - yMin)) * candleAreaH
  return (
    <g transform={`translate(${x}, 0)`}>
      <rect x={0} y={12} width={panelW} height={panelH} fill="#131B2E" rx="8" stroke={palette.border} />
      <text x={padInX} y={32} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="14" fontWeight="700">{title}</text>
      <text x={panelW - padInX} y={32} fill={verdictGood ? palette.bull : palette.bear} fontFamily="Oxanium, sans-serif" fontSize="14" fontWeight="700" textAnchor="end">{verdict}</text>

      {/* VA */}
      <rect x={padInX} y={toPx(VAH)} width={candleAreaW} height={toPx(VAL) - toPx(VAH)} fill={palette.purple} opacity="0.12" />
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

      <text x={padInX} y={panelH - 4} fill={palette.textMuted} fontFamily="Space Mono, monospace" fontSize="10">{sub}</text>
    </g>
  )
}

export default function TrueVsFalseSetup() {
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="Two side-by-side panels comparing a true 80% Rule setup with a false positive. The left panel shows a clean open above VAH, gradual re-entry, two 30-minute periods of acceptance inside the value area, then traversal to the opposite VAL. The right panel shows a quick wick re-entry that immediately re-exits without acceptance — a false positive."
      >
        <Panel x={padX} candles={trueSetup()} title="True 80% Setup" verdict="TAKE ✓" verdictGood sub="open above → gradual re-entry → 2 periods inside → traversal" />
        <Panel x={padX * 2 + panelW} candles={falseSetup()} title="False Positive" verdict="SKIP ✗" verdictGood={false} sub="quick wick re-entry then exit — no acceptance" />
      </svg>
    </figure>
  )
}
