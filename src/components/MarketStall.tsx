import { Coins, TrendingUp } from "lucide-react"
import type { DemandSlot } from "~/board/domain"
import type { FruitColor, FruitName } from "~/cards/domain"
import { darkBand, paperFrame } from "~/components/paperFrame"
import { icon, tokenSlot, value } from "~/components/trackSlot"
import { css, cx } from "~/generated/styled-system/css"

/**
 * A fruit's market stall: header names the fruit, the demand track below is a
 * left-to-right line of slots that fills as the fruit sells — leftmost slots
 * pay the most gold, rightmost slots induce the most demand. Slot count grows
 * with player count; the track just subdivides into more, narrower slots
 * rather than growing physically (the physical footprint is decided once this
 * gets composed into the board's market ring). Which other fruits this one
 * induces demand for is listed as text below the track, rather than as
 * arrows on a shared board-wide diagram — see project discussion for why.
 */

const frame = css({
  display: "grid",
  gridTemplateRows: "auto auto auto",
  border: "0.3mm solid",
  borderRadius: "card",
  overflow: "hidden"
})

const header = css({
  textAlign: "center",
  fontSize: "name",
  fontWeight: 700,
  letterSpacing: "0.02em",
  paddingBlock: "2"
})

// Three shared row tracks (token / gold / induced-demand) that every slot
// subgrids into, so a slot that omits a row (see `value` below) still lines
// up with its neighbours instead of the remaining rows collapsing upward.
const track = css({
  display: "grid",
  gridAutoFlow: "column",
  gridAutoColumns: "1fr",
  gridTemplateRows: "auto auto auto"
})

const slot = css({
  display: "grid",
  gridRow: "1 / -1",
  gridTemplateRows: "subgrid",
  justifyItems: "center",
  alignItems: "center",
  gap: "2",
  paddingBlock: "3",
  paddingInline: "1",
  borderInlineEndWidth: "0.2mm",
  borderInlineEndStyle: "solid",
  borderInlineEndColor: "stone.400/40"
})

const lastSlot = css({ borderInlineEndWidth: 0 })

const inducesSection = css({
  paddingInline: "3",
  paddingBlock: "3",
  borderTopWidth: "0.2mm",
  borderTopStyle: "solid",
  borderTopColor: "stone.400/40"
})

const inducesLabel = css({
  fontSize: "micro",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  opacity: 0.7
})

const inducesList = css({
  fontSize: "body",
  lineHeight: 1.3
})

export function MarketStall({
  fruit,
  color,
  slots,
  induces
}: {
  fruit: FruitName
  color: FruitColor
  slots: readonly DemandSlot[]
  induces: readonly FruitName[]
}) {
  return (
    <div className={cx(frame, paperFrame({ color }))}>
      <div className={cx(header, darkBand({ color }))}>{fruit}</div>
      <div className={track}>
        {slots.map((s, i) => (
          <div key={i} className={cx(slot, i === slots.length - 1 && lastSlot)}>
            <span className={tokenSlot({ size: "lg", shape: "square" })} />
            <span className={value}>
              {s.gold > 0 && (
                <>
                  <Coins className={icon} />
                  {s.gold}
                </>
              )}
            </span>
            <span className={value}>
              {s.inducedDemand > 0 && (
                <>
                  <TrendingUp className={icon} />
                  {s.inducedDemand}
                </>
              )}
            </span>
          </div>
        ))}
      </div>
      {induces.length > 0 && (
        <div className={inducesSection}>
          <div className={inducesLabel}>Induces demand</div>
          <div className={inducesList}>{induces.join(", ")}</div>
        </div>
      )}
    </div>
  )
}
