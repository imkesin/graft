import { Coins } from "lucide-react"
import { darkBand, paperFrame } from "~/components/paperFrame"
import { icon, tokenSlot, value } from "~/components/trackSlot"
import type { LaborTier } from "~/domain/MarketDefinitions"
import { css, cx } from "~/generated/styled-system/css"

/**
 * The Labor Market: workers up for hire, grouped into cost tiers (cheapest at
 * the top, most expensive at the bottom). Each tier shows its gold price once
 * alongside a row of `count` token slots, so a price with many workers reads
 * as one compact group rather than a long stack of identical rows. Tiers are
 * driven by CSS grid (`gridAutoRows: 1fr`) so they always fill the sleeve's
 * full height, whatever the tier count.
 */

const frame = css({
  display: "grid",
  gridTemplateRows: "auto 1fr",
  height: "100%",
  borderWidth: "0.3mm",
  borderStyle: "solid",
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

const track = css({
  display: "grid",
  gridAutoFlow: "row",
  gridAutoRows: "1fr"
})

const tier = css({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  alignItems: "center",
  gap: "3",
  paddingInline: "3",
  borderBottomWidth: "0.2mm",
  borderBottomStyle: "solid",
  borderBottomColor: "stone.400/40"
})

const lastTier = css({ borderBottomWidth: 0 })

// Two fixed columns; workers beyond 2 wrap onto further rows, so a tall tier
// grows down rather than crowding a single wide line.
const tokens = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, auto)",
  justifyContent: "flex-end",
  alignContent: "center",
  gap: "2"
})

export function LaborMarket({ tiers }: { tiers: readonly LaborTier[] }) {
  return (
    <div className={cx(frame, paperFrame({ color: "brown" }))}>
      <div className={cx(header, darkBand({ color: "brown" }))}>Labor Market</div>
      <div className={track}>
        {tiers.map((t, i) => (
          <div key={i} className={cx(tier, i === tiers.length - 1 && lastTier)}>
            <span className={value}>
              <Coins className={icon} />
              {t.gold}
            </span>
            <div className={tokens}>
              {Array.from(
                { length: t.count },
                (_, j) => <span key={j} className={tokenSlot({ size: "lg", shape: "circle" })} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
