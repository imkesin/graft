import type { FruitName, PlayerCount } from "~/domain/CoreDefinitions"

/**
 * The three social groups an Influence card can court. Defined here (mirroring
 * `FRUIT_LIST_WITH_METADATA`) so the set is single-sourced and the compiler can
 * validate every card's `group`. Name-only for now; richer per-group metadata
 * (flavor, color, icon) can be added to these entries later.
 */
export const GROUP_LIST_WITH_METADATA = [
  { name: "Elites" },
  { name: "Merchants" },
  { name: "People" }
] as const
export type GroupName = typeof GROUP_LIST_WITH_METADATA[number]["name"]

/** Resource cost to play a card. Both required; 0 = none of that resource. */
export type Cost = {
  readonly workers: number
  readonly gold: number
}

/**
 * Copies present in the printed deck, keyed by player count. Every count is
 * required so omissions are impossible; 0 means the card is absent at that
 * count.
 */
export type Copies = Record<PlayerCount, number>

/**
 * One harvest row on a Field, unlocked in order. `capacity` is the Harvest
 * Capacity that row demands; `amount` is the INCREMENTAL fruit it yields. A
 * medium field
 *   [{ capacity: 1, amount: 1 }, { capacity: 2, amount: 2 }]
 * yields 1 fruit at capacity 1 and 3 total at capacity 2; a small field is a
 * single row.
 */
export type HarvestRow = {
  readonly capacity: number
  readonly amount: number
}

/** Intrinsic data shared by a card's definition and its physical copies. */
export type FieldCardBase = {
  readonly kind: "field"
  readonly id: string
  readonly name: string
  readonly cost: Cost
  readonly fruit: FruitName
  readonly rows: readonly HarvestRow[]
}

export type FieldImprovementCardBase = {
  readonly kind: "field-improvement"
  readonly id: string
  readonly name: string
  readonly cost: Cost
  readonly additionalText: string
}

/**
 * A personal goal card, drafted from its own shared Influence deck rather than
 * the Field/Field-improvement deck. Unlike the other kinds it carries no play
 * `cost`: you acquire it (flat off-card price) and later fulfill it. The goal
 * itself and any timing preconditions live in `additionalText`. Each card
 * courts exactly one `group`.
 */
export type InfluenceCardBase = {
  readonly kind: "influence"
  readonly id: string
  readonly name: string
  readonly group: GroupName
  readonly additionalText: string
}

/**
 * A ballot card that ships inside the Influence deck but is its own kind (as
 * field-improvement is to field). Placeholder: it carries only a name
 * ("Election") and its copy counts — the body is intentionally empty until the
 * mechanic is designed.
 */
export type ElectionCardBase = {
  readonly kind: "election"
  readonly id: string
  readonly name: string
}

export type CardBase =
  | FieldCardBase
  | FieldImprovementCardBase
  | InfluenceCardBase
  | ElectionCardBase

/**
 * A catalog entry: a card's intrinsic data plus how many copies the printed deck
 * holds at each player count. This is the authored source (see `deck.ts`).
 */
export type CardDefinition = CardBase & { readonly copies: Copies }

export type Deck = readonly CardDefinition[]

/**
 * A single physical card produced by expanding the catalog. `minPlayerCount` is
 * the player-count symbol it bears — the smallest player count at which this
 * copy is included. A definition with copies {2:1,3:1,4:2} expands to one "2"
 * card plus, at four players, an extra "4" card. Carries no `copies`.
 */
export type Card = CardBase & { readonly minPlayerCount: PlayerCount }
