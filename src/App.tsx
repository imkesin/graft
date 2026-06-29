import { useEffect, useState } from "react";
import { css } from "~/generated/styled-system/css";
import { Card } from "~/components/Card";
import { ZoomControl } from "~/components/ZoomControl";

const page = css({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "24px",
  padding: "24px",
});

export function App() {
  const [zoom, setZoom] = useState(2.5);
  const [showGuides, setShowGuides] = useState(true);

  // `--u` must live on the root: Panda hoists the card-unit tokens to `:root`,
  // so their `var(--u)` is resolved there. Setting it on a nested wrapper has
  // no effect. `--u` is therefore a single global scale knob.
  useEffect(() => {
    document.documentElement.style.setProperty("--u", `${zoom}mm`);
  }, [zoom]);

  return (
    <div className={page}>
      <ZoomControl
        zoom={zoom}
        onZoom={setZoom}
        showGuides={showGuides}
        onToggleGuides={setShowGuides}
      />
      <Card showGuides={showGuides} />
    </div>
  );
}

export default App;
