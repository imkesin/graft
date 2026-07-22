/**
 * @deprecated Invest/Infrastructure removed from the board; retained but unused.
 */
export const INFRASTRUCTURE_LIST = ["Ports", "Railways"] as const
/**
 * @deprecated Invest/Infrastructure removed from the board; retained but unused.
 */
export type Infrastructure = typeof INFRASTRUCTURE_LIST[number]

/**
 * @deprecated Invest/Infrastructure removed from the board; retained but unused.
 */
export const INFRASTRUCTURE_LEVELS = 5

type InfrastructureUpgradeCost = {
  readonly gold: number
  readonly workers: number
  readonly fieldsToDiscardCount?: number
  readonly workersToRemove?: number
}

type InfrastructureImmediateBonus = {
  readonly additionalTurns?: number
}

type InfrastructureCommonBonus = {
  readonly transportCapacityIncrease?: number
  readonly marketOverflowSlotPayoff?: number
}

/**
 * @deprecated Invest/Infrastructure removed from the board; retained but unused.
 */
export type InfrastructureTrackLevel = {
  readonly cost: InfrastructureUpgradeCost
  readonly immediateBonus?: InfrastructureImmediateBonus
  readonly commonBonus?: InfrastructureCommonBonus
}

/**
 * @deprecated Invest/Infrastructure removed from the board; retained but unused.
 */
export type InfraTrackDefinition = {
  readonly kind: Infrastructure
  readonly levels: readonly InfrastructureTrackLevel[]
}

/**
 * @deprecated Invest/Infrastructure removed from the board; retained but unused.
 */
export const infrastructureTracks: readonly InfraTrackDefinition[] = [
  {
    kind: "Railways",
    levels: [
      {
        cost: {
          gold: 4,
          workers: 3
        },
        commonBonus: { transportCapacityIncrease: 1 }
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
          workers: 3,
          fieldsToDiscardCount: 1
        },
        immediateBonus: { additionalTurns: 1 },
        commonBonus: { transportCapacityIncrease: 2 }
      },
      {
        cost: {
          gold: 13,
          workers: 4,
          fieldsToDiscardCount: 2
        },
        immediateBonus: { additionalTurns: 2 },
        commonBonus: { transportCapacityIncrease: 2 }
      },
      {
        cost: {
          gold: 16,
          workers: 5,
          fieldsToDiscardCount: 3
        },
        immediateBonus: { additionalTurns: 3 },
        commonBonus: { transportCapacityIncrease: 3 }
      }
    ]
  },
  {
    kind: "Ports",
    levels: [
      {
        cost: {
          gold: 8,
          workers: 2
        },
        commonBonus: { marketOverflowSlotPayoff: 1 }
      },
      {
        cost: {
          gold: 12,
          workers: 2
        },
        immediateBonus: { additionalTurns: 1 },
        commonBonus: { marketOverflowSlotPayoff: 2 }
      },
      {
        cost: {
          gold: 16,
          workers: 2,
          workersToRemove: 1
        },
        immediateBonus: { additionalTurns: 1 },
        commonBonus: { marketOverflowSlotPayoff: 2 }
      },
      {
        cost: {
          gold: 20,
          workers: 3,
          workersToRemove: 1
        },
        immediateBonus: { additionalTurns: 2 },
        commonBonus: { marketOverflowSlotPayoff: 3 }
      },
      {
        cost: {
          gold: 24,
          workers: 4,
          workersToRemove: 1
        },
        immediateBonus: { additionalTurns: 3 },
        commonBonus: { marketOverflowSlotPayoff: 5 }
      }
    ]
  }
]
