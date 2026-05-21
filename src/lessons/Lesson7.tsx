import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import Hook from '../components/Hook'
import Concept from '../components/Concept'
import FatalMistake from '../components/FatalMistake'
import PracticalTakeaway from '../components/PracticalTakeaway'
import ChartCaption from '../components/ChartCaption'
import Quiz from '../components/Quiz'
import EightyPctSequence from '../components/charts/EightyPctSequence'
import TrueVsFalseSetup from '../components/charts/TrueVsFalseSetup'
import EightyPctDetector from '../components/interactives/EightyPctDetector'
import { useProgress } from '../hooks/useProgress'

const QUESTIONS = [
  {
    id: 'Q7.1', prompt: 'The 80% Rule requires which of the following?',
    options: ['Price opening inside value area', 'Price opening outside value area, re-entering, and staying for 2 consecutive 30-min periods', 'Trading above VWAP', 'A trend day'],
    correctIndex: 1,
    explanation: 'Three conditions: outside-open, re-entry, AND two-period acceptance. All three required.',
  },
  {
    id: 'Q7.2', prompt: "The 80% Rule's profit target is:",
    options: ["Yesterday's POC, then opposite Value Area edge", "Yesterday's high", 'The next round number', 'The session VWAP'],
    correctIndex: 0,
    explanation: 'T1 = POC (the magnet). T2 = opposite VA edge (the traversal target). Scale out as you go.',
  },
  {
    id: 'Q7.3', prompt: 'Why does the rule require TWO consecutive 30-min periods of acceptance?',
    options: ['Tradition', 'To filter out rapid re-entry then re-exit ("fake" re-entries)', 'To match the session length', 'To align with daily timeframe'],
    correctIndex: 1,
    explanation: 'One period of re-entry could be a wick. Two periods confirms genuine acceptance — the market is back inside value.',
  },
  {
    id: 'Q7.4', prompt: 'A common false positive is:',
    options: ['Two full periods of acceptance with rising volume', 'Rapid re-entry then re-exit without acceptance', 'Re-entry from below VAL', 'Re-entry on a trend day'],
    correctIndex: 1,
    explanation: 'The quick wick re-entry that exits before the second 30-min mark fails the acceptance condition. Skip it.',
  },
  {
    id: 'Q7.5', prompt: "What's the right move when conditions for the 80% Rule are still developing?",
    options: ['Enter on the first re-entry candle', 'Wait for full confirmation (two 30-min periods inside) before entering', 'Take a small starter position', 'Front-run the setup'],
    correctIndex: 1,
    explanation: 'Patience. The 80% probability comes from full confirmation. Jumping early kills the edge.',
  },
]

export default function Lesson7() {
  const { completeLesson } = useProgress()

  return (
    <LessonLayout lessonId="l7" glossaryTerms={['80% Rule', 'Value Area Acceptance', 'VAH', 'VAL', 'POC']}>
      <PromiseCallout>
        By the end of this lesson, you'll spot one of the highest-probability setups in volume profile trading — and avoid its most common false positives.
      </PromiseCallout>

      <Hook>
        This is the setup that built the volume profile trading reputation. When price opens outside yesterday's value area, then re-enters and stays for two consecutive 30-minute periods, the probability that price traverses the entire value area to the opposite edge is roughly 80%. It's not a guarantee. It's not a holy grail. But it is one of the most asymmetric trades a profile trader can make.
      </Hook>

      <Concept num={1} title="The 80% Rule Setup.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Price opens OUTSIDE yesterday's value area (above VAH or below VAL).</li>
          <li>Price re-enters the value area.</li>
          <li>Price stays inside for 2 consecutive 30-minute periods (the "acceptance" condition).</li>
          <li>Once both conditions are met: probability of traversing to the opposite edge is roughly 80%.</li>
        </ul>
      </Concept>

      <figure>
        <EightyPctSequence />
        <ChartCaption id="Chart 7.1">The 80% Rule Sequence — open above, re-enter, accept, traverse.</ChartCaption>
      </figure>

      <Concept num={2} title="Why It Works.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Outside-value pricing is rejected pricing — the market tried it and is moving away.</li>
          <li>Re-entry signals the market is returning to fair value.</li>
          <li>Two periods of acceptance confirms it's not a quick failed test.</li>
          <li>Once confirmed, the auction is back inside value and tends to fill the range.</li>
        </ul>
      </Concept>

      <Concept num={3} title="The Trade Plan.">
        <div className="rounded-lg border border-border-subtle bg-bg-elevated p-4 space-y-1.5">
          <div className="text-sm"><span className="text-poc-gold font-mono">Entry:</span> after confirmation of 2 full 30-min periods inside the value area</div>
          <div className="text-sm"><span className="text-bear-red font-mono">Stop:</span> just back outside the value area (on the side you re-entered from)</div>
          <div className="text-sm"><span className="text-bull-green font-mono">T1:</span> yesterday's POC</div>
          <div className="text-sm"><span className="text-bull-green font-mono">T2:</span> yesterday's opposite Value Area edge</div>
        </div>
      </Concept>

      <Concept num={4} title="The False Positives.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Rapid re-entry then re-exit without two full periods inside = NOT a 80% Rule setup. Skip.</li>
          <li>Re-entry on news-driven candle (huge wick re-entry, not gradual) = unreliable. Wait for the second 30-min period.</li>
          <li>"Acceptance" with very thin volume inside the VA = weaker setup; skew probability lower.</li>
        </ul>
      </Concept>

      <figure>
        <TrueVsFalseSetup />
        <ChartCaption id="Chart 7.2">True Setup vs. False Positive — side by side.</ChartCaption>
      </figure>

      <FatalMistake>
        Entering on the first re-entry candle without waiting for full acceptance. The rule explicitly requires two consecutive 30-minute periods inside. Jumping early turns an 80% setup into a coinflip. Wait for confirmation. The trade will still be there.
      </FatalMistake>

      <EightyPctDetector />

      <h2 className="font-head font-bold text-2xl mt-12 mb-2">Knowledge Check</h2>
      <Quiz questions={QUESTIONS} onComplete={(score) => completeLesson('l7', score)} />

      <PracticalTakeaway>
        Over the next two weeks, log every day MES opens outside yesterday's VA. Track which re-enter, which complete the two-period acceptance, and which then traverse to the opposite edge. Your hit-rate journal will tell you whether the rule holds in current market conditions — and your confidence will grow with the data.
      </PracticalTakeaway>
    </LessonLayout>
  )
}
