import type { LaborMarketDefinition } from "./domain"

/**
 * Placeholder worker cost escalation, grouped into cost tiers: cheapest tier
 * first, most expensive last, `count` workers available at each price. Total
 * workers (and often the number of tiers) grows with player count, mirroring
 * the fruit demand tracks in `market.ts`. Hand-edit `gold`/`count` directly,
 * or add/remove tiers.
 */
export const laborMarket: LaborMarketDefinition = {
  workerTrack: {
    2: [
      { gold: 0, count: 1 },
      { gold: 1, count: 5 },
      { gold: 2, count: 3 }
    ],
    3: [
      { gold: 0, count: 2 },
      { gold: 1, count: 4 },
      { gold: 2, count: 3 },
      { gold: 3, count: 2 }
    ],
    4: [
      { gold: 0, count: 3 },
      { gold: 1, count: 5 },
      { gold: 2, count: 3 },
      { gold: 3, count: 2 }
    ]
  }
}
