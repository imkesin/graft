import { type Card, type CardDefinition, type Deck, FRUIT_LIST_WITH_METADATA, type PlayerCount } from "./domain"

const PLAYER_COUNTS: readonly PlayerCount[] = [2, 3, 4]

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
    cost: { workers: 1, gold: 1 },
    copies: {
      2: 1,
      3: 2,
      4: 3
    },
    additionalText: "Attach to a Field. Its first worker slot yields +1 fruit."
  },
  {
    kind: "field-improvement",
    id: "trellis-system",
    name: "Trellis System",
    cost: { workers: 0, gold: 2 },
    copies: {
      2: 1,
      3: 2,
      4: 3
    },
    additionalText: "Attach to a Field. Add one worker slot yielding +1 fruit."
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
