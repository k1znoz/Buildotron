import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@buildotron/design-system/tokens.css'
import '@buildotron/design-system/primitives.css'
import '@buildotron/plugins/styles.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
