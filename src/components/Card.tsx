import { Coins, PersonStanding } from "lucide-react"
import { Fragment, type ReactNode } from "react"
import type {
  Card,
  CardBase,
  Cost,
  FieldCardBase,
  FieldImprovementCardBase,
  InfluenceCardBase,
  PlayerCount
} from "~/cards/domain"
import { paperFrame } from "~/components/paperFrame"
import { css, cva, cx } from "~/generated/styled-system/css"
import { Guides } from "./Guides"

/**
 * Field cards read as brown (fields, crops); field-improvements as stone;
 * influences as zinc — near-white, with the header/footer bands brighter
 * than the body rather than the dark-band inversion the other two kinds use.
 */
type CardKind = CardBase["kind"]

// The card's base surface, by kind — the shared `paperFrame` recipe (see
// ~/components/paperFrame) covers all four kinds with no deviation.
const KIND_PAPER_COLOR = {
  field: "brown",
  "field-improvement": "stone",
  influence: "zinc",
  election: "cyan"
} as const satisfies Record<CardKind, string>

/** Field-improvement owns the shared rules-text body layout. Influence has its
 * own thirds layout (`InfluenceBody`). */
type TextCardBase = FieldImprovementCardBase

/**
 * A single poker card. Two render variants:
 *
 *   - "bleed": full-bleed 69x94mm. Gutter is 6u (bleed + trim->safe).
 *   - "trim":  trim-only 63x88mm with a hairline cut outline. Gutter is 3u
 *     (trim->safe). For the home N-up grid sheet, where cards touch and the
 *     shared outlines form the cut grid.
 *
 * Either way the safe-zone content column is 57mm wide. All dimensions resolve
 * from `--u` (1mm in print).
 *
 * Layout is a CSS grid whose outer columns are gutter tracks (`--gutter`):
 *
 *     ┌────────┬──────────┬────────┐
 *     │  full-width header (band)  │   bleeds across all 3 columns
 *     ├────────┼──────────┼────────┤
 *     │ gutter │ body│cost│ gutter │   cost rail runs down the body's right
 *     │ gutter │  footer  │ gutter │
 *     └────────┴──────────┴────────┘
 *
 * The header spans every column so its banner colour goes wall-to-wall, but its
 * *content* sits in the middle column via `grid-template-columns: subgrid`, so
 * it lines up with the body. Body and footer sit in the middle column directly.
 * Sections therefore need no horizontal padding of their own — the gutter
 * tracks supply the inset, and the band colour bleeds into them. The title gets
 * the full band width; cost is a top-aligned vertical rail on the body's right.
 */
export type CardVariant = "bleed" | "trim"

const frame = css({
  position: "relative",
  boxSizing: "border-box",
  display: "grid",
  gridTemplateColumns: "var(--gutter) 1fr var(--gutter)",
  // header band (bleeds to top) · body (fills) · footer band (bleeds to bottom)
  gridTemplateRows: "auto 1fr auto",
  overflow: "hidden"
})

// Header/footer bands and the cost badge, by kind. Field and field-improvement
// invert contrast (dark band, light ink); influence instead brightens the
// band above the body while keeping ink dark throughout.
const darkBand = cva({
  variants: {
    kind: {
      field: { background: "brown.900", color: "brown.50" },
      "field-improvement": { background: "stone.900", color: "stone.50" },
      influence: { background: "white", color: "zinc.900" },
      election: { background: "cyan.600", color: "cyan.50" }
    }
  }
})

// Border for the player-count ring, chosen to contrast against this kind's
// band background — the paper colour where the band is dark, the ink colour
// where the band (influence) is light.
const paperBorder = cva({
  variants: {
    kind: {
      field: { borderColor: "brown.50" },
      "field-improvement": { borderColor: "stone.50" },
      influence: { borderColor: "zinc.900" },
      election: { borderColor: "cyan.50" }
    }
  }
})

const bleedFrame = css({
  width: "cardW",
  height: "cardH",
  "--gutter": "calc(6 * var(--u))"
})

const trimFrame = css({
  width: "trimW",
  height: "trimH",
  "--gutter": "calc(3 * var(--u))"
})

// Hairline cut line on the trim boundary. `outline` doesn't affect layout, so
// adjacent cards' outlines coincide into a single shared cut line.
const accentOutline = cva({
  base: { outlineWidth: "0.2mm", outlineStyle: "solid" },
  variants: {
    kind: {
      field: { outlineColor: "brown.500" },
      "field-improvement": { outlineColor: "stone.500" },
      influence: { outlineColor: "zinc.500" },
      election: { outlineColor: "cyan.500" }
    }
  }
})

// Full-width band: spans all columns so its colour bleeds to both edges. Top
// padding = gutter so the content starts at the safe line even though the band
// reaches the top edge. A horizontal subgrid relays the parent column tracks so
// the content can land in the middle column.
const header = css({
  gridColumn: "1 / -1",
  display: "grid",
  gridTemplateColumns: "subgrid",
  alignItems: "center",
  paddingTop: "var(--gutter)",
  // Match the trimmed top inset (3u) so the title is centred within the band's
  // visible (post-cut) area in both variants.
  paddingBottom: "3"
})

const headerContent = css({
  gridColumn: "2",
  display: "flex",
  alignItems: "center",
  minWidth: 0
})

const titleText = css({
  fontSize: "name",
  fontWeight: 700,
  letterSpacing: "0.02em",
  lineHeight: 1.1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
})

// The body is one full-width grid (`1 / -1`) that owns its column lines, so
// every piece is placed rather than margin-shifted. Columns: a left gutter
// (card edge -> safe line), the 1fr content column, and an `auto` cost column
// that runs out to the card's right edge. Rows: fields keep the lead/cost band
// over the worker table (2fr/3fr); text-body cards (field-improvement,
// improvement) split evenly (1fr/1fr) since their rules text fills the bottom
// half. Influence does not use this region — see `influenceBody`.
const bodyRegion = cva({
  base: {
    gridColumn: "1 / -1",
    display: "grid",
    gridTemplateColumns: "var(--gutter) 1fr auto",
    minHeight: 0,
    // Unit-scaled default so every descendant tracks the zoom knob instead of
    // falling back to the fixed 16px root size.
    fontSize: "body"
  },
  variants: {
    kind: {
      field: { gridTemplateRows: "2fr 3fr" },
      "field-improvement": { gridTemplateRows: "1fr 1fr" }
    }
  }
})

const bodyTopMain = css({
  gridColumn: "2",
  gridRow: "1",
  minWidth: 0,
  lineHeight: 1.35,
  whiteSpace: "pre-line",
  display: "flex",
  flexDirection: "column",
  gap: "2"
})

// Shared by field-improvement and influence, the two rules-text kinds.
// Mirrors `fieldTable`: the bottom row's `auto` cost column goes unused (the
// cost rail only ever occupies row 1), so this spans `1 / -1` and re-declares
// its own gutter|1fr|gutter columns to reclaim that width instead of being
// boxed into the parent's narrower `1fr` content track. The border-top divides
// it from the top half (cost rail) above, matching the mid-tone `fieldTable`
// already uses for its own slot/output divider.
const textBand = cva({
  base: {
    gridColumn: "1 / -1",
    gridRow: "2",
    minHeight: 0,
    display: "grid",
    gridTemplateColumns: "var(--gutter) 1fr var(--gutter)",
    borderTopWidth: "0.3mm",
    borderTopStyle: "solid"
  },
  variants: {
    kind: {
      "field-improvement": { borderTopColor: "stone.500" }
    }
  }
})

const textBandContent = css({
  gridColumn: "2",
  minWidth: 0,
  paddingTop: "3",
  // One step down from the inherited `body` size — this is paragraph text,
  // not a table/label.
  fontSize: "paragraph",
  lineHeight: 1.35,
  whiteSpace: "pre-line",
  display: "flex",
  flexDirection: "column",
  gap: "2"
})

// Influence body: two rows (art · text) rather than the field/improvement
// column split. Columns mirror the field body (gutter | 1fr | auto) so the
// fulfilment cost rides the same top-right rail as a field's acquisition cost;
// the text band spans every column and re-declares gutter|1fr|gutter so it
// bleeds edge to edge.
const influenceBody = css({
  gridColumn: "1 / -1",
  display: "grid",
  gridTemplateColumns: "var(--gutter) 1fr auto",
  // Art on top; the group name and goal text fill the larger lower row.
  gridTemplateRows: "1fr 2fr",
  minHeight: 0,
  fontSize: "body"
})

// Top row: intentionally blank space reserved for art. Spans every column so
// future art bleeds full width; the cost rail sits over its top-right corner.
const influenceArt = css({
  gridColumn: "1 / -1",
  gridRow: "1",
  minHeight: 0
})

// Lower row: full-bleed text band parted from the art above by a hairline rule
// (mirrors `textBand`/`fieldTable` dividers). Holds the bold group name and the
// goal / completion condition.
const influenceBand = css({
  gridColumn: "1 / -1",
  gridRow: "2",
  minHeight: 0,
  display: "grid",
  gridTemplateColumns: "var(--gutter) 1fr var(--gutter)",
  borderTopWidth: "0.3mm",
  borderTopStyle: "solid",
  borderTopColor: "zinc.500"
})

// The impacted group, a bold lead-in ahead of the goal text.
const influenceGroupName = css({
  fontWeight: 700,
  letterSpacing: "0.02em"
})

// Dark fill for the cost badge on influence paper: the field kinds' `darkBand`
// resolves to a light band for influence (see `darkBand`), which would vanish
// against the near-white body, so the fulfilment cost inverts to a dark chip.
const influenceCostFill = css({
  background: "zinc.900",
  color: "zinc.50"
})

// Lower row content: the bold group name followed by the goal / completion
// condition (plus any timing preconditions) as one freeform paragraph.
const influenceGoalContent = css({
  gridColumn: "2",
  minWidth: 0,
  paddingTop: "3",
  fontSize: "paragraph",
  lineHeight: 1.35,
  whiteSpace: "pre-line",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: "2"
})

// Election body: intentionally empty for now. Occupies the body row so the
// footer stays pinned to the bottom of the frame grid.
const electionBody = css({
  gridColumn: "1 / -1",
  minHeight: 0
})

// Cost rail in the `auto` column, centered down the top-half row. That track
// ends at the card's right edge, so the right-aligned badges land their right
// side on it.
const costRail = css({
  gridColumn: "3",
  gridRow: "1",
  alignSelf: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "1"
})

// A dark band bleeding off the right edge — the horizontal twin of the header /
// footer bands. Its box reaches the card edge, but the value is balanced about
// the *cut* line (the real card boundary): it sits 2u inside the cut, mirroring
// the 2u the icon sits inside the left edge, with the dark running past the cut
// as bleed. paddingRight = bleed margin (gutter − 3u trim inset) + 2u match.
// Only the left corners round, since the right runs off the cut.
const costBadge = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "1",
  borderStartStartRadius: "1",
  borderEndStartRadius: "1",
  paddingLeft: "2",
  paddingRight: "calc(var(--gutter) - 1 * var(--u))",
  paddingBlock: "1",
  fontSize: "body",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums"
})

const icon = css({ width: "4", height: "4", flexShrink: 0 })

// Worker->output table: a full-bleed banded zone in the body's lower row. The
// table owns its own column lines — gutter | slot (1fr) | output (2fr) | gutter
// — so it spans edge to edge (tinted background, plus a divider rule across the
// top that splits the card) while the cells land in the safe column with no
// margins or re-inset padding. The slot/output boundary carries a vertical rule,
// and stacked slots are parted by soft horizontal rules.
const fieldTable = css({
  gridColumn: "1 / -1",
  gridRow: "2",
  minHeight: 0,
  display: "grid",
  gridTemplateColumns: "var(--gutter) 1fr 2fr var(--gutter)",
  gridAutoRows: "1fr",
  borderTopWidth: "0.3mm",
  borderTopStyle: "solid",
  borderTopColor: "brown.500",
  background: "brown.900/6"
})

const fieldSlotCell = css({
  gridColumn: "2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5",
  paddingBlock: "2",
  borderInlineEndWidth: "0.3mm",
  borderInlineEndStyle: "solid",
  borderInlineEndColor: "brown.500"
})

const fieldOutputCell = css({
  gridColumn: "3",
  display: "flex",
  alignItems: "center",
  paddingBlock: "2",
  paddingInlineStart: "3",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums"
})

// Soft horizontal rule between stacked slots; omitted above the first row.
const fieldRowDivider = css({
  borderTopWidth: "0.2mm",
  borderTopStyle: "solid",
  borderTopColor: "brown.500/30"
})

// An empty slot a worker token drops into during harvest.
const slotCircle = css({
  width: "8",
  height: "8",
  borderRadius: "9999px",
  borderWidth: "0.4mm",
  borderStyle: "solid",
  borderColor: "brown.500",
  background: "brown.50"
})

// Thin dark stripe mirroring the header: bleeds to the bottom edge, with
// paddingBottom = gutter dropping its content onto the safe line.
const footer = css({
  gridColumn: "1 / -1",
  display: "grid",
  gridTemplateColumns: "subgrid",
  alignItems: "center",
  // Mirror of the header: paddingBottom = gutter puts content on the safe line;
  // paddingTop = 3 (the trimmed bottom inset) centres it in the visible stripe.
  paddingTop: "3",
  paddingBottom: "var(--gutter)"
})

const footerContent = css({
  gridColumn: "2",
  display: "flex",
  alignItems: "center",
  gap: "0"
})

// Small ring per player-count the card is included in (copies > 0).
const playerPip = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "3",
  height: "3",
  borderRadius: "9999px",
  borderWidth: "0.2mm",
  borderStyle: "solid",
  fontSize: "micro",
  fontWeight: 700,
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums"
})

function assertNever(value: never): never {
  throw new Error(`Unhandled card kind: ${JSON.stringify(value)}`)
}

function WorkerCost({ workers, kind }: { workers: number; kind: CardKind }) {
  return (
    <span className={cx(costBadge, darkBand({ kind }))}>
      <PersonStanding className={icon} />
      {workers}
    </span>
  )
}

function GoldCost({ gold, kind }: { gold: number; kind: CardKind }) {
  return (
    <span className={cx(costBadge, darkBand({ kind }))}>
      <Coins className={icon} />
      {gold}
    </span>
  )
}

function CostRail({ cost, kind }: { cost: Cost; kind: CardKind }) {
  return (
    <div className={costRail}>
      {cost.workers > 0 && <WorkerCost workers={cost.workers} kind={kind} />}
      {cost.gold > 0 && <GoldCost gold={cost.gold} kind={kind} />}
    </div>
  )
}

type BodyRegions = { top: ReactNode; bottom: ReactNode }

function fieldRegions(card: FieldCardBase): BodyRegions {
  return {
    top: null,
    bottom: (
      <div className={fieldTable}>
        {card.slots.map((slot, i) => (
          <Fragment key={i}>
            <span className={cx(fieldSlotCell, i > 0 && fieldRowDivider)}>
              {Array.from({ length: slot.workers }, (_, w) => <span key={w} className={slotCircle} />)}
            </span>
            <span className={cx(fieldOutputCell, i > 0 && fieldRowDivider)}>
              {`${slot.amount} ${card.fruit}`}
            </span>
          </Fragment>
        ))}
      </div>
    )
  }
}

function textCardRegions(card: TextCardBase): BodyRegions {
  return {
    top: null,
    bottom: (
      <div className={textBand({ kind: card.kind })}>
        <div className={textBandContent}>{card.additionalText}</div>
      </div>
    )
  }
}

function InfluenceBody({ card }: { card: InfluenceCardBase }) {
  const workers = card.additionalCost?.workers ?? 0
  const gold = card.additionalCost?.gold ?? 0

  return (
    <div className={influenceBody}>
      <div className={influenceArt} />
      <div className={costRail}>
        {workers > 0 && (
          <span className={cx(costBadge, influenceCostFill)}>
            <PersonStanding className={icon} />
            {workers}
          </span>
        )}
        {gold > 0 && (
          <span className={cx(costBadge, influenceCostFill)}>
            <Coins className={icon} />
            {gold}
          </span>
        )}
      </div>
      <div className={influenceBand}>
        <div className={influenceGoalContent}>
          <span className={influenceGroupName}>{card.group}</span>
          {card.additionalText}
        </div>
      </div>
    </div>
  )
}

function Footer({ minPlayerCount, kind }: { minPlayerCount: PlayerCount; kind: CardKind }) {
  return (
    <div className={cx(footer, darkBand({ kind }))}>
      <div className={footerContent}>
        <span className={cx(playerPip, paperBorder({ kind }))}>{minPlayerCount}</span>
      </div>
    </div>
  )
}

function bodyRegions(card: FieldCardBase | FieldImprovementCardBase): BodyRegions {
  switch (card.kind) {
    case "field":
      return fieldRegions(card)
    case "field-improvement":
      return textCardRegions(card)
    default:
      return assertNever(card)
  }
}

function CardBody({ card }: { card: Card }) {
  if (card.kind === "influence") {
    return <InfluenceBody card={card} />
  }
  if (card.kind === "election") {
    return <div className={electionBody} />
  }
  const regions = bodyRegions(card)
  return (
    <div className={bodyRegion({ kind: card.kind })}>
      <div className={bodyTopMain}>{regions.top}</div>
      <CostRail cost={card.cost} kind={card.kind} />
      {regions.bottom}
    </div>
  )
}

export function Card({
  card,
  variant = "bleed",
  showGuides = false
}: {
  card: Card
  variant?: CardVariant
  showGuides?: boolean
}) {
  return (
    <div
      className={cx(
        frame,
        paperFrame({ color: KIND_PAPER_COLOR[card.kind] }),
        variant === "bleed" ? bleedFrame : trimFrame,
        variant === "trim" && accentOutline({ kind: card.kind })
      )}
    >
      <div className={cx(header, darkBand({ kind: card.kind }))}>
        <div className={headerContent}>
          <span className={titleText}>{card.name}</span>
        </div>
      </div>
      <CardBody card={card} />
      <Footer minPlayerCount={card.minPlayerCount} kind={card.kind} />
      {showGuides && variant === "bleed" && <Guides />}
    </div>
  )
}
