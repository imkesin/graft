import type { FruitColor, FruitName, PlayerCount } from "~/cards/domain"

/**
 * One slot on a fruit's demand track: what a sale there pays in gold, and the
 * incremental demand it induces elsewhere on sale (exact mechanic TBD).
 */
export type DemandSlot = {
  gold: number
  inducedDemand: number
}

export type MarketStallDefinition = {
  fruit: FruitName
  color: FruitColor
  /** Demand track, keyed by player count — slot count grows with players. */
  demandTrack: Record<PlayerCount, readonly DemandSlot[]>
  /** Other fruits whose demand this one induces when sold — shown as text on the stall rather than as a board-wide arrow diagram. */
  induces: readonly FruitName[]
}

/**
 * One worker up for hire on the Labor Market track: what it costs in gold to
 * take. A single dimension, unlike a fruit's `DemandSlot` — no induced
 * demand.
 */
export type LaborSlot = {
  gold: number
}

export type LaborMarketDefinition = {
  /** Worker track, keyed by player count — worker count grows with players, same as MarketStallDefinition's demandTrack. */
  workerTrack: Record<PlayerCount, readonly LaborSlot[]>
}
