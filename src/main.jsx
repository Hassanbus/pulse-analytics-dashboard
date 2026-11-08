// Global styles come first, so the CSS files of components (loaded through App) come later
// and can override them. CSS uses the last rule when two rules are equally specific.
import './styles/tokens.css'
import './styles/base.css'
import './styles/ui.css'
import './styles/page.css'
import './styles/table.css'
import './styles/states.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import SettingsProvider from './settings/SettingsProvider.jsx'

// The entry point: React takes over the empty <div id="root"> in index.html.
// useTransitions={false}: URL changes are applied right away. The orders search box keeps
// its text in the URL, and a delayed update could lose letters while you type.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter useTransitions={false}>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)
