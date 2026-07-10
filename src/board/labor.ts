import type { LaborMarketDefinition } from "./domain"

/**
 * Placeholder worker cost escalation: cheapest worker at the top of the
 * track, most expensive at the bottom. Slot count (workers available) grows
 * with player count, mirroring the fruit demand tracks in `market.ts`. Hand-
 * edit values directly, or add/remove slots to change worker count.
 */
export const laborMarket: LaborMarketDefinition = {
  workerTrack: {
    2: [
      { gold: 0 },
      { gold: 1 },
      { gold: 1 },
      { gold: 1 },
      { gold: 1 },
      { gold: 1 },
      { gold: 2 },
      { gold: 2 },
      { gold: 2 }
    ],
    3: [
      { gold: 0 },
      { gold: 0 },
      { gold: 1 },
      { gold: 1 },
      { gold: 1 },
      { gold: 1 },
      { gold: 2 },
      { gold: 2 },
      { gold: 2 },
      { gold: 3 },
      { gold: 3 }
    ],
    4: [
      { gold: 0 },
      { gold: 0 },
      { gold: 0 },
      { gold: 1 },
      { gold: 1 },
      { gold: 1 },
      { gold: 1 },
      { gold: 1 },
      { gold: 2 },
      { gold: 2 },
      { gold: 2 },
      { gold: 3 },
      { gold: 3 }
    ]
  }
}
