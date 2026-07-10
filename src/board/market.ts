import { FRUIT_LIST_WITH_METADATA } from "~/cards/domain"
import type { FruitName } from "~/cards/domain"
import type { DemandSlot, MarketStallDefinition } from "./domain"

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
const placeholderDemandTrack: Record<2 | 3 | 4, readonly DemandSlot[]> = {
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
}

export const marketStalls: readonly MarketStallDefinition[] = FRUIT_LIST_WITH_METADATA.map((
  { name, color },
  index
) => ({
  fruit: name,
  color,
  demandTrack: placeholderDemandTrack,
  induces: placeholderInduces(index)
}))
