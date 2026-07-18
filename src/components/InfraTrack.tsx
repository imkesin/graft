import { Coins, PersonStanding } from "lucide-react"
import { darkBand, paperFrame } from "~/components/paperFrame"
import { icon, value } from "~/components/trackSlot"
import type { Infrastructure, InfrastructureTrackLevel } from "~/domain/InfrastructureDefinitions"
import { css, cx } from "~/generated/styled-system/css"

/**
 * One infrastructure upgrade track (Port / Railway / Telegraph): a header names
 * the type, and the levels below are a top-to-bottom ladder unlocked lowest
 * first. Each level pairs the `cost` to reach it (left) with the `effect` it
 * grants (right). Levels are driven by CSS grid (`gridAutoRows: 1fr`) so they
 * always fill the track's full height, whatever the level count. Cost/effect
 * are the two authored zones; the effect is free text until the effect enum
 * lands (see `~/board/domain`).
 */

// paperFrame/darkBand tint per infrastructure type — distinct hues so the
// tracks read apart at a glance when stacked in the board's infra column.
const KIND_COLOR = {
  Ports: "cyan",
  Railways: "amber"
} as const satisfies Record<Infrastructure, string>

const frame = css({
  display: "grid",
  gridTemplateRows: "auto 1fr",
  height: "100%",
  minHeight: 0,
  borderWidth: "0.3mm",
  borderStyle: "solid",
  borderRadius: "card",
  overflow: "hidden"
})

const header = css({
  textAlign: "center",
  fontSize: "body",
  fontWeight: 700,
  letterSpacing: "0.02em",
  paddingBlock: "1"
})

const track = css({
  display: "grid",
  gridAutoFlow: "row",
  gridAutoRows: "1fr",
  minHeight: 0
})

// Level marker | cost stack | effect text. The cost column is `auto` so it
// stays as narrow as its badges, leaving the rest for the effect.
const level = css({
  display: "grid",
  gridTemplateColumns: "auto auto 1fr",
  alignItems: "center",
  gap: "1.5",
  paddingInline: "2",
  paddingBlock: "1",
  borderBottomWidth: "0.2mm",
  borderBottomStyle: "solid",
  borderBottomColor: "stone.400/40"
})

const lastLevel = css({ borderBottomWidth: 0 })

const levelMark = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "6",
  height: "6",
  borderWidth: "0.3mm",
  borderStyle: "solid",
  borderColor: "stone.400",
  borderRadius: "9999px",
  fontSize: "micro",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  flexShrink: 0
})

// Workers over gold, so a level with both stacks compactly in the narrow column.
const cost = css({
  display: "grid",
  justifyItems: "start",
  gap: "0.5"
})

const effect = css({
  fontSize: "micro",
  lineHeight: 1.2
})

// The schema carries effects as structured bonuses, not free text; render the
// ones a level grants as a short human-readable line (blank on the free rung).
function effectText(level: InfrastructureTrackLevel): string {
  const parts: string[] = []
  const transportCapacityIncrease = level.commonBonus?.transportCapacityIncrease
  const marketOverflowSlotIncrease = level.commonBonus?.marketOverflowSlotIncrease
  if (transportCapacityIncrease) parts.push(`+${transportCapacityIncrease} Transport Capacity`)
  if (marketOverflowSlotIncrease) parts.push(`+${marketOverflowSlotIncrease} Overflow Slot`)
  if (level.immediateBonus?.additionalTurns) parts.push(`+${level.immediateBonus.additionalTurns} Turn`)
  return parts.join(" · ")
}

export function InfraTrack(
  { kind, levels }: { kind: Infrastructure; levels: readonly InfrastructureTrackLevel[] }
) {
  const color = KIND_COLOR[kind]
  return (
    <div className={cx(frame, paperFrame({ color }))}>
      <div className={cx(header, darkBand({ color }))}>{kind}</div>
      <div className={track}>
        {levels.map((l, i) => (
          <div key={i} className={cx(level, i === levels.length - 1 && lastLevel)}>
            <span className={levelMark}>{i + 1}</span>
            <div className={cost}>
              {l.cost.workers > 0 && (
                <span className={value}>
                  <PersonStanding className={icon} />
                  {l.cost.workers}
                </span>
              )}
              {l.cost.gold > 0 && (
                <span className={value}>
                  <Coins className={icon} />
                  {l.cost.gold}
                </span>
              )}
            </div>
            <span className={effect}>{effectText(l)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
