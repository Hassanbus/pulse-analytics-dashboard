import { createContext } from 'react'

// The settings "channel" that any component can read from.
// It lives in its own file, so the provider file exports only a component (needed for fast refresh).
export const SettingsContext = createContext(null)
