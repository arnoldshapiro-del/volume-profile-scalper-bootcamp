import LessonLayout from '../components/LessonLayout'
import PromiseCallout from '../components/PromiseCallout'
import Hook from '../components/Hook'
import Concept from '../components/Concept'
import FatalMistake from '../components/FatalMistake'
import PracticalTakeaway from '../components/PracticalTakeaway'
import ChartCaption from '../components/ChartCaption'
import Quiz from '../components/Quiz'
import AuctionInOnePicture from '../components/charts/AuctionInOnePicture'
import FourAuctionStates from '../components/charts/FourAuctionStates'
import SpotAuctionState from '../components/interactives/SpotAuctionState'
import { useProgress } from '../hooks/useProgress'
import { useOnboarding } from '../hooks/useOnboarding'

const QUESTIONS = [
  {
    id: 'Q0.1', prompt: 'Volume Profile is best described as:',
    options: [
      'A type of moving average that incorporates volume',
      'A picture of where the market spent time at each price',
      'An order flow indicator',
      'A pattern recognition algorithm',
    ],
    correctIndex: 1,
    explanation: "It's a snapshot of accumulated volume at each price level — not a calculation, not a prediction.",
  },
  {
    id: 'Q0.2', prompt: 'When buyers and sellers agree a price is "fair," what happens?',
    options: ['Price moves rapidly higher', 'Volume builds at that level, forming an HVN', 'Price gaps to a new level', 'The market closes'],
    correctIndex: 1,
    explanation: 'Agreement = transactions happen. Lots of transactions at one price = HVN forms.',
  },
  {
    id: 'Q0.3', prompt: 'An HVN works as support/resistance primarily because:',
    options: ['Technical traders draw lines there', 'Institutions defended positions built at that level', 'The number 50 is psychologically important', 'Volume profiles are self-fulfilling prophecies'],
    correctIndex: 1,
    explanation: 'Real money was committed there. Those positions need defending when price returns.',
  },
  {
    id: 'Q0.4', prompt: 'Which auction state describes price spiking into a level and sharply reversing?',
    options: ['Balance', 'Imbalance', 'Acceptance', 'Rejection'],
    correctIndex: 3,
    explanation: 'Rejection = market tested the level and refused it. Validates the LVN below or HVN above.',
  },
  {
    id: 'Q0.5', prompt: "What's the difference between an indicator and Volume Profile?",
    options: ['Indicators use math; Volume Profile uses volume directly', 'Indicators are more accurate', 'Volume Profile only works on futures', 'There is no meaningful difference'],
    correctIndex: 0,
    explanation: 'Indicators derive numbers from prices. Volume Profile shows you the raw market activity.',
  },
]

export default function Lesson0() {
  const { completeLesson } = useProgress()
  const { onboarding } = useOnboarding()
  const instrument = onboarding.instrument || 'MES'

  return (
    <LessonLayout lessonId="l0" glossaryTerms={['Auction Theory', 'Balance / Imbalance', 'Acceptance / Rejection', 'HVN', 'LVN', 'POC']}>
      <PromiseCallout>
        By the end of this lesson, you will understand the market mechanism that makes Volume Profile work — and why this isn't another indicator, it's a window into actual market structure.
      </PromiseCallout>

      <Hook>
        Every market is an auction. Buyers bid. Sellers offer. Price moves until it finds a level where buying and selling balance. Then price stays there until something changes. Volume Profile is just a picture of that auction — showing you exactly where the market spent its time agreeing on value. Once you see {instrument} as an auction instead of a chart, Volume Profile stops looking like an indicator and starts looking like the truth.
      </Hook>

      <Concept num={1} title="Markets are price-discovery mechanisms.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Price has one job: find the level where transactions occur most efficiently.</li>
          <li>When buyers and sellers disagree on value, price moves rapidly to find new equilibrium.</li>
          <li>When they agree, price oscillates in a tight range, building volume.</li>
        </ul>
      </Concept>

      <Concept num={2} title="Volume tells you where agreement happened.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>High volume at a price = both sides agreed it was "fair value."</li>
          <li>Low volume at a price = one side rejected it, price moved through quickly.</li>
          <li>The Volume Profile is literally a map of agreement vs. rejection.</li>
        </ul>
      </Concept>

      <figure>
        <AuctionInOnePicture />
        <ChartCaption id="Chart 0.1">The Auction in One Picture — same data, different lens.</ChartCaption>
      </figure>

      <Concept num={3} title="Auction memory is institutional memory.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li>Once a price level has been "agreed fair" by significant volume, it remains psychologically important.</li>
          <li>Institutions who built positions at that level will defend them when price returns.</li>
          <li>This is why HVNs work as support/resistance — they're zones of unresolved institutional interest.</li>
        </ul>
      </Concept>

      <Concept num={4} title="The four auction states.">
        <ul className="list-disc list-outside ml-5 space-y-1.5">
          <li><span className="text-hvn-teal font-mono">Balance</span> — price oscillates, both sides agree, volume builds (HVN forms).</li>
          <li><span className="text-lvn-amber font-mono">Imbalance</span> — one side overwhelms the other, price moves rapidly (LVN forms).</li>
          <li><span className="text-bull-green font-mono">Acceptance</span> — price returns to a previous balance area and stays (validates the HVN).</li>
          <li><span className="text-bear-red font-mono">Rejection</span> — price tests a level but moves away quickly (validates the LVN).</li>
        </ul>
      </Concept>

      <figure>
        <FourAuctionStates />
        <ChartCaption id="Chart 0.2">The Four Auction States — balance, imbalance, acceptance, rejection.</ChartCaption>
      </figure>

      <FatalMistake>
        Treating Volume Profile as a "better" indicator. It is not an indicator. It is a different way of seeing the same market — through volume instead of through time. If you use it the same way you use moving averages, you'll miss everything that matters.
      </FatalMistake>

      <SpotAuctionState />

      <h2 className="font-head font-bold text-2xl mt-12 mb-2">Knowledge Check</h2>
      <p className="text-text-secondary text-sm mb-2">Five questions. Pass with 3 of 5 to mark this lesson complete and unlock Lesson 1.</p>

      <Quiz questions={QUESTIONS} onComplete={(score) => completeLesson('l0', score)} />

      <PracticalTakeaway>
        Tonight, pull up yesterday's {instrument} daily session in NinjaTrader. Don't analyze it. Don't trade-prep it. Just look at the Volume Profile and the candlesticks side by side. Find one HVN. Find one LVN. Notice where the candlesticks confirm what the profile shows. That's the muscle memory you're building.
      </PracticalTakeaway>
    </LessonLayout>
  )
}
