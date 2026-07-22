import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { BoardPrintPage } from "./routes/BoardPrintPage.tsx"
import { FocusReferencePage } from "./routes/FocusReferencePage.tsx"
import { PrintPage } from "./routes/PrintPage.tsx"

// Minimal pathname routing: `/print/cards` is the card print target,
// `/print/board` is the board print target, `/print/reference` is the one-page
// player reference, everything else is the interactive preview. Vite's dev
// server does SPA history fallback, so no router dependency is needed for the
// MVP.
const path = window.location.pathname
const Root = path.startsWith("/print/board")
  ? BoardPrintPage
  : path.startsWith("/print/reference")
  ? FocusReferencePage
  : path.startsWith("/print/cards")
  ? PrintPage
  : App

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
