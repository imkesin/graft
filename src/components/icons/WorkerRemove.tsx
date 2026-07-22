import { UserRoundMinus } from "lucide-react"
import { css } from "~/generated/styled-system/css"

/**
 * A worker-removal cost: the red sibling of `WorkerCost`. Same 10x10 octagon,
 * rim, and light-body / dark-band recipe, but in red rather than brown and
 * stamped with Lucide's `user-round-minus` — so "lose workers" never reads as
 * the ordinary "spend workers" badge even though they share a silhouette.
 *
 * Drawn as inline SVG so it stays print-crisp and scales with `--u`; the real
 * `<UserRoundMinus>` is nested as a positioned inner svg so we build directly on
 * the Lucide icon, matching the sibling badges.
 */

// Geometry in the 0..10 viewBox (1 unit = 1mm at print), identical to WorkerCost.
const STROKE = 0.4 // rim
const INSET = STROKE / 2
const CX = 5
const LO = INSET // 0.2
const HI = 10 - INSET // 9.8
const CUT = (HI - LO) / (2 + Math.SQRT2)

const OCTAGON = [
  `M ${LO + CUT} ${LO}`,
  `L ${HI - CUT} ${LO}`,
  `L ${HI} ${LO + CUT}`,
  `L ${HI} ${HI - CUT}`,
  `L ${HI - CUT} ${HI}`,
  `L ${LO + CUT} ${HI}`,
  `L ${LO} ${HI - CUT}`,
  `L ${LO} ${LO + CUT}`,
  "Z"
].join(" ")

const BAND_TOP = 5.5
const LOWER = [
  `M ${LO} ${BAND_TOP}`,
  `L ${HI} ${BAND_TOP}`,
  `L ${HI} ${HI - CUT}`,
  `L ${HI - CUT} ${HI}`,
  `L ${LO + CUT} ${HI}`,
  `L ${LO} ${HI - CUT}`,
  "Z"
].join(" ")

const ICON = 5.2
const IX = CX - ICON / 2 // 2.4
const IY = 0.45

const NUM_Y = 7.65
const FONT = 3.0

const badge = css({ display: "block", width: "10", height: "10" })

/**
 * @deprecated Invest/Infrastructure removed from the board; retained but unused.
 */
export function WorkerRemove({ amount, className }: { amount: number; className?: string }) {
  return (
    <svg
      className={className ? `${badge} ${className}` : badge}
      viewBox="0 0 10 10"
      role="img"
      aria-label={`remove ${amount} ${amount === 1 ? "worker" : "workers"}`}
    >
      {/* Light octagon body. */}
      <path d={OCTAGON} fill="var(--colors-red-100)" />
      {/* Dark lower band holding the count. */}
      <path d={LOWER} fill="var(--colors-red-700)" />
      {/* Rim on top of both so it stays crisp. */}
      <path d={OCTAGON} fill="none" stroke="var(--colors-red-500)" strokeWidth={STROKE} />
      <UserRoundMinus
        x={IX}
        y={IY}
        width={ICON}
        height={ICON}
        color="var(--colors-red-900)"
        strokeWidth={2.5}
      />
      <text
        x={CX}
        y={NUM_Y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={FONT}
        fontWeight={700}
        fill="var(--colors-red-50)"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {amount}
      </text>
    </svg>
  )
}
