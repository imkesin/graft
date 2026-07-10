import { Coins } from "lucide-react"
import type { LaborSlot } from "~/board/domain"
import { darkBand, paperFrame } from "~/components/paperFrame"
import { icon, tokenSlot, value } from "~/components/trackSlot"
import { css, cx } from "~/generated/styled-system/css"

/**
 * The Labor Market: a vertical, single-dimension track of workers up for
 * hire, cheapest at the top and most expensive at the bottom. Slot count
 * grows with player count; rows are driven by CSS grid (`gridAutoRows: 1fr`)
 * so the track always fills the sleeve's full height, whether it holds 5
 * workers or 7.
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

const slot = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "3",
  borderBottomWidth: "0.2mm",
  borderBottomStyle: "solid",
  borderBottomColor: "stone.400/40"
})

const lastSlot = css({ borderBottomWidth: 0 })

export function LaborMarket({ slots }: { slots: readonly LaborSlot[] }) {
  return (
    <div className={cx(frame, paperFrame({ color: "brown" }))}>
      <div className={cx(header, darkBand({ color: "brown" }))}>Labor Market</div>
      <div className={track}>
        {slots.map((s, i) => (
          <div key={i} className={cx(slot, i === slots.length - 1 && lastSlot)}>
            <span className={tokenSlot({ size: "md", shape: "circle" })} />
            <span className={value}>
              <Coins className={icon} />
              {s.gold}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
