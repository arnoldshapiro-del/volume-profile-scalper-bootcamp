export interface LessonMeta {
  id: string
  num: number | 'C'
  slug: string
  title: string
  duration: string
  difficulty: 1 | 2 | 3 | 4 | 5
  unlockRequires: string | null
}

export const LESSONS: LessonMeta[] = [
  { id: 'l0', num: 0, slug: 'auction-theory', title: 'Why Volume Profile Works (Auction Theory)', duration: '12 min', difficulty: 1, unlockRequires: null },
  { id: 'l1', num: 1, slug: 'what-volume-profile-is', title: 'What Volume Profile Actually Is', duration: '10 min', difficulty: 1, unlockRequires: 'l0' },
  { id: 'l2', num: 2, slug: 'the-big-three', title: 'The Big Three: POC, VAH, VAL', duration: '15 min', difficulty: 2, unlockRequires: 'l1' },
  { id: 'l3', num: 3, slug: 'hvn-vs-lvn', title: 'HVN vs LVN — Mountains and Valleys', duration: '18 min', difficulty: 2, unlockRequires: 'l2' },
  { id: 'l4', num: 4, slug: 'four-profile-shapes', title: 'The Four Profile Shapes', duration: '20 min', difficulty: 3, unlockRequires: 'l3' },
  { id: 'l5', num: 5, slug: 'initial-balance-open-type', title: 'Initial Balance & Open Type', duration: '18 min', difficulty: 3, unlockRequires: 'l4' },
  { id: 'l6', num: 6, slug: 'naked-pocs', title: 'Naked POCs — Magnetic Targets', duration: '12 min', difficulty: 2, unlockRequires: 'l5' },
  { id: 'l7', num: 7, slug: 'eighty-percent-rule', title: 'The 80% Rule (Value Area Acceptance)', duration: '15 min', difficulty: 3, unlockRequires: 'l6' },
  { id: 'l8', num: 8, slug: 'brooks-h1-h2', title: 'Integrating with Al Brooks H1/H2', duration: '22 min', difficulty: 4, unlockRequires: 'l7' },
  { id: 'l9', num: 9, slug: 'failed-breakout', title: 'The Failed Breakout at Profile Edges', duration: '18 min', difficulty: 4, unlockRequires: 'l8' },
  { id: 'l10', num: 10, slug: 'pre-market-routine', title: 'Your Pre-Market Routine', duration: '15 min', difficulty: 2, unlockRequires: 'l9' },
  { id: 'capstone', num: 'C', slug: 'capstone', title: 'Capstone: Trade the Open Simulator', duration: '30 min', difficulty: 5, unlockRequires: 'l10' },
]

export const TOTAL_LESSONS = LESSONS.length
