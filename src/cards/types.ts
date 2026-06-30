/**
 * Card data model. The deck is a discriminated union over `kind`; each variant
 * carries its own fields. Card definitions live as typed TS literals (see
 * `deck.ts`), so the compiler validates the whole catalog at build time — there
 * is no runtime decoding step.
 */

export type PlayerCount = 2 | 3 | 4

export type Fruit =
  | "Rambutan"
  | "Orange"
  | "Banana"
  | "Lime"
  | "Passionfruit"
  | "Dragonfruit"
  | "Coconut"

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

export type FieldCard = {
  kind: "field"
  id: string
  name: string
  cost: Cost
  copies: Copies
  /** A field produces a single fruit type. */
  fruit: Fruit
  slots: readonly WorkerSlot[]
}

export type FieldImprovementCard = {
  kind: "field-improvement"
  id: string
  name: string
  cost: Cost
  copies: Copies
  /** Placeholder rules text until the mechanic is finalized. */
  additionalText: string
}

export type Card = FieldCard | FieldImprovementCard

export type Deck = readonly Card[]
