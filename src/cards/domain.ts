/**
 * Card data model. The deck is a discriminated union over `kind`; each variant
 * carries its own fields. Card definitions live as typed TS literals (see
 * `deck.ts`), so the compiler validates the whole catalog at build time — there
 * is no runtime decoding step.
 */
export const PLAYER_COUNTS = [2, 3, 4] as const
export type PlayerCount = typeof PLAYER_COUNTS[number]

/**
 * Every fruit, with the noun used for its field card. `fieldName` distinguishes
 * the small-field names ("Small Rambutan Orchard" vs "Small Orange Grove").
 */
export const FRUIT_LIST_WITH_METADATA = [
  { name: "Rambutan", fieldName: "Orchard" },
  { name: "Orange", fieldName: "Grove" },
  { name: "Banana", fieldName: "Plantation" },
  { name: "Lime", fieldName: "Grove" },
  { name: "Passionfruit", fieldName: "Farm" },
  { name: "Dragonfruit", fieldName: "Terraces" },
  { name: "Coconut", fieldName: "Plantation" }
] as const
export type FruitName = typeof FRUIT_LIST_WITH_METADATA[number]["name"]

/** Resource cost to play a card. Both required; 0 = none of that resource. */
export type Cost = {
  workers: number
  gold: number
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
  workers: number
  amount: number
}

/** Intrinsic data shared by a card's definition and its physical copies. */
export type FieldCardBase = {
  kind: "field"
  id: string
  name: string
  cost: Cost
  /** A field produces a single fruit type. */
  fruit: FruitName
  slots: readonly WorkerSlot[]
}

export type FieldImprovementCardBase = {
  kind: "field-improvement"
  id: string
  name: string
  cost: Cost
  /** Placeholder rules text until the mechanic is finalized. */
  additionalText: string
}

export type CardBase = FieldCardBase | FieldImprovementCardBase

/**
 * A catalog entry: a card's intrinsic data plus how many copies the printed deck
 * holds at each player count. This is the authored source (see `deck.ts`).
 */
export type CardDefinition = CardBase & { copies: Copies }

export type Deck = readonly CardDefinition[]

/**
 * A single physical card produced by expanding the catalog. `minPlayerCount` is
 * the player-count symbol it bears — the smallest player count at which this
 * copy is included. A definition with copies {2:1,3:1,4:2} expands to one "2"
 * card plus, at four players, an extra "4" card. Carries no `copies`.
 */
export type Card = CardBase & { minPlayerCount: PlayerCount }
