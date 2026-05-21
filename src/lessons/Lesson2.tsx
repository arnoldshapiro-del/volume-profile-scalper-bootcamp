import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import Hook from '../components/Hook'
import Concept from '../components/Concept'
import FatalMistake from '../components/FatalMistake'
import PracticalTakeaway from '../components/PracticalTakeaway'
import ChartCaption from '../components/ChartCaption'
import Quiz from '../components/Quiz'
import BigThreeVisualized from '../components/charts/BigThreeVisualized'
import AboveInBelowValue from '../components/charts/AboveInBelowValue'
import MarkTheBigThree from '../components/interactives/MarkTheBigThree'
import { useProgress } from '../hooks/useProgress'

const QUESTIONS = [
  {
    id: 'Q2.1', prompt: 'The Value Area contains what percentage of session volume?',
    options: ['50%', '60%', '70%', '80%'],
    correctIndex: 2,
    explanation: '70% ≈ one standard deviation, capturing the "agreed fair value" zone.',
  },
  {
    id: 'Q2.2', prompt: 'VAH stands for:',
    options: ['Volume Anchor High', 'Value Area High', 'Variable Average High', 'Volume Adjusted High'],
    correctIndex: 1,
    explanation: 'VAH = top boundary of the 70% value area.',
  },
  {
    id: 'Q2.3', prompt: "If MES opens today above yesterday's VAH, the initial bias is:",
    options: ['Bearish', 'Neutral', 'Bullish', 'Random'],
    correctIndex: 2,
    explanation: 'Above yesterday\'s value = market valuing higher than yesterday. Bullish skew until proven otherwise.',
  },
  {
    id: 'Q2.4', prompt: 'The POC acts as:',
    options: ['A solid wall that price never crosses', 'A magnet that price often returns to', 'An entry signal', 'A measure of volatility'],
    correctIndex: 1,
    explanation: 'POC = market center of gravity. Price gravitates back, especially after extension.',
  },
  {
    id: 'Q2.5', prompt: 'What is the single highest-leverage habit a Volume Profile trader can build?',
    options: ['Watching the news feed', "Marking yesterday's Big Three on today's chart before open", 'Adjusting moving averages', 'Trading larger size'],
    correctIndex: 1,
    explanation: 'This one habit gives you a complete map before the bell. Nothing else comes close in value-per-effort.',
  },
]

export default function Lesson2() {
  const { completeLesson } = useProgress()

  return (
    <LessonLayout lessonId="l2" glossaryTerms={['POC', 'VAH', 'VAL', 'Value Area', 'HVN']}>
      <PromiseCallout>
        By the end of this lesson, you will know the three reference levels that guide every trade decision you make.
      </PromiseCallout>

      <Hook>
        Most traders look at a chart and see chaos. Professional Volume Profile traders look at the same chart and see three lines: yesterday's POC, yesterday's Value Area High, yesterday's Value Area Low. That's it. Those three lines tell them whether to be a buyer or a seller before the bell rings.
      </Hook>

      <Concept num={1} title="Point of Control (POC).">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>The price with the most volume in the session.</li>
          <li>Acts as the market's center of gravity.</li>
          <li>Price returns to it repeatedly — like a magnet.</li>
          <li>Drawn in <span className="text-poc-gold">gold</span> on this app.</li>
        </ul>
      </Concept>

      <Concept num={2} title="Value Area.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>The price range containing 70% of the session's volume.</li>
          <li>Bounded by Value Area High (VAH) at top, Value Area Low (VAL) at bottom.</li>
          <li>Represents where the market spent most of its time finding fair value.</li>
          <li>Drawn in <span className="text-va-purple">purple</span> on this app.</li>
        </ul>
      </Concept>

      <figure>
        <BigThreeVisualized />
        <ChartCaption id="Chart 2.1">The Big Three Visualized — POC, VAH, VAL, with the value area shaded.</ChartCaption>
      </figure>

      <Concept num={3} title="Why 70%?">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>70% ≈ one standard deviation of a normal distribution.</li>
          <li>Volume tends to cluster around fair value in a roughly bell-shaped pattern.</li>
          <li>The 70% threshold captures the "agreed fair value" zone while excluding the tails (rejected prices).</li>
        </ul>
      </Concept>

      <Concept num={4} title="Above / In / Below — the mental framework.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Price <span className="text-bull-green font-mono">ABOVE</span> yesterday's VAH = bullish skew (market valued higher than yesterday).</li>
          <li>Price <span className="text-va-purple font-mono">IN</span> yesterday's value area = balance (mean reversion bias).</li>
          <li>Price <span className="text-bear-red font-mono">BELOW</span> yesterday's VAL = bearish skew (market valued lower than yesterday).</li>
          <li>That single read shapes 80% of trade decisions for the day.</li>
        </ul>
      </Concept>

      <figure>
        <AboveInBelowValue />
        <ChartCaption id="Chart 2.2">Above / In / Below Value — three states, three biases.</ChartCaption>
      </figure>

      <FatalMistake>
        Not marking yesterday's Big Three on today's chart. If you start your trading day without these three lines extended across your chart, you're trading blind. This is the cheapest, fastest, highest-leverage habit you can build.
      </FatalMistake>

      <MarkTheBigThree />

      <h2 className="font-head font-bold text-2xl mt-12 mb-2">Knowledge Check</h2>
      <Quiz questions={QUESTIONS} onComplete={(score) => completeLesson('l2', score)} />

      <PracticalTakeaway>
        Monday morning before market open: draw three horizontal lines on your MES chart — yesterday's POC, VAH, VAL. Extend them right across today's chart. Take no trades. Just watch how price reacts when it touches each line during the session. Note in your journal which line price respected most.
      </PracticalTakeaway>
    </LessonLayout>
  )
}
