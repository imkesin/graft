import { css, cx } from "~/generated/styled-system/css";
import { Guides } from "./Guides";

/**
 * A single poker card. Two render variants:
 *
 *   - "bleed": full-bleed 69x94mm with a 6u (bleed + trim->safe) content inset.
 *     For the single-card / pro-print path. Supports the guide overlay.
 *   - "trim":  trim-only 63x88mm with a 3u (trim->safe) content inset and a
 *     hairline cut outline. For the home N-up grid sheet, where cards touch and
 *     the shared outlines form the cut grid.
 *
 * Either way the safe-zone content box is 57x82mm, so content is identical
 * across variants. All dimensions resolve from `--u` (1mm in print).
 */
export type CardVariant = "bleed" | "trim";

const DEFAULT_TITLE = "Net-Net Stock";
const DEFAULT_BODY =
  "Trades below net current asset value.\n\n" +
  "When revealed, draw 2 cards and gain 1 Margin of Safety token. If no " +
  "opponent holds Mr. Market, you may liquidate this card for its book " +
  "value at end of turn.";

const frame = css({
  position: "relative",
  background: "#f4ecd8",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: "3",
  color: "#2b2317",
  overflow: "hidden",
});

const bleedFrame = css({
  width: "cardW",
  height: "cardH",
  padding: "6",
});

const trimFrame = css({
  width: "trimW",
  height: "trimH",
  padding: "3",
  // Hairline cut line on the trim boundary. `outline` doesn't affect layout,
  // so adjacent cards' outlines coincide into a single shared cut line.
  outline: "0.2mm solid #6b6150",
});

const titleBar = css({
  background: "#2b2317",
  color: "#f4ecd8",
  borderRadius: "1",
  paddingInline: "3",
  paddingBlock: "2",
  fontSize: "title",
  fontWeight: 700,
  letterSpacing: "0.02em",
  lineHeight: 1.1,
});

const bodyText = css({
  flex: 1,
  fontSize: "body",
  lineHeight: 1.35,
  whiteSpace: "pre-line",
});

export function Card({
  variant = "bleed",
  showGuides = false,
  title = DEFAULT_TITLE,
  body = DEFAULT_BODY,
}: {
  variant?: CardVariant;
  showGuides?: boolean;
  title?: string;
  body?: string;
}) {
  return (
    <div className={cx(frame, variant === "bleed" ? bleedFrame : trimFrame)}>
      <div className={titleBar}>{title}</div>
      <div className={bodyText}>{body}</div>
      {showGuides && variant === "bleed" && <Guides />}
    </div>
  );
}
