import OptionGroup from '../components/ui/OptionGroup.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import { formatMoney } from '../lib/format.js'
import { CURRENCIES, THEMES } from '../settings/storage.js'
import { useSettings } from '../settings/useSettings.js'
import './settings.css'

const CURRENCY_NAMES = { USD: 'US dollar', EUR: 'Euro', EGP: 'Egyptian pound' }
const THEME_NAMES = { light: 'Light', dark: 'Dark' }

// Personal preferences. They are saved in this browser and change every page at once.
export default function SettingsPage() {
  const { currency, theme, updateSettings } = useSettings()

  const currencyOptions = CURRENCIES.map((code) => ({
    value: code,
    label: `${CURRENCY_NAMES[code]} (${code})`,
    example: formatMoney(1234.5, code), // shows how amounts will look
  }))
  const themeOptions = THEMES.map((name) => ({ value: name, label: THEME_NAMES[name] }))

  return (
    <div className="page settings">
      <PageHeader title="Settings" description="Your choices are saved in this browser." />
      <OptionGroup
        legend="Currency"
        hint="Display only: this changes the currency symbol, not the numbers. Amounts are not converted."
        name="currency"
        value={currency}
        options={currencyOptions}
        onChange={(value) => updateSettings({ currency: value })}
      />
      <OptionGroup
        legend="Theme"
        hint="Dark mode uses the same colors with darker surfaces, checked for good contrast."
        name="theme"
        value={theme}
        options={themeOptions}
        onChange={(value) => updateSettings({ theme: value })}
      />
    </div>
  )
}
