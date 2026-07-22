import type { CardDefinition, Deck } from "./domain"

const influenceCopies = {
  2: 2,
  3: 3,
  4: 4,
  5: 4
} as const

const influences = [
  {
    kind: "influence",
    id: "mechanization",
    name: "Mechanization",
    group: "Elites",
    copies: influenceCopies,
    additionalText:
      "Improve a field.\n\nThis must be at least your 4th Field Improvement, and you must have more Field Improvements than any other Player."
  },
  {
    kind: "influence",
    id: "expansion",
    name: "Land Dominance",
    group: "Elites",
    copies: influenceCopies,
    additionalText:
      "Cultivate a Field.\n\nThis must be at least your 5th Field, and you must have more Fields than any other Player."
  },
  {
    kind: "influence",
    id: "synergistic-sale",
    name: "Synergistic Sale",
    group: "Merchants",
    copies: influenceCopies,
    additionalText:
      "Sell 4 Fruits that are adjacent in the Market in a single trip.\n\nFor each copy of this Influence Card in play, you must sell an additional adjacent Fruit.\n\nDo not collect Gold or induce demand for this sale."
  },
  {
    kind: "influence",
    id: "market-maker",
    name: "Market Maker",
    group: "Merchants",
    copies: influenceCopies,
    additionalText:
      "Sell at least 2 Fruits of two different types (4+ total), filling their demand tracks.\n\nFor each copy of this Influence Card already in play, you must fill the demand track of an additional type.\n\nDo not collect Gold or induce demand in the sale."
  },
  {
    kind: "influence",
    id: "improved-labor-standards",
    name: "Improved Labor Standards",
    group: "People",
    copies: influenceCopies,
    additionalText:
      "After recruiting, the Labor Supply must be empty and you must employ more Workers than any other Player. Then, return all Workers you control to the labor supply.\n\nFor each copy of this Influence Card already in play, you must pay an additional 1 Gold for each Worker returned."
  },
  {
    kind: "influence",
    id: "harvest-festival",
    name: "Harvest Festival",
    group: "People",
    copies: influenceCopies,
    additionalText:
      "Harvest 8 or more Fruits. Then, return 4 Fruits to Supply.\n\nFor each copy of this influence card already in play, you must harvest an additional Fruit and immediately return it to Supply."
  }
] satisfies ReadonlyArray<CardDefinition>

const elections = [
  {
    kind: "election",
    id: "election",
    name: "Election",
    copies: {
      2: 3,
      3: 4,
      4: 5,
      5: 5
    }
  }
] satisfies ReadonlyArray<CardDefinition>

export const influenceDeck: Deck = [
  ...influences,
  ...elections
]
