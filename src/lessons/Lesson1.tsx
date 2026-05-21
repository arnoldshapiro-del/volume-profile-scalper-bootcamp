import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import Hook from '../components/Hook'
import Concept from '../components/Concept'
import FatalMistake from '../components/FatalMistake'
import PracticalTakeaway from '../components/PracticalTakeaway'
import ChartCaption from '../components/ChartCaption'
import Quiz from '../components/Quiz'
import SameDataTwoViews from '../components/charts/SameDataTwoViews'
import AnatomyOfProfile from '../components/charts/AnatomyOfProfile'
import ToggleTheLens from '../components/interactives/ToggleTheLens'
import { useProgress } from '../hooks/useProgress'
import { useOnboarding } from '../hooks/useOnboarding'

const QUESTIONS = [
  {
    id: 'Q1.1', prompt: 'Each horizontal bar in a Volume Profile represents:',
    options: ['Time spent at that price', 'Total contracts traded at that price', 'The number of buy orders only', 'Price volatility at that level'],
    correctIndex: 1,
    explanation: 'Bars count buys + sells combined. One contract = one buyer + one seller = one transaction tallied.',
  },
  {
    id: 'Q1.2', prompt: 'The longest horizontal bar on a Volume Profile is called:',
    options: ['The High of Day', 'The Volume Weighted Average Price', 'The Point of Control', 'The Initial Balance'],
    correctIndex: 2,
    explanation: 'POC = the single price level with the most accumulated volume. The market\'s center of gravity for the period.',
  },
  {
    id: 'Q1.3', prompt: 'Compared to a moving average, Volume Profile is:',
    options: ['More accurate', 'Faster to calculate', 'Showing different information (volume at price vs price over time)', 'Less reliable'],
    correctIndex: 2,
    explanation: 'Different lens entirely. MA = average of prior closes. VP = where transactions actually occurred.',
  },
  {
    id: 'Q1.4', prompt: 'Volume Profile is best used as:',
    options: ['An entry trigger', 'A standalone trading system', 'A context layer for other setups', 'A replacement for price action'],
    correctIndex: 2,
    explanation: 'It tells you WHERE to trust setups, not WHEN to enter. Price action remains the trigger.',
  },
  {
    id: 'Q1.5', prompt: 'What can Volume Profile NOT do?',
    options: ['Show where institutions have defended positions', 'Predict the next price move', 'Identify high-conviction levels', 'Reveal market structure'],
    correctIndex: 1,
    explanation: 'It shows history. It doesn\'t predict. It improves your read of context — the prediction is still your job.',
  },
]

export default function Lesson1() {
  const { completeLesson } = useProgress()
  const { onboarding } = useOnboarding()
  const instrument = onboarding.instrument || 'MES'

  return (
    <LessonLayout lessonId="l1" glossaryTerms={['POC', 'HVN', 'LVN', 'Value Area', 'Auction Theory']}>
      <PromiseCallout>
        By the end of this lesson, you will understand exactly what Volume Profile shows — and what makes it fundamentally different from every indicator you've used before.
      </PromiseCallout>

      <Hook>
        Moving averages tell you where price was on average. Trend lines tell you where price might be heading. Volume Profile tells you where real money was actually spent. It's the only chart tool built from objective truth — not math derived from prices. It's a receipt.
      </Hook>

      <Concept num={1} title="Vertical Volume vs. Horizontal Volume.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Standard volume bars (bottom of chart): how many contracts traded <em>per time period</em>.</li>
          <li>Volume Profile (side of chart): how many contracts traded <em>per price level</em>.</li>
          <li>Same data, rotated 90 degrees. Reveals completely different information.</li>
        </ul>
      </Concept>

      <figure>
        <SameDataTwoViews />
        <ChartCaption id="Chart 1.1">Same Data, Two Views — volume per time on the left, volume per price on the right.</ChartCaption>
      </figure>

      <Concept num={2} title="What the bars actually count.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Each horizontal bar = total contracts exchanged at that specific price (buys + sells combined as one transaction).</li>
          <li>The longest bar = the price with the most volume = the Point of Control.</li>
          <li>Lengths are proportional and scale automatically.</li>
        </ul>
      </Concept>

      <Concept num={3} title="What it answers that nothing else does.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>"Where did the most money trade today?" → <span className="text-poc-gold">POC</span></li>
          <li>"Where do institutions have positions to defend?" → <span className="text-hvn-teal">HVN clusters</span></li>
          <li>"Where will price likely struggle vs. accelerate?" → <span className="text-hvn-teal">HVN</span> vs <span className="text-lvn-amber">LVN</span></li>
          <li>"Where is current price relative to yesterday's value?" → above / in / below</li>
        </ul>
      </Concept>

      <figure>
        <AnatomyOfProfile />
        <ChartCaption id="Chart 1.2">Anatomy of a Volume Profile — POC in gold, HVN in teal, LVN in amber.</ChartCaption>
      </figure>

      <Concept num={4} title="What it does NOT do.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Doesn't predict direction.</li>
          <li>Doesn't tell you when to enter.</li>
          <li>Doesn't replace price action analysis.</li>
          <li>It's a CONTEXT layer, not an entry signal.</li>
        </ul>
      </Concept>

      <FatalMistake>
        Using Volume Profile alone for entries. It is a location tool, not a trigger tool. Your Brooks H1/H2 setup gives you the trigger. Volume Profile tells you whether to trust it.
      </FatalMistake>

      <ToggleTheLens />

      <h2 className="font-head font-bold text-2xl mt-12 mb-2">Knowledge Check</h2>
      <p className="text-text-secondary text-sm mb-2">Five questions. 3 of 5 to advance.</p>

      <Quiz questions={QUESTIONS} onComplete={(score) => completeLesson('l1', score)} />

      <PracticalTakeaway>
        Tomorrow before market open, in NinjaTrader, turn on Volume Profile if it isn't already on. Just look at yesterday's session profile on {instrument}. Find the longest bar (POC). Don't trade. Just notice where it is relative to today's pre-market price. Notice how price reacts when it approaches that level during the open.
      </PracticalTakeaway>
    </LessonLayout>
  )
}
