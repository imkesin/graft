export const PLAYER_COUNTS = [2, 3, 4] as const
export type PlayerCount = typeof PLAYER_COUNTS[number]

export const FRUIT_LIST_WITH_METADATA = [
  {
    name: "Rambutan",
    fieldName: "Orchard",
    color: "red"
  },
  {
    name: "Orange",
    fieldName: "Grove",
    color: "orange"
  },
  {
    name: "Banana",
    fieldName: "Plantation",
    color: "yellow"
  },
  {
    name: "Lime",
    fieldName: "Grove",
    color: "lime"
  },
  {
    name: "Coconut",
    fieldName: "Plantation",
    color: "stone"
  },
  {
    name: "Passionfruit",
    fieldName: "Farm",
    color: "violet"
  },
  {
    name: "Dragonfruit",
    fieldName: "Terraces",
    color: "pink"
  }
] as const
export type FruitName = typeof FRUIT_LIST_WITH_METADATA[number]["name"]
export type FruitColor = typeof FRUIT_LIST_WITH_METADATA[number]["color"]

/**
 * Fruit → its own token/crate colour, derived once from the metadata list.
 * The lone cast is unavoidable: `Object.fromEntries` widens keys to `string`,
 * but the entries come straight from the typed list so the map is total.
 */
export const FRUIT_COLOR: Record<FruitName, FruitColor> = Object.fromEntries(
  FRUIT_LIST_WITH_METADATA.map((f) => [f.name, f.color])
) as Record<FruitName, FruitColor>
