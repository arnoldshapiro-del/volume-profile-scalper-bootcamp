import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import Hook from '../components/Hook'
import Concept from '../components/Concept'
import FatalMistake from '../components/FatalMistake'
import PracticalTakeaway from '../components/PracticalTakeaway'
import ChartCaption from '../components/ChartCaption'
import Quiz from '../components/Quiz'
import FourOpenTypes from '../components/charts/FourOpenTypes'
import IBExtension from '../components/charts/IBExtension'
import ReadTheOpen from '../components/interactives/ReadTheOpen'
import { useProgress } from '../hooks/useProgress'

const QUESTIONS = [
  {
    id: 'Q5.1', prompt: 'The Initial Balance refers to:',
    options: ["The first 30 minutes' high/low", "The first 60 minutes' high/low", 'The pre-market range', "Yesterday's range"],
    correctIndex: 1,
    explanation: "IB = 9:30–10:30 ET high and low. The day's first reference range.",
  },
  {
    id: 'Q5.2', prompt: 'An Open Drive is characterized by:',
    options: ['Sideways chop', 'Brief test then strong reversal', 'Strong directional move from the bell with no meaningful pullback', 'Initial move then reversal through opening print'],
    correctIndex: 2,
    explanation: 'Open Drive = highest conviction setup. Join immediately, no waiting for confirmation.',
  },
  {
    id: 'Q5.3', prompt: 'The Open Auction signal tells you to:',
    options: ['Trade aggressively in the chop', 'Fade every extreme', 'Stay small or stand aside', 'Wait for IB extension'],
    correctIndex: 2,
    explanation: "Open Auction = market doesn't know its own direction. Forcing trades here is how scalpers bleed.",
  },
  {
    id: 'Q5.4', prompt: 'A break of IB high after 10:30 with conviction suggests:',
    options: ['Imminent reversal', 'Directional bias higher for the rest of session', 'End of trend', 'No meaningful signal'],
    correctIndex: 1,
    explanation: 'IB extension is one of the highest-probability continuation setups, especially when paired with trend-shape profile.',
  },
  {
    id: 'Q5.5', prompt: 'An Open Drive paired with a developing trend-shape profile signals:',
    options: ['Highest-conviction trend trading opportunity', 'A balanced day in disguise', 'Imminent reversal', 'Low-conviction setup'],
    correctIndex: 0,
    explanation: "When the open and the profile shape agree on direction, you have the day's highest-conviction setup. Size up.",
  },
]

export default function Lesson5() {
  const { completeLesson } = useProgress()

  return (
    <LessonLayout lessonId="l5" glossaryTerms={['Initial Balance', 'Open Drive', 'Open Test Drive', 'Open Rejection Reverse', 'Open Auction']}>
      <PromiseCallout>
        By the end of this lesson, you'll classify any market open within the first 60 minutes — and adjust your trading aggression to match the day's character.
      </PromiseCallout>

      <Hook>
        The first 60 minutes of trading are not a warmup. They are the auction's opening statement. By 10:30 AM ET, the market has already told you whether today is a one-way trend, a fade-the-edges day, or a chop-bucket you should stay out of. Most retail traders trade the first hour blindly. Pros use it to set the agenda.
      </Hook>

      <Concept num={1} title="The Initial Balance (IB).">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>The high and low established in the first 60 minutes of cash session (9:30–10:30 ET).</li>
          <li>Marks the day's first reference range.</li>
          <li>IB extension (break above IB high or below IB low after 10:30) is one of the highest-probability continuation setups.</li>
          <li>Wide IB = volatile opening, often range-bound rest of day. Narrow IB = compressed opening, often expansion day follows.</li>
        </ul>
      </Concept>

      <Concept num={2} title="The Four Open Types.">
        <div className="space-y-2">
          <div className="rounded-lg border border-bull-green/40 bg-bull-green/5 p-3">
            <div className="font-head font-bold text-bull-green">Open Drive · ★★★★</div>
            <p className="text-sm">Strong directional move from the bell, no meaningful pullback. Highest conviction. Join immediately.</p>
          </div>
          <div className="rounded-lg border border-hvn-teal/40 bg-hvn-teal/5 p-3">
            <div className="font-head font-bold text-hvn-teal">Open Test Drive · ★★★</div>
            <p className="text-sm">Brief opposite-direction test, then strong reversal and drive. Second-highest conviction.</p>
          </div>
          <div className="rounded-lg border border-va-purple/40 bg-va-purple/5 p-3">
            <div className="font-head font-bold text-va-purple">Open Rejection Reverse · ★★</div>
            <p className="text-sm">Initial move one way, sharp rejection, reverses through the opening print. Follow the reversal direction.</p>
          </div>
          <div className="rounded-lg border border-lvn-amber/40 bg-lvn-amber/5 p-3">
            <div className="font-head font-bold text-lvn-amber">Open Auction · ★</div>
            <p className="text-sm">Sideways chop, no commitment either side. Lowest conviction. Stay small or stand aside.</p>
          </div>
        </div>
      </Concept>

      <figure>
        <FourOpenTypes />
        <ChartCaption id="Chart 5.1">The Four Open Types — conviction stars under each title.</ChartCaption>
      </figure>

      <Concept num={3} title="IB Extension Rule.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>After 10:30, if price breaks above IB high (or below IB low) with conviction, the breakout direction is favored for the rest of session.</li>
          <li>Pair this with profile shape — IB extension on a trend day = highest-conviction trades of the week.</li>
          <li>Failed IB extension (break, fail, reverse back inside IB) = the inverse — strong reversal signal.</li>
        </ul>
      </Concept>

      <figure>
        <IBExtension />
        <ChartCaption id="Chart 5.2">The IB Extension Setup — break, pullback, continue.</ChartCaption>
      </figure>

      <Concept num={4} title="Open Type + Profile Shape = Strategy Matrix.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li><span className="text-bull-green">Open Drive + Trend Shape</span> = full-conviction trend trading</li>
          <li><span className="text-va-purple">Open Auction + D-Shape</span> = mean reversion, small size</li>
          <li><span className="text-lvn-amber">Open Rejection Reverse + b/P Shape</span> = fade the rejected extreme</li>
        </ul>
      </Concept>

      <FatalMistake>
        Forcing trades during Open Auction. If the first 30 minutes are chop with no clear direction, the market is telling you it doesn't know either. Sitting on your hands during Open Auction is a profitable trade. Forcing entries here is how scalpers bleed out before the real moves arrive.
      </FatalMistake>

      <ReadTheOpen />

      <h2 className="font-head font-bold text-2xl mt-12 mb-2">Knowledge Check</h2>
      <Quiz questions={QUESTIONS} onComplete={(score) => completeLesson('l5', score)} />

      <PracticalTakeaway>
        For the next 5 trading days: at 10:30 AM ET, write in your journal which open type you saw, and which open type you THOUGHT you saw at 9:45. Track the gap. The skill is recognizing it earlier each day.
      </PracticalTakeaway>
    </LessonLayout>
  )
}
