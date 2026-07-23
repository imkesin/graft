export const FOCUSES = [
  "Expand",
  "Harvest",
  "Recruit",
  "Sell"
] as const
export type Focus = typeof FOCUSES[number]

export const FOCUS_ACTION_METADATA = {
  Expand: {
    actions: [
      {
        id: "expand-expand",
        name: "Expand",
        ruleDescription:
          "Select 1 of the visible Field Cards, collect all gold on it, and place it in your player zone. Or, reveal 1 Field Card from your hand and place it in your Player Zone.\n\nImmediately pay the cost listed on the card. Each Family Worker in the Expand zone is counted toward the Worker cost.\n\nIf the Field was selected from the visible set, place 1 coin from Supply on each of the remaining Field Cards. Then, reveal another Field card from the Field Card Supply."
      }
    ]
  },
  Harvest: {
    actions: [
      {
        id: "harvest-harvest",
        name: "Harvest",
        ruleDescription:
          "Produce 1 or more Fruits from your Fields by assigning Workers to their rows.\n\nRows must be worked from top to bottom. Each of your Family Workers in the Harvest zone is counted toward the Worker cost.\n\nA field with any number of Fruits already on it may not be harvested; they must be taken to market first."
      }
    ]
  },
  Recruit: {
    actions: [
      {
        id: "recruit-recruit",
        name: "Recruit",
        ruleDescription:
          "Hire the lowest cost Worker for free. Then, you may hire any number of Workers from the labor pool by paying their cost in Gold.\n\nRepeat the process for each additional Family Worker already in the Recruit zone.\n\nIf, at the start of your turn, you employed fewer Workers than another player, you may Poach any number of workers from other Players by paying 1 Gold more than the highest cost listed in the labor pool."
      }
    ]
  },
  Sell: {
    actions: [
      {
        id: "sell-sell",
        name: "Sell",
        ruleDescription:
          "Move 1 or more Fruits from your Fields to the Market.\n\nFor each Family Worker in the Sell zone, you may transport any number of Fruits of 1 type. For each additional Worker assigned to this action, you may transport 1 additional type of Fruit.\n\nPlace Fruit Crates into the empty slots in the Market and collect the corresponding amount of Gold.\n\nThen, induce demand by removing other Fruits from their Demand Tracks and returning them to Supply. You collect 1 additional Gold for every Fruit Crate removed through induced demand."
      }
    ]
  }
}
