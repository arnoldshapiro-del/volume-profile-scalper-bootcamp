import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import Hook from '../components/Hook'
import Concept from '../components/Concept'
import FatalMistake from '../components/FatalMistake'
import PracticalTakeaway from '../components/PracticalTakeaway'
import ChartCaption from '../components/ChartCaption'
import Quiz from '../components/Quiz'
import AnatomyHvnLvn from '../components/charts/AnatomyHvnLvn'
import VacuumEffect from '../components/charts/VacuumEffect'
import MountainOrValley from '../components/interactives/MountainOrValley'
import { useProgress } from '../hooks/useProgress'

const QUESTIONS = [
  {
    id: 'Q3.1', prompt: "Yesterday MES traded 5,847.50–5,852.25 for 40 minutes. Today price approaches 5,849.75 from above. Most likely outcome?",
    options: ['Slices through and accelerates lower', 'Bounces back toward 5,852 area', 'Gaps lower', 'No relevance today'],
    correctIndex: 1,
    explanation: "Institutions accumulated longs in that zone. Average entry near 5,849.75. They'll defend. Expect a bounce.",
  },
  {
    id: 'Q3.2', prompt: 'A Low-Volume Node is best described as:',
    options: ['A price with many institutional orders', 'A price level where few contracts traded relative to surrounding levels', 'The bottom of session range', 'A level where price stalled'],
    correctIndex: 1,
    explanation: 'LVN = thin volume = rejection zone where price moved through quickly.',
  },
  {
    id: 'Q3.3', prompt: 'Price suddenly accelerates downward through a thin profile section. You should:',
    options: ['Short immediately — momentum confirms direction', 'Wait for acceleration to end at the next HVN, then look for a long', 'Buy the dip — oversold', 'Short with tight stop and ride the cascade'],
    correctIndex: 1,
    explanation: 'Never short a vacuum. Wait for price to hit the next HVN and look for rejection.',
  },
  {
    id: 'Q3.4', prompt: 'HVNs work as support/resistance because:',
    options: ['Significant trading volume occurred there and positions are defended', "They're mathematical averages of price", 'They predict future price', "They're calculated from OHLC data"],
    correctIndex: 0,
    explanation: 'Real money. Real positions. Real defense.',
  },
  {
    id: 'Q3.5', prompt: 'The most reliable HVN bounce trade requires:',
    options: ['Entering exactly at the HVN touch', 'A rejection candle confirming the level held', 'Aggressive position sizing', 'A breakout above the HVN'],
    correctIndex: 1,
    explanation: 'Confirmation candle = the trigger. The HVN is the location. You need both.',
  },
]

export default function Lesson3() {
  const { completeLesson } = useProgress()

  return (
    <LessonLayout lessonId="l3" glossaryTerms={['HVN', 'LVN', 'POC', 'Vacuum', 'Balance / Imbalance']}>
      <PromiseCallout>
        By the end of this lesson, you'll instantly recognize where price will bounce (HVN) versus accelerate (LVN), and choose the correct trade approach for each.
      </PromiseCallout>

      <Hook>
        Yesterday morning, MES traded between 5,847.50 and 5,852.25 for forty straight minutes. Big institutions accumulated long positions averaging around 5,849.75. They have real money on the line at that price. Today, when MES drifts back down to 5,849.75 — those same institutions defend their position. They buy more. Price will NOT slice through. That's a High-Volume Node. It's not "support" in the line-on-a-chart sense — it's a battlefield where actual money is at stake.
      </Hook>

      <Concept num={1} title="HVN — The Mountain.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Price level (or narrow zone) where significantly more contracts were traded than at surrounding prices.</li>
          <li>Forms from institutional accumulation, fair value agreement, resting limit orders.</li>
          <li>Acts as support/resistance because (a) position defense, (b) trapped traders exiting at breakeven, (c) algorithms recognize and fade moves into them.</li>
          <li>Real-time behavior: price slows, multiple rejection candles, increased volume on the touch, then bounces.</li>
        </ul>
      </Concept>

      <Concept num={2} title="LVN — The Valley.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Price level where significantly fewer contracts traded than surrounding levels.</li>
          <li>Forms from price rejection, news-driven gaps, imbalanced auction.</li>
          <li>Accelerates price because (a) no resting orders to absorb, (b) stop-loss cascades, (c) algorithms add to momentum.</li>
          <li>Real-time behavior: long-bodied candles, small wicks, wider tick spreads, price doesn't stop until next HVN.</li>
        </ul>
      </Concept>

      <figure>
        <AnatomyHvnLvn />
        <ChartCaption id="Chart 3.1">Anatomy of HVN vs LVN — institutional defense around the POC.</ChartCaption>
      </figure>

      <Concept num={3} title="Two trade archetypes.">
        <div className="space-y-3">
          <div className="rounded-lg border border-hvn-teal/40 bg-hvn-teal/5 p-3.5">
            <div className="font-head font-bold text-hvn-teal mb-1">HVN Bounce (Mean Reversion)</div>
            <p className="text-sm">Wait for rejection candle AT the HVN. Enter on close. Stop just beyond HVN. Target previous swing.</p>
          </div>
          <div className="rounded-lg border border-lvn-amber/40 bg-lvn-amber/5 p-3.5">
            <div className="font-head font-bold text-lvn-amber mb-1">LVN Breakthrough (Momentum)</div>
            <p className="text-sm">Wait for strong breakout candle through edge of HVN into adjacent LVN. Enter on close or pullback to broken edge. Stop back inside HVN. Target next HVN on other side.</p>
          </div>
        </div>
      </Concept>

      <figure>
        <VacuumEffect />
        <ChartCaption id="Chart 3.2">The Vacuum Effect — LVN traversal between two HVN clusters.</ChartCaption>
      </figure>

      <Concept num={4} title="The auction asymmetry.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>HVNs absorb energy (price slows in agreement zones).</li>
          <li>LVNs release energy (price accelerates through rejection zones).</li>
          <li>The market alternates between balance (HVN building) and imbalance (LVN traversal).</li>
        </ul>
      </Concept>

      <FatalMistake>
        Trying to fade an LVN move. If price is sprinting through an LVN, do NOT short the rip (or buy the fall). The acceleration exists precisely because no one will take the other side. You will be the only one. You will get run over. The rule: never short a vacuum. Never buy free fall.
      </FatalMistake>

      <MountainOrValley />

      <h2 className="font-head font-bold text-2xl mt-12 mb-2">Knowledge Check</h2>
      <Quiz questions={QUESTIONS} onComplete={(score) => completeLesson('l3', score)} />

      <PracticalTakeaway>
        Tomorrow: identify ONE clear HVN cluster and ONE clear LVN gap on your live MES profile. Mark them. Watch how price interacts with each during the session. Write three sentences in your trade journal about what you observed. Do not trade these zones yet. Just watch.
      </PracticalTakeaway>
    </LessonLayout>
  )
}
