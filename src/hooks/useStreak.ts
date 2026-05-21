import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

interface StreakState {
  count: number
  lastVisit: string | null  // YYYY-MM-DD
}

const EMPTY: StreakState = { count: 0, lastVisit: null }

function ymd(d: Date) {
  return d.toISOString().slice(0, 10)
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime()
  return Math.round(ms / (24 * 60 * 60 * 1000))
}

export function useStreak() {
  const [streak, setStreak, reset] = useLocalStorage<StreakState>('vp_streak', EMPTY)

  useEffect(() => {
    const today = ymd(new Date())
    if (streak.lastVisit === today) return
    if (!streak.lastVisit) {
      setStreak({ count: 1, lastVisit: today })
      return
    }
    const delta = daysBetween(streak.lastVisit, today)
    if (delta === 1) setStreak({ count: streak.count + 1, lastVisit: today })
    else if (delta > 1) setStreak({ count: 1, lastVisit: today })
    // delta < 1 (clock skew) — leave alone
  }, [streak.lastVisit, streak.count, setStreak])

  return { streak, resetStreak: reset }
}
