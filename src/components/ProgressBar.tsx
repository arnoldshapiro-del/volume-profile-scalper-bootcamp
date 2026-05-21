import { useProgress } from '../hooks/useProgress'

export default function ProgressBar() {
  const { progressPct } = useProgress()
  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-bg-elevated">
      <div
        className="h-full bg-gradient-to-r from-hvn-teal to-poc-gold transition-all duration-500 ease-out"
        style={{ width: `${progressPct}%` }}
        aria-label={`${progressPct}% of bootcamp complete`}
      />
    </div>
  )
}
