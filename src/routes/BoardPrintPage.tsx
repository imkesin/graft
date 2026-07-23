import { CARD_TRIM_H_MM, CARD_TRIM_W_MM } from "~/cards/cardSize"
import { LaborSupply } from "~/components/LaborSupply"
import { MarketStall } from "~/components/MarketStall"
import { WorkerZone } from "~/components/WorkerZone"
import { laborSupply } from "~/domain/LaborSupplyDefinitions"
import { marketStalls } from "~/domain/MarketDefinitions"
import { css } from "~/generated/styled-system/css"

/**
 * Full board sheet for an 18x24in print-shop sheet, printed landscape (24in wide
 * x 18in tall). A 0.5in bleed/safe margin all around leaves an inscribed 23x17in
 * board, laid out as a CSS grid.
 *
 * Tracks are conceived in a "double-resolution" unit grid: the inscribed board
 * is 46x34 half-inch units (1u = 0.5in), so an empty lane of size 1u is a slim
 * 0.5in gutter — half the width of a content inch's two units. The unit counts
 * below are authored as literal decimal inches in the styles (Panda extracts
 * `css()` statically, so a runtime unit() helper can't be used). Content tracks
 * take 2u per original inch; each 1u gutter surrenders 1u of "leftover" vs a
 * full 2u lane, which the flex/TBD zone of its grid absorbs — the `market`
 * (outer) and `emptyZone` placeholder (top band).
 *
 * The board seats the game's five worker-placement zones (one per Focus) as far
 * apart as the sheet allows, pairing each with the supply it draws on. The
 * bottom band holds the two economy engines (the market, and the Labor Market
 * track + its zone); the top band holds the three card/field actions (a card
 * supply stacked over its zone, or just a zone where there's no supply):
 *
 *     bottom-mid   Market ellipse        + Sell zone (dead centre)
 *     bottom-right Labor Market track    + Recruit zone
 *     top-left     (empty)
 *     top-mid      (no supply)             Harvest zone
 *     top-right    Expansion Card supply + Expand zone
 *
 * The top and bottom bands have DIFFERENT column needs, so they don't share
 * tracks: the outer grid's columns serve only the bottom band, and the top band
 * (`topBand`) is a nested full-width grid with its own columns.
 *
 * The former bottom-left `infra` column (Infrastructure tracks + Invest zone)
 * has been removed; its ~4in was absorbed mostly by the market (which grows from
 * 16.5in to 20in wide) and a little by the labor column (2in to 2.5in wide).
 *
 *   outer columns (u): 40 1 5  (= 46u = 23in)  [market gutter workers]
 *   outer rows (u):    11 1 17 1 4  (= 34u = 17in)
 *                        (market spans the bottom three rows = 22u = 11in)
 *
 *   outer gridTemplateAreas:
 *     "topBand topBand topBand"
 *     ".       .      ."
 *     "market  .      workers"
 *     "market  .      workers"
 *     "market  .      workers"
 *
 *   `topBand` spans the full 46u top row and holds its own grid:
 *     top columns (u): 12 1 14 1 18  (= 46u = 23in)
 *     top areas:   "cardsL . harvest . cardsR"
 *
 *   - `market`: bottom 20x11in block (col 1, spanning all three bottom rows),
 *     the 7 MarketStalls on an ellipse (kept upright for legibility) with the
 *     Sell zone at its centre.
 *   - `workers`: bottom-right 2.5x11in (5u-wide) column spanning all three bottom
 *     rows, holding the Labor Market with the Recruit zone tucked below it,
 *     framed together.
 *   - `cardsL`: 6in column — intentionally empty (formerly the Influence
 *     supply + zone). `cardsR`: 9in column — three Expansion Card outlines over
 *     the Expand zone. `harvest`: 7in column centring the (supply-less) Harvest
 *     zone, absorbing the leftover width.
 *   - The 1u buffer columns/gutter and the 1u buffer rows are real empty grid
 *     cells, so `gap` is 0.
 *
 * RADIUS_X is sized to the widened 20in market cell so the ring spreads into the
 * space freed by dropping the infra column; RADIUS_Y still fits the unchanged
 * 11in height. With 7 stalls anchored at the top vertex the ring's vertical
 * extremes are asymmetric (top sin=-1.0, bottom sin=+0.90), so OFFSET_Y nudges
 * it down to visually center the ellipse within the cell.
 */

const RADIUS_X = 205
const RADIUS_Y = 105
const OFFSET_Y = 5
const STALL_COUNT = 7

const CARD_TRIM_W = CARD_TRIM_W_MM
const CARD_TRIM_H = CARD_TRIM_H_MM

const printCss = `
  :root { --u: 1mm; }
  @page { size: 24in 18in; margin: 0; }
  @media print {
    html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
    .screen-only { display: none !important; }
    /*
     * height + overflow:hidden pins the print root to exactly one 18in page.
     * The market stalls are centred with transform: translate(-50%, -50%), and
     * Chrome paginates from the PRE-transform box, whose downward extent crosses
     * the page edge — fragmenting the bottom stalls (Coconut/Lime) onto a
     * phantom second page. Clipping to one page suppresses that break; nothing
     * visible is lost since all content fits within the 18in sheet.
     */
    .print-root { background: #fff !important; padding: 0 !important; display: block !important; height: 18in !important; overflow: hidden !important; }
    .sheet { box-shadow: none !important; margin: 0 !important; }
  }
`

const screen = css({
  background: "#525252",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  padding: "24px"
})

const note = css({
  position: "fixed",
  top: "12px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 10,
  background: "#262626",
  color: "#e5e5e5",
  fontSize: "13px",
  padding: "8px 14px",
  borderRadius: "8px"
})

const sheetStyle = css({
  position: "relative",
  width: "24in",
  height: "18in",
  background: "#fff",
  boxSizing: "border-box",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  flex: "none",
  display: "grid",
  gridTemplateColumns: "20in 0.5in 2.5in",
  gridTemplateRows: "5.5in 0.5in 8.5in 0.5in 2in",
  gridTemplateAreas: `"topBand topBand topBand" ". . ." "market . workers" "market . workers" "market . workers"`,
  gap: 0,
  padding: "0.5in"
})

// The top band is its own full-width (46u) grid, independent of the bottom's
// gutter/market/workers tracks, so the card columns keep their width regardless
// of the narrower bottom-corner cells below them.
const topBandArea = css({
  gridArea: "topBand",
  display: "grid",
  gridTemplateColumns: "6in 0.5in 7in 0.5in 9in",
  gridTemplateAreas: `"cardsL . harvest . cardsR"`,
  gap: 0
})

// A barely-there dotted frame around each region cell — a development aid for
// eyeballing the layout; intended to be removed once the board is finalised.
const devOutline = {
  border: "0.3mm dotted",
  borderColor: "stone.200",
  borderRadius: "card"
} as const

// Each card action stacks its face-up supply over its worker zone: the card row
// sits at the top of the 5.5in band, the labelled WorkerZone tucks in below.
const cardStack = {
  ...devOutline,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5mm",
  paddingTop: "3mm"
} as const

// The former Influence column, now intentionally empty. It keeps its 6in grid
// track so Harvest and Expand stay put; nothing is drawn in it.
const cardsLArea = css({ gridArea: "cardsL" })
const cardsRArea = css({ ...cardStack, gridArea: "cardsR" })

// Harvest has no board supply, so its column just centres the bare zone.
const harvestArea = css({
  ...devOutline,
  gridArea: "harvest",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
})

const supplyRow = css({ display: "flex", justifyContent: "center", gap: "8mm" })

const cardOutline = css({
  flexShrink: 0,
  border: "0.3mm dashed",
  borderColor: "stone.400",
  borderRadius: "card",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "stone.400",
  fontSize: "micro"
})

const cardOutlineSize = { width: `${CARD_TRIM_W}mm`, height: `${CARD_TRIM_H}mm` }

// The bottom-corner zone cells just centre a labelled WorkerZone. No outline of
// their own — they sit inside the infra/workers column, which frames them.
const zoneCell = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
})

// The workers column spans the full 11in bottom band, framing its track (top)
// and its worker zone (bottom, ~1.5in) as one dev-outlined region. `1fr auto`
// lets the track fill and the zone take its natural height.
const workersArea = css({
  ...devOutline,
  gridArea: "workers",
  display: "grid",
  gridTemplateRows: "1fr auto",
  gap: "0.25in"
})

const gameArea = css({
  gridArea: "market",
  position: "relative",
  border: "0.3mm dotted",
  borderColor: "stone.200",
  borderRadius: "card"
})

const stallWrap = css({
  position: "absolute",
  transform: "translate(-50%, -50%)"
})

export function BoardPrintPage() {
  const stalls = marketStalls.slice(0, STALL_COUNT)

  return (
    <>
      <style>{printCss}</style>
      <div className={`print-root ${screen}`}>
        <div className={`${note} screen-only`}>
          Print → 24x18in landscape · Margins: None · Scale: 100%
        </div>
        <div className={`sheet ${sheetStyle}`}>
          <div className={topBandArea}>
            <div className={cardsLArea} />
            <div className={harvestArea}>
              <WorkerZone label="Harvest" />
            </div>
            <div className={cardsRArea}>
              <div className={supplyRow}>
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className={cardOutline} style={cardOutlineSize}>
                    Expansion
                  </div>
                ))}
              </div>
              <WorkerZone label="Expand" />
            </div>
          </div>
          <div className={workersArea}>
            <LaborSupply track={laborSupply.workerTrack} />
            <div className={zoneCell}>
              <WorkerZone label="Recruit" />
            </div>
          </div>
          <div className={gameArea}>
            <div
              className={stallWrap}
              style={{ left: "50%", top: `calc(50% + ${OFFSET_Y}mm)` }}
            >
              <WorkerZone label="Sell" />
            </div>
            {stalls.map((stall, i) => {
              const theta = (-90 + (i * 360) / STALL_COUNT) * (Math.PI / 180)
              const x = RADIUS_X * Math.cos(theta)
              const y = RADIUS_Y * Math.sin(theta)
              return (
                <div
                  key={stall.fruit}
                  className={stallWrap}
                  style={{ left: `calc(50% + ${x}mm)`, top: `calc(50% + ${y + OFFSET_Y}mm)` }}
                >
                  <MarketStall
                    fruit={stall.fruit}
                    color="stone"
                    columns={stall.demandColumns}
                    induces={stall.induces}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
