import { useContext } from 'react'
import { SettingsContext } from './settingsContext.js'

// Any component can read the settings: const { currency, theme, updateSettings } = useSettings()
export function useSettings() {
  return useContext(SettingsContext)
}
