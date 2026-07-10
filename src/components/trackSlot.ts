import { css, cva } from "~/generated/styled-system/css"

/**
 * Shared pieces of a board track's slot (MarketStall's demand track,
 * LaborMarket's worker track): the empty token a physical piece drops into,
 * and the icon-prefixed numeric value next to it. Deliberately neutral
 * (stone/white) rather than tinted, so it reads clearly against any track's
 * color. Card.tsx's own slot circle/cost badge are visually similar but tied
 * to its bleed-to-edge gutter math, so they stay separate.
 *
 * `shape` distinguishes what kind of physical piece fills the slot: `circle`
 * for workers (matches Card.tsx's worker-slot circles), `square` for fruit
 * crates (MarketStall's demand track).
 */
export const tokenSlot = cva({
  base: {
    borderWidth: "0.4mm",
    borderStyle: "solid",
    borderColor: "stone.400",
    background: "white",
    flexShrink: 0
  },
  variants: {
    size: {
      md: { width: "10", height: "10" },
      lg: { width: "12", height: "12" }
    },
    shape: {
      circle: { borderRadius: "9999px" },
      square: { borderRadius: "sm" }
    }
  }
})

export const value = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "1",
  fontSize: "body",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums"
})

export const icon = css({ width: "4", height: "4", flexShrink: 0 })
