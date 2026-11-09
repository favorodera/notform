import { describe, expect, it } from 'vitest'
import { normalizeDebounce } from '../../src/utils/debounce'

describe('normalizeDebounce', () => {
  it.for([
    [undefined, undefined],
    [0, 0],
    [250, 250],
    [-50, 0],
    [NaN, 0],
    [Infinity, 0],
    [-Infinity, 0],
  ])('%s becomes %s', ([input, expected]) => {
    expect(normalizeDebounce(input)).toBe(expected)
  })
})
