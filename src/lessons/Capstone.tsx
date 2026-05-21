import { useEffect, useMemo, useState } from 'react'
import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import { useProgress } from '../hooks/useProgress'
import { DAYS, type CapstoneDay, type OpenType } from '../data/capstone-days'
import { useLocalStorage } from '../hooks/useLocalStorage'
import TradePlacement, { scorePlacement, type Placement } from '../components/interactives/TradePlacement'

type Phase = 'select' | 'premarket' | 'open' | 'setups' | 'place' | 'score'

const palette = {
  bg: '#0A0E1A', border: '#2A3654', bull: '#10B981', bear: '#EF4444',
  poc: '#FFD700', purple: '#A78BFA', hvn: '#14B8A6', text: '#E8ECF4', textMuted: '#8B95B0',
}

const OPEN_OPTIONS: OpenType[] = ['Open Drive', 'Open Test Drive', 'Open Rejection Reverse', 'Open Auction']

interface SessionScore {
  dayId: string
  openTypeCorrect: boolean
  takeSkipCorrect: number
  takeSkipTotal: number
  premarketCount: number
  placementScore: number
  placementMax: number
  finalScore: number
}

const PREMARKET_ITEMS = [
  'Marked yesterday\'s POC, VAH, VAL',
  'Identified naked POCs',
  'Noted HVN clusters above/below',
  'Noted LVN voids above/below',
  'Defined bias (above/in/below)',
]

export default function Capstone() {
  const { completeLesson } = useProgress()
  const [phase, setPhase] = useState<Phase>('select')
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [premarketChecks, setPremarketChecks] = useState<boolean[]>(Array(PREMARKET_ITEMS.length).fill(false))
  const [openTypeAnswer, setOpenTypeAnswer] = useState<OpenType | null>(null)
  const [setupAnswers, setSetupAnswers] = useState<Record<string, 'TAKE' | 'SKIP' | null>>({})
  const [placements, setPlacements] = useState<Record<string, Placement>>({})
  const [showCount, setShowCount] = useState(0)
  const [scores, setScores] = useLocalStorage<SessionScore[]>('vp_capstone_scores', [])

  const day: CapstoneDay | null = useMemo(() => DAYS.find((d) => d.id === selectedDayId) || null, [selectedDayId])

  // Open phase animated playback
  useEffect(() => {
    if (phase !== 'open' || !day) return
    setShowCount(0)
    const t = setInterval(() => setShowCount((n) => n >= day.ibCandles.length ? (clearInterval(t), n) : n + 1), 180)
    return () => clearInterval(t)
  }, [phase, day])

  function resetAll() {
    setPhase('select')
    setSelectedDayId(null)
    setPremarketChecks(Array(PREMARKET_ITEMS.length).fill(false))
    setOpenTypeAnswer(null)
    setSetupAnswers({})
    setPlacements({})
    setShowCount(0)
  }

  function afterSetups() {
    if (!day) return
    // If any TAKE setups, go to placement phase; else skip to score
    const takeSetups = day.setups.filter((s) => setupAnswers[s.id] === 'TAKE' && s.idealEntry !== undefined)
    if (takeSetups.length === 0) finalize()
    else setPhase('place')
  }

  function finalize(finalPlacements: Record<string, Placement> = placements) {
    if (!day) return
    const openTypeCorrect = openTypeAnswer === day.openType
    let takeSkipCorrect = 0
    day.setups.forEach((s) => { if (setupAnswers[s.id] === s.optimal) takeSkipCorrect++ })
    const total = day.setups.length
    const premarketCount = premarketChecks.filter(Boolean).length

    // Placement scoring: only count for TAKEs the user chose AND that have ideal values
    let placementScore = 0
    let placementMax = 0
    day.setups.forEach((s) => {
      if (setupAnswers[s.id] === 'TAKE' && s.idealEntry !== undefined && finalPlacements[s.id]) {
        const { score, max } = scorePlacement(s, finalPlacements[s.id])
        placementScore += score
        placementMax += max
      }
    })

    const placementWeighted = placementMax > 0 ? (placementScore / placementMax) * 15 : 0
    const finalScore = Math.round(
      (openTypeCorrect ? 25 : 0) +
      (takeSkipCorrect / total) * 50 +
      (premarketCount / PREMARKET_ITEMS.length) * 10 +
      placementWeighted
    )
    const session: SessionScore = {
      dayId: day.id, openTypeCorrect,
      takeSkipCorrect, takeSkipTotal: total,
      premarketCount,
      placementScore, placementMax,
      finalScore,
    }
    setScores([...scores.filter((s) => s.dayId !== day.id), session])
    completeLesson('capstone', finalScore)
    setPlacements(finalPlacements)
    setPhase('score')
  }

  return (
    <LessonLayout lessonId="capstone">
      <PromiseCallout>
        Apply everything in a full simulated trading morning with real-time decisions. Pre-market checklist → Open Type read → take/skip decisions → final score.
      </PromiseCallout>

      {phase === 'select' && (
        <DaySelect onSelect={(id) => { setSelectedDayId(id); setPhase('premarket') }} scores={scores} />
      )}

      {phase === 'premarket' && day && (
        <PremarketPhase day={day} checks={premarketChecks} setChecks={setPremarketChecks} onNext={() => setPhase('open')} />
      )}

      {phase === 'open' && day && (
        <OpenPhase day={day} showCount={showCount} setShowCount={setShowCount} openTypeAnswer={openTypeAnswer} setOpenTypeAnswer={setOpenTypeAnswer} onNext={() => setPhase('setups')} />
      )}

      {phase === 'setups' && day && (
        <SetupsPhase day={day} answers={setupAnswers} setAnswers={setSetupAnswers} onFinalize={afterSetups} />
      )}

      {phase === 'place' && day && (
        <div className="my-8">
          <PhaseHeader phaseLabel="Phase 4 · Place your trades" title={day.title} subtitle="For each TAKE, set entry, stop, T1, T2." />
          <TradePlacement
            day={day}
            setups={day.setups.filter((s) => setupAnswers[s.id] === 'TAKE' && s.idealEntry !== undefined)}
            onComplete={(p) => finalize(p)}
          />
        </div>
      )}

      {phase === 'score' && day && (
        <ScoreBreakdown day={day} score={scores.find((s) => s.dayId === day.id)} placements={placements} openTypeAnswer={openTypeAnswer} setupAnswers={setupAnswers} onReset={resetAll} />
      )}
    </LessonLayout>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────

function DaySelect({ onSelect, scores }: { onSelect: (id: string) => void, scores: SessionScore[] }) {
  return (
    <div className="my-8">
      <h2 className="font-head font-bold text-2xl mb-2">Choose a simulated trading day</h2>
      <p className="text-text-secondary text-sm mb-6">Each day is a fully simulated scalping morning. Complete all three to master your reads.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DAYS.map((d) => {
          const completed = scores.find((s) => s.dayId === d.id)
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d.id)}
              className="card card-hover text-left transition-all"
            >
              <div className="text-xs font-mono uppercase text-text-secondary mb-1">Day · {d.shape}-shape</div>
              <h3 className="font-head font-bold text-xl mb-2">{d.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">{d.description}</p>
              {completed && (
                <div className="text-xs font-mono text-poc-gold">Last score: <span className="font-bold">{completed.finalScore}</span>/100</div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PremarketPhase({ day, checks, setChecks, onNext }: { day: CapstoneDay, checks: boolean[], setChecks: (b: boolean[]) => void, onNext: () => void }) {
  return (
    <div className="my-8">
      <PhaseHeader phaseLabel="Phase 1 · Pre-market" title={day.title} subtitle="Run the 5-minute checklist" />

      <YesterdayReference day={day} />

      <div className="my-6 rounded-xl border border-border-subtle bg-bg-card p-6">
        <h4 className="font-head font-semibold text-lg mb-3">Pre-market checklist</h4>
        <div className="space-y-2">
          {PREMARKET_ITEMS.map((item, i) => {
            const c = checks[i]
            return (
              <button key={i} type="button" onClick={() => { const n = [...checks]; n[i] = !c; setChecks(n) }} className={`w-full text-left px-4 py-2.5 rounded-lg border flex items-center gap-3 transition-all ${c ? 'border-hvn-teal bg-hvn-teal/10' : 'border-border-subtle bg-bg-elevated hover:border-accent-blue'}`}>
                <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${c ? 'border-hvn-teal bg-hvn-teal text-bg-base' : 'border-text-muted'}`}>{c && <span className="text-xs">✓</span>}</span>
                <span className="text-sm">{item}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-5 flex justify-end">
          <button type="button" className="btn-primary" onClick={onNext}>Cash open →</button>
        </div>
      </div>
    </div>
  )
}

function OpenPhase({ day, showCount, setShowCount, openTypeAnswer, setOpenTypeAnswer, onNext }: { day: CapstoneDay, showCount: number, setShowCount: (n: number) => void, openTypeAnswer: OpenType | null, setOpenTypeAnswer: (o: OpenType) => void, onNext: () => void }) {
  const playbackDone = showCount >= day.ibCandles.length
  return (
    <div className="my-8">
      <PhaseHeader phaseLabel="Phase 2 · Cash open" title="9:30 – 10:30 ET · the first 60 minutes" subtitle="Watch the IB form. At 10:30, classify the open type." />

      <MarketChart day={day} candles={day.ibCandles.slice(0, showCount)} showRefLines />

      {!playbackDone && (
        <div className="my-4 text-center text-sm text-text-secondary font-mono">⏱ Playback in progress · {showCount} / {day.ibCandles.length}</div>
      )}
      {!playbackDone && (
        <div className="flex justify-center mb-4">
          <button type="button" className="btn-secondary" onClick={() => setShowCount(day.ibCandles.length)}>Skip animation</button>
        </div>
      )}

      {playbackDone && (
        <div className="my-6 rounded-xl border border-border-subtle bg-bg-card p-6">
          <h4 className="font-head font-semibold text-lg mb-3">It's 10:30 ET. Classify today's Open Type:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {OPEN_OPTIONS.map((o) => {
              const sel = openTypeAnswer === o
              let cls = 'px-3 py-3 rounded-lg border text-sm font-head font-semibold transition-all '
              cls += sel ? 'border-poc-gold bg-poc-gold/15 text-poc-gold' : 'border-border-subtle bg-bg-elevated hover:border-accent-blue'
              return <button key={o} type="button" onClick={() => setOpenTypeAnswer(o)} className={cls}>{o}</button>
            })}
          </div>
          <div className="mt-5 flex justify-end">
            <button type="button" className="btn-primary disabled:opacity-40" disabled={!openTypeAnswer} onClick={onNext}>Setups phase →</button>
          </div>
        </div>
      )}
    </div>
  )
}

function SetupsPhase({ day, answers, setAnswers, onFinalize }: { day: CapstoneDay, answers: Record<string, 'TAKE' | 'SKIP' | null>, setAnswers: (a: Record<string, 'TAKE' | 'SKIP' | null>) => void, onFinalize: () => void }) {
  const allCandles = [...day.ibCandles, ...day.postIBCandles]
  return (
    <div className="my-8">
      <PhaseHeader phaseLabel="Phase 3 · Setups (11:00 – 2:00)" title="Three setups present themselves" subtitle="Decide TAKE or SKIP for each, based on profile context." />
      <MarketChart day={day} candles={allCandles} showRefLines />

      <div className="my-6 space-y-3">
        {day.setups.map((s, i) => {
          const a = answers[s.id] || null
          return (
            <div key={s.id} className="rounded-xl border border-border-subtle bg-bg-card p-5">
              <div className="flex items-baseline justify-between mb-2">
                <h4 className="font-head font-semibold text-lg">Setup {i + 1}: {s.name}</h4>
                <span className="text-xs text-text-secondary font-mono">{s.highlightPriceMin}–{s.highlightPriceMax}</span>
              </div>
              <p className="text-sm text-text-secondary mb-3">{s.location}</p>
              <div className="grid grid-cols-2 gap-2.5">
                {(['TAKE', 'SKIP'] as const).map((d) => {
                  const sel = a === d
                  let cls = 'px-4 py-3 rounded-lg border font-head font-bold transition-all '
                  cls += sel
                    ? (d === 'TAKE' ? 'border-bull-green bg-bull-green/20 text-bull-green' : 'border-bear-red bg-bear-red/20 text-bear-red')
                    : 'border-border-subtle bg-bg-elevated hover:border-accent-blue'
                  return <button key={d} type="button" onClick={() => setAnswers({ ...answers, [s.id]: d })} className={cls}>{d}</button>
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button type="button" className="btn-primary disabled:opacity-40" disabled={day.setups.some((s) => !answers[s.id])} onClick={onFinalize}>Finalize · See score →</button>
      </div>
    </div>
  )
}

function ScoreBreakdown({ day, score, placements, openTypeAnswer, setupAnswers, onReset }: {
  day: CapstoneDay
  score: SessionScore | undefined
  placements: Record<string, Placement>
  openTypeAnswer: OpenType | null
  setupAnswers: Record<string, 'TAKE' | 'SKIP' | null>
  onReset: () => void
}) {
  if (!score) return null
  const isExcellent = score.finalScore >= 85
  const isGood = score.finalScore >= 70
  const grade = isExcellent ? 'A' : isGood ? 'B' : score.finalScore >= 55 ? 'C' : 'D'

  // Identify weakest area
  const weakAreas: string[] = []
  if (!score.openTypeCorrect) weakAreas.push('Open Type classification — review Lesson 5.')
  if (score.takeSkipCorrect < score.takeSkipTotal) weakAreas.push('Take/Skip decisions — review Lesson 8.')
  if (score.premarketCount < PREMARKET_ITEMS.length) weakAreas.push('Pre-market routine — review Lesson 10.')
  if (score.placementMax > 0 && score.placementScore < score.placementMax) weakAreas.push('Trade placement (entry/stop/T1/T2) — practice with the cheat sheet matrix.')

  return (
    <div className="my-8">
      <PhaseHeader phaseLabel="Phase 5 · Results" title="Session complete" subtitle="Here's how you did." />

      <div className="my-6 rounded-2xl border border-poc-gold/40 bg-gradient-to-br from-bg-card via-bg-card to-poc-gold/5 p-8 text-center">
        <div className="text-7xl font-head font-bold mb-2">
          <span className={isExcellent ? 'text-poc-gold' : isGood ? 'text-hvn-teal' : 'text-lvn-amber'}>{score.finalScore}</span>
          <span className="text-text-muted text-3xl">/100</span>
        </div>
        <div className="text-2xl font-head font-bold mb-1">Grade: {grade}</div>
        <div className="text-sm text-text-secondary">{day.title}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <ScoreCard title="Open Type" value={`${score.openTypeCorrect ? 25 : 0} / 25`} detail={score.openTypeCorrect ? `${day.openType}` : `You guessed ${openTypeAnswer}. Correct: ${day.openType}`} good={score.openTypeCorrect} />
        <ScoreCard title="Take/Skip" value={`${Math.round((score.takeSkipCorrect / score.takeSkipTotal) * 50)} / 50`} detail={`${score.takeSkipCorrect} of ${score.takeSkipTotal} correct`} good={score.takeSkipCorrect === score.takeSkipTotal} />
        <ScoreCard title="Pre-market" value={`${Math.round((score.premarketCount / PREMARKET_ITEMS.length) * 10)} / 10`} detail={`${score.premarketCount} of ${PREMARKET_ITEMS.length} items`} good={score.premarketCount === PREMARKET_ITEMS.length} />
        <ScoreCard
          title="Placement"
          value={score.placementMax > 0 ? `${Math.round((score.placementScore / score.placementMax) * 15)} / 15` : 'N/A'}
          detail={score.placementMax > 0 ? `${score.placementScore} of ${score.placementMax} placement checks` : 'No TAKE setups'}
          good={score.placementMax > 0 && score.placementScore === score.placementMax}
        />
      </div>

      <div className="my-6 rounded-xl border border-border-subtle bg-bg-card p-6">
        <h4 className="font-head font-semibold text-lg mb-3">Setup-by-setup review</h4>
        <ul className="space-y-3">
          {day.setups.map((s) => {
            const ans = setupAnswers[s.id]
            const correct = ans === s.optimal
            const placement = placements[s.id]
            const placementResult = (placement && ans === 'TAKE' && s.idealEntry !== undefined) ? scorePlacement(s, placement) : null
            return (
              <li key={s.id} className={`p-4 rounded-lg border ${correct ? 'border-bull-green/40 bg-bull-green/5' : 'border-bear-red/40 bg-bear-red/5'}`}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-head font-bold">{s.name}</span>
                  <span className={`text-xs font-mono ${correct ? 'text-bull-green' : 'text-bear-red'}`}>
                    {correct ? '✓' : '✗'} You: {ans} · Optimal: {s.optimal}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-1">{s.location}</p>
                <p className="text-sm">{s.rationale}</p>
                {placementResult && (
                  <div className="mt-2 pt-2 border-t border-border-subtle/50">
                    <div className="text-[10px] font-mono uppercase text-text-secondary mb-1">Placement: {placementResult.score}/{placementResult.max}</div>
                    <ul className="text-xs space-y-0.5">
                      {placementResult.notes.map((n, i) => <li key={i} className={n.startsWith('✓') ? 'text-bull-green' : 'text-bear-red/80'}>{n}</li>)}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {weakAreas.length > 0 && (
        <div className="my-6 rounded-xl border border-lvn-amber/40 bg-lvn-amber/5 p-5">
          <h4 className="font-head font-semibold text-lg text-lvn-amber mb-2">Focus areas</h4>
          <ul className="space-y-1 text-sm">
            {weakAreas.map((w, i) => <li key={i}>• {w}</li>)}
          </ul>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button type="button" className="btn-primary" onClick={onReset}>Try another day →</button>
      </div>
    </div>
  )
}

function ScoreCard({ title, value, detail, good }: { title: string, value: string, detail: string, good: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${good ? 'border-bull-green/40 bg-bull-green/5' : 'border-lvn-amber/40 bg-lvn-amber/5'}`}>
      <div className="text-xs font-mono uppercase text-text-secondary mb-1">{title}</div>
      <div className="font-head font-bold text-2xl mb-1">{value}</div>
      <div className="text-xs text-text-secondary">{detail}</div>
    </div>
  )
}

function PhaseHeader({ phaseLabel, title, subtitle }: { phaseLabel: string, title: string, subtitle: string }) {
  return (
    <div className="mb-5">
      <div className="text-xs font-mono uppercase tracking-widest text-poc-gold mb-1">{phaseLabel}</div>
      <h3 className="font-head font-bold text-2xl">{title}</h3>
      <p className="text-sm text-text-secondary">{subtitle}</p>
    </div>
  )
}

function YesterdayReference({ day }: { day: CapstoneDay }) {
  return (
    <div className="my-6 rounded-xl border border-border-subtle bg-bg-elevated p-5">
      <h4 className="font-head font-semibold text-base mb-2">Yesterday's session reference</h4>
      <div className="grid grid-cols-3 gap-3">
        <RefStat label="POC" value={day.ySession.POC} color="text-poc-gold" />
        <RefStat label="VAH" value={day.ySession.VAH} color="text-va-purple" />
        <RefStat label="VAL" value={day.ySession.VAL} color="text-va-purple" />
      </div>
      <div className="mt-3 text-xs text-text-secondary font-mono">
        Naked POCs (prior sessions): {day.ySession.nakedPOCs.join(', ')}
      </div>
    </div>
  )
}

function RefStat({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="text-center">
      <div className="text-xs font-mono text-text-muted uppercase">{label}</div>
      <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
    </div>
  )
}

function MarketChart({ day, candles, showRefLines }: { day: CapstoneDay, candles: { o: number, c: number, h: number, l: number }[], showRefLines: boolean }) {
  const W = 760, H = 380, padX = 16, padY = 18
  const yMin = 28, yMax = 80
  const allCandles = [...day.ibCandles, ...day.postIBCandles]
  const totalSlots = allCandles.length
  const cw = (W - 2 * padX - 90) / totalSlots
  const toPx = (price: number) => padY + (H - 2 * padY) * (1 - (price - yMin) / (yMax - yMin))

  // Compute developing profile from shown candles
  const profile: { p: number, w: number }[] = []
  for (let p = yMin; p <= yMax; p += 2) {
    let w = 0
    candles.forEach((c) => { if (p >= c.l && p <= c.h) w += 4 })
    profile.push({ p, w: Math.min(80, w) })
  }

  return (
    <div className="rounded-xl border border-border-subtle overflow-hidden" style={{ background: palette.bg }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* Profile sidebar */}
        {profile.map((b, i) => (
          <rect key={i} x={padX} y={toPx(b.p) - 3} width={b.w} height={6} fill={palette.hvn} opacity="0.7" rx="1" />
        ))}

        {/* Reference lines */}
        {showRefLines && (
          <g>
            <rect x={padX + 90} y={toPx(day.ySession.VAH)} width={W - padX * 2 - 90} height={toPx(day.ySession.VAL) - toPx(day.ySession.VAH)} fill={palette.purple} opacity="0.1" />
            <line x1={padX + 90} y1={toPx(day.ySession.VAH)} x2={W - padX} y2={toPx(day.ySession.VAH)} stroke={palette.purple} strokeDasharray="3 3" />
            <line x1={padX + 90} y1={toPx(day.ySession.VAL)} x2={W - padX} y2={toPx(day.ySession.VAL)} stroke={palette.purple} strokeDasharray="3 3" />
            <line x1={padX + 90} y1={toPx(day.ySession.POC)} x2={W - padX} y2={toPx(day.ySession.POC)} stroke={palette.poc} strokeWidth="1.4" />
            {day.ySession.nakedPOCs.map((p, i) => (
              <line key={i} x1={padX + 90} y1={toPx(p)} x2={W - padX} y2={toPx(p)} stroke={palette.poc} strokeDasharray="4 4" opacity="0.5" />
            ))}
          </g>
        )}

        {/* 10:30 marker (after IB candles) */}
        <line x1={padX + 90 + day.ibCandles.length * cw} y1={padY} x2={padX + 90 + day.ibCandles.length * cw} y2={H - padY} stroke={palette.poc} strokeDasharray="2 3" opacity="0.5" />

        {/* Candles */}
        {candles.map((c, i) => {
          const cx = padX + 90 + i * cw + cw / 2
          const isBull = c.c >= c.o
          const color = isBull ? palette.bull : palette.bear
          return (
            <g key={i}>
              <line x1={cx} y1={toPx(c.h)} x2={cx} y2={toPx(c.l)} stroke={color} strokeWidth="0.9" />
              <rect x={cx - cw * 0.32} y={toPx(Math.max(c.o, c.c))} width={cw * 0.64} height={Math.max(0.8, Math.abs(toPx(c.o) - toPx(c.c)))} fill={color} />
            </g>
          )
        })}

        {/* Labels */}
        <text x={W - padX} y={toPx(day.ySession.POC) - 2} fill={palette.poc} fontFamily="Space Mono, monospace" fontSize="10" textAnchor="end" fontWeight="700">POC</text>
        <text x={W - padX} y={toPx(day.ySession.VAH) - 2} fill={palette.purple} fontFamily="Space Mono, monospace" fontSize="10" textAnchor="end">VAH</text>
        <text x={W - padX} y={toPx(day.ySession.VAL) + 12} fill={palette.purple} fontFamily="Space Mono, monospace" fontSize="10" textAnchor="end">VAL</text>
      </svg>
    </div>
  )
}
