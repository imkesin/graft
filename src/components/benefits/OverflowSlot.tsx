import { GoldCost } from "~/components/icons/GoldCost"
import { FruitCrateSlot } from "~/components/slots/FruitCrateSlot"
import { css } from "~/generated/styled-system/css"

/**
 * The Ports payoff: unlocking the special overflow slot. A composite of the
 * pieces the benefit is made of — a single (dark, wildcard) crate slot for the
 * extra demand space, with a gold coin half-overlaid on its top-right corner
 * for the price that slot pays out.
 *
 * The slot borrows `FruitCrateSlot` but goes dark (stone.700 body, a lighter
 * stone.300 "+" for a bonus space) so it reads as extra capacity rather than a
 * specific market. The coin is `GoldCost`, positioned to sit roughly half on /
 * half off the slot so the two pieces stay legible as a pair.
 */

// The coin (10u) pokes OVERHANG past the 12u slot on the top and right. Sizing
// the wrapper to exactly contain both puts the slot in the lower-left and the
// coin in the upper-right, so the visible union is symmetric about the wrapper's
// centre — centring the wrapper in its cell then centres the badge as a unit.
const OVERHANG = 3
const SIZE = 12 + OVERHANG

const wrap = css({ position: "relative", flexShrink: 0 })
const slot = css({ position: "absolute", left: 0, bottom: 0 })
const coin = css({ position: "absolute", top: 0, right: 0 })

const wrapSize = { width: `calc(${SIZE} * var(--u))`, height: `calc(${SIZE} * var(--u))` }

/**
 * @deprecated Invest/Infrastructure removed from the board; retained but unused.
 */
export function OverflowSlot({ amount, className }: { amount: number; className?: string }) {
  return (
    <div className={className ? `${wrap} ${className}` : wrap} style={wrapSize}>
      <FruitCrateSlot
        className={slot}
        letter="+"
        fill="var(--colors-stone-700)"
        ink="var(--colors-stone-300)"
      />
      <GoldCost className={coin} amount={amount} />
    </div>
  )
}
