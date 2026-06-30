import type { Card, Deck, PlayerCount } from "./types"

export const deck: Deck = [
  {
    kind: "field",
    id: "sm-rambutan-field",
    name: "Small Rambutan Orchard",
    cost: {
      workers: 2,
      gold: 6
    },
    copies: {
      2: 2,
      3: 2,
      4: 2
    },
    fruit: "Rambutan",
    slots: [{ workers: 1, amount: 1 }]
  },
  {
    kind: "field",
    id: "md-rambutan-field",
    name: "Medium Rambutan Plantation",
    cost: {
      workers: 3,
      gold: 9
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    fruit: "Rambutan",
    slots: [
      { workers: 1, amount: 1 },
      { workers: 1, amount: 2 }
    ]
  },
  {
    kind: "field",
    id: "sm-orange-field",
    name: "Small Orange Grove",
    cost: {
      workers: 2,
      gold: 5
    },
    copies: {
      2: 2,
      3: 2,
      4: 2
    },
    fruit: "Orange",
    slots: [{ workers: 1, amount: 1 }]
  },
  {
    kind: "field",
    id: "sm-banana-field",
    name: "Small Banana Plantation",
    cost: {
      workers: 2,
      gold: 5
    },
    copies: {
      2: 2,
      3: 2,
      4: 2
    },
    fruit: "Banana",
    slots: [{ workers: 1, amount: 1 }]
  },
  {
    kind: "field",
    id: "medium-banana-field",
    name: "Banana Plantation",
    cost: { workers: 1, gold: 2 },
    copies: { 2: 3, 3: 4, 4: 5 },
    fruit: "Banana",
    slots: [
      { workers: 1, amount: 1 },
      { workers: 2, amount: 2 }
    ]
  },
  {
    kind: "field",
    id: "dragonfruit-terraces",
    name: "Dragonfruit Terraces",
    cost: { workers: 2, gold: 3 },
    copies: { 2: 2, 3: 3, 4: 3 },
    fruit: "Dragonfruit",
    slots: [
      { workers: 1, amount: 1 },
      { workers: 2, amount: 2 },
      { workers: 3, amount: 4 }
    ]
  },
  {
    kind: "field-improvement",
    id: "irrigation-channel",
    name: "Irrigation Channel",
    cost: { workers: 1, gold: 1 },
    copies: { 2: 2, 3: 2, 4: 3 },
    additionalText: "Attach to a Field. Its first worker slot yields +1 fruit."
  },
  {
    kind: "field-improvement",
    id: "trellis-system",
    name: "Trellis System",
    cost: { workers: 0, gold: 2 },
    copies: { 2: 1, 3: 2, 4: 2 },
    additionalText: "Attach to a Field. Add one worker slot yielding +1 fruit."
  }
]

/**
 * Flatten the catalog into the physical deck for `players`, repeating each card
 * by its copy count at that player count.
 */
export function expandDeck(source: Deck, players: PlayerCount): readonly Card[] {
  return source.flatMap((card) => Array.from({ length: card.copies[players] }, () => card))
}
