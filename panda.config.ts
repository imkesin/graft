import { defineConfig } from "@pandacss/dev"

/**
 * Card-unit token system.
 *
 * Every physical dimension is expressed as a multiple of `--u`, a CSS length
 * that equals one millimetre of real-world size. On screen `--u` is enlarged
 * (zoom); at print time it pins to `1mm` so output is dimensionally exact.
 *
 *   token "12"  ->  calc(12 * var(--u))
 *
 * Tokens are registered under both `spacing` (padding/margin/gap) and `sizes`
 * (width/height) so the same numeric scale drives every layout property.
 */
const u = (n: number) => ({ value: `calc(${n} * var(--u))` })

// Integer unit scale 0..100 covers everything from hairline padding to the
// full 94mm card height. Generated at build time; zero runtime cost.
const unitScale = Object.fromEntries(
  Array.from({ length: 101 }, (_, n) => [String(n), u(n)])
)

// Poker geometry (mm): 63x88 trim, 3mm bleed/edge -> 69x94 full bleed,
// safe zone inset 3mm inside the trim.
const cardSizes = {
  bleed: u(3),
  cardW: u(69),
  cardH: u(94),
  trimW: u(63),
  trimH: u(88),
  safeW: u(57),
  safeH: u(82)
}

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],

  theme: {
    extend: {
      tokens: {
        spacing: unitScale,
        sizes: { ...unitScale, ...cardSizes },
        radii: {
          card: u(3)
        },
        fontSizes: {
          title: u(5),
          name: u(3.8),
          body: u(3.4),
          micro: u(2.2)
        }
      }
    }
  },

  outdir: "src/generated/styled-system"
})
