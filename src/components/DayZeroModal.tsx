import { useState } from 'react'
import { useOnboarding, type OnboardingAnswers } from '../hooks/useOnboarding'

const LEAKS = [
  { id: 'selection', label: 'Trade selection — taking too many setups' },
  { id: 'stops', label: 'Stops — too tight or too wide' },
  { id: 'targets', label: 'Targets — exiting too early or holding too long' },
  { id: 'daytype', label: 'Day-type misreads — fading trends, joining chops' },
  { id: 'psych', label: 'Psychology — revenge trades, FOMO, fear' },
]

export default function DayZeroModal() {
  const { onboarding, setOnboarding } = useOnboarding()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<OnboardingAnswers>(onboarding)

  if (onboarding.completed) return null

  function update<K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function toggleLeak(id: string) {
    const has = draft.leaks.includes(id)
    update('leaks', has ? draft.leaks.filter((l) => l !== id) : [...draft.leaks, id])
  }

  function finish() {
    setOnboarding({ ...draft, completed: true })
  }

  const canContinue = (
    (step === 0 && !!draft.instrument) ||
    (step === 1 && draft.years.trim().length > 0) ||
    (step === 2 && draft.leaks.length > 0) ||
    step >= 3
  )

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-bg-card border border-border-subtle rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-hvn-teal/20 via-poc-gold/15 to-va-purple/20 px-8 py-6 border-b border-border-subtle">
          <div className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-2">Welcome to the Bootcamp</div>
          <h2 className="font-head text-3xl font-bold">Let's personalize your experience</h2>
          <p className="text-text-secondary text-sm mt-2">3 quick questions. About 30 seconds.</p>
        </div>

        <div className="px-8 py-8 min-h-[280px]">
          {step === 0 && (
            <div>
              <label className="block text-sm font-mono uppercase text-text-secondary mb-4">Question 1 of 3</label>
              <h3 className="font-head text-xl mb-5">What's your primary instrument?</h3>
              <div className="grid grid-cols-3 gap-3">
                {(['MES', 'M2K', 'Both'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update('instrument', opt)}
                    className={`px-4 py-5 rounded-xl border-2 font-head font-bold text-lg transition-all ${
                      draft.instrument === opt
                        ? 'border-poc-gold bg-poc-gold/15 text-poc-gold'
                        : 'border-border-subtle bg-bg-elevated text-text-primary hover:border-accent-blue'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <label className="block text-sm font-mono uppercase text-text-secondary mb-4">Question 2 of 3</label>
              <h3 className="font-head text-xl mb-5">How many years have you been trading futures?</h3>
              <input
                type="text"
                value={draft.years}
                onChange={(e) => update('years', e.target.value)}
                placeholder="e.g. 2, 10+, or 6 months"
                className="w-full px-4 py-3 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary font-mono focus:border-accent-blue focus:outline-none"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-mono uppercase text-text-secondary mb-4">Question 3 of 3</label>
              <h3 className="font-head text-xl mb-2">What's your biggest current trading leak?</h3>
              <p className="text-xs text-text-secondary mb-4">Select all that apply. We'll reference these in Lesson 8.</p>
              <div className="space-y-2">
                {LEAKS.map((leak) => {
                  const checked = draft.leaks.includes(leak.id)
                  return (
                    <button
                      type="button"
                      key={leak.id}
                      onClick={() => toggleLeak(leak.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                        checked
                          ? 'border-hvn-teal bg-hvn-teal/15'
                          : 'border-border-subtle bg-bg-elevated hover:border-accent-blue'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        checked ? 'border-hvn-teal bg-hvn-teal text-bg-base' : 'border-text-muted'
                      }`}>
                        {checked && '✓'}
                      </span>
                      <span className="text-sm">{leak.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="font-head text-2xl mb-3">You're set. Let's begin.</h3>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                Lesson 0 starts with auction theory — the foundation that makes everything else click. About 12 minutes.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-5 border-t border-border-subtle bg-bg-elevated flex justify-between items-center">
          <div className="flex gap-1.5">
            {[0,1,2,3].map((i) => (
              <span key={i} className={`block w-2 h-2 rounded-full ${i === step ? 'bg-poc-gold' : i < step ? 'bg-hvn-teal' : 'bg-border-subtle'}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && step < 3 && (
              <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>Back</button>
            )}
            {step < 3 ? (
              <button
                type="button"
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!canContinue}
                onClick={() => setStep(step + 1)}
              >
                Continue →
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={finish}>Start Lesson 0 →</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
