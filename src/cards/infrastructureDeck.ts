import type { CardDefinition, Deck } from "./domain"

/**
 * Infrastructure cards print on their own sheet and share the field-improvement
 * template: a play cost in workers/gold plus freeform rules text, nothing else.
 * Every name ships in equal quantity — 4 copies each at 2 players, 5 at 3, 6 at
 * 4. Cost and text are placeholders until the real cards are drafted.
 */

const INFRASTRUCTURE_NAMES = ["Port", "Rails", "Telegraph"] as const

const infrastructure = INFRASTRUCTURE_NAMES.map((name) => ({
  kind: "infrastructure",
  id: name.toLowerCase(),
  name,
  cost: {
    workers: 0,
    gold: 0
  },
  copies: {
    2: 4,
    3: 5,
    4: 6
  },
  additionalText: "Placeholder text until the real card copy is drafted."
})) satisfies ReadonlyArray<CardDefinition>

export const infrastructureDeck: Deck = [...infrastructure]
