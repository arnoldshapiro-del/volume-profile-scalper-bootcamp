import { useState } from 'react'

type Decision = 'TAKE' | 'SKIP'

interface Scenario {
  id: number
  setup: string
  context: string
  decision: Decision
  rationale: string
}

const SCENARIOS: Scenario[] = [
  { id: 1, setup: 'H2 long', context: "at yesterday's VAL", decision: 'TAKE', rationale: 'Institutional floor + H2 confirmation = layup.' },
  { id: 2, setup: 'H2 long', context: 'inside an LVN, no nearby HVN below', decision: 'SKIP', rationale: 'No structure to bounce off. Pretty chart, empty profile.' },
  { id: 3, setup: 'Bull flag', context: 'pointing into a naked POC above', decision: 'TAKE', rationale: 'Momentum into a magnet. Two edges aligned.' },
  { id: 4, setup: 'Bear flag', context: 'breaking down into an LVN', decision: 'TAKE', rationale: 'Vacuum + bear flag = momentum trade with built-in target at next HVN.' },
  { id: 5, setup: 'Double bottom', context: 'at an HVN cluster', decision: 'TAKE', rationale: 'Institutional buying confirmed at the structure level.' },
  { id: 6, setup: 'H2 short', context: 'inside no-mans-land between HVNs', decision: 'SKIP', rationale: "Chart looks fine but the profile shows nothing meaningful around the level. No edge." },
  { id: 7, setup: 'Bull flag', context: 'breakout INTO a major HVN above', decision: 'SKIP', rationale: 'Breakouts INTO HVNs typically stall and reverse — defense is dense.' },
  { id: 8, setup: 'H2 short', context: "at yesterday's VAH", decision: 'TAKE', rationale: "Institutional ceiling + H2 = high conviction." },
  { id: 9, setup: 'H2 long', context: "at yesterday's POC", decision: 'TAKE', rationale: 'Bouncing off the magnetic center — high conviction.' },
  { id: 10, setup: 'Double top', context: 'inside an LVN', decision: 'SKIP', rationale: 'No prior agreement at that level. The pattern is real, the location is empty.' },
]

export default function TakeItOrSkipIt() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(Decision | null)[]>(Array(SCENARIOS.length).fill(null))
  const [revealed, setRevealed] = useState<boolean[]>(Array(SCENARIOS.length).fill(false))
  const s = SCENARIOS[idx]

  function pick(d: Decision) {
    if (revealed[idx]) return
    const a = [...answers]; a[idx] = d; setAnswers(a)
    const r = [...revealed]; r[idx] = true; setRevealed(r)
  }
  const score = revealed.reduce((acc, r, i) => acc + (r && answers[i] === SCENARIOS[i].decision ? 1 : 0), 0)

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h4 className="font-head font-semibold text-xl">Interactive · Take It or Skip It</h4>
        <span className="text-xs font-mono text-text-secondary">{idx + 1} / {SCENARIOS.length} · pass 8/10</span>
      </div>

      <div className="rounded-lg bg-bg-elevated border border-border-subtle p-5 mb-4">
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-2">Scenario {idx + 1}</div>
        <div className="font-head text-2xl text-text-primary leading-tight mb-1">{s.setup}</div>
        <div className="text-text-secondary text-sm">{s.context}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {(['TAKE', 'SKIP'] as Decision[]).map((d) => {
          const sel = answers[idx] === d
          const correct = revealed[idx] && d === s.decision
          const wrong = revealed[idx] && sel && d !== s.decision
          let cls = 'px-5 py-4 rounded-lg border-2 font-head font-bold text-base transition-all '
          if (correct) cls += 'border-bull-green bg-bull-green/20 text-bull-green'
          else if (wrong) cls += 'border-bear-red bg-bear-red/20 text-bear-red animate-shake'
          else cls += 'border-border-subtle bg-bg-elevated text-text-primary hover:border-accent-blue'
          return <button key={d} type="button" disabled={revealed[idx]} onClick={() => pick(d)} className={cls}>{d}</button>
        })}
      </div>

      {revealed[idx] && (
        <div className="p-3 rounded-lg bg-bg-elevated border border-border-subtle mb-3">
          <div className="text-xs font-mono uppercase mb-1 text-text-secondary">Answer: <span className="text-poc-gold">{s.decision}</span></div>
          <p className="text-sm">{s.rationale}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-text-secondary">
          Score: <span className="text-poc-gold font-bold">{score}</span> / {SCENARIOS.length} {revealed.every(Boolean) && score >= 8 && <span className="text-bull-green ml-2">✓ Passed</span>}
        </div>
        <div className="flex gap-2">
          {revealed[idx] && idx < SCENARIOS.length - 1 && <button className="btn-primary" onClick={() => setIdx(idx + 1)}>Next →</button>}
        </div>
      </div>
    </div>
  )
}
