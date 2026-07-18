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
 * Resources spent to FULFILL an Influence card (not to acquire it — acquisition is
 * a flat, off-card price). Distinct from `Cost`: it is paid at completion, not
 * on play, and each resource is optional (omit = none of it).
 */
export type AdditionalCost = {
  readonly workers?: number
  readonly gold?: number
}

/**
 * Copies present in the printed deck, keyed by player count. Every count is
 * required so omissions are impossible; 0 means the card is absent at that
 * count.
 */
export type Copies = Record<PlayerCount, number>

/**
 * One worker slot on a Field, filled in order. `amount` is the INCREMENTAL
 * fruit this slot yields. A medium field
 *   [{ workers: 1, amount: 1 }, { workers: 2, amount: 2 }]
 * yields 1 fruit with one worker and 3 with two; a small field is a single
 * slot. `workers` is explicit so a future slot needing >1 worker fits without
 * reshaping the model.
 */
export type WorkerSlot = {
  readonly workers: number
  readonly amount: number
}

/** Intrinsic data shared by a card's definition and its physical copies. */
export type FieldCardBase = {
  readonly kind: "field"
  readonly id: string
  readonly name: string
  readonly cost: Cost
  readonly fruit: FruitName
  readonly slots: readonly WorkerSlot[]
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
 * `cost`: you acquire it (flat off-card price) and later fulfill it. Fulfilling
 * may demand `additionalCost` (optional); the goal itself and any timing
 * preconditions live in `additionalText`. Each card courts exactly one `group`.
 */
export type InfluenceCardBase = {
  readonly kind: "influence"
  readonly id: string
  readonly name: string
  readonly group: GroupName
  readonly additionalCost?: AdditionalCost
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
