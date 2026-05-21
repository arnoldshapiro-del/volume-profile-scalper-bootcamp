import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import Hook from '../components/Hook'
import Concept from '../components/Concept'
import FatalMistake from '../components/FatalMistake'
import PracticalTakeaway from '../components/PracticalTakeaway'
import ChartCaption from '../components/ChartCaption'
import Quiz from '../components/Quiz'
import BrooksSameSetupTwoDays from '../components/charts/BrooksSameSetupTwoDays'
import TakeSkipMatrix from '../components/charts/TakeSkipMatrix'
import TakeItOrSkipIt from '../components/interactives/TakeItOrSkipIt'
import { useProgress } from '../hooks/useProgress'
import { useOnboarding } from '../hooks/useOnboarding'

const LEAK_HINTS: Record<string, string> = {
  selection: 'Use the 3-step context check before EVERY entry. It directly attacks trade selection.',
  stops: "When taking H2 at structure, stop sits just past the HVN. If your stop is wider than the HVN's edge, the trade isn't really at structure.",
  targets: 'Naked POCs and opposite VA edges are your T1/T2. Stop hoping; start using profile-derived targets.',
  daytype: 'The take/skip filter is a day-type defense. On trend days, breakouts into HVN flip to TAKE (continuation).',
  psych: 'The 5-second context check forces a pause. Pause kills impulse. Use it as a circuit-breaker.',
}

const QUESTIONS = [
  {
    id: 'Q8.1', prompt: "An H2 long at yesterday's VAL is a:",
    options: ['Low-conviction setup', 'High-conviction setup (bouncing off institutional floor)', 'Setup to fade', 'Trend continuation only'],
    correctIndex: 1,
    explanation: 'VAL = the floor of institutional value. H2 confirms buyers are stepping in. The two align — take with conviction.',
  },
  {
    id: 'Q8.2', prompt: 'A clean H2 long in the middle of an LVN with no nearby HVN below is:',
    options: ['A high-conviction take', "A skip — there's no structure to bounce off", 'A mean reversion trade', 'A trend day setup'],
    correctIndex: 1,
    explanation: 'The chart says yes, the profile says nothing. No floor = no edge. Skip every time.',
  },
  {
    id: 'Q8.3', prompt: 'A bull flag breakout above a naked POC is:',
    options: ['Momentum heading into a magnet — high conviction', 'Low probability', 'Identical to any other bull flag', 'A setup to fade'],
    correctIndex: 0,
    explanation: 'The flag gives you the entry, the naked POC gives you the magnet. Two edges in alignment.',
  },
  {
    id: 'Q8.4', prompt: 'The 5-second context check is:',
    options: ['Optional and rarely worth doing', 'Identify setup → ask where on profile → take if at structure, skip if in vacuum', 'A complex multi-step routine', 'Replaces price action analysis'],
    correctIndex: 1,
    explanation: '5 seconds, 3 steps. Costs nothing. Filters dramatically.',
  },
  {
    id: 'Q8.5', prompt: 'A breakout INTO an HVN is generally:',
    options: ['High conviction continuation', 'Low conviction — likely to chop and reverse at the HVN', 'The best setup possible', 'Identical to a breakout into an LVN'],
    correctIndex: 1,
    explanation: 'Breakouts THROUGH HVNs are rare; breakouts INTO them usually stall and reverse. Different direction, different trade.',
  },
]

export default function Lesson8() {
  const { completeLesson } = useProgress()
  const { onboarding } = useOnboarding()
  const primaryLeak = onboarding.leaks?.[0]
  const leakHint = primaryLeak ? LEAK_HINTS[primaryLeak] : null

  return (
    <LessonLayout lessonId="l8" glossaryTerms={['HVN', 'LVN', 'POC', 'VAH', 'VAL', 'Naked POC']}>
      <PromiseCallout>
        By the end of this lesson, you'll know which of your Brooks H1/H2 setups to take with full conviction — and which to skip without hesitation.
      </PromiseCallout>

      <Hook>
        You already see the H1s and H2s. You already see the bull flags and bear flags. The problem isn't recognizing setups. The problem is taking too many of them. Volume Profile is the filter. Same H2 setup, two different days: at yesterday's VAL it's a layup; in the middle of a vacuum it's a bleed. The chart looks identical. The profile context tells you which is which.
      </Hook>

      {leakHint && (
        <div className="my-6 rounded-xl border border-accent-blue/40 bg-accent-blue/5 p-4">
          <div className="text-xs uppercase tracking-wider text-accent-blue font-mono font-bold mb-1.5">For your stated leak</div>
          <p className="text-sm">{leakHint}</p>
        </div>
      )}

      <Concept num={1} title="The Thesis.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Price action = WHAT is happening (the trigger).</li>
          <li>Volume Profile = WHERE it's happening (the context).</li>
          <li>A great trader needs both: the WHAT to enter, the WHERE to filter.</li>
          <li>This single integration is the difference between a 40% win rate and a 60% win rate on identical setups.</li>
        </ul>
      </Concept>

      <figure>
        <BrooksSameSetupTwoDays />
        <ChartCaption id="Chart 8.1">Same Setup, Two Days — identical H2, completely different trades.</ChartCaption>
      </figure>

      <Concept num={2} title="High-Conviction Integrations (TAKE).">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>H2 long at yesterday's <span className="text-va-purple">VAL</span> = bouncing off institutional floor.</li>
          <li>H2 long at yesterday's <span className="text-poc-gold">POC</span> = bouncing off magnetic center.</li>
          <li>H2 short at yesterday's <span className="text-va-purple">VAH</span> = rejecting institutional ceiling.</li>
          <li>Bull flag breakout above a <span className="text-poc-gold">naked POC</span> = momentum into a magnet.</li>
          <li>Bear flag breakdown into an <span className="text-lvn-amber">LVN</span> = momentum into a vacuum.</li>
          <li>Double bottom at an <span className="text-hvn-teal">HVN</span> = institutional buying confirmed.</li>
        </ul>
      </Concept>

      <Concept num={3} title="Low-Conviction Setups (SKIP).">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>H2 long inside an LVN with no nearby HVN below = no floor to bounce off.</li>
          <li>Breakout INTO an HVN = price will hit institutional defense and chop/reverse.</li>
          <li>Flag pointing into a vacuum with no profile structure = no target, no friction.</li>
          <li>Brooks signal in the middle of nowhere on the profile = "the chart says yes, the profile says nothing."</li>
        </ul>
      </Concept>

      <figure>
        <TakeSkipMatrix />
        <ChartCaption id="Chart 8.2">Take-It-or-Skip-It Matrix — Brooks setup × profile context.</ChartCaption>
      </figure>

      <Concept num={4} title="The Three-Step Context Check.">
        <ol className="list-decimal list-outside ml-5 space-y-1.5">
          <li>Identify the Brooks setup (H1/H2/flag/double bottom etc.).</li>
          <li>Ask where it sits on the profile (HVN/POC/VAH/VAL/LVN/no-mans-land).</li>
          <li>Take if at structure (HVN/POC/VAH/VAL); skip if in vacuum.</li>
        </ol>
        <p className="text-sm text-text-secondary mt-2">Do this in 5 seconds before every entry. It costs you nothing and saves you everything.</p>
      </Concept>

      <FatalMistake>
        Taking a clean Brooks setup that happens to be in a vacuum. The Brooks pattern is real. The profile is empty around it. There's nothing to bounce off, no level to defend, no magnet to pull. The trade has no edge — just a pretty chart. Skip every single time.
      </FatalMistake>

      <TakeItOrSkipIt />

      <h2 className="font-head font-bold text-2xl mt-12 mb-2">Knowledge Check</h2>
      <Quiz questions={QUESTIONS} onComplete={(score) => completeLesson('l8', score)} />

      <PracticalTakeaway>
        For the next 10 trading days, before every Brooks-based entry, screenshot the chart and write down: (1) the setup name, (2) where it sits on the profile, (3) take or skip per the matrix. Log the outcome. Within two weeks, the filter becomes automatic — and your win rate will reflect it.
      </PracticalTakeaway>
    </LessonLayout>
  )
}
