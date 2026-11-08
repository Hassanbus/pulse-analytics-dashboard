// The fixed lists that describe our fictional store.
// The generator mixes them with seeded random numbers to create the orders.

export const CATEGORIES = ['Audio', 'Wearables', 'Smart Home', 'Computer Gear', 'Accessories']
export const REGIONS = ['North America', 'Europe', 'Middle East', 'Asia Pacific', 'Latin America']
export const CHANNELS = ['Website', 'Mobile app', 'Marketplace', 'Social']
export const STATUSES = ['completed', 'processing', 'refunded', 'cancelled']

// How often each region appears, in the same order as REGIONS.
export const REGION_WEIGHTS = [34, 27, 16, 15, 8]

// 40 products: [name, category, price]. The names are invented for this demo.
export const CATALOG = [
  ['Aria Wireless Earbuds', 'Audio', 89],
  ['Nimbus Over-Ear Headphones', 'Audio', 179],
  ['Cove Bluetooth Speaker', 'Audio', 59],
  ['Horizon Soundbar', 'Audio', 249],
  ['Quill USB Microphone', 'Audio', 119],
  ['Drift Sleep Earbuds', 'Audio', 139],
  ['Orbit Turntable', 'Audio', 199],
  ['Pocket DAC Amplifier', 'Audio', 79],
  ['Stride Fitness Band', 'Wearables', 49],
  ['Summit Smartwatch', 'Wearables', 229],
  ['Lull Sleep Ring', 'Wearables', 199],
  ['Pace Running Watch', 'Wearables', 279],
  ['Clip Step Tracker', 'Wearables', 29],
  ['Glow Kids Watch', 'Wearables', 69],
  ['Beat Heart-Rate Strap', 'Wearables', 59],
  ['Lens Smart Glasses', 'Wearables', 299],
  ['Beacon Smart Bulb', 'Smart Home', 19],
  ['Hearth Thermostat', 'Smart Home', 149],
  ['Sentry Video Doorbell', 'Smart Home', 129],
  ['Mesh Wi-Fi Router', 'Smart Home', 189],
  ['Spark Smart Plug', 'Smart Home', 15],
  ['Breeze Air Purifier', 'Smart Home', 169],
  ['Guard Indoor Camera', 'Smart Home', 49],
  ['Sprout Plant Sensor', 'Smart Home', 25],
  ['Keystone Mechanical Keyboard', 'Computer Gear', 129],
  ['Glide Wireless Mouse', 'Computer Gear', 49],
  ['Vista 27-inch Monitor', 'Computer Gear', 329],
  ['Dock Pro USB-C Hub', 'Computer Gear', 79],
  ['Rapid Portable SSD', 'Computer Gear', 109],
  ['Clarity 4K Webcam', 'Computer Gear', 99],
  ['Raise Laptop Stand', 'Computer Gear', 45],
  ['Tempo Game Controller', 'Computer Gear', 69],
  ['Charge Duo Power Bank', 'Accessories', 39],
  ['Loop Braided Cable', 'Accessories', 12],
  ['Shell Phone Case', 'Accessories', 25],
  ['Sleeve Laptop Bag', 'Accessories', 49],
  ['Wave Wireless Charger', 'Accessories', 35],
  ['Grip Phone Stand', 'Accessories', 19],
  ['Shield Screen Protector', 'Accessories', 14],
  ['Trek Tech Organizer', 'Accessories', 29],
]
