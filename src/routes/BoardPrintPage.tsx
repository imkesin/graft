import { useState } from "react"
import { laborMarket } from "~/board/labor"
import { marketStalls } from "~/domain/MarketDefinitions"
import { CARD_TRIM_H_MM, CARD_TRIM_W_MM } from "~/cards/cardSize"
import { InfraTrack } from "~/components/InfraTrack"
import { LaborMarket } from "~/components/LaborMarket"
import { MarketStall } from "~/components/MarketStall"
import { WorkerZone } from "~/components/WorkerZone"
import { PLAYER_COUNTS, type PlayerCount } from "~/domain/CoreDefinitions"
import { infrastructureTracks } from "~/domain/InfrastructureDefinitions"
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
 * The board seats the game's six worker-placement zones (one per Focus) as far
 * apart as the sheet allows, pairing each with the supply it draws on. The
 * bottom band holds the three economy engines (a track + its zone); the top band
 * holds the three card/field actions (a card supply stacked over its zone, or
 * just a zone where there's no supply):
 *
 *     bottom-left  Infrastructure track  + Invest zone
 *     bottom-mid   Market ellipse        + Sell zone (dead centre)
 *     bottom-right Labor Market track    + Recruit zone
 *     top-left     Influence Card supply + Influence zone
 *     top-mid      (no supply)             Harvest zone
 *     top-right    Expansion Card supply + Expand zone
 *
 * The top and bottom bands have DIFFERENT column needs, so they don't share
 * tracks: the outer grid's columns serve only the bottom band, and the top band
 * (`topBand`) is a nested full-width grid with its own columns.
 *
 *   outer columns (u): 5 1 34 1 5  (= 46u = 23in)  [infra gutter market gutter workers]
 *   outer rows (u):    11 1 17 1 4  (= 34u = 17in)
 *                        (market spans the bottom three rows = 22u = 11in)
 *
 *   outer gridTemplateAreas:
 *     "topBand topBand topBand topBand topBand"
 *     ".       .      .      .      ."
 *     "infra   .      market .      workers"
 *     "infra   .      market .      workers"
 *     "infra   .      market .      workers"
 *
 *   `topBand` spans the full 46u top row and holds its own grid:
 *     top columns (u): 12 1 14 1 18  (= 46u = 23in)
 *     top areas:   "cardsL . harvest . cardsR"
 *
 *   - `infra`: bottom-left 2.5x11in (5u-wide) column spanning all three bottom
 *     rows, holding the infrastructure upgrade tracks (Ports/Railways) stacked
 *     evenly with the Invest zone tucked below them, framed together. Separated
 *     from the market by a 1u (0.5in) gutter.
 *   - `market`: bottom 17x11in block (col 3, spanning all three bottom rows),
 *     the 7 MarketStalls on an ellipse (kept upright for legibility) with the
 *     Sell zone at its centre. Ellipse is deliberately not yet re-fit to the
 *     narrower cell.
 *   - `workers`: bottom-right 2.5x11in (5u-wide) column spanning all three bottom
 *     rows, holding the Labor Market with the Recruit zone tucked below it,
 *     framed together.
 *   - `cardsL`: 6in column — two Influence Card outlines over the Influence zone.
 *     `cardsR`: 9in column — three Expansion Card outlines over the Expand
 *     zone (Influence:Expand = 2:3). `harvest`: 7in column centring the
 *     (supply-less) Harvest zone, absorbing the leftover width.
 *   - The 1u buffer columns/gutter and the 1u buffer rows are real empty grid
 *     cells, so `gap` is 0.
 *
 * RADIUS_X/Y are sized against MarketStall's measured footprint at 4 players
 * (7 demand slots, its widest case: ~100x56mm) so the ring inscribes the
 * ~19x11in market cell with a few mm of clearance. With 7 stalls
 * anchored at the top vertex the ring's vertical extremes are asymmetric
 * (top sin=-1.0, bottom sin=+0.90), so OFFSET_Y nudges it down to visually
 * center the ellipse within the cell.
 */

const RADIUS_X = 160
const RADIUS_Y = 110
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
    .print-root { background: #fff !important; padding: 0 !important; display: block !important; }
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
  gridTemplateColumns: "2.5in 0.5in 17in 0.5in 2.5in",
  gridTemplateRows: "5.5in 0.5in 8.5in 0.5in 2in",
  gridTemplateAreas:
    `"topBand topBand topBand topBand topBand" ". . . . ." "infra . market . workers" "infra . market . workers" "infra . market . workers"`,
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

const cardsLArea = css({ ...cardStack, gridArea: "cardsL" })
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

// The infra and workers columns each span the full 11in bottom band, framing
// their track (top) and its worker zone (bottom, ~1.5in) as one dev-outlined
// region. `1fr auto` lets the track fill and the zone take its natural height.
const infraArea = css({
  ...devOutline,
  gridArea: "infra",
  display: "grid",
  gridTemplateRows: "1fr auto",
  gap: "0.25in"
})

const workersArea = css({
  ...devOutline,
  gridArea: "workers",
  display: "grid",
  gridTemplateRows: "1fr auto",
  gap: "0.25in"
})

// The infrastructure tracks stack vertically, filling the infra column's track
// region evenly however many there are; each carries its own frame.
const infraTracks = css({
  display: "grid",
  gridAutoRows: "1fr",
  gap: "0.25in",
  minHeight: 0
})

const gameArea = css({
  gridArea: "market",
  position: "relative",
  border: "0.3mm dotted",
  borderColor: "stone.400",
  borderRadius: "card"
})

const stallWrap = css({
  position: "absolute",
  transform: "translate(-50%, -50%)"
})

export function BoardPrintPage() {
  const [players, setPlayers] = useState<PlayerCount>(4)
  const stalls = marketStalls.slice(0, STALL_COUNT)

  return (
    <>
      <style>{printCss}</style>
      <div className={`print-root ${screen}`}>
        <div className={`${note} screen-only`}>
          Print → 24x18in landscape · Margins: None · Scale: 100%
          <label style={{ marginLeft: "12px" }}>
            Players{" "}
            <select
              value={players}
              onChange={(e) => setPlayers(Number(e.target.value) as PlayerCount)}
            >
              {PLAYER_COUNTS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={`sheet ${sheetStyle}`}>
          <div className={topBandArea}>
            <div className={cardsLArea}>
              <div className={supplyRow}>
                {Array.from({ length: 2 }, (_, i) => (
                  <div key={i} className={cardOutline} style={cardOutlineSize}>
                    Influence
                  </div>
                ))}
              </div>
              <WorkerZone label="Influence" />
            </div>
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
            <LaborMarket tiers={laborMarket.workerTrack[players]} />
            <div className={zoneCell}>
              <WorkerZone label="Recruit" />
            </div>
          </div>
          <div className={infraArea}>
            <div className={infraTracks}>
              {infrastructureTracks.map((infra) => (
                <InfraTrack key={infra.kind} kind={infra.kind} levels={infra.levels} />
              ))}
            </div>
            <div className={zoneCell}>
              <WorkerZone label="Invest" />
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
                    slots={stall.demandTrack[players]}
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
