import type { FruitColor, FruitName, PlayerCount } from "~/cards/domain"

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
