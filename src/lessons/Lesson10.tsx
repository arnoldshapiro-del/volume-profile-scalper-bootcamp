import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import Hook from '../components/Hook'
import Concept from '../components/Concept'
import FatalMistake from '../components/FatalMistake'
import PracticalTakeaway from '../components/PracticalTakeaway'
import ChartCaption from '../components/ChartCaption'
import Quiz from '../components/Quiz'
import PreMarketMap from '../components/charts/PreMarketMap'
import DayInThreePhases from '../components/charts/DayInThreePhases'
import BuildChecklist from '../components/interactives/BuildChecklist'
import { useProgress } from '../hooks/useProgress'
import { useChecklist } from '../hooks/useChecklist'

const QUESTIONS = [
  {
    id: 'Q10.1', prompt: 'The single most important pre-market task is:',
    options: ['Reading the news', "Marking yesterday's POC, VAH, VAL and extending them across today", 'Checking other markets', "Reviewing yesterday's trades"],
    correctIndex: 1,
    explanation: 'This one habit gives you a complete map for the day. Everything else is supplemental.',
  },
  {
    id: 'Q10.2', prompt: 'At 10:30 AM ET, you should:',
    options: ['Take your first trade no matter what', 'Confirm IB high/low, classify Open Type, and assess developing profile shape', 'Stop trading', 'Switch instruments'],
    correctIndex: 1,
    explanation: '10:30 = the day-character read. Three quick reads (IB, Open Type, shape) tell you what day this is.',
  },
  {
    id: 'Q10.3', prompt: 'A personalized checklist beats a generic one because:',
    options: ["It's easier", "You'll actually use it", "It's shorter", 'It includes more items'],
    correctIndex: 1,
    explanation: 'Ownership drives adherence. A checklist YOU built reflects YOUR trading style and gets run; a generic one gets skipped.',
  },
  {
    id: 'Q10.4', prompt: 'The mornings you most want to skip the routine are:',
    options: ['Slow news days', 'The mornings you most need it', 'Trend days', 'Friday mornings'],
    correctIndex: 1,
    explanation: 'Choppy, news-driven, or "I\'m tired" mornings are exactly when discipline matters most. Skip never.',
  },
  {
    id: 'Q10.5', prompt: "The end-of-day review's main purpose is:",
    options: ['Calculating P&L', "Setting up tomorrow's pre-market map (today's POC/VAH/VAL + new naked POCs + new LVNs)", 'Reviewing trade journal entries', 'Updating broker statements'],
    correctIndex: 1,
    explanation: "Today's structure becomes tomorrow's reference. 2 minutes at the close = 5 minutes of head start before the next bell.",
  },
]

export default function Lesson10() {
  const { completeLesson } = useProgress()
  const { checklist } = useChecklist()
  const selectedCount = Object.values(checklist.items).filter(Boolean).length + checklist.customAdditions.length

  return (
    <LessonLayout lessonId="l10" glossaryTerms={['POC', 'VAH', 'VAL', 'Naked POC', 'Initial Balance', 'HVN', 'LVN']}>
      <PromiseCallout>
        By the end of this lesson, you will have a personalized 5-minute pre-market routine saved to this app — and a plan for the trading day before the bell rings.
      </PromiseCallout>

      <Hook>
        Discretionary traders who skip pre-market preparation are flying without instruments. Five minutes of profile prep is worth more than five hours of intra-day reaction. Today you build your own checklist — the same one you'll run every morning at 9:25 ET for the rest of your career.
      </Hook>

      {selectedCount > 0 && (
        <div className="my-6 rounded-xl border border-hvn-teal/40 bg-hvn-teal/10 p-4">
          <div className="text-xs uppercase tracking-wider text-hvn-teal font-mono font-bold mb-1.5">Your saved checklist</div>
          <p className="text-sm">{selectedCount} items committed. Scroll down to refine.</p>
        </div>
      )}

      <Concept num={1} title="The Pre-Market 5-Minute Checklist.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Mark yesterday's Big Three (POC, VAH, VAL) and extend them across today's chart.</li>
          <li>Identify all naked POCs from the past 5–10 sessions and extend them.</li>
          <li>Note HVN clusters above and below current pre-market price.</li>
          <li>Note LVN voids above and below current pre-market price.</li>
          <li>Define your bias: above / in / below yesterday's value area.</li>
          <li>Pre-define entries: which Brooks setups would you take at each key level.</li>
          <li>Pre-define no-trade zones: which areas are vacuums where you'll stay flat.</li>
        </ul>
      </Concept>

      <figure>
        <PreMarketMap />
        <ChartCaption id="Chart 10.1">The Pre-Market Map — everything in one glance.</ChartCaption>
      </figure>

      <Concept num={2} title="The 10:30 AM Day-Character Read.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>IB high/low established — note the range width.</li>
          <li>Open Type confirmed — Open Drive / Test Drive / Rejection Reverse / Auction.</li>
          <li>Developing profile shape — D, P, b, or trend.</li>
          <li>Adjust day plan: trend day = join only, balance day = fade extremes, exhaustion shape = fade the tail.</li>
        </ul>
      </Concept>

      <Concept num={3} title="The End-of-Day Review.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Mark today's POC, VAH, VAL on the chart (these become tomorrow's reference).</li>
          <li>Note new naked POCs created today.</li>
          <li>Note new LVN voids created today.</li>
          <li>Plan tomorrow's first hour: which levels matter? What's your bias above/in/below?</li>
        </ul>
      </Concept>

      <figure>
        <DayInThreePhases />
        <ChartCaption id="Chart 10.2">The Day in Three Phases — pre-market, open, post-IB.</ChartCaption>
      </figure>

      <Concept num={4} title="Personalization Beats Discipline.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>A checklist you wrote yourself, that reflects your trading style and your instruments, will be used.</li>
          <li>A generic checklist will be skipped on busy mornings.</li>
          <li>This lesson's interactive lets you build YOUR version — and saves it to the app for daily reference.</li>
        </ul>
      </Concept>

      <FatalMistake>
        Skipping prep on "quick" days. The mornings you most want to skip the routine are the mornings you most need it — choppy or news-driven days. Five minutes of structure is the only thing standing between you and revenge trading.
      </FatalMistake>

      <BuildChecklist />

      <h2 className="font-head font-bold text-2xl mt-12 mb-2">Knowledge Check</h2>
      <Quiz questions={QUESTIONS} onComplete={(score) => completeLesson('l10', score)} />

      <PracticalTakeaway>
        Save the checklist you built in this lesson's interactive. Print it. Tape it to your monitor. Run it at 9:25 AM ET every day for the next 30 trading days. The skill being built is not the checklist itself — it's the muscle memory of preparation.
      </PracticalTakeaway>
    </LessonLayout>
  )
}
