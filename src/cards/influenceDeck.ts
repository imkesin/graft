import type { CardDefinition, Deck } from "./domain"

/**
 * Influence cards live in one shared deck, separate from the Field /
 * Field-improvement `deck`. Each card courts exactly one social `group` — two
 * cards per group (Elites, Merchants, People). Every influence card ships in
 * equal quantity: 3 copies at 2 players, 4 at 3, 5 at 4. The Election card is
 * its own kind in the same deck, with its own higher counts.
 */

const influenceCopies = {
  2: 3,
  3: 4,
  4: 5
} as const

const influences = [
  {
    kind: "influence",
    id: "investor",
    name: "Investor",
    group: "Elites",
    copies: influenceCopies,
    additionalText:
      "Upgrade infrastructure. All types must be at least level 3. You do not receive the immediate bonus associated with the upgrade."
  },
  {
    kind: "influence",
    id: "expansion",
    name: "Land Dominance",
    group: "Elites",
    copies: influenceCopies,
    additionalText:
      "Cultivate a Field. This must be at least your 4th Field, and you must have more Fields than any other player.\n\nAs an additional cost, discard 1 Field Card from your hand. And, for each copy of this Influence Card already in play, you must discard 1 additional Field Card."
  },
  {
    kind: "influence",
    id: "synergistic-sale",
    name: "Synergistic Sale",
    group: "Merchants",
    copies: influenceCopies,
    additionalText:
      "Sell 3 Fruits that are adjacent in the market in a single trip. For each copy of this Influence Card in play, you must sell an additional adjacent Fruit.\n\nDo not collect Gold or induce demand in the sale."
  },
  {
    kind: "influence",
    id: "concentrated-sale",
    name: "Concentrated Sale",
    group: "Merchants",
    copies: influenceCopies,
    additionalText:
      "Sell 2 or more Fruits of a single type and fill their demand track. For each copy of this Influence Card already in play, you must satisfy the requirement for an additional type of fruit.\n\nDo not collect Gold or induce demand in the sale."
  },
  {
    kind: "influence",
    id: "improved-labor-standards",
    name: "Improved Labor Standards",
    group: "People",
    copies: influenceCopies,
    additionalText:
      "After recruiting workers, you must now employ at least twice as many workers as the next largest employer. Then, pay an additional 1 Gold for each worker you employ and return them all to the Labor Supply. For each copy of this Influence Card already in play, you must pay an additional 1 Gold for each worker returned."
  },
  {
    kind: "influence",
    id: "harvest-festival",
    name: "Harvest Festival",
    group: "People",
    additionalCost: {
      workers: 1,
      gold: 4
    },
    copies: influenceCopies,
    additionalText:
      "You must have harvested 5 or more fruits on this turn. Then, return 2 of the harvested fruits to Supply. For each copy of this influence card already in play, you must harvest an additional fruit and return it to Supply."
  }
] satisfies ReadonlyArray<CardDefinition>

const elections = [
  {
    kind: "election",
    id: "election",
    name: "Election",
    copies: {
      2: 4,
      3: 5,
      4: 6
    }
  }
] satisfies ReadonlyArray<CardDefinition>

export const influenceDeck: Deck = [
  ...influences,
  ...elections
]
