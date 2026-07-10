/**
 * Card data model. The deck is a discriminated union over `kind`; each variant
 * carries its own fields. Card definitions live as typed TS literals (see
 * `deck.ts`), so the compiler validates the whole catalog at build time — there
 * is no runtime decoding step.
 */
export const PLAYER_COUNTS = [2, 3, 4] as const
export type PlayerCount = typeof PLAYER_COUNTS[number]

/**
 * Every fruit, with the noun used for its field card and the Panda color
 * scale used to identify it wherever fruits are color-coded (e.g. market
 * stalls). `fieldName` distinguishes the small-field names ("Small Rambutan
 * Orchard" vs "Small Orange Grove").
 */
export const FRUIT_LIST_WITH_METADATA = [
  { name: "Rambutan", fieldName: "Orchard", color: "red" },
  { name: "Orange", fieldName: "Grove", color: "orange" },
  { name: "Banana", fieldName: "Plantation", color: "yellow" },
  { name: "Lime", fieldName: "Grove", color: "lime" },
  { name: "Coconut", fieldName: "Plantation", color: "stone" },
  { name: "Passionfruit", fieldName: "Farm", color: "violet" },
  { name: "Dragonfruit", fieldName: "Terraces", color: "pink" }
] as const
export type FruitName = typeof FRUIT_LIST_WITH_METADATA[number]["name"]
export type FruitColor = typeof FRUIT_LIST_WITH_METADATA[number]["color"]

/**
 * The five social groups an Influence card can court. Defined here (mirroring
 * `FRUIT_LIST_WITH_METADATA`) so the set is single-sourced and the compiler can
 * validate every card's `group`. Name-only for now; richer per-group metadata
 * (flavor, color, icon) can be added to these entries later.
 */
export const GROUP_LIST_WITH_METADATA = [
  { name: "Laborers" },
  { name: "Landowners" },
  { name: "Politicians" },
  { name: "Merchants" },
  { name: "Church" }
] as const
export type GroupName = typeof GROUP_LIST_WITH_METADATA[number]["name"]

/** Resource cost to play a card. Both required; 0 = none of that resource. */
export type Cost = {
  workers: number
  gold: number
}

/**
 * Resources spent to FULFILL an Influence card (not to acquire it — acquisition is
 * a flat, off-card price). Distinct from `Cost`: it is paid at completion, not
 * on play, and each resource is optional (omit = none of it).
 */
export type AdditionalCost = {
  workers?: number
  gold?: number
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
  fruit: FruitName
  slots: readonly WorkerSlot[]
}

export type FieldImprovementCardBase = {
  kind: "field-improvement"
  id: string
  name: string
  cost: Cost
  additionalText: string
}

/**
 * A personal goal card, drafted from its own shared Influence deck rather than
 * the Field/Field-improvement deck. Unlike the other kinds it carries no play
 * `cost`: you acquire it (flat off-card price) and later fulfill it. Fulfilling
 * may demand `additionalCost` (optional); the goal itself and any timing
 * preconditions live in `additionalText`. Each card courts exactly one `group`.
 */
export type InfluenceCardBase = {
  kind: "influence"
  id: string
  name: string
  group: GroupName
  additionalCost?: AdditionalCost
  additionalText: string
}

/**
 * A ballot card that ships inside the Influence deck but is its own kind (as
 * field-improvement is to field). Placeholder: it carries only a name
 * ("Election") and its copy counts — the body is intentionally empty until the
 * mechanic is designed.
 */
export type ElectionCardBase = {
  kind: "election"
  id: string
  name: string
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
export type CardDefinition = CardBase & { copies: Copies }

export type Deck = readonly CardDefinition[]

/**
 * A single physical card produced by expanding the catalog. `minPlayerCount` is
 * the player-count symbol it bears — the smallest player count at which this
 * copy is included. A definition with copies {2:1,3:1,4:2} expands to one "2"
 * card plus, at four players, an extra "4" card. Carries no `copies`.
 */
export type Card = CardBase & { minPlayerCount: PlayerCount }
