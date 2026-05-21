import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import Hook from '../components/Hook'
import Concept from '../components/Concept'
import FatalMistake from '../components/FatalMistake'
import PracticalTakeaway from '../components/PracticalTakeaway'
import ChartCaption from '../components/ChartCaption'
import Quiz from '../components/Quiz'
import FiveSessionsNakedPoc from '../components/charts/FiveSessionsNakedPoc'
import MagneticPull from '../components/charts/MagneticPull'
import SpotTheNakedPOC from '../components/interactives/SpotTheNakedPOC'
import { useProgress } from '../hooks/useProgress'

const QUESTIONS = [
  {
    id: 'Q6.1', prompt: 'A naked POC is best defined as:',
    options: ['Any POC from yesterday', 'A prior-session POC that has not been retested by later price action', "The current session's developing POC", 'An untested high or low'],
    correctIndex: 1,
    explanation: 'Naked = the level has not been "completed" by a subsequent test. Markets seek to complete them.',
  },
  {
    id: 'Q6.2', prompt: 'Naked POCs are best used as:',
    options: ['Entry triggers', 'Stop loss locations', 'Profit targets', 'Mean reversion signals'],
    correctIndex: 2,
    explanation: 'The POC is a magnetic target. Your entry comes from a separate setup. The naked POC tells you where the trade is likely to travel.',
  },
  {
    id: 'Q6.3', prompt: "A naked POC's magnetic power:",
    options: ['Increases over time', 'Stays the same forever', 'Decays after roughly 10 sessions', 'Disappears after 1 day'],
    correctIndex: 2,
    explanation: 'Old naked POCs lose relevance. The fresher the naked POC (within ~10 sessions), the stronger the pull.',
  },
  {
    id: 'Q6.4', prompt: 'Why are naked POCs magnetic?',
    options: ["They're calculated from VWAP", 'Institutions and algorithms remember them, and markets seek to "complete" untested levels', 'They appear on retail charts', "They're mathematical averages"],
    correctIndex: 1,
    explanation: 'Auction theory + institutional memory + algorithmic scanning = a self-reinforcing target.',
  },
  {
    id: 'Q6.5', prompt: 'When LONG with a target above current price, you should target:',
    options: ["Yesterday's high", 'The session VWAP', 'The nearest naked POC above', 'A round number'],
    correctIndex: 2,
    explanation: 'The nearest naked POC above is the highest-probability profit target. Round numbers are noise; naked POCs are signal.',
  },
]

export default function Lesson6() {
  const { completeLesson } = useProgress()

  return (
    <LessonLayout lessonId="l6" glossaryTerms={['Naked POC', 'POC', 'Auction Theory']}>
      <PromiseCallout>
        By the end of this lesson, you'll find untouched prior-session POCs on any chart and use them as high-probability profit targets.
      </PromiseCallout>

      <Hook>
        Five sessions ago, MES printed a POC at 5,832.50 and never came back to test it. That untested level has been sitting there ever since — like a magnet. When today's price drifts within 10 points of it, the market will find a way to touch it. Naked POCs are the cleanest, easiest target levels in all of trading. And almost no retail trader uses them.
      </Hook>

      <Concept num={1} title='What makes a POC "naked."'>
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>A POC from a prior session that has not been retested by subsequent price action.</li>
          <li>The market formed a center of gravity there, then moved away, and hasn't come back to confirm.</li>
          <li>Auction theory says markets seek to "complete" themselves — to test every level of significance.</li>
        </ul>
      </Concept>

      <Concept num={2} title="Why they are magnetic.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Institutions remember levels where significant volume traded.</li>
          <li>Algorithms specifically scan for untested POCs and target them.</li>
          <li>A naked POC is a built-in profit target because so many participants are looking at the same level.</li>
        </ul>
      </Concept>

      <figure>
        <FiveSessionsNakedPoc />
        <ChartCaption id="Chart 6.1">Five Sessions, Two Naked POCs — gold dotted lines extend to today.</ChartCaption>
      </figure>

      <Concept num={3} title="How to identify them.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Scroll back 5–10 sessions on your chart.</li>
          <li>For each prior session, locate that day's POC.</li>
          <li>Check if subsequent price action has crossed back through that level.</li>
          <li>If NO: it's a naked POC. Mark it with a dotted horizontal line extended to today.</li>
        </ul>
      </Concept>

      <Concept num={4} title="How to trade them — as TARGETS, not entries.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>When LONG: target the nearest naked POC above current price.</li>
          <li>When SHORT: target the nearest naked POC below current price.</li>
          <li>Combine with profile shape: on a trend day, the next naked POC in the trend direction is your T2.</li>
          <li>Time decay: a naked POC older than ~10 sessions loses magnetic power.</li>
        </ul>
      </Concept>

      <figure>
        <MagneticPull />
        <ChartCaption id="Chart 6.2">The Magnetic Pull — price completes the touch, then mean-reverts.</ChartCaption>
      </figure>

      <FatalMistake>
        Entering a trade because price is "heading toward" a naked POC. The POC is a TARGET, not a trigger. You still need a Brooks H1/H2 or rejection setup to enter. The naked POC just tells you where the wind will carry the trade once you're in it.
      </FatalMistake>

      <SpotTheNakedPOC />

      <h2 className="font-head font-bold text-2xl mt-12 mb-2">Knowledge Check</h2>
      <Quiz questions={QUESTIONS} onComplete={(score) => completeLesson('l6', score)} />

      <PracticalTakeaway>
        Tonight: scroll back 10 sessions on your MES chart. Identify every session's POC. Mark which are naked. Draw dotted lines extending to today. Tomorrow morning, see how many are above and below current price. Those are your day's natural targets — before you've taken a single trade.
      </PracticalTakeaway>
    </LessonLayout>
  )
}
