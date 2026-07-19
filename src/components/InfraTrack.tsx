import { Fragment } from "react"
import { OverflowSlot } from "~/components/benefits/OverflowSlot"
import { FieldDiscard } from "~/components/icons/FieldDiscard"
import { GoldCost } from "~/components/icons/GoldCost"
import { TransportCapacity } from "~/components/icons/TransportCapacity"
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

// One 2-column grid for the whole ladder: cost (auto, as narrow as its badges)
// on the left, payoff (1fr) on the right. Running the levels through a single
// grid — rather than one grid per row — lets the payoff cells' shared left
// border stack into a continuous vertical divider between the two zones.
const track = css({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gridAutoRows: "1fr",
  minHeight: 0
})

const rowBorder = {
  borderBottomWidth: "0.2mm",
  borderBottomStyle: "solid",
  borderBottomColor: "stone.400/40"
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

// Payoff column: its left border is the continuous divider between cost and
// payoff (the stacked cells share one vertical line).
const payoff = css({
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
              <div className={cx(payoff, last && lastRow)}>
                {l.commonBonus?.transportCapacityIncrease != null && (
                  <TransportCapacity amount={l.commonBonus.transportCapacityIncrease} />
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
