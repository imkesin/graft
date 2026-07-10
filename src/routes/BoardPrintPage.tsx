import { useState } from "react"
import { laborMarket } from "~/board/labor"
import { marketStalls } from "~/board/market"
import { CARD_TRIM_H_MM, CARD_TRIM_W_MM } from "~/cards/cardSize"
import { PLAYER_COUNTS, type PlayerCount } from "~/cards/domain"
import { LaborMarket } from "~/components/LaborMarket"
import { MarketStall } from "~/components/MarketStall"
import { css } from "~/generated/styled-system/css"

/**
 * Rough first pass at the full board sheet, sized for an 18x24in landscape
 * print-shop sheet. Grid areas:
 *
 *   "cards cards"
 *   "game  workers"
 *
 *   - `cards`: one row across the full top, playing-card-sized (trim 63x88mm,
 *     matching Card.tsx/PrintPage.tsx) outlines — 3 grouped on the left, a
 *     flexible blank gap, then 2 grouped on the right (`auto 1fr auto`).
 *   - `workers`: the lower-right, the Labor Market's worker track (see
 *     `LaborMarket`), exactly `CARD_TRIM_W` wide to match the card outlines
 *     above it.
 *   - `game`: 7 MarketStalls sitting at the vertices of an ellipse (kept
 *     upright for legibility, not tiled/rotated wedges — a possible later
 *     refinement), in the lower-left. Fruit-relationship info lives as text
 *     on each stall rather than as a center diagram, so the ring's middle is
 *     left open.
 *
 * RADIUS_X/Y are tuned against MarketStall's rendered footprint at 4 players
 * (7 demand slots, its widest case) so adjacent stalls clear each other —
 * nudge them again if the stall's size changes.
 */

const IN_TO_MM = 25.4
const PAGE_W = 24 * IN_TO_MM // 609.6mm
const PAGE_H = 18 * IN_TO_MM // 457.2mm

const RADIUS_X = 185
const RADIUS_Y = 115
const STALL_COUNT = 7

const CARD_TRIM_W = CARD_TRIM_W_MM
const CARD_TRIM_H = CARD_TRIM_H_MM
const LEFT_CARD_COUNT = 3
const RIGHT_CARD_COUNT = 2

const printCss = `
  :root { --u: 1mm; }
  @page { size: ${PAGE_W}mm ${PAGE_H}mm; margin: 0; }
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
  background: "#fff",
  boxSizing: "border-box",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  flex: "none",
  display: "grid",
  gridTemplateAreas: `"cards cards" "game workers"`,
  gridTemplateRows: "auto 1fr",
  gap: "10mm",
  padding: "10mm"
})

const workersArea = css({ gridArea: "workers" })

const gameArea = css({ gridArea: "game", position: "relative" })

// Left group / blank gap / right group — the gap is a real empty grid cell
// (`1fr`), not just visual spacing, so it soaks up whatever width is left.
const cardSlotArea = css({
  gridArea: "cards",
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  height: `${CARD_TRIM_H}mm`
})

const cardGroup = css({
  display: "flex",
  gap: "4mm"
})

const cardOutline = css({
  width: `${CARD_TRIM_W}mm`,
  height: `${CARD_TRIM_H}mm`,
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
          Print → 18x24in landscape · Margins: None · Scale: 100%
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
        <div
          className={`sheet ${sheetStyle}`}
          style={{
            width: `${PAGE_W}mm`,
            height: `${PAGE_H}mm`,
            gridTemplateColumns: `1fr ${CARD_TRIM_W}mm`
          }}
        >
          <div className={cardSlotArea}>
            <div className={cardGroup}>
              {Array.from({ length: LEFT_CARD_COUNT }, (_, i) => (
                <div key={i} className={cardOutline}>
                  Card
                </div>
              ))}
            </div>
            <div />
            <div className={cardGroup}>
              {Array.from({ length: RIGHT_CARD_COUNT }, (_, i) => (
                <div key={i} className={cardOutline}>
                  Card
                </div>
              ))}
            </div>
          </div>
          <div className={workersArea}>
            <LaborMarket slots={laborMarket.workerTrack[players]} />
          </div>
          <div className={gameArea}>
            {stalls.map((stall, i) => {
              const theta = (-90 + (i * 360) / STALL_COUNT) * (Math.PI / 180)
              const x = RADIUS_X * Math.cos(theta)
              const y = RADIUS_Y * Math.sin(theta)
              return (
                <div
                  key={stall.fruit}
                  className={stallWrap}
                  style={{ left: `calc(50% + ${x}mm)`, top: `calc(50% + ${y}mm)` }}
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
