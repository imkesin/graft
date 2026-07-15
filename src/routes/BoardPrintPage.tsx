import { useState } from "react"
import { laborMarket } from "~/board/labor"
import { marketStalls } from "~/board/market"
import { CARD_TRIM_H_MM, CARD_TRIM_W_MM } from "~/cards/cardSize"
import { PLAYER_COUNTS, type PlayerCount } from "~/cards/domain"
import { LaborMarket } from "~/components/LaborMarket"
import { MarketStall } from "~/components/MarketStall"
import { css } from "~/generated/styled-system/css"

/**
 * Full board sheet for an 18x24in print-shop sheet, printed landscape
 * (24in wide x 18in tall). A 0.5in bleed/safe margin all around leaves an
 * inscribed 23x17in board, laid out as a CSS grid whose tracks are authored
 * directly in inches:
 *
 *   columns: 6 1 3 1 3 1 3 1 4 (in)   (= 23in)
 *   rows:    5 1 8 1 2 (in)           (= 17in)
 *
 *   gridTemplateAreas:
 *     "cardsL .      cardM  .      emptyZone .      cardsR cardsR cardsR"
 *     ".      .      .      .      .         .      .      .      ."
 *     "market market market market market   market market .      workers"
 *     "market market market market market   market market .      ."
 *     "market market market market market   market market .      tinyZone"
 *
 *   The column tracks are the union of the top band's card zones
 *   (6/1/3/1/3/1/8) and the bottom's market/workers split (18/1/4).
 *
 *   - `market`: bottom-left 18x11in block (cols 1-7, spanning all three bottom
 *     rows), the 7 MarketStalls on an ellipse (kept upright for legibility).
 *   - `workers`: bottom-right 4x8in column — a dashed recruiting station with a
 *     1in token-staging lane on the left and the Labor Market track filling the
 *     rest.
 *   - `tinyZone`: 4x2in placeholder in the bottom-right corner, split from
 *     `workers` by a 1in buffer row; content TBD.
 *   - `cardsL`: 6in zone, two spread card outlines. `cardM`: 3in zone, one
 *     centered card. `cardsR`: 8in zone, three evenly-spread cards.
 *   - `emptyZone`: 3x4in outlined placeholder; content TBD.
 *   - The `1in` buffer columns and the `1in` buffer row are real empty grid
 *     cells, so `gap` is 0.
 *
 * RADIUS_X/Y are sized against MarketStall's measured footprint at 4 players
 * (7 demand slots, its widest case: ~100x56mm) so the ring inscribes the
 * 18x11in (457x279mm) market cell with a few mm of clearance. With 7 stalls
 * anchored at the top vertex the ring's vertical extremes are asymmetric
 * (top sin=-1.0, bottom sin=+0.90), so OFFSET_Y nudges it down to visually
 * center the ellipse within the cell.
 */

const RADIUS_X = 175
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
  gridTemplateColumns: "6in 1in 3in 1in 3in 1in 3in 1in 4in",
  gridTemplateRows: "5in 1in 8in 1in 2in",
  gridTemplateAreas: `"cardsL . cardM . emptyZone . cardsR cardsR cardsR" ". . . . . . . . ." "market market market market market market market . workers" "market market market market market market market . ." "market market market market market market market . tinyZone"`,
  gap: 0,
  padding: "0.5in"
})

// Cards sit at the top of each box; the space left below is intentional, so
// hired workers can be placed onto the card once it's in play.
const cardRow = {
  display: "flex",
  alignItems: "flex-start",
  paddingTop: "3mm",
  border: "0.3mm dashed",
  borderColor: "stone.400",
  borderRadius: "card"
} as const

const cardsLArea = css({ ...cardRow, gridArea: "cardsL", justifyContent: "space-evenly" })
const cardMArea = css({ ...cardRow, gridArea: "cardM", justifyContent: "center" })
const cardsRArea = css({ ...cardRow, gridArea: "cardsR", justifyContent: "space-evenly" })

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

const placeholderBox = {
  border: "0.3mm dashed",
  borderColor: "stone.400",
  borderRadius: "card",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "stone.400",
  fontSize: "micro"
} as const

const emptyZoneArea = css({ ...placeholderBox, gridArea: "emptyZone" })
const tinyZoneArea = css({ ...placeholderBox, gridArea: "tinyZone" })

// The Labor Market's cell is a dashed "recruiting station": a 1in lane on the
// left is left open for players to drop tokens when hiring, and the Labor
// Market component fills the remaining width to its right.
const workersArea = css({
  gridArea: "workers",
  display: "grid",
  gridTemplateColumns: "1in 1fr",
  gap: "2mm",
  padding: "2mm",
  border: "0.3mm dashed",
  borderColor: "stone.400",
  borderRadius: "card"
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
          <div className={cardsLArea}>
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className={cardOutline} style={cardOutlineSize}>
                Card
              </div>
            ))}
          </div>
          <div className={cardMArea}>
            <div className={cardOutline} style={cardOutlineSize}>
              Card
            </div>
          </div>
          <div className={emptyZoneArea} />
          <div className={cardsRArea}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={cardOutline} style={cardOutlineSize}>
                Card
              </div>
            ))}
          </div>
          <div className={workersArea}>
            <div />
            <LaborMarket tiers={laborMarket.workerTrack[players]} />
          </div>
          <div className={tinyZoneArea} />
          <div className={gameArea}>
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
                    color={stall.color}
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
