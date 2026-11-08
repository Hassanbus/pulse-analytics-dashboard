import { describe, expect, it } from 'vitest'
import { createRandom, pickWeighted } from './random.js'

describe('createRandom', () => {
  it('gives the same numbers for the same seed', () => {
    const a = createRandom(42)
    const b = createRandom(42)
    const listA = Array.from({ length: 5 }, a)
    const listB = Array.from({ length: 5 }, b)
    expect(listA).toEqual(listB)
  })

  it('gives different numbers for a different seed', () => {
    expect(createRandom(1)()).not.toBe(createRandom(2)())
  })

  it('stays between 0 (included) and 1 (not included)', () => {
    const random = createRandom(7)
    for (let i = 0; i < 1000; i++) {
      const value = random()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('pickWeighted', () => {
  it('never picks an item with weight 0', () => {
    const random = createRandom(3)
    for (let i = 0; i < 100; i++) {
      expect(pickWeighted(random, ['a', 'b'], [0, 1])).toBe('b')
    }
  })

  it('picks heavier items more often', () => {
    const random = createRandom(5)
    let heavy = 0
    for (let i = 0; i < 2000; i++) {
      if (pickWeighted(random, ['heavy', 'light'], [3, 1]) === 'heavy') heavy++
    }
    // Around 75% of 2000 = 1500. We allow some random spread.
    expect(heavy).toBeGreaterThan(1400)
    expect(heavy).toBeLessThan(1600)
  })
})
