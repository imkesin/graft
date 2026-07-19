import { LayersMinus } from "lucide-react"
import { css } from "~/generated/styled-system/css"

/**
 * A field-discard badge: the odd one out among the cost siblings (see
 * GoldCost.tsx / WorkerCost.tsx / InducedDemand.tsx). Instead of a token
 * silhouette it draws a dark-green playing card (poker 63:88 ratio) standing
 * inside the shared 10x10 card-unit box, so it reads as "a Field card" at a
 * glance. Lucide's `square-arrow-right-exit` in white says "discard it", and a
 * white count beside the arrow says how many.
 *
 * Drawn as inline SVG so it stays print-crisp and scales with `--u`; the real
 * `<SquareArrowRightExit>` is nested as a positioned inner svg so we build
 * directly on the Lucide icon, matching the sibling badges.
 */

// Geometry in the 0..10 viewBox (1 unit = 1mm at print).
const STROKE = 0.4 // rim, matching the siblings
const H = 10 - STROKE // card height, inset by half the rim top and bottom
const W = H * (63 / 88) // poker ratio, portrait
const LEFT = (10 - W) / 2 // centre the card in the square box
const TOP = STROKE / 2
const RX = 0.9 // corner radius

const CX = LEFT + W / 2 // horizontal centre of the card

// Arrow (top) over count (bottom), stacked and centred on the card.
const ICON = 3.4
const FONT = 2.9
const IX = CX - ICON / 2
const ICON_CY = 3.5 // arrow centre in the upper half
const IY = ICON_CY - ICON / 2
const NUM_Y = 7.0 // count centre in the lower half

const badge = css({ display: "block", width: "10", height: "10" })

export function FieldDiscard({ amount, className }: { amount: number; className?: string }) {
  return (
    <svg
      className={className ? `${badge} ${className}` : badge}
      viewBox="0 0 10 10"
      role="img"
      aria-label={`discard ${amount} field ${amount === 1 ? "card" : "cards"}`}
    >
      {/* Dark-green card body. */}
      <rect
        x={LEFT}
        y={TOP}
        width={W}
        height={H}
        rx={RX}
        ry={RX}
        fill="var(--colors-green-900)"
        stroke="var(--colors-green-950)"
        strokeWidth={STROKE}
      />
      <LayersMinus
        x={IX}
        y={IY}
        width={ICON}
        height={ICON}
        color="white"
        strokeWidth={2}
      />
      <text
        x={CX}
        y={NUM_Y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={FONT}
        fontWeight={700}
        fill="white"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {amount}
      </text>
    </svg>
  )
}
