import { FRUIT_LIST_WITH_METADATA, PLAYER_COUNTS } from "~/domain/CoreDefinitions"
import type { Card, CardDefinition, Deck } from "./domain"

const smallFields = FRUIT_LIST_WITH_METADATA.map(({ name, fieldName }) => ({
  kind: "field",
  id: `sm-${name.toLowerCase()}-field`,
  name: `Small ${name} ${fieldName}`,
  cost: {
    workers: 1,
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
    gold: 2,
    workers: 0
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
    gold: 4,
    workers: 1
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
    gold: 8,
    workers: 2
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
    gold: 10,
    workers: 3
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
      "During a Harvest, you may pay 1 Gold to increase your Harvest Capacity by 1. The additional capacity can only be applied to the attached field."
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
    additionalText:
      "Whenever you Sell, you may remove 1 fruit from this Field rather than taking it to market. If you do, collect +2 additional gold. This does not require any Transport Capacity."
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
    additionalText: "Whenever this Field is harvested with maximum Harvest Capacity, it yields +1 fruit."
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
      "Whenever this Field and at least 1 other Field are Harvested in the same action, you may retain 1 worker that would otherwise be returned to the Labor Supply."
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
