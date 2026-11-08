// Settings are saved in the browser (localStorage), so they survive a page reload.
// They are personal preferences, not filters, so they do not belong in the URL.

export const CURRENCIES = ['USD', 'EUR', 'EGP']
export const THEMES = ['light', 'dark']
const STORAGE_KEY = 'pulse-settings'

// Before the user picks a theme, we follow the operating system setting.
function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {} // storage is blocked or the JSON is broken: use the defaults
  }
}

// Reads the saved settings. Anything missing or broken falls back to a safe default.
export function loadSettings() {
  const saved = readSaved()
  return {
    currency: CURRENCIES.includes(saved.currency) ? saved.currency : 'USD',
    theme: THEMES.includes(saved.theme) ? saved.theme : systemTheme(),
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Some private browsing modes block storage. The app still works; it just forgets the choice.
  }
}
