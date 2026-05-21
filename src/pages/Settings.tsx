import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { useOnboarding } from '../hooks/useOnboarding'
import { useChecklist } from '../hooks/useChecklist'
import { useStreak } from '../hooks/useStreak'

const RESET_KEYS = ['vp_progress', 'vp_onboarding', 'vp_checklist', 'vp_streak', 'vp_capstone_scores']

export default function Settings() {
  const { resetProgress, completedCount, progressPct } = useProgress()
  const { onboarding, resetOnboarding } = useOnboarding()
  const { resetChecklist } = useChecklist()
  const { streak, resetStreak } = useStreak()
  const [confirm, setConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  function doReset() {
    resetProgress()
    resetOnboarding()
    resetChecklist()
    resetStreak()
    // Belt + suspenders
    RESET_KEYS.forEach((k) => { try { localStorage.removeItem(k) } catch {} })
    setDone(true)
    setConfirm(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-head text-4xl font-bold mb-2">Settings</h1>
      <p className="text-text-secondary mb-8">Your bootcamp data lives in this browser. No accounts, no cloud.</p>

      <section className="card mb-4">
        <h2 className="font-head font-bold text-xl mb-3">Your stats</h2>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat label="Lessons complete" value={`${completedCount} / 12`} />
          <Stat label="Progress" value={`${progressPct}%`} />
          <Stat label="Day streak" value={`${streak.count}`} />
          <Stat label="Instrument" value={onboarding.instrument || '—'} />
          <Stat label="Years" value={onboarding.years || '—'} />
          <Stat label="Leaks tracked" value={onboarding.leaks?.length?.toString() || '0'} />
        </dl>
      </section>

      <section className="card mb-4">
        <h2 className="font-head font-bold text-xl mb-3">Data export</h2>
        <p className="text-sm text-text-secondary mb-3">All your progress is stored as JSON in your browser's localStorage. To back it up: open DevTools → Application → Local Storage → copy the values for keys starting with <code className="font-mono text-poc-gold">vp_</code>.</p>
        <button type="button" className="btn-secondary" onClick={() => {
          const dump: Record<string, unknown> = {}
          RESET_KEYS.forEach((k) => { try { const v = localStorage.getItem(k); if (v) dump[k] = JSON.parse(v) } catch {} })
          const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href = url; a.download = `vp-bootcamp-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click()
          URL.revokeObjectURL(url)
        }}>⬇ Download backup JSON</button>
      </section>

      <section className="card mb-4 border-bear-red/40">
        <h2 className="font-head font-bold text-xl mb-3 text-bear-red">Reset all data</h2>
        <p className="text-sm text-text-secondary mb-4">
          Wipes your progress, onboarding answers, pre-market checklist, day streak, and Capstone scores. You'll start fresh with Lesson 0 unlocked and the Day 0 modal reappearing. <strong className="text-text-primary">This cannot be undone.</strong>
        </p>
        {!confirm && !done && (
          <button type="button" className="px-5 py-2.5 rounded-lg font-head font-semibold border border-bear-red/60 bg-bear-red/10 text-bear-red hover:bg-bear-red/20 transition-all" onClick={() => setConfirm(true)}>
            Reset everything
          </button>
        )}
        {confirm && !done && (
          <div className="rounded-lg border border-bear-red/60 bg-bear-red/10 p-4">
            <p className="text-sm mb-3 font-head font-semibold">Are you sure? This is irreversible.</p>
            <div className="flex gap-2">
              <button type="button" className="px-4 py-2 rounded-lg font-head font-semibold bg-bear-red text-white hover:bg-bear-red/80" onClick={doReset}>Yes, reset</button>
              <button type="button" className="btn-secondary" onClick={() => setConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
        {done && (
          <div className="rounded-lg border border-bull-green/60 bg-bull-green/10 p-4">
            <p className="text-sm mb-3 text-bull-green">✓ All data cleared. Go to the dashboard to start fresh.</p>
            <button type="button" className="btn-primary" onClick={() => navigate('/')}>Back to dashboard →</button>
          </div>
        )}
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-wider text-text-muted">{label}</div>
      <div className="text-xl font-head font-bold mt-1">{value}</div>
    </div>
  )
}
