import type { CardDefinition, Deck } from "./domain"

/**
 * Influence cards live in one shared deck, separate from the Field /
 * Field-improvement `deck` (see `deck.ts`). Each card courts exactly one social
 * `group`; the cards are authored as one array per group and spread into the
 * final `influenceDeck` below, so the deck reads as distinct blocks. Placeholder
 * text until the real card copy is drafted.
 */

const laborInfluences = [
  {
    kind: "influence",
    id: "improved-labor-standards",
    name: "Improved Labor Standards",
    group: "Laborers",
    additionalCost: {
      workers: 1
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText:
      "No special prerequisites.\n\nAfter fulfilling the Influence card, you must pay +1 additional gold when hiring a worker. This effect is permanent."
  },
  {
    kind: "influence",
    id: "upskilling",
    name: "Upskilling",
    group: "Laborers",
    additionalCost: {
      gold: 6
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText:
      "No special prerequisites.\n\nRemove 1 worker you employ from the game; it does not return the general labor pool."
  },
  {
    kind: "influence",
    id: "harvest-festival",
    name: "Harvest Festival",
    group: "Laborers",
    additionalCost: {
      workers: 1,
      gold: 4
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText:
      "Harvest 5+ fruits on this turn. All other players (in order) may immediately harvest. This does not count as their turn."
  },
  {
    kind: "influence",
    id: "respect-the-strikes",
    name: "Respect the Strikes",
    group: "Laborers",
    additionalCost: {
      gold: 2
    },
    copies: {
      2: 0,
      3: 1,
      4: 1
    },
    additionalText:
      "Return all workers you employ to the general labor pool. If you return four or more workers this way, all other players must return 1 worker to the general pool."
  },
  {
    kind: "influence",
    id: "large-employer",
    name: "Large Employer",
    group: "Laborers",
    additionalCost: {
      workers: 2
    },
    copies: {
      2: 0,
      3: 0,
      4: 1
    },
    additionalText: "Employ more workers than the next two largest employers combined"
  }
] satisfies ReadonlyArray<CardDefinition>

const landownerInfluences = [
  {
    kind: "influence",
    id: "land-and-expand",
    name: "Land and Expand",
    group: "Landowners",
    additionalCost: {
      workers: 2,
      gold: 6
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText: "Control 4+ Fields and more fields than any other player."
  },
  {
    kind: "influence",
    id: "dynastic-wedding",
    name: "Dynastic Wedding",
    group: "Landowners",
    additionalCost: {
      gold: 15,
      workers: 5
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText: "No additional conditions."
  },
  {
    kind: "influence",
    id: "settle-border-dispute",
    name: "Settle Border Dispute",
    group: "Landowners",
    additionalCost: {
      gold: 1
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText: "Discard a field card from your hand. It cannot be recovered."
  },
  {
    kind: "influence",
    id: "patient-investor",
    name: "Patient Investor",
    group: "Landowners",
    additionalCost: { gold: 12 },
    copies: {
      2: 0,
      3: 1,
      4: 1
    },
    additionalText: "Have more gold than the next two wealthiest players combined."
  },
  {
    kind: "influence",
    id: "unified-orchards",
    name: "Unified Orchards",
    group: "Landowners",
    additionalCost: {
      gold: 6
    },
    copies: {
      2: 0,
      3: 0,
      4: 1
    },
    additionalText: "Control four or more fields that can produce the same fruit."
  }
] satisfies ReadonlyArray<CardDefinition>

const politicianInfluences = [
  {
    kind: "influence",
    id: "retirement-party",
    name: "Retirement Party",
    group: "Politicians",
    additionalCost: {
      gold: 5,
      workers: 1
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText:
      "You family worker must not have worked this turn.\n\nAfter fulfilling the Influence card, your family worker is no longer in the game. This effect is permanent."
  },
  {
    kind: "influence",
    id: "local-infrastructure",
    name: "Local Infrastructure",
    group: "Politicians",
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalCost: {
      gold: 12,
      workers: 3
    },
    additionalText: "Discard a field improvement card from your hand. It cannot be recovered."
  },
  {
    kind: "influence",
    id: "police-protection",
    name: "Police Protection",
    group: "Politicians",
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalCost: {
      gold: 6
    },
    additionalText:
      "No additional prerequisites.\n\nWhenever you go to market, you must pay +1 gold. This effect is permanent."
  },
  {
    kind: "influence",
    id: "market-festival",
    name: "Market Festival",
    group: "Politicians",
    additionalCost: { gold: 10 },
    copies: {
      2: 0,
      3: 1,
      4: 1
    },
    additionalText:
      "Earn 8 or more gold when selling in the market. All other players (in order) may immediately sell into the market. This does not count as their turn."
  },
  {
    kind: "influence",
    id: "fight-corruption",
    name: "Fight Corruption",
    group: "Politicians",
    additionalCost: { gold: 10 },
    copies: {
      2: 0,
      3: 0,
      4: 1
    },
    additionalText:
      "You family worker must have returned from gaining influence this turn. You do not gain any gold from influencing."
  }
] satisfies ReadonlyArray<CardDefinition>

const merchantInfluences = [
  {
    kind: "influence",
    id: "synergistic-sale",
    name: "Synergistic Sale",
    group: "Merchants",
    additionalCost: {
      gold: 2
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText:
      "Sell three fruits that are adjacent in the market in a single trip. Each fruit sold for this Influence card induces 1 less demand than usual."
  },
  {
    kind: "influence",
    id: "pair-trade",
    name: "Pair Trade",
    group: "Merchants",
    additionalCost: {
      gold: 4
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText:
      "Sell 2+ units of two different kinds of fruit in the market. Each fruit sold for this Influence card induces 1 less demand than usual."
  },
  {
    kind: "influence",
    id: "market-maker",
    name: "Market Maker",
    group: "Merchants",
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalCost: {
      gold: 1
    },
    additionalText:
      "Sell 2+ fruits of a type with maximum demand (empty track). Each fruit sold for this Influence card results in 1 less demand than usual."
  },
  {
    kind: "influence",
    id: "reliable-delivery",
    name: "Reliable Delivery",
    group: "Merchants",
    additionalCost: { gold: 1 },
    copies: {
      2: 0,
      3: 1,
      4: 1
    },
    additionalText:
      "Sell three or more of single fruit into the market, saturating demand. Each fruit sold for this Influence card results in 1 less demand than usual."
  },
  {
    kind: "influence",
    id: "financier",
    name: "Financier",
    group: "Merchants",
    additionalCost: { gold: 15 },
    copies: {
      2: 0,
      3: 0,
      4: 1
    },
    additionalText: "No additional prerequisites.\n\nYou receive +1 gold each time you sell in the market."
  }
] satisfies ReadonlyArray<CardDefinition>

const churchInfluences = [
  {
    kind: "influence",
    id: "donate-excess",
    name: "Donate Excess",
    group: "Church",
    additionalCost: {
      workers: 2
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText:
      "Discard two harvested fruits from any of your fields. The demand for fruit discarded this way must be already saturated in the market."
  },
  {
    kind: "influence",
    id: "blessed-crop",
    name: "Blessed Crop",
    group: "Church",
    additionalCost: {
      gold: 6
    },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText:
      "Increase the demand of a crop you can produce by 1. You must have harvested this crop this turn.\n\nThen, decrease the demand for all other crops by 1."
  },
  {
    kind: "influence",
    id: "clean-ledger",
    name: "Clean Ledger",
    group: "Church",
    additionalCost: { gold: 2 },
    copies: {
      2: 1,
      3: 1,
      4: 1
    },
    additionalText:
      "No additional prerequisites.\n\nAny time you earn 5+ gold selling in the market, you must immediately pay 2 gold back to the Church."
  },
  {
    kind: "influence",
    id: "monastic-vineyard",
    name: "Monastic Vineyard",
    group: "Church",
    additionalCost: {
      workers: 2,
      gold: 2
    },
    copies: {
      2: 0,
      3: 1,
      4: 1
    },
    additionalText:
      "Attach this influence card to a field as if it were an improvement.\n\nAny time you harvest this field, it produces 1 fewer fruit than it would otherwise."
  },
  {
    kind: "influence",
    id: "rest-the-land",
    name: "Rest the Land",
    group: "Church",
    additionalCost: {
      workers: 1
    },
    copies: {
      2: 0,
      3: 0,
      4: 1
    },
    additionalText:
      "No additional prerequisites.\n\nIn any future harvest, at least 2 of the fields you control must not produce fruit. This effect is permanent."
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
      4: 5
    }
  }
] satisfies ReadonlyArray<CardDefinition>

export const influenceDeck: Deck = [
  ...laborInfluences,
  ...landownerInfluences,
  ...politicianInfluences,
  ...merchantInfluences,
  ...churchInfluences,
  ...elections
]
