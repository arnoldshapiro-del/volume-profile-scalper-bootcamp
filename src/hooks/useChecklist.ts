import { useLocalStorage } from './useLocalStorage'

export interface ChecklistState {
  items: Record<string, boolean>
  customAdditions: string[]
}

const EMPTY: ChecklistState = { items: {}, customAdditions: [] }

export function useChecklist() {
  const [checklist, setChecklist, reset] = useLocalStorage<ChecklistState>('vp_checklist', EMPTY)
  return { checklist, setChecklist, resetChecklist: reset }
}
