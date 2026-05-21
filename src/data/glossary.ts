export interface GlossaryTerm {
  term: string
  short: string
  definition: string
  lesson: string
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: 'POC', short: 'Point of Control', definition: 'The price with the most volume in a session. Acts as a magnet.', lesson: 'L2' },
  { term: 'VAH', short: 'Value Area High', definition: 'Top boundary of the 70% value area.', lesson: 'L2' },
  { term: 'VAL', short: 'Value Area Low', definition: 'Bottom boundary of the 70% value area.', lesson: 'L2' },
  { term: 'Value Area', short: '70% Volume Zone', definition: 'The price range containing 70% of session volume.', lesson: 'L2' },
  { term: 'HVN', short: 'High-Volume Node', definition: 'A price level with significantly more volume than surrounding levels. Acts as support/resistance.', lesson: 'L3' },
  { term: 'LVN', short: 'Low-Volume Node', definition: 'A price level with significantly less volume than surrounding levels. Accelerates price.', lesson: 'L3' },
  { term: 'Naked POC', short: 'Untested prior POC', definition: 'A prior-session POC that has not been retested by subsequent price action. Acts as a magnet.', lesson: 'L6' },
  { term: 'Initial Balance', short: 'IB — First 60 min', definition: 'The first 60 minutes\' high/low of the cash session.', lesson: 'L5' },
  { term: 'Open Drive', short: 'Strong directional open', definition: 'Strong directional move from the bell with no meaningful pullback. Highest conviction open.', lesson: 'L5' },
  { term: 'Open Test Drive', short: 'Test then drive', definition: 'Brief opposite-direction test, then strong reversal and drive.', lesson: 'L5' },
  { term: 'Open Rejection Reverse', short: 'Reject + reverse', definition: 'Initial move one way, sharp rejection, reverses through the opening print.', lesson: 'L5' },
  { term: 'Open Auction', short: 'Sideways chop', definition: 'Sideways chop with no commitment. Lowest conviction open.', lesson: 'L5' },
  { term: 'D-Shape', short: 'Balanced bell', definition: 'Balanced bell-curve profile, POC in mid-range, mean-reversion bias.', lesson: 'L4' },
  { term: 'P-Shape', short: 'Short covering', definition: 'Heavy bottom, thin tail at top, short-covering exhaustion.', lesson: 'L4' },
  { term: 'b-Shape', short: 'Long liquidation', definition: 'Heavy top, thin tail at bottom, long-liquidation exhaustion.', lesson: 'L4' },
  { term: 'Trend Day', short: 'Thin elongated profile', definition: 'Thin, elongated profile, no clear value area, never fade.', lesson: 'L4' },
  { term: '80% Rule', short: 'VA acceptance rule', definition: 'When price opens outside VA, re-enters, and gains 2-period acceptance, ~80% chance of traversing to opposite VA edge.', lesson: 'L7' },
  { term: 'Value Area Acceptance', short: 'Two 30-min periods inside', definition: 'Two consecutive 30-minute periods inside the value area.', lesson: 'L7' },
  { term: 'Failed Breakout', short: '4-step reversal', definition: 'Four-step pattern: break outside VA, fail to accept, re-enter, reversal.', lesson: 'L9' },
  { term: 'Vacuum', short: 'LVN traversal', definition: 'Price sprinting through a low-volume zone with no friction.', lesson: 'L3' },
  { term: 'Auction Theory', short: 'Markets are auctions', definition: 'Markets are price-discovery mechanisms moving between balance and imbalance.', lesson: 'L0' },
  { term: 'Balance / Imbalance', short: 'Auction states', definition: 'Auction states. Balance builds HVN; imbalance traverses LVN.', lesson: 'L0' },
  { term: 'Acceptance / Rejection', short: 'Validation states', definition: 'Auction states. Acceptance validates HVN; rejection validates LVN.', lesson: 'L0' },
]
