import { useEffect, useState } from 'react'
import { SettingsContext } from './settingsContext.js'
import { loadSettings, saveSettings } from './storage.js'

// Holds the currency and theme for the whole app. React context means we do not
// have to pass these values through every component by hand.
export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  // CSS changes all colors through the data-theme attribute on <html> (see tokens.css).
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme
  }, [settings.theme])

  // We save only when the user changes something, so the system theme is not "frozen" too early.
  function updateSettings(changes) {
    const next = { ...settings, ...changes }
    setSettings(next)
    saveSettings(next)
  }

  // React 19 lets us render the context itself as the provider.
  return <SettingsContext value={{ ...settings, updateSettings }}>{children}</SettingsContext>
}
