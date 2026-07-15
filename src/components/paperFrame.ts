import { cva } from "~/generated/styled-system/css"

/**
 * Paper surface + inverted dark band, tinted by a single Panda color scale:
 * `{color}.50` paper / `{color}.900` ink / `{color}.500` border for the
 * surface, background/ink inverted for the band. Shared by every card-like
 * surface that follows this recipe — Card's field/field-improvement/
 * influence/election kinds, MarketStall's fruit colors, and LaborMarket's
 * brown. Card.tsx's frame has no visible border, so the borderColor is simply
 * unused there. Card.tsx's influence/election kinds still layer their own
 * band override on top (see Card.tsx) since those two don't follow the
 * inverted-band half of the recipe.
 */
export const paperFrame = cva({
  variants: {
    color: {
      red: { background: "red.50", color: "red.900", borderColor: "red.500" },
      orange: { background: "orange.50", color: "orange.900", borderColor: "orange.500" },
      yellow: { background: "yellow.50", color: "yellow.900", borderColor: "yellow.500" },
      lime: { background: "lime.50", color: "lime.900", borderColor: "lime.500" },
      violet: { background: "violet.50", color: "violet.900", borderColor: "violet.500" },
      pink: { background: "pink.50", color: "pink.900", borderColor: "pink.500" },
      stone: { background: "stone.50", color: "stone.900", borderColor: "stone.500" },
      brown: { background: "brown.50", color: "brown.900", borderColor: "brown.500" },
      zinc: { background: "zinc.50", color: "zinc.900", borderColor: "zinc.500" },
      cyan: { background: "cyan.50", color: "cyan.900", borderColor: "cyan.500" },
      neutral: { background: "neutral.50", color: "neutral.900", borderColor: "neutral.500" }
    }
  }
})

export const darkBand = cva({
  variants: {
    color: {
      red: { background: "red.900", color: "red.50" },
      orange: { background: "orange.900", color: "orange.50" },
      yellow: { background: "yellow.900", color: "yellow.50" },
      lime: { background: "lime.900", color: "lime.50" },
      violet: { background: "violet.900", color: "violet.50" },
      pink: { background: "pink.900", color: "pink.50" },
      stone: { background: "stone.900", color: "stone.50" },
      brown: { background: "brown.900", color: "brown.50" },
      zinc: { background: "zinc.900", color: "zinc.50" },
      cyan: { background: "cyan.900", color: "cyan.50" },
      neutral: { background: "neutral.900", color: "neutral.50" }
    }
  }
})
