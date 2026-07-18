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
