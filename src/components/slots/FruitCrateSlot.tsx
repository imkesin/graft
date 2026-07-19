import type { FruitColor } from "~/domain/CoreDefinitions"
import { css } from "~/generated/styled-system/css"
import { token } from "~/generated/styled-system/tokens"

/**
 * A market demand slot a fruit crate drops into: a 12x12 card-unit square with a
 * stone rim and white fill, optionally tinted for a fruit and stamped with a
 * large, faint capital initial.
 *
 * Both cues are deliberately redundant: the tint identifies the fruit in colour,
 * and the letter survives a black-and-white print (where the faint tint washes
 * out) — the intended playtest medium. Both stay pale enough that a physical
 * token placed in the slot still reads clearly on top.
 *
 * Drawn as inline SVG so it stays print-crisp and scales with `--u`; the tint
 * and ink resolve at render time via `token()`, so any FruitColor works without
 * a per-colour style variant.
 */

// Geometry in the 0..12 viewBox (1 unit = 1mm at print).
const STROKE = 0.4 // rim, matching the plain token slot
const INSET = STROKE / 2
const RADIUS = 1 // slight crate rounding
const FONT = 7.5 // large initial, kept faint by colour rather than size

const slot = css({ display: "block", width: "12", height: "12" })

export function FruitCrateSlot(
  {
    color,
    letter,
    size,
    fill,
    ink,
    className
  }: {
    color?: FruitColor
    letter?: string
    size?: number
    /** Override the crate fill (any CSS colour); defaults to the fruit tint / white. */
    fill?: string
    /** Override the stamped-letter colour; defaults to the fruit tint / faint stone. */
    ink?: string
    className?: string
  }
) {
  const fillColor = fill ?? (color ? token(`colors.${color}.100`) : "white")
  const inkColor = ink ?? (color ? token(`colors.${color}.200`) : token("colors.stone.200"))
  // `size` (in card units) overrides the default 12u square via inline style,
  // which reliably wins over the `slot` class regardless of stylesheet order.
  const sizeStyle = size ? { width: `calc(${size} * var(--u))`, height: `calc(${size} * var(--u))` } : undefined
  return (
    <svg
      className={className ? `${slot} ${className}` : slot}
      style={sizeStyle}
      viewBox="0 0 12 12"
      role="img"
      aria-label={letter ? `${letter} crate slot` : "crate slot"}
    >
      <rect
        x={INSET}
        y={INSET}
        width={12 - STROKE}
        height={12 - STROKE}
        rx={RADIUS}
        ry={RADIUS}
        fill={fillColor}
        stroke="var(--colors-stone-400)"
        strokeWidth={STROKE}
      />
      {letter && (
        <text
          x={6}
          y={6}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={FONT}
          fontWeight={700}
          fill={inkColor}
        >
          {letter}
        </text>
      )}
    </svg>
  )
}
