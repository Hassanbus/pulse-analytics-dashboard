import { DATA_END, DATA_START, generateData } from './generate.js'

// The demo data is created once, when the app starts. Every page imports this same
// copy, so the numbers on all screens always agree with each other.
export const { products, orders } = generateData()

// The first and last day of the data. The date range picker cannot go outside them.
export const DATA_BOUNDS = { start: DATA_START, end: DATA_END }
