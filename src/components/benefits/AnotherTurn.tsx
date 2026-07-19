import { Repeat2 } from "lucide-react"
import { css } from "~/generated/styled-system/css"

/**
 * A take-another-turn payoff: the ellipse-shaped sibling of the cost/payoff
 * badges (see GoldCost/WorkerCost/TransportCapacityIncrease). Same 12x12 card-
 * unit box as the other payoffs and the same rim, but a distinct silhouette — a
 * wide ellipse (rx > ry) rather than a disc/octagon/diamond — so it never reads
 * as another badge.
 *
 * Unlike the siblings, its count doesn't sit in a dark lower band: the content
 * here is horizontal ("N" then Lucide's `repeat-2`), so it reads left-to-right
 * across the ellipse's wide middle, and the wider-than-tall shape is exactly
 * what that horizontal pairing wants. Drawn as inline SVG so it stays print-
 * crisp and scales with `--u`; the real `<Repeat2>` is nested as a positioned
 * inner svg so we build directly on the Lucide icon.
 */

// Geometry in the 0..12 viewBox (1 unit = 1mm at print).
const STROKE = 0.4 // rim, matching the siblings
const INSET = STROKE / 2
const C = 6 // centre
const RX = C - INSET // 5.8 — fills the box horizontally
const RY = 4.0 // shorter vertical radius, so the ellipse reads wider than tall

// Number (left) then repeat-2 (right), centred as a horizontal pair about C.
const NUM_X = 3.4
const FONT = 4.2

const ICON = 4.6
const ICON_CX = 7.5
const IX = ICON_CX - ICON / 2 // 5.2
const IY = C - ICON / 2 // 3.7

const badge = css({ display: "block", width: "12", height: "12" })

export function AnotherTurn({ amount, className }: { amount: number; className?: string }) {
  return (
    <svg
      className={className ? `${badge} ${className}` : badge}
      viewBox="0 0 12 12"
      role="img"
      aria-label={`take ${amount} more turn${amount === 1 ? "" : "s"}`}
    >
      {/* Light ellipse body. */}
      <ellipse cx={C} cy={C} rx={RX} ry={RY} fill="var(--colors-stone-100)" />
      {/* Rim on top so it stays crisp. */}
      <ellipse
        cx={C}
        cy={C}
        rx={RX}
        ry={RY}
        fill="none"
        stroke="var(--colors-stone-400)"
        strokeWidth={STROKE}
      />
      <text
        x={NUM_X}
        y={C}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={FONT}
        fontWeight={700}
        fill="var(--colors-stone-600)"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {amount}
      </text>
      <Repeat2
        x={IX}
        y={IY}
        width={ICON}
        height={ICON}
        color="var(--colors-stone-600)"
        strokeWidth={2.25}
      />
    </svg>
  )
}
