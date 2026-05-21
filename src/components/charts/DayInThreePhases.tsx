const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', poc: '#FFD700', purple: '#A78BFA', hvn: '#14B8A6',
}

const W = 760, H = 280
const padX = 18, padY = 30

const PHASES = [
  {
    label: '9:25 — Pre-market',
    color: palette.hvn,
    bullets: ['Mark POC, VAH, VAL', 'Identify naked POCs', 'Define bias above/in/below'],
  },
  {
    label: '9:30–10:30 — Open + IB',
    color: palette.poc,
    bullets: ['Watch IB high/low form', 'Classify Open Type', 'Note developing profile shape'],
  },
  {
    label: '10:30 — Close — Execute',
    color: palette.purple,
    bullets: ['Trade IB extensions', 'Apply Brooks × Profile filter', 'EOD: mark today\'s POC/VAH/VAL'],
  },
]

const blockW = (W - 2 * padX - 24) / 3

export default function DayInThreePhases() {
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="A horizontal timeline showing the trading day in three phases: pre-market, open and IB formation, and post-IB execution. Each phase block lists 3 actions."
      >
        <text x={padX} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">The day in three phases</text>

        {/* Timeline */}
        <line x1={padX} y1={padY + 20} x2={W - padX} y2={padY + 20} stroke={palette.border} strokeWidth="2" />

        {PHASES.map((p, i) => {
          const x = padX + i * (blockW + 12)
          return (
            <g key={i}>
              <circle cx={x + blockW / 2} cy={padY + 20} r="6" fill={p.color} />
              <rect x={x} y={padY + 38} width={blockW} height={H - padY - 70} fill="#131B2E" stroke={palette.border} rx="8" />
              <text x={x + blockW / 2} y={padY + 60} fill={p.color} fontFamily="Oxanium, sans-serif" fontSize="12" fontWeight="700" textAnchor="middle">{p.label}</text>
              {p.bullets.map((b, j) => (
                <text key={j} x={x + 12} y={padY + 90 + j * 22} fill={palette.text} fontFamily="Space Mono, monospace" fontSize="11">• {b}</text>
              ))}
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
