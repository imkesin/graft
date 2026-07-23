import { FOCUS_ACTION_METADATA, FOCUSES } from "~/domain/FocusDefinitions"
import { css } from "~/generated/styled-system/css"

/**
 * Single-page player reference for the four Focus actions. Not a rulebook — a
 * one-sheet "latest rules" card a player keeps beside them: each Focus, its
 * action name, and the current rule text, laid out to fit one US Letter page.
 *
 * Print geometry mirrors the card sheet (PrintPage): Letter, zero @page margin,
 * the sheet supplies its own inner margin, and the on-screen backdrop is
 * stripped white at print time. Unlike the card sheets this page is typographic,
 * not card-unit based, so it uses pt/mm directly rather than `--u`.
 *
 * IMPORTANT for manual Cmd-P: Margins = None, Scale = 100%.
 */

const PAGE_W = 215.9 // US Letter, mm
const PAGE_H = 279.4
const MARGIN = 14

// Each Focus carries an accent that ties the block to a colour identity. Kept
// muted (600-step) so the sheet reads as ink on paper, not a highlighter.
const ACCENT: Record<string, string> = {
  Expand: "#059669", // emerald.600
  Harvest: "#d97706", // amber.600
  Recruit: "#0284c7", // sky.600
  Sell: "#e11d48" // rose.600
}

const printCss = `
  @page { size: letter; margin: 0; }
  @media print {
    html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
    .screen-only { display: none !important; }
    .print-root { background: #fff !important; padding: 0 !important; gap: 0 !important; display: block !important; }
    /*
     * The content is shorter than a Letter page. Pinning the sheet to the full
     * page height leaves a box that ends exactly at the page edge, which Chrome
     * fragments onto a phantom second page. Letting print height flow to content
     * keeps it on one page; the @page's zero margin + the sheet's own padding
     * still supply the print margin.
     */
    .sheet { box-shadow: none !important; margin: 0 !important; height: auto !important; }
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

// The page is a grid: a header band over a flowing two-column body. The body
// uses CSS multi-column so the five variable-length blocks balance across the
// two columns, with each block kept whole (break-inside: avoid).
const sheetStyle = css({
  position: "relative",
  background: "#fff",
  color: "#1c1917",
  boxSizing: "border-box",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  flex: "none",
  display: "grid",
  gridTemplateRows: "auto 1fr",
  fontFamily: "system-ui, -apple-system, sans-serif"
})

const header = css({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "baseline",
  gap: "6mm",
  paddingBottom: "3.5mm",
  borderBottom: "0.6mm solid #1c1917"
})

const title = css({
  fontSize: "30pt",
  fontWeight: 800,
  letterSpacing: "-0.01em",
  lineHeight: 1
})

const subtitle = css({
  fontSize: "11pt",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#57534e"
})

const body = css({
  columnCount: 2,
  columnGap: "11mm",
  paddingTop: "9mm"
})

const block = css({
  breakInside: "avoid",
  marginBottom: "8.5mm",
  paddingLeft: "5.5mm",
  borderLeft: "1.4mm solid"
})

const blockHead = css({
  display: "flex",
  alignItems: "baseline",
  gap: "3mm",
  marginBottom: "2.5mm"
})

const focusName = css({
  fontSize: "17pt",
  fontWeight: 800,
  lineHeight: 1
})

const actionName = css({
  fontSize: "9pt",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase"
})

const para = css({
  fontSize: "10.5pt",
  lineHeight: 1.5,
  margin: "0 0 2.5mm 0",
  color: "#292524"
})

export function FocusReferencePage() {
  return (
    <>
      <style>{printCss}</style>
      <div className={`print-root ${screen}`}>
        <div className={`${note} screen-only`}>
          Print → Letter · Margins: None · Scale: 100%
        </div>
        <div
          className={`sheet ${sheetStyle}`}
          style={{ width: `${PAGE_W}mm`, height: `${PAGE_H}mm`, padding: `${MARGIN}mm` }}
        >
          <div className={header}>
            <div className={title}>Graft</div>
            <div className={subtitle}>Focus Actions · Player Reference</div>
          </div>
          <div className={body}>
            {FOCUSES.map((focus) => {
              const accent = ACCENT[focus]
              const action = FOCUS_ACTION_METADATA[focus].actions[0]
              if (!action) return null
              const paragraphs = action.ruleDescription.split("\n\n")
              return (
                <div key={focus} className={block} style={{ borderLeftColor: accent }}>
                  <div className={blockHead}>
                    <span className={focusName} style={{ color: accent }}>
                      {focus}
                    </span>
                    {action.name !== focus && (
                      <span className={actionName} style={{ color: accent }}>
                        {action.name}
                      </span>
                    )}
                  </div>
                  {paragraphs.map((text, i) => <p key={i} className={para}>{text}</p>)}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
