export type OpenType = 'Open Drive' | 'Open Test Drive' | 'Open Rejection Reverse' | 'Open Auction'
export type Shape = 'D' | 'P' | 'b' | 'Trend'

export interface CapstoneSetup {
  id: string
  name: string         // e.g. "H2 long at VAL"
  location: string     // narrative
  optimal: 'TAKE' | 'SKIP'
  rationale: string
  // Visual hint
  highlightPriceMin: number
  highlightPriceMax: number
  // For TAKE setups: ideal trade placement (optional — null on SKIPs)
  direction?: 'long' | 'short'
  idealEntry?: number
  idealStop?: number
  idealT1?: number
  idealT2?: number
  placementTolerance?: number  // points of tolerance for "close enough"
}

export interface CapstoneDay {
  id: 'd-shape' | 'trend' | 'failed-breakout'
  title: string
  description: string
  // Yesterday's reference
  ySession: {
    POC: number
    VAH: number
    VAL: number
    nakedPOCs: number[]
  }
  // Today's first 60 minutes (IB) candles + post-IB
  openType: OpenType
  shape: Shape
  ibCandles: { o: number, c: number, h: number, l: number }[]
  postIBCandles: { o: number, c: number, h: number, l: number }[]
  setups: CapstoneSetup[]
}

// Helper to generate candles with constraints
function ibFor(kind: 'drive-up' | 'drive-down' | 'auction' | 'rejection-up'): { o: number, c: number, h: number, l: number }[] {
  const out: { o: number, c: number, h: number, l: number }[] = []
  if (kind === 'drive-up') {
    let p = 42
    for (let i = 0; i < 12; i++) { out.push({ o: p, c: p + 1.4, h: p + 1.8, l: p - 0.3 }); p += 1.4 }
  } else if (kind === 'drive-down') {
    let p = 60
    for (let i = 0; i < 12; i++) { out.push({ o: p, c: p - 1.4, h: p + 0.3, l: p - 1.8 }); p -= 1.4 }
  } else if (kind === 'auction') {
    for (let i = 0; i < 12; i++) {
      const base = 50 + Math.sin(i * 0.9) * 3
      const o = base; const c = base + (i % 2 ? 1.3 : -1.3)
      out.push({ o, c, h: Math.max(o, c) + 1, l: Math.min(o, c) - 1 })
    }
  } else { // rejection-up
    let p = 50
    for (let i = 0; i < 4; i++) { out.push({ o: p, c: p + 1.6, h: p + 2, l: p - 0.3 }); p += 1.6 }
    out.push({ o: p, c: p - 5, h: p + 1, l: p - 5.5 }); p -= 5
    for (let i = 0; i < 7; i++) { out.push({ o: p, c: p - 1.3, h: p + 0.3, l: p - 1.7 }); p -= 1.3 }
  }
  return out
}

function postFor(kind: 'balanced' | 'trend-up' | 'failed-breakout'): { o: number, c: number, h: number, l: number }[] {
  const out: { o: number, c: number, h: number, l: number }[] = []
  if (kind === 'balanced') {
    for (let i = 0; i < 36; i++) {
      const base = 50 + Math.sin(i * 0.4) * 7
      const o = base
      const c = base + (i % 2 ? 1.5 : -1.5)
      out.push({ o, c, h: Math.max(o, c) + 1.2, l: Math.min(o, c) - 1.2 })
    }
  } else if (kind === 'trend-up') {
    let p = 56
    for (let i = 0; i < 36; i++) {
      const o = p; const c = p + 0.8 + Math.sin(i * 0.3) * 0.4
      out.push({ o, c, h: c + 0.4, l: o - 0.3 }); p = c
    }
  } else { // failed-breakout
    // Initial break above VAH (60), stall, re-entry, reversal toward POC and below
    let p = 60
    for (let i = 0; i < 6; i++) { const o = p; const c = p + 1.5; out.push({ o, c, h: c + 0.4, l: o - 0.3 }); p = c }
    for (let i = 0; i < 6; i++) { out.push({ o: p, c: p + (i % 2 ? -0.4 : 0.2), h: p + 0.6, l: p - 0.6 }) }
    for (let i = 0; i < 6; i++) { const o = p; const c = p - 1.3; out.push({ o, c, h: o + 0.4, l: c - 0.4 }); p = c }
    out.push({ o: p, c: p - 4, h: p + 0.5, l: p - 4.5 }); p -= 4
    for (let i = 0; i < 17; i++) { const o = p; const c = p - 0.6; out.push({ o, c, h: o + 0.4, l: c - 0.4 }); p = c }
  }
  return out
}

export const DAYS: CapstoneDay[] = [
  {
    id: 'd-shape',
    title: 'D-Shape Day',
    description: "Yesterday: 50 POC · VA 40–60. Pre-market opens inside value. Expect a balanced day.",
    ySession: { POC: 50, VAH: 60, VAL: 40, nakedPOCs: [68, 35] },
    openType: 'Open Auction',
    shape: 'D',
    ibCandles: ibFor('auction'),
    postIBCandles: postFor('balanced'),
    setups: [
      {
        id: 's1', name: 'H2 long', location: "at yesterday's VAL (40)",
        optimal: 'TAKE', rationale: "VAL is the institutional floor. On a balanced day, fading the extremes back to POC is the textbook trade.",
        highlightPriceMin: 38, highlightPriceMax: 44,
        direction: 'long', idealEntry: 41, idealStop: 38, idealT1: 50, idealT2: 58, placementTolerance: 2,
      },
      {
        id: 's2', name: 'H2 long', location: 'inside an LVN at 52, no nearby HVN below current price',
        optimal: 'SKIP', rationale: "No structure to bounce off. The chart pattern is clean but the profile is empty around it.",
        highlightPriceMin: 50, highlightPriceMax: 54,
      },
      {
        id: 's3', name: 'H2 short', location: "at yesterday's VAH (60)",
        optimal: 'TAKE', rationale: "Mirror of the first setup. VAH = institutional ceiling on a balanced day. Take the fade to POC.",
        highlightPriceMin: 58, highlightPriceMax: 62,
        direction: 'short', idealEntry: 59, idealStop: 62, idealT1: 50, idealT2: 42, placementTolerance: 2,
      },
    ],
  },
  {
    id: 'trend',
    title: 'Trend Day',
    description: 'Yesterday: 50 POC · VA 40–60. Today opens with Open Drive higher. Profile developing thin and elongated — trend day fingerprint.',
    ySession: { POC: 50, VAH: 60, VAL: 40, nakedPOCs: [42, 72] },
    openType: 'Open Drive',
    shape: 'Trend',
    ibCandles: ibFor('drive-up'),
    postIBCandles: postFor('trend-up'),
    setups: [
      {
        id: 's1', name: 'H2 short', location: "at yesterday's VAH (60), counter-trend on a trend day",
        optimal: 'SKIP', rationale: "Never fade a trend day. Even at a structure level, the day's character overrides. Drop this setup.",
        highlightPriceMin: 58, highlightPriceMax: 62,
      },
      {
        id: 's2', name: 'Bull flag', location: 'breaking out above naked POC (72)',
        optimal: 'TAKE', rationale: 'On a trend day with momentum to a magnet, this is the layup of the week.',
        highlightPriceMin: 70, highlightPriceMax: 74,
        direction: 'long', idealEntry: 72, idealStop: 68, idealT1: 76, idealT2: 80, placementTolerance: 2,
      },
      {
        id: 's3', name: 'H2 long', location: 'pullback to developing POC at 64',
        optimal: 'TAKE', rationale: 'Trend day strategy = join on pullbacks to developing POC. This is the right way to engage.',
        highlightPriceMin: 62, highlightPriceMax: 66,
        direction: 'long', idealEntry: 64, idealStop: 60, idealT1: 70, idealT2: 76, placementTolerance: 2,
      },
    ],
  },
  {
    id: 'failed-breakout',
    title: 'Failed Breakout Day',
    description: 'Yesterday: 50 POC · VA 40–60. Today opens above VAH but fails to find acceptance — re-enters and reverses.',
    ySession: { POC: 50, VAH: 60, VAL: 40, nakedPOCs: [38] },
    openType: 'Open Rejection Reverse',
    shape: 'b',
    ibCandles: ibFor('rejection-up'),
    postIBCandles: postFor('failed-breakout'),
    setups: [
      {
        id: 's1', name: 'H2 long', location: 'on the initial break above VAH at 62',
        optimal: 'SKIP', rationale: "Chasing the breakout is exactly the trap. Wait for failure.",
        highlightPriceMin: 60, highlightPriceMax: 64,
      },
      {
        id: 's2', name: 'Failed Breakout short', location: 'after re-entry into VA, rejection candle at 56',
        optimal: 'TAKE', rationale: "Four-step pattern complete: break, fail, re-enter, reject. Trapped buyers will fuel the down move toward POC.",
        highlightPriceMin: 54, highlightPriceMax: 58,
        direction: 'short', idealEntry: 56, idealStop: 64, idealT1: 50, idealT2: 40, placementTolerance: 3,
      },
      {
        id: 's3', name: 'H2 short', location: 'at developing POC during the cascade',
        optimal: 'SKIP', rationale: "POC acts as a magnet here — late entry chases an already-extended move. Better to scale out earlier longs than initiate new shorts.",
        highlightPriceMin: 48, highlightPriceMax: 52,
      },
    ],
  },
]
