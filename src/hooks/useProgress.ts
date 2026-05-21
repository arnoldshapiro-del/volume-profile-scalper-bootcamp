import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { LESSONS } from '../data/lessons'

export interface LessonProgress {
  completed: boolean
  quiz_score: number
  completed_at: number | null
}

export type ProgressMap = Record<string, LessonProgress>

const EMPTY: ProgressMap = {}

export function useProgress() {
  const [progress, setProgress, reset] = useLocalStorage<ProgressMap>('vp_progress', EMPTY)

  const isCompleted = useCallback((id: string) => !!progress[id]?.completed, [progress])

  const isUnlocked = useCallback((id: string) => {
    const lesson = LESSONS.find((l) => l.id === id)
    if (!lesson) return false
    if (!lesson.unlockRequires) return true
    return !!progress[lesson.unlockRequires]?.completed
  }, [progress])

  const completeLesson = useCallback((id: string, quizScore: number) => {
    setProgress((p) => ({
      ...p,
      [id]: { completed: true, quiz_score: quizScore, completed_at: Date.now() },
    }))
  }, [setProgress])

  const completedCount = Object.values(progress).filter((p) => p.completed).length
  const progressPct = Math.round((completedCount / LESSONS.length) * 100)

  return { progress, isCompleted, isUnlocked, completeLesson, completedCount, progressPct, resetProgress: reset }
}
