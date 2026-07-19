import { useEffect, useState } from "react"
import { fieldDeck, previewCard } from "~/cards/fieldDeck"
import { influenceDeck } from "~/cards/influenceDeck"
import { Card } from "~/components/Card"
import { GoldCost } from "~/components/icons/GoldCost"
import { InducedDemand } from "~/components/icons/InducedDemand"
import { WorkerCost } from "~/components/icons/WorkerCost"
import { FruitCrateSlot } from "~/components/slots/FruitCrateSlot"
import { WorkerSlot } from "~/components/slots/WorkerSlot"
import { MarketStall } from "~/components/MarketStall"
import { ZoomControl } from "~/components/ZoomControl"
import { FRUIT_LIST_WITH_METADATA, type FruitName, PLAYER_COUNTS, type PlayerCount } from "~/domain/CoreDefinitions"
import { marketStalls } from "~/domain/MarketDefinitions"
import { css } from "~/generated/styled-system/css"

const allCards = [
  ...fieldDeck,
  ...influenceDeck
]

const page = css({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "24px",
  padding: "24px"
})

const select = css({
  background: "#262626",
  color: "#e5e5e5",
  border: "1px solid #404040",
  borderRadius: "6px",
  padding: "6px 10px",
  fontSize: "14px"
})

export function App() {
  const [zoom, setZoom] = useState(2.5)
  const [showGuides, setShowGuides] = useState(true)
  const [selectedId, setSelectedId] = useState(allCards[0]?.id)
  const selected = allCards.find((card) => card.id === selectedId) ?? allCards[0]
  const [stallFruit, setStallFruit] = useState(marketStalls[0]?.fruit)
  const [stallPlayers, setStallPlayers] = useState<PlayerCount>(4)
  const selectedStall = marketStalls.find((s) => s.fruit === stallFruit) ?? marketStalls[0]

  // `--u` must live on the root: Panda hoists the card-unit tokens to `:root`,
  // so their `var(--u)` is resolved there. Setting it on a nested wrapper has
  // no effect. `--u` is therefore a single global scale knob.
  useEffect(() => {
    document.documentElement.style.setProperty("--u", `${zoom}mm`)
  }, [zoom])

  return (
    <div className={page}>
      <ZoomControl
        zoom={zoom}
        onZoom={setZoom}
        showGuides={showGuides}
        onToggleGuides={setShowGuides}
      />
      <select className={select} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
        {allCards.map((card) => (
          <option key={card.id} value={card.id}>
            {card.name}
          </option>
        ))}
      </select>
      {selected && <Card card={previewCard(selected)} showGuides={showGuides} />}
      <select
        className={select}
        value={stallFruit}
        onChange={(e) => setStallFruit(e.target.value as FruitName)}
      >
        {marketStalls.map((s) => (
          <option key={s.fruit} value={s.fruit}>
            {s.fruit}
          </option>
        ))}
      </select>
      <select
        className={select}
        value={stallPlayers}
        onChange={(e) => setStallPlayers(Number(e.target.value) as PlayerCount)}
      >
        {PLAYER_COUNTS.map((n) => (
          <option key={n} value={n}>
            {n} players
          </option>
        ))}
      </select>
      {selectedStall && (
        <MarketStall
          fruit={selectedStall.fruit}
          color={selectedStall.color}
          slots={selectedStall.demandTrack[stallPlayers]}
          induces={selectedStall.induces}
        />
      )}
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <GoldCost amount={1} />
        <GoldCost amount={7} />
        <GoldCost amount={12} />
        <GoldCost amount={88} />
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <WorkerCost amount={1} />
        <WorkerCost amount={7} />
        <WorkerCost amount={12} />
        <WorkerCost amount={88} />
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <InducedDemand amount={1} />
        <InducedDemand amount={2} />
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {FRUIT_LIST_WITH_METADATA.map((f) => (
          <FruitCrateSlot key={f.name} color={f.color} letter={f.name.charAt(0)} />
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <WorkerSlot />
        <WorkerSlot />
        <WorkerSlot />
      </div>
    </div>
  )
}

export default App
