import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { BoardPrintPage } from "./routes/BoardPrintPage.tsx"
import { PrintPage } from "./routes/PrintPage.tsx"

// Minimal pathname routing: `/print` is the card print target, `/print/board`
// is the board print target, everything else is the interactive preview.
// Vite's dev server does SPA history fallback, so no router dependency is
// needed for the MVP. The more specific `/print/board` is checked first since
// it's also a `/print` prefix match.
const path = window.location.pathname
const Root = path.startsWith("/print/board") ? BoardPrintPage : path.startsWith("/print") ? PrintPage : App

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
