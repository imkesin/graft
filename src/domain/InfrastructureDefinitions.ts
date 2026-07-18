export const INFRASTRUCTURE_LIST = ["Ports", "Railways"] as const
export type Infrastructure = typeof INFRASTRUCTURE_LIST[number]

export const INFRASTRUCTURE_LEVELS = 5

type InfrastructureUpgradeCost = {
  readonly gold: number
  readonly workers: number
  readonly fieldsToDiscardCount?: number
}

type InfrastructureImmediateBonus = {
  readonly additionalTurns?: number
}

type InfrastructureCommonBonus = {
  readonly transportCapacityIncrease?: number
  readonly marketOverflowSlotIncrease?: number
}

export type InfrastructureTrackLevel = {
  readonly cost: InfrastructureUpgradeCost
  readonly immediateBonus?: InfrastructureImmediateBonus
  readonly commonBonus?: InfrastructureCommonBonus
}

export type InfraTrackDefinition = {
  readonly kind: Infrastructure
  readonly levels: readonly InfrastructureTrackLevel[]
}

export const infrastructureTracks: readonly InfraTrackDefinition[] = [
  {
    kind: "Ports",
    levels: [
      {
        cost: {
          gold: 8,
          workers: 2
        }
      },
      {
        cost: {
          gold: 12,
          workers: 2
        },
        immediateBonus: { additionalTurns: 1 },
        commonBonus: { marketOverflowSlotIncrease: 1 }
      },
      {
        cost: {
          gold: 16,
          workers: 3
        },
        immediateBonus: { additionalTurns: 1 },
        commonBonus: { marketOverflowSlotIncrease: 1 }
      },
      {
        cost: {
          gold: 20,
          workers: 3
        },
        immediateBonus: { additionalTurns: 2 },
        commonBonus: { marketOverflowSlotIncrease: 1 }
      },
      {
        cost: {
          gold: 24,
          workers: 4
        },
        immediateBonus: { additionalTurns: 3 },
        commonBonus: { marketOverflowSlotIncrease: 1 }
      }
    ]
  },
  {
    kind: "Railways",
    levels: [
      {
        cost: {
          gold: 4,
          workers: 3,
          fieldsToDiscardCount: 1
        }
      },
      {
        cost: {
          gold: 7,
          workers: 3,
          fieldsToDiscardCount: 1
        },
        immediateBonus: { additionalTurns: 1 },
        commonBonus: { transportCapacityIncrease: 1 }
      },
      {
        cost: {
          gold: 10,
          workers: 4,
          fieldsToDiscardCount: 2
        },
        immediateBonus: { additionalTurns: 1 },
        commonBonus: { transportCapacityIncrease: 1 }
      },
      {
        cost: {
          gold: 13,
          workers: 4,
          fieldsToDiscardCount: 2
        },
        immediateBonus: { additionalTurns: 2 },
        commonBonus: { transportCapacityIncrease: 1 }
      },
      {
        cost: {
          gold: 16,
          workers: 5,
          fieldsToDiscardCount: 3
        },
        immediateBonus: { additionalTurns: 3 },
        commonBonus: { transportCapacityIncrease: 1 }
      }
    ]
  }
]
