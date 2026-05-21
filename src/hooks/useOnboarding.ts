import { useLocalStorage } from './useLocalStorage'

export interface OnboardingAnswers {
  completed: boolean
  instrument: 'MES' | 'M2K' | 'Both' | null
  years: string
  leaks: string[]
}

const EMPTY: OnboardingAnswers = {
  completed: false,
  instrument: null,
  years: '',
  leaks: [],
}

export function useOnboarding() {
  const [data, setData, reset] = useLocalStorage<OnboardingAnswers>('vp_onboarding', EMPTY)
  return { onboarding: data, setOnboarding: setData, resetOnboarding: reset }
}
