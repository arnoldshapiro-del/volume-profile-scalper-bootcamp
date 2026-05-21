import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import Hook from '../components/Hook'
import Concept from '../components/Concept'
import FatalMistake from '../components/FatalMistake'
import PracticalTakeaway from '../components/PracticalTakeaway'
import ChartCaption from '../components/ChartCaption'
import Quiz from '../components/Quiz'
import FourShapesGrid from '../components/charts/FourShapesGrid'
import TailIsTrade from '../components/charts/TailIsTrade'
import ShapeSorter from '../components/interactives/ShapeSorter'
import { useProgress } from '../hooks/useProgress'

const QUESTIONS = [
  {
    id: 'Q4.1', prompt: 'A symmetrical bell-shaped profile with POC in the middle indicates:',
    options: ['A trend day', 'A balanced (D-shape) day, mean reversion bias', 'Short covering', 'Long liquidation'],
    correctIndex: 1,
    explanation: 'Bell shape = market found fair value early. Both sides agree. Fade extremes, target POC.',
  },
  {
    id: 'Q4.2', prompt: 'A P-shape profile (heavy bottom, thin tail up) suggests:',
    options: ['Strong continuation higher', 'Short covering exhaustion — look for shorts at the top of the tail', 'A trend day in progress', 'Imminent crash'],
    correctIndex: 1,
    explanation: 'The tail is where buyers had to chase. Once chasing stops, price returns to the heavy node.',
  },
  {
    id: 'Q4.3', prompt: 'On a trend day, your strategy should be:',
    options: ["Fade the extreme — it's gone too far", 'Sit out completely', 'Join the trend on pullbacks to developing POC', 'Average down on counter-trend positions'],
    correctIndex: 2,
    explanation: "Trend days don't mean revert. Join or stand aside. Never fade.",
  },
  {
    id: 'Q4.4', prompt: 'A b-shape profile (heavy top, thin tail down) suggests:',
    options: ['Long liquidation exhaustion — look for longs at the bottom of the tail', 'Strong continuation lower', 'A balanced day', 'Indecision'],
    correctIndex: 0,
    explanation: 'The tail is the puke zone. Sellers are exhausted there. The top HVN is real resistance, but the bottom of the tail is the bounce trade.',
  },
  {
    id: 'Q4.5', prompt: 'What is the cardinal sin when trading a trend day?',
    options: ['Joining too early', 'Fading because price "has gone too far"', 'Using a stop loss', 'Targeting the POC'],
    correctIndex: 1,
    explanation: 'Trend days are imbalance all day. There is no "too far." Fading them is account suicide.',
  },
]

export default function Lesson4() {
  const { completeLesson } = useProgress()

  return (
    <LessonLayout lessonId="l4" glossaryTerms={['D-Shape', 'P-Shape', 'b-Shape', 'Trend Day', 'POC']}>
      <PromiseCallout>
        By the end of this lesson, you'll glance at a developing profile and instantly classify it — and know which approach (fade vs. follow) the day requires.
      </PromiseCallout>

      <Hook>
        Every trading day leaves a fingerprint. By 11 AM, the profile is already telling you what kind of day this is — balanced and choppy, exhausted and reversing, or trending and unstoppable. Read the shape correctly and the right strategy chooses itself. Read it wrong and you'll fade a trend day until your account is gone.
      </Hook>

      <Concept num={1} title="D-Shape (Balanced).">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Symmetrical bell curve, POC near mid-range.</li>
          <li>Volume distributed evenly above and below POC.</li>
          <li>Market in agreement, fair value found early.</li>
          <li><span className="text-poc-gold">Strategy:</span> mean reversion. Fade extremes. Target POC.</li>
        </ul>
      </Concept>

      <Concept num={2} title="P-Shape (Short Covering / Bullish Exhaustion).">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Heavy volume at the bottom, thin tail extending up.</li>
          <li>Started with shorts being squeezed, drove price up, ran out of buyers at top.</li>
          <li>The tail is the "I had to chase" zone.</li>
          <li><span className="text-poc-gold">Strategy:</span> look for shorts at the top of the tail. The bottom HVN is real support.</li>
        </ul>
      </Concept>

      <Concept num={3} title="b-Shape (Long Liquidation / Bearish Exhaustion).">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Heavy volume at the top, thin tail extending down.</li>
          <li>Started with longs panic-selling, drove price down, ran out of sellers at bottom.</li>
          <li>The tail is the "I had to puke" zone.</li>
          <li><span className="text-poc-gold">Strategy:</span> look for longs at the bottom of the tail. The top HVN is real resistance.</li>
        </ul>
      </Concept>

      <Concept num={4} title="Trend Day (Directional).">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Narrow, thin profile with no clear value area.</li>
          <li>Volume spread thinly across a wide price range.</li>
          <li>Each new period prints higher (or lower) than the last.</li>
          <li><span className="text-poc-gold">Strategy:</span> NEVER fade. Only join the trend on pullbacks to developing POC.</li>
        </ul>
      </Concept>

      <figure>
        <FourShapesGrid />
        <ChartCaption id="Chart 4.1">The Four Shapes Side by Side — fingerprint of the day.</ChartCaption>
      </figure>

      <figure>
        <TailIsTrade />
        <ChartCaption id="Chart 4.2">The Tail Is the Trade — fade the chase zone, target the heavy node.</ChartCaption>
      </figure>

      <FatalMistake>
        Fading a trend day because "price has gone too far." Trend days don't mean revert. They are imbalance from open to close. Your job on a trend day is to recognize it early and join — or stand aside. Fading it is account suicide.
      </FatalMistake>

      <ShapeSorter />

      <h2 className="font-head font-bold text-2xl mt-12 mb-2">Knowledge Check</h2>
      <Quiz questions={QUESTIONS} onComplete={(score) => completeLesson('l4', score)} />

      <PracticalTakeaway>
        Tomorrow at 11 AM ET, screenshot your MES profile as it stands. Classify it: D, P, b, or Trend. Then watch the rest of the day. Was your classification right? Was the strategy that classification implied the correct one? Build this skill ten days in a row.
      </PracticalTakeaway>
    </LessonLayout>
  )
}
