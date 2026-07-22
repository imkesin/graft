import { Fragment } from "react"
import { AnotherTurn } from "~/components/benefits/AnotherTurn"
import { OverflowSlot } from "~/components/benefits/OverflowSlot"
import { TransportCapacityIncrease } from "~/components/benefits/TransportCapacityIncrease"
import { FieldDiscard } from "~/components/icons/FieldDiscard"
import { GoldCost } from "~/components/icons/GoldCost"
import { WorkerCost } from "~/components/icons/WorkerCost"
import { WorkerRemove } from "~/components/icons/WorkerRemove"
import { darkBand, paperFrame } from "~/components/paperFrame"
import type { Infrastructure, InfrastructureTrackLevel } from "~/domain/InfrastructureDefinitions"
import { css, cx } from "~/generated/styled-system/css"

/**
 * One infrastructure upgrade track (Port / Railway / Telegraph): a header names
 * the type, and the levels below are a top-to-bottom ladder unlocked lowest
 * first. Each level pairs the `cost` to reach it (left) with the `effect` it
 * grants (right). Levels are driven by CSS grid (`gridAutoRows: 1fr`) so they
 * always fill the track's full height, whatever the level count. Cost/effect
 * are the two authored zones; the effect is free text until the effect enum
 * lands (see `~/board/domain`).
 */

// paperFrame/darkBand tint per infrastructure type. Uniform stone for now to
// keep the board calm; per-track hues are a later differentiation pass.
const KIND_COLOR = {
  Ports: "stone",
  Railways: "stone"
} as const satisfies Record<Infrastructure, string>

const frame = css({
  display: "grid",
  gridTemplateRows: "auto 1fr",
  height: "100%",
  minHeight: 0,
  borderWidth: "0.3mm",
  borderStyle: "solid",
  borderRadius: "card",
  overflow: "hidden"
})

const header = css({
  textAlign: "center",
  fontSize: "body",
  fontWeight: 700,
  letterSpacing: "0.02em",
  paddingBlock: "1"
})

// One 3-column grid for the whole ladder: cost (auto, as narrow as its badges)
// on the left, then the immediate "take another turn" bonus (auto), then the
// common payoff (1fr) filling the rest. Running the levels through a single
// grid — rather than one grid per row — lets each column's shared left border
// stack into a continuous vertical divider between adjacent zones.
const track = css({
  display: "grid",
  gridTemplateColumns: "auto auto 1fr",
  gridAutoRows: "1fr",
  minHeight: 0
})

const rowBorder = {
  borderBottomWidth: "0.2mm",
  borderBottomStyle: "solid",
  borderBottomColor: "stone.400/60"
} as const

// Cost column: the badge boxes sit side by side (gold, workers, discard).
const cost = css({
  ...rowBorder,
  display: "flex",
  alignItems: "center",
  gap: "1",
  paddingInline: "2",
  paddingBlock: "1"
})

// Each cost badge rides in a faint 12x12 box so the three read as a matched set.
const badgeBox = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "12",
  height: "12",
  borderWidth: "0.2mm",
  borderStyle: "solid",
  borderColor: "stone.400/40",
  background: "stone.400/10",
  borderRadius: "calc(1 * var(--u))",
  flexShrink: 0
})

// Common payoff column: a faint left border sets it apart from the immediate
// "take another turn" bonus to its left; the stacked cells share that one
// continuous vertical rule.
const payoff = css({
  ...rowBorder,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: "2",
  paddingBlock: "1",
  borderLeftWidth: "0.2mm",
  borderLeftStyle: "solid",
  borderLeftColor: "stone.400/20"
})

// "Take another turn" column: an immediate build bonus sitting just left of the
// common payoff. Its bold left border is the continuous cost|payoff divider (the
// stacked cells share one vertical line). Reserves its width even on the levels
// that grant no extra turn, so both it and the divider stay unbroken.
const turn = css({
  ...rowBorder,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: "2",
  paddingBlock: "1",
  borderLeftWidth: "0.3mm",
  borderLeftStyle: "solid",
  borderLeftColor: "stone.400"
})

const lastRow = css({ borderBottomWidth: 0 })

/**
 * @deprecated Invest/Infrastructure removed from the board; retained but unused.
 */
export function InfraTrack(
  { kind, levels }: { kind: Infrastructure; levels: readonly InfrastructureTrackLevel[] }
) {
  const color = KIND_COLOR[kind]
  return (
    <div className={cx(frame, paperFrame({ color }))}>
      <div className={cx(header, darkBand({ color }))}>{kind}</div>
      <div className={track}>
        {levels.map((l, i) => {
          const last = i === levels.length - 1
          return (
            <Fragment key={i}>
              <div className={cx(cost, last && lastRow)}>
                {l.cost.gold > 0 && (
                  <span className={badgeBox}>
                    <GoldCost amount={l.cost.gold} />
                  </span>
                )}
                {l.cost.workers > 0 && (
                  <span className={badgeBox}>
                    <WorkerCost amount={l.cost.workers} />
                  </span>
                )}
                {l.cost.workersToRemove != null && l.cost.workersToRemove > 0 && (
                  <span className={badgeBox}>
                    <WorkerRemove amount={l.cost.workersToRemove} />
                  </span>
                )}
                {l.cost.fieldsToDiscardCount != null && l.cost.fieldsToDiscardCount > 0 && (
                  <span className={badgeBox}>
                    <FieldDiscard amount={l.cost.fieldsToDiscardCount} />
                  </span>
                )}
              </div>
              <div className={cx(turn, last && lastRow)}>
                {l.immediateBonus?.additionalTurns != null && <AnotherTurn amount={l.immediateBonus.additionalTurns} />}
              </div>
              <div className={cx(payoff, last && lastRow)}>
                {l.commonBonus?.transportCapacityIncrease != null && (
                  <TransportCapacityIncrease amount={l.commonBonus.transportCapacityIncrease} />
                )}
                {l.commonBonus?.marketOverflowSlotPayoff != null && (
                  <OverflowSlot amount={l.commonBonus.marketOverflowSlotPayoff} />
                )}
              </div>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
