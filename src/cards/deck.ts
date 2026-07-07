import {
  type Card,
  type CardDefinition,
  type Deck,
  FRUIT_LIST_WITH_METADATA,
  PLAYER_COUNTS,
  type PlayerCount
} from "./domain"

const smallFields = FRUIT_LIST_WITH_METADATA.map(({ name, fieldName }) => ({
  kind: "field",
  id: `sm-${name.toLowerCase()}-field`,
  name: `Small ${name} ${fieldName}`,
  cost: {
    workers: 2,
    gold: 6
  },
  copies: {
    2: 2,
    3: 2,
    4: 2
  },
  fruit: name,
  slots: [
    { workers: 1, amount: 1 }
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
    4: 2
  },
  fruit: name,
  slots: [
    { workers: 1, amount: 1 },
    { workers: 1, amount: 2 }
  ]
})) satisfies ReadonlyArray<CardDefinition>

export const deck: Deck = [
  ...smallFields,
  ...mediumFields,
  {
    kind: "field-improvement",
    id: "irrigation-channel",
    name: "Irrigation Channel",
    cost: { workers: 3, gold: 3 },
    copies: {
      2: 1,
      3: 1,
      4: 2
    },
    additionalText: "After a worker has harvested this field, you may retain them by immediately moving them into a slot on another field. A maximum of 2 workers may be retained this way"
  },
    {
    kind: "field-improvement",
    id: "local-workforce",
    name: "Local Workforce",
    cost: { workers: 0, gold: 2 },
    copies: {
      2: 1,
      3: 2,
      4: 2
    },
    additionalText: "During a harvest, you may pay 1 gold to work one empty slot on this Field (rather than using a worker from your pool)."
  },
  {
    kind: "field-improvement",
    id: "focus-on-quality",
    name: "Focus on Quality",
    cost: { workers: 1, gold: 0 },
    copies: {
      2: 1,
      3: 2,
      4: 2
    },
    additionalText: "When fruit harvested from this Field is sold in the market, collect +2 additional gold for each sold this way. A field improved this way cannot produce more than two fruit per harvest."
  },
  {
    kind: "field-improvement",
    id: "high-density-planting",
    name: "High-Density Planting",
    cost: { workers: 2, gold: 2 },
    copies: {
      2: 1,
      3: 2,
      4: 2
    },
    additionalText: "Whenever this Field is harvested by the maximum number of workers, it yields +1 fruit."
  },
  {
    kind: "field-improvement",
    id: "on-site-processing",
    name: "On-Site Processing",
    cost: { workers: 1, gold: 3 },
    copies: {
      2: 1,
      3: 1,
      4: 2
    },
    additionalText: "Whenever you sell two or more fruits from this Field, gain an additional +2 gold."
  },
  {
    kind: "field-improvement",
    id: "companion-planting",
    name: "Companion Planting",
    cost: { workers: 2, gold: 0 },
    copies: {
      2: 1,
      3: 1,
      4: 2
    },
    additionalText: "Whenever this field and a field of a different fruit are harvest simultaneously, receive +1 fruit of either variety."
  }
]

/**
 * Expand the catalog into the physical deck for `players`: one entry per printed
 * copy. A card whose copy count grows with player count is split so each copy
 * carries the player-count symbol at which it enters (`minPlayers`) — copies
 * {2:1,3:1,4:2} yield one "2" copy and one "4" copy. Copies whose symbol exceeds
 * `players` are filtered out, so the result holds exactly `copies[players]` of
 * each card.
 */
export function expandDeck(source: Deck, players: PlayerCount): readonly Card[] {
  return source.flatMap(({ copies, ...base }) =>
    PLAYER_COUNTS.reduce<{ previous: number; cards: Card[] }>(
      ({ previous, cards }, minPlayerCount) => {
        const introduced = copies[minPlayerCount] - previous

        if (minPlayerCount <= players && introduced > 0) {
          cards.push(...Array.from({ length: introduced }, () => ({ ...base, minPlayerCount })))
        }
        return { previous: copies[minPlayerCount], cards }
      },
      {
        previous: 0,
        cards: []
      }
    ).cards
  )
}

/**
 * Turn a catalog definition into a single physical card for preview, stamped
 * with the lowest player count at which it appears.
 */
export function previewCard({ copies, ...base }: CardDefinition): Card {
  const minPlayerCount = PLAYER_COUNTS.find((n) => copies[n] > 0) ?? PLAYER_COUNTS[0]
  return { ...base, minPlayerCount }
}
