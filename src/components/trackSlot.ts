import { css } from "~/generated/styled-system/css"

/**
 * The numeric value label beside a board track's slot (e.g. MarketStall's demand
 * track). Deliberately neutral (stone/white) so it reads clearly against any
 * track's color. The physical slots themselves now live as dedicated components
 * under `~/components/slots` (FruitCrateSlot, WorkerSlot).
 */
export const value = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "1",
  fontSize: "body",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums"
})
