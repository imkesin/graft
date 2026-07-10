import { useEffect, useState } from "react"
import { marketStalls } from "~/board/market"
import { deck, previewCard } from "~/cards/deck"
import { type FruitName, PLAYER_COUNTS, type PlayerCount } from "~/cards/domain"
import { influenceDeck } from "~/cards/influenceDeck"
import { Card } from "~/components/Card"
import { MarketStall } from "~/components/MarketStall"
import { ZoomControl } from "~/components/ZoomControl"
import { css } from "~/generated/styled-system/css"

// Field/field-improvement and Influence are separate printed decks, but the
// preview picker below just needs one flat list of every card to browse.
const allCards = [...deck, ...influenceDeck]

const page = css({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "24px",
  padding: "24px"
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
      <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
        {allCards.map((card) => (
          <option key={card.id} value={card.id}>
            {card.name}
          </option>
        ))}
      </select>
      {selected && <Card card={previewCard(selected)} showGuides={showGuides} />}
      <select value={stallFruit} onChange={(e) => setStallFruit(e.target.value as FruitName)}>
        {marketStalls.map((s) => (
          <option key={s.fruit} value={s.fruit}>
            {s.fruit}
          </option>
        ))}
      </select>
      <select
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
    </div>
  )
}

export default App
