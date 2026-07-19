import { TrainTrack } from "lucide-react"
import { css } from "~/generated/styled-system/css"

/**
 * A transport-capacity payoff: the Railways sibling of the cost badges, but a
 * step larger (12x12, matching the payoff slots) and diamond-shaped so it never
 * reads as a cost. Lucide's `train-track` sits in the upper body; a "+N" rides
 * the dark lower band, reusing the light-body / dark-band recipe shared across
 * the family.
 *
 * The diamond is a 45°-rotated square whose edges are the lines |dx|+|dy| = R,
 * so an axis-aligned icon of side up to 2R seats inside with its corners landing
 * exactly on the edges. Drawn as inline SVG so it stays print-crisp and scales
 * with `--u`; the real `<TrainTrack>` is nested as a positioned inner svg.
 */

// Geometry in the 0..12 viewBox (1 unit = 1mm at print).
const STROKE = 0.4 // rim, matching the siblings
const INSET = STROKE / 2
const C = 6 // centre
const R = C - INSET // centre-to-vertex (5.8)
const TOP = C - R // 0.2
const BOT = C + R // 11.8

const DIAMOND = `M ${C} ${TOP} L ${BOT} ${C} L ${C} ${BOT} L ${TOP} ${C} Z`

// x of the diamond's left/right edge at a given y in the lower half [C, BOT].
const frac = (y: number) => (y - C) / R
const leftX = (y: number) => TOP + R * frac(y)
const rightX = (y: number) => BOT - R * frac(y)

// Dark band: the lower slice of the diamond below BAND_TOP (a downward triangle).
const BAND_TOP = 7.2
const BAND = `M ${leftX(BAND_TOP)} ${BAND_TOP} L ${rightX(BAND_TOP)} ${BAND_TOP} L ${C} ${BOT} Z`

// train-track centred in the upper body (kept clear of the band).
const ICON = 4.2
const IX = C - ICON / 2 // 3.9
const IY = 2.8

const NUM_Y = 8.7 // centroid of the band triangle
const FONT = 2.8

// Rendered at 15u (the OverflowSlot payoff's total footprint) so both tracks'
// payoffs read at the same size; the 0..12 viewBox scales up uniformly.
const badge = css({ display: "block", width: "15", height: "15" })

export function TransportCapacityIncrease({ amount, className }: { amount: number; className?: string }) {
  return (
    <svg
      className={className ? `${badge} ${className}` : badge}
      viewBox="0 0 12 12"
      role="img"
      aria-label={`+${amount} transport capacity`}
    >
      {/* Light diamond body. */}
      <path d={DIAMOND} fill="var(--colors-slate-100)" />
      {/* Dark lower band holding the count. */}
      <path d={BAND} fill="var(--colors-slate-800)" />
      {/* Rim on top of both; round joins tame the sharp diamond corners. */}
      <path
        d={DIAMOND}
        fill="none"
        stroke="var(--colors-slate-500)"
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <TrainTrack
        x={IX}
        y={IY}
        width={ICON}
        height={ICON}
        color="var(--colors-slate-900)"
        strokeWidth={2}
      />
      <text
        x={C}
        y={NUM_Y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={FONT}
        fontWeight={700}
        fill="var(--colors-slate-50)"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        +{amount}
      </text>
    </svg>
  )
}
