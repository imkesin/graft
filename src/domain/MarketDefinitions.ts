import { FRUIT_LIST_WITH_METADATA, type FruitColor, type FruitName, type PlayerCount } from "~/domain/CoreDefinitions"

/**
 * One slot on a fruit's demand track: what a sale there pays in gold, and the
 * incremental demand it induces elsewhere on sale (exact mechanic TBD).
 */
export type DemandSlot = {
  readonly gold: number
  readonly inducedDemand: number
}

export type MarketStallDefinition = {
  readonly fruit: FruitName
  readonly color: FruitColor
  /** Demand track, keyed by player count — slot count grows with players. */
  readonly demandTrack: Record<PlayerCount, readonly DemandSlot[]>
  /** Other fruits whose demand this one induces when sold — shown as text on the stall rather than as a board-wide arrow diagram. */
  readonly induces: readonly FruitName[]
}

/**
 * One cost tier on the Labor Market: a group of `count` interchangeable
 * workers, all hired for the same `gold` price. Grouping workers by price
 * (rather than one slot per worker) keeps the track compact vertically — a
 * tier renders its price once alongside a row of `count` token slots.
 */
export type LaborTier = {
  readonly gold: number
  readonly count: number
}

export type LaborMarketDefinition = {
  /** Worker cost tiers, keyed by player count — cheapest first. Both the tier count and workers-per-tier can grow with players. */
  readonly workerTrack: Record<PlayerCount, readonly LaborTier[]>
}

const FRUIT_NAMES = FRUIT_LIST_WITH_METADATA.map((f) => f.name)

/**
 * Placeholder induced-demand relationships: each fruit induces the next three
 * fruits in the list, wrapping around. Real relationships TBD.
 */
function placeholderInduces(index: number): readonly FruitName[] {
  return [1, 2, 4].map((offset) => FRUIT_NAMES[(index + offset) % FRUIT_NAMES.length]!)
}

/**
 * Placeholder demand track, shared by every fruit until real per-fruit
 * numbers are set. Authored as plain literals: hand-edit values directly, or
 * add/remove slots to change slot count. To customize one fruit, replace its
 * `demandTrack` in `marketStalls` below instead of editing this shared one.
 *
 * `gold: 0` or `inducedDemand: 0` on a slot renders that row blank (see the
 * last slot of each track below for an example).
 */
const placeholderDemandTrack = {
  2: [
    { gold: 5, inducedDemand: 0 },
    { gold: 3, inducedDemand: 1 },
    { gold: 2, inducedDemand: 1 },
    { gold: 1, inducedDemand: 1 },
    { gold: 0, inducedDemand: 2 }
  ],
  3: [
    { gold: 5, inducedDemand: 0 },
    { gold: 3, inducedDemand: 1 },
    { gold: 2, inducedDemand: 1 },
    { gold: 2, inducedDemand: 1 },
    { gold: 1, inducedDemand: 1 },
    { gold: 0, inducedDemand: 2 }
  ],
  4: [
    { gold: 5, inducedDemand: 0 },
    { gold: 3, inducedDemand: 1 },
    { gold: 3, inducedDemand: 1 },
    { gold: 2, inducedDemand: 1 },
    { gold: 2, inducedDemand: 1 },
    { gold: 1, inducedDemand: 1 },
    { gold: 0, inducedDemand: 2 }
  ]
} as const satisfies Record<PlayerCount, readonly DemandSlot[]>

export const marketStalls: readonly MarketStallDefinition[] = FRUIT_LIST_WITH_METADATA.map((
  { name, color },
  index
) => ({
  fruit: name,
  color,
  demandTrack: placeholderDemandTrack,
  induces: placeholderInduces(index)
}))
