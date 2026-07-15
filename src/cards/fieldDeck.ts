import { type Card, type CardDefinition, type Deck, FRUIT_LIST_WITH_METADATA, PLAYER_COUNTS } from "./domain"

const smallFields = FRUIT_LIST_WITH_METADATA.map(({ name, fieldName }) => ({
  kind: "field",
  id: `sm-${name.toLowerCase()}-field`,
  name: `Small ${name} ${fieldName}`,
  cost: {
    workers: 2,
    gold: 6
  },
  copies: {
    2: 1,
    3: 1,
    4: 1
  },
  fruit: name,
  slots: [
    { workers: 1, amount: 1 }
  ]
})) satisfies ReadonlyArray<CardDefinition>

const wildFields = FRUIT_LIST_WITH_METADATA.map(({ name, fieldName }) => ({
  kind: "field",
  id: `wild-${name.toLowerCase()}-field`,
  name: `Wild ${name} ${fieldName}`,
  cost: {
    workers: 0,
    gold: 2
  },
  copies: {
    2: 1,
    3: 1,
    4: 1
  },
  fruit: name,
  slots: [
    { workers: 2, amount: 1 },
    { workers: 1, amount: 1 }
  ]
})) satisfies ReadonlyArray<CardDefinition>

const remoteFields = FRUIT_LIST_WITH_METADATA.map(({ name, fieldName }) => ({
  kind: "field",
  id: `remote-${name.toLowerCase()}-field`,
  name: `Remote ${name} ${fieldName}`,
  cost: {
    workers: 2,
    gold: 4
  },
  copies: {
    2: 0,
    3: 0,
    4: 1
  },
  fruit: name,
  slots: [
    { workers: 2, amount: 2 }
  ]
})) satisfies ReadonlyArray<CardDefinition>

const mediumFields = FRUIT_LIST_WITH_METADATA.map(({ name, fieldName }) => ({
  kind: "field",
  id: `md-${name.toLowerCase()}-field`,
  name: `Medium ${name} ${fieldName}`,
  cost: {
    workers: 3,
    gold: 9
  },
  copies: {
    2: 1,
    3: 1,
    4: 1
  },
  fruit: name,
  slots: [
    { workers: 1, amount: 1 },
    { workers: 1, amount: 2 }
  ]
})) satisfies ReadonlyArray<CardDefinition>

const largeFields = FRUIT_LIST_WITH_METADATA.map(({ name, fieldName }) => ({
  kind: "field",
  id: `lg-${name.toLowerCase()}-field`,
  name: `Large ${name} ${fieldName}`,
  cost: {
    workers: 4,
    gold: 12
  },
  copies: {
    2: 0,
    3: 1,
    4: 1
  },
  fruit: name,
  slots: [
    { workers: 1, amount: 2 },
    { workers: 2, amount: 3 }
  ]
})) satisfies ReadonlyArray<CardDefinition>

export const fieldDeck: Deck = [
  ...smallFields,
  ...wildFields,
  ...remoteFields,
  ...mediumFields,
  ...largeFields,
  {
    kind: "field-improvement",
    id: "local-workforce",
    name: "Local Workforce",
    cost: {
      workers: 0,
      gold: 2
    },
    copies: {
      2: 2,
      3: 3,
      4: 3
    },
    additionalText:
      "During a harvest, you may pay 1 gold to work one empty slot on this Field (rather than using a worker from your pool)."
  },
  {
    kind: "field-improvement",
    id: "on-site-processing",
    name: "On-Site Processing",
    cost: {
      workers: 1,
      gold: 2
    },
    copies: {
      2: 2,
      3: 3,
      4: 3
    },
    additionalText: "Whenever you sell two or more fruits from this Field, gain an additional +2 gold."
  },
  {
    kind: "field-improvement",
    id: "focus-on-quality",
    name: "Focus on Quality",
    cost: {
      workers: 1,
      gold: 0
    },
    copies: {
      2: 2,
      3: 2,
      4: 3
    },
    additionalText:
      "When fruit harvested from this Field is sold in the market, collect +3 additional gold.\n\nA field improved this way cannot produce more than 1 fruit per harvest."
  },
  {
    kind: "field-improvement",
    id: "dense-planting",
    name: "Dense Planting",
    cost: {
      workers: 1,
      gold: 1
    },
    copies: {
      2: 2,
      3: 2,
      4: 3
    },
    additionalText: "Whenever this Field is harvested with all worker slots full, it yields +1 fruit."
  },
  {
    kind: "field-improvement",
    id: "irrigation-channel",
    name: "Irrigation Channel",
    cost: {
      workers: 2,
      gold: 2
    },
    copies: {
      2: 1,
      3: 2,
      4: 3
    },
    additionalText:
      "After a worker has harvested this field, you may retain them by immediately moving them into a slot on another field. Only 1 worker may be retained this way."
  }
]

/**
 * Turn a catalog definition into a single physical card for preview, stamped
 * with the lowest player count at which it appears.
 */
export function previewCard({ copies, ...base }: CardDefinition): Card {
  const minPlayerCount = PLAYER_COUNTS.find((n) => copies[n] > 0) ?? PLAYER_COUNTS[0]
  return { ...base, minPlayerCount }
}
