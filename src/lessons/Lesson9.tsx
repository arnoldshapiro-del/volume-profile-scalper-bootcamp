import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import Hook from '../components/Hook'
import Concept from '../components/Concept'
import FatalMistake from '../components/FatalMistake'
import PracticalTakeaway from '../components/PracticalTakeaway'
import ChartCaption from '../components/ChartCaption'
import Quiz from '../components/Quiz'
import FailedBreakoutSequence from '../components/charts/FailedBreakoutSequence'
import WhereStopsSit from '../components/charts/WhereStopsSit'
import FailedBreakoutSpotter from '../components/interactives/FailedBreakoutSpotter'
import { useProgress } from '../hooks/useProgress'

const QUESTIONS = [
  {
    id: 'Q9.1', prompt: 'The four-step failed breakout pattern requires:',
    options: ['Break, hold, accept, continue', 'Break, fail to accept, re-enter, reversal', 'Range, break, accept, continue', 'Trend, pause, reverse, range'],
    correctIndex: 1,
    explanation: 'Four phases: the false break, the lack of acceptance, the return inside value, and the rejection candle that fires the reversal.',
  },
  {
    id: 'Q9.2', prompt: 'The entry trigger for a failed breakout reversal is:',
    options: ['The initial breakout candle', 'Re-entry into the value area', 'A rejection candle (engulfing/hammer/pin) AFTER re-entry', 'Touch of the POC'],
    correctIndex: 2,
    explanation: "Re-entry alone isn't enough — you need confirmation. The rejection candle is the confirmation.",
  },
  {
    id: 'Q9.3', prompt: 'Why does the failed breakout work?',
    options: ['Mean reversion is automatic', "Trapped breakout traders' stops fuel the reversal", 'Volume always returns to average', 'Algorithms force the move'],
    correctIndex: 1,
    explanation: "Their cluster of stops just outside the level becomes the gas in the reversal's tank.",
  },
  {
    id: 'Q9.4', prompt: "A failed breakout's first profit target is:",
    options: ["Yesterday's high", 'Round numbers', "Yesterday's POC", 'The session VWAP'],
    correctIndex: 2,
    explanation: 'POC is the magnet — and the natural T1. T2 is the opposite VA edge (the full traversal).',
  },
  {
    id: 'Q9.5', prompt: 'The discipline that gives this setup its edge is:',
    options: ['Position sizing', 'Speed of execution', 'Patience to wait for the failure rather than chasing the breakout', 'Using larger stops'],
    correctIndex: 2,
    explanation: 'You are the trader who waits while everyone else chases. That patience IS the edge.',
  },
]

export default function Lesson9() {
  const { completeLesson } = useProgress()

  return (
    <LessonLayout lessonId="l9" glossaryTerms={['Failed Breakout', 'VAH', 'VAL', 'POC', '80% Rule']}>
      <PromiseCallout>
        By the end of this lesson, you'll spot one of the most reliable reversal patterns in volume profile trading — and exploit the moment trapped breakout traders fuel the reversal.
      </PromiseCallout>

      <Hook>
        Every breakout above VAH attracts a wave of breakout traders. Every breakout below VAL does the same. When those breakouts fail and price re-enters the value area, those breakout traders are now trapped. Their stops cluster just outside the level they bought (or sold). When price reverses, their forced exits become the fuel for the move back through POC. The failed breakout is the trap, and you are the one selling them their own coffin.
      </Hook>

      <Concept num={1} title="The Four-Step Pattern.">
        <ol className="list-decimal list-outside ml-5 space-y-1.5">
          <li>Price breaks above VAH (or below VAL) with apparent conviction.</li>
          <li>Price fails to find acceptance outside the value area (no follow-through, weak volume).</li>
          <li>Price re-enters the value area.</li>
          <li>Strong rejection candle prints, signaling reversal toward POC and potentially opposite VA edge.</li>
        </ol>
      </Concept>

      <figure>
        <FailedBreakoutSequence />
        <ChartCaption id="Chart 9.1">The Failed Breakout Sequence — four panels, one trade.</ChartCaption>
      </figure>

      <Concept num={2} title="Why It Works.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Failed breakouts trap aggressive breakout traders on the wrong side.</li>
          <li>Their stops sit just outside the broken level.</li>
          <li>Once price reverses through that level, stops trigger in a cascade.</li>
          <li>The cascade fuels the reversal — the breakout traders are now sellers of their longs (or buyers of their shorts).</li>
        </ul>
      </Concept>

      <figure>
        <WhereStopsSit />
        <ChartCaption id="Chart 9.2">Where the Stops Sit — trapped exits become the reversal's fuel.</ChartCaption>
      </figure>

      <Concept num={3} title="The Entry Trigger.">
        <div className="rounded-lg border border-border-subtle bg-bg-elevated p-4 space-y-1.5">
          <div className="text-sm"><span className="text-poc-gold font-mono">Trigger:</span> rejection candle AFTER re-entry — engulfing, hammer, pin bar, or strong wick.</div>
          <div className="text-sm"><span className="text-poc-gold font-mono">Entry:</span> on close of the rejection candle (or next candle's open).</div>
          <div className="text-sm"><span className="text-bear-red font-mono">Stop:</span> just beyond the failed breakout extreme (where trapped stops cluster).</div>
          <div className="text-sm"><span className="text-bull-green font-mono">T1:</span> yesterday's POC. <span className="text-bull-green font-mono">T2:</span> opposite VA edge.</div>
        </div>
      </Concept>

      <Concept num={4} title="The Naked POC Variant.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>The same pattern works at naked POCs: price approaches the naked POC, breaks through briefly, fails to hold, reverses.</li>
          <li>Often coincides with VA edge if the naked POC happens to sit near VAH/VAL.</li>
          <li>High-conviction confluence when both align.</li>
        </ul>
      </Concept>

      <FatalMistake>
        Entering on the breakout itself, hoping it succeeds. You are exactly the trader this setup feeds on. Volume Profile traders wait for the failure and reversal — they don't buy the breakout, they buy the failure of the breakout. The discipline to wait is the entire edge.
      </FatalMistake>

      <FailedBreakoutSpotter />

      <h2 className="font-head font-bold text-2xl mt-12 mb-2">Knowledge Check</h2>
      <Quiz questions={QUESTIONS} onComplete={(score) => completeLesson('l9', score)} />

      <PracticalTakeaway>
        Tomorrow, mark yesterday's VAH and VAL on your MES chart. During the session, every time price breaks above VAH or below VAL, set a timer for 30 minutes. Note whether the break holds or fails. When it fails AND re-enters AND prints a rejection candle, screenshot it. Within 5 sessions you'll have a folder of these — and the pattern recognition becomes effortless.
      </PracticalTakeaway>
    </LessonLayout>
  )
}
