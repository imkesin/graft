export const FOCUSES = [
  "Expand",
  "Harvest",
  "Influence",
  "Invest",
  "Recruit",
  "Sell"
] as const
export type Focus = typeof FOCUSES[number]

export const FOCUS_ACTION_METADATA = {
  Expand: {
    actions: [
      {
        id: "expand-claim",
        name: "Claim",
        ruleDescription:
          "Select 1 of the visible Field Cards and put it into your hand; you collect all gold it. Then, pay 1 Gold for each Field you have cultivated.\n\nIf you hold more than 7 Field Cards, you must discard down to 7 by placing them face-down at the bottom of the Field Card Supply.\n\nLastly, fill the empty space on the board."
      },
      {
        id: "expand-cultivate",
        name: "Cultivate",
        ruleDescription:
          "Reveal a Field Card from your hand, placing it in your Player Zone, and pay the cost listed on the card. If you have played a Field Improvement card, then you must attach it to an existing field. Then, place 1 Gold from Supply on 1 face-up Field Card in one of the slots on the Board."
      }
    ]
  },
  Harvest: {
    actions: [
      {
        id: "harvest-harvest",
        name: "Harvest",
        ruleDescription:
          "Produce 1 or more Fruits from your Fields, leaving each on the Field that produced it. You have a baseline Harvest Capacity of 1, and each additional worker applied to this action increases capacity by 1.\n\nHarvest Rows must be worked from top to bottom and do not produce any Fruit when partially filled.\n\nA field with any number of Fruits already on it may not be Harvested; they must be taken to market."
      }
    ]
  },
  Influence: {
    actions: [
      {
        id: "influence-suppress",
        name: "Suppress",
        ruleDescription:
          "Select 1 of the face-up Influence Cards and move it to the bottom of the Influence Card Supply. Pay 2 Gold, plus 2 additional Gold for each Influence Card in your player zone. Lastly, fill the empty space on the board."
      }
    ]
  },
  Invest: {
    actions: [
      {
        id: "invest-infrastructure",
        name: "Infrastructure",
        ruleDescription:
          "Advance one of the Infrastructure Tracks by 1 space, and pay the cost indicated on the new space. Then, if there is a one-time bonus on the new space, claim the bonus."
      }
    ]
  },
  Recruit: {
    actions: [
      {
        id: "recruit-recruit",
        name: "Recruit",
        ruleDescription:
          "Hire 1 or more Workers from the Labor Pool and pay their corresponding costs.\n\nIf, at the start of your turn, you employed fewer workers than another player, you may Poach any number of workers by paying 1 additional Gold more the highest cost listed in the labor pool."
      }
    ]
  },
  Sell: {
    actions: [
      {
        id: "sell-sell",
        name: "Sell",
        ruleDescription:
          "Move 1 or more Fruit Crates from your Fields to the Market.\n\nYou have a baseline Transport Capacity of 1. But, each Worker applied to this action increases your Transport Capacity by 2.\n\nPlace Fruit Crates into the empty slots in the Market and collect the corresponding amount of Gold. Then, induce demand by removing other Fruit Crates from their Demand Tracks and returning them to Supply. You collect 1 additional Gold for every Fruit Crate removed this way."
      }
    ]
  }
}
