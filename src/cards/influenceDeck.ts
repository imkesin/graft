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
    additionalCost: {
      gold: 5
    },
    copies: influenceCopies,
    additionalText: "Control 2 or more Infrastructure cards, and more than any other player."
  },
  {
    kind: "influence",
    id: "expansion",
    name: "Land Dominance",
    group: "Elites",
    additionalCost: {
      workers: 1,
      gold: 5
    },
    copies: influenceCopies,
    additionalText:
      "Construct a field. This must be at least your 4th field, and you must have more fields than any other player."
  },
  {
    kind: "influence",
    id: "synergistic-sale",
    name: "Synergistic Sale",
    group: "Merchants",
    copies: influenceCopies,
    additionalText:
      "Sell 3 fruits that are adjacent in the market in a single trip. For each copy of this Influence card in play, you must sell an additional adjacent fruit.\n\nEach fruit sold for this way induces 1 less demand and earns 1 less gold than usual."
  },
  {
    kind: "influence",
    id: "concentrated-sale",
    name: "Concentrated Sale",
    group: "Merchants",
    additionalCost: {
      gold: 1
    },
    copies: influenceCopies,
    additionalText:
      "Sell into a single fruit's demand until it is fully saturated. Each fruit sold for this Influence card induces 1 less demand than usual."
  },
  {
    kind: "influence",
    id: "improved-labor-standards",
    name: "Improved Labor Standards",
    group: "People",
    additionalCost: {
      workers: 1,
      gold: 2
    },
    copies: influenceCopies,
    additionalText:
      "No special prerequisites.\n\nYou must pay +1 additional gold when hiring a worker. This effect is permanent."
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
      "You must have harvested 5+ fruits on this turn.\n\nDiscard 2 of the harvested fruits. All other players (in order) may immediately harvest; this does not count as their turn."
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
