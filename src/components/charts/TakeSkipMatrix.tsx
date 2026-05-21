const palette = {
  bg: '#0A0E1A', border: '#2A3654', text: '#E8ECF4', textMuted: '#8B95B0',
  bull: '#10B981', bear: '#EF4444', lvn: '#F59E0B', poc: '#FFD700',
}

const ROWS = [
  { setup: 'H2 long', cells: ['take', 'take', 'take', 'skip', 'skip'] },
  { setup: 'H2 short', cells: ['take', 'take', 'take', 'skip', 'skip'] },
  { setup: 'Bull flag', cells: ['take', 'take', 'take', 'caution', 'caution'] },
  { setup: 'Bear flag', cells: ['take', 'take', 'take', 'caution', 'caution'] },
  { setup: 'Double bottom', cells: ['take', 'take', 'take', 'skip', 'skip'] },
  { setup: 'Double top', cells: ['take', 'take', 'take', 'skip', 'skip'] },
  { setup: 'Breakout INTO HVN', cells: ['skip', 'skip', 'skip', '—', '—'] },
]
const COLS = ['At HVN', 'At POC', 'At VAH/VAL', 'In LVN', 'No-Mans-Land']

const W = 760, H = 480
const padX = 18, padY = 30
const colW = (W - 2 * padX - 140) / 5
const rowH = (H - padY - 40) / (ROWS.length + 1)

function symbol(v: string) {
  if (v === 'take') return { glyph: '✓', color: palette.bull, label: 'TAKE' }
  if (v === 'skip') return { glyph: '✗', color: palette.bear, label: 'SKIP' }
  if (v === 'caution') return { glyph: '~', color: palette.lvn, label: 'CAUTION' }
  return { glyph: '—', color: palette.textMuted, label: '' }
}

export default function TakeSkipMatrix() {
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl border border-border-subtle"
        style={{ background: palette.bg }}
        role="img"
        aria-label="Take-it-or-skip-it matrix table. Rows are Brooks setup types: H2 long, H2 short, bull flag, bear flag, double bottom, double top, breakout into HVN. Columns are profile context: At HVN, At POC, At VAH/VAL, In LVN, No-Mans-Land. Most setups at structure are marked TAKE in green; setups in LVN or no-mans-land are marked SKIP in red or CAUTION in amber."
      >
        <text x={padX} y={20} fill={palette.text} fontFamily="Oxanium, sans-serif" fontSize="13" fontWeight="600">Take-It-or-Skip-It · Brooks setup × profile context</text>

        {/* Column headers */}
        {COLS.map((c, i) => (
          <g key={c}>
            <rect x={padX + 140 + i * colW} y={padY} width={colW - 4} height={rowH - 4} fill={palette.bg} stroke={palette.border} rx="4" />
            <text x={padX + 140 + i * colW + colW / 2 - 2} y={padY + rowH / 2 + 4} fill={palette.poc} fontFamily="Oxanium, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle">{c}</text>
          </g>
        ))}

        {/* Rows */}
        {ROWS.map((r, ri) => (
          <g key={r.setup}>
            <rect x={padX} y={padY + (ri + 1) * rowH} width={132} height={rowH - 4} fill={palette.bg} stroke={palette.border} rx="4" />
            <text x={padX + 10} y={padY + (ri + 1) * rowH + rowH / 2 + 4} fill={palette.text} fontFamily="Space Mono, monospace" fontSize="11">{r.setup}</text>
            {r.cells.map((v, ci) => {
              const s = symbol(v)
              return (
                <g key={ci}>
                  <rect x={padX + 140 + ci * colW} y={padY + (ri + 1) * rowH} width={colW - 4} height={rowH - 4} fill={s.color} fillOpacity="0.15" stroke={s.color} strokeOpacity="0.4" rx="4" />
                  <text x={padX + 140 + ci * colW + colW / 2 - 2} y={padY + (ri + 1) * rowH + rowH / 2 + 1} fill={s.color} fontFamily="Oxanium, sans-serif" fontSize="14" fontWeight="700" textAnchor="middle">{s.glyph}</text>
                  <text x={padX + 140 + ci * colW + colW / 2 - 2} y={padY + (ri + 1) * rowH + rowH / 2 + 14} fill={s.color} fontFamily="Space Mono, monospace" fontSize="8" textAnchor="middle">{s.label}</text>
                </g>
              )
            })}
          </g>
        ))}
      </svg>
    </figure>
  )
}
