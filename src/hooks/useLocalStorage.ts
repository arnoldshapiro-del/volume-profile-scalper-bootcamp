import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return initial
      return JSON.parse(raw) as T
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch { /* quota exceeded — silent */ }
  }, [key, value])

  const reset = useCallback(() => {
    try { localStorage.removeItem(key) } catch { /* ignore */ }
    setValue(initial)
  }, [key, initial])

  return [value, setValue, reset] as const
}
