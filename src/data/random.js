// A tiny seeded random number generator, called "mulberry32".
// Math.random() gives new numbers on every page load. A seeded generator gives the
// SAME list of numbers every time for the same seed, so the demo data never changes.
export function createRandom(seed) {
  let state = seed | 0
  return function random() {
    // Bit mixing steps from the published mulberry32 algorithm.
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), state | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296 // a number from 0 up to (not including) 1
  }
}

// Picks one item. Items with a bigger weight are picked more often.
// Example: weights [3, 1] -> the first item wins about 75% of the time.
export function pickWeighted(random, items, weights) {
  let total = 0
  for (const weight of weights) total += weight

  let roll = random() * total
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i]
    if (roll < 0) return items[i]
  }
  return items[items.length - 1] // only reached because of tiny rounding errors
}
