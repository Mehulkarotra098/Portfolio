import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/young-serif/latin-400.css'
import '@fontsource-variable/hanken-grotesk/index.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
