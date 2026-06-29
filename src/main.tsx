import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrintPage } from './routes/PrintPage.tsx'

// Minimal pathname routing: `/print` is the bare print target, everything else
// is the interactive preview. Vite's dev server does SPA history fallback, so
// no router dependency is needed for the MVP.
const Root = window.location.pathname.startsWith('/print') ? PrintPage : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
