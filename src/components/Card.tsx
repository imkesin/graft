import { Coins, PersonStanding } from "lucide-react"
import { Fragment, type ReactNode } from "react"
import type { Card as CardData, Cost, FieldCard, FieldImprovementCard, PlayerCount } from "~/cards/types"
import { css, cx } from "~/generated/styled-system/css"
import { Guides } from "./Guides"

const PLAYER_COUNTS: readonly PlayerCount[] = [2, 3, 4]

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
  background: "#f4ecd8",
  boxSizing: "border-box",
  display: "grid",
  gridTemplateColumns: "var(--gutter) 1fr var(--gutter)",
  // header band (bleeds to top) · body (fills) · footer band (bleeds to bottom)
  gridTemplateRows: "auto 1fr auto",
  rowGap: "2",
  color: "#2b2317",
  overflow: "hidden"
})

const bleedFrame = css({
  width: "cardW",
  height: "cardH",
  "--gutter": "calc(6 * var(--u))"
})

const trimFrame = css({
  width: "trimW",
  height: "trimH",
  "--gutter": "calc(3 * var(--u))",
  // Hairline cut line on the trim boundary. `outline` doesn't affect layout,
  // so adjacent cards' outlines coincide into a single shared cut line.
  outline: "0.2mm solid #6b6150"
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
  background: "#2b2317",
  color: "#f4ecd8",
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

// Body splits into two equal halves. Top half holds the cost rail (right) and
// the kind's lead content (left); bottom half holds the worker table.
const bodyRegion = css({
  gridColumn: "2",
  display: "grid",
  gridTemplateRows: "1fr 1fr",
  minHeight: 0
})

const bodyTop = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "2",
  minHeight: 0
})

const bodyTopMain = css({
  flex: "1",
  minWidth: 0,
  fontSize: "body",
  lineHeight: 1.35,
  whiteSpace: "pre-line",
  display: "flex",
  flexDirection: "column",
  gap: "2"
})

const bodyBottom = css({
  minHeight: 0,
  display: "flex",
  flexDirection: "column"
})

// Vertical cost rail down the body's right edge, starting at the top.
const costRail = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "1",
  flexShrink: 0
})

// Icon + number in a rounded rectangle. Dark on the cream body so it reads.
const costBadge = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "1",
  background: "#2b2317",
  color: "#f4ecd8",
  borderRadius: "1",
  paddingInline: "2",
  paddingBlock: "1",
  fontSize: "body",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums"
})

const icon = css({ width: "4", height: "4", flexShrink: 0 })

// Worker->output table (fills the body's bottom half). Column 1 is the worker
// slot (a circle); column 2 is the fruit it yields.
const workerTable = css({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  columnGap: "3",
  rowGap: "2",
  alignItems: "center"
})

// An empty slot a worker token drops into during harvest.
const slotCircle = css({
  width: "8",
  height: "8",
  borderRadius: "9999px",
  border: "0.4mm solid #6b6150",
  background: "#fffdf6"
})

const slotOutput = css({
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums"
})

// Thin dark stripe mirroring the header: bleeds to the bottom edge, with
// paddingBottom = gutter dropping its content onto the safe line.
const footer = css({
  gridColumn: "1 / -1",
  display: "grid",
  gridTemplateColumns: "subgrid",
  alignItems: "center",
  background: "#2b2317",
  color: "#f4ecd8",
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
  border: "0.2mm solid #f4ecd8",
  fontSize: "micro",
  fontWeight: 700,
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums"
})

function assertNever(value: never): never {
  throw new Error(`Unhandled card kind: ${JSON.stringify(value)}`)
}

function WorkerCost({ workers }: { workers: number }) {
  return (
    <span className={costBadge}>
      <PersonStanding className={icon} />
      {workers}
    </span>
  )
}

function GoldCost({ gold }: { gold: number }) {
  return (
    <span className={costBadge}>
      <Coins className={icon} />
      {gold}
    </span>
  )
}

function CostRail({ cost }: { cost: Cost }) {
  return (
    <div className={costRail}>
      {cost.workers > 0 && <WorkerCost workers={cost.workers} />}
      {cost.gold > 0 && <GoldCost gold={cost.gold} />}
    </div>
  )
}

type BodyRegions = { top: ReactNode; bottom: ReactNode }

function fieldRegions(card: FieldCard): BodyRegions {
  return {
    top: null,
    bottom: (
      <div className={workerTable}>
        {card.slots.map((slot, i) => (
          <Fragment key={i}>
            <span className={slotCircle} />
            <span className={slotOutput}>{`${slot.amount} ${card.fruit}`}</span>
          </Fragment>
        ))}
      </div>
    )
  }
}

function improvementRegions(card: FieldImprovementCard): BodyRegions {
  return { top: card.additionalText, bottom: null }
}

function Footer({ copies }: { copies: CardData["copies"] }) {
  const present = PLAYER_COUNTS.filter((n) => copies[n] > 0)
  return (
    <div className={footer}>
      <div className={footerContent}>
        {present.map((n) => (
          <span key={n} className={playerPip}>
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

function bodyRegions(card: CardData): BodyRegions {
  switch (card.kind) {
    case "field":
      return fieldRegions(card)
    case "field-improvement":
      return improvementRegions(card)
    default:
      return assertNever(card)
  }
}

export function Card({
  card,
  variant = "bleed",
  showGuides = false
}: {
  card: CardData
  variant?: CardVariant
  showGuides?: boolean
}) {
  const regions = bodyRegions(card)
  return (
    <div className={cx(frame, variant === "bleed" ? bleedFrame : trimFrame)}>
      <div className={header}>
        <div className={headerContent}>
          <span className={titleText}>{card.name}</span>
        </div>
      </div>
      <div className={bodyRegion}>
        <div className={bodyTop}>
          <div className={bodyTopMain}>{regions.top}</div>
          <CostRail cost={card.cost} />
        </div>
        <div className={bodyBottom}>{regions.bottom}</div>
      </div>
      <Footer copies={card.copies} />
      {showGuides && variant === "bleed" && <Guides />}
    </div>
  )
}
