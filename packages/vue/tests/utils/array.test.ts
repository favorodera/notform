import { describe, expect, it } from 'vitest'
import { clampIndex,
  createDiscardMapper,
  createInsertMapper,
  createMoveMapper,
  createRemoveMapper,
  createSwapMapper,
  type IndexMapper,
  isIndexInRange,
  moveListItem,
  swapListItems } from '../../src/utils/array'

const source = ['a', 'b', 'c', 'd']
const indexes = [0, 1, 2, 3]

const pairs = indexes.flatMap((from) => {
  return indexes.map((to): [number, number] => {
    return [from, to]
  })
})

/**
 * The mapper is a promise about where every item ends up. Check that promise against
 * the real list operation: survivors sit where the mapper says, dropped items are gone.
 * @param before The list before the operation.
 * @param after The list after the operation.
 * @param mapIndex The mapper under test.
 */
// Before and after need local copies to latch onto
// eslint-disable-next-line unicorn/no-unnecessary-parameters
function expectMapperToMatch(before: string[], after: string[], mapIndex: IndexMapper): void {
  for (const [index, item] of before.entries()) {
    const mapped = mapIndex(index)

    if (mapped === undefined) {
      expect(after).not.toContain(item)
    } else {
      expect(after[mapped]).toBe(item)
    }
  }
}

describe('clampIndex', () => {
  it.for([
    [-5, 0],
    [0, 0],
    [2, 2],
    [3, 3],
    [99, 3],
    [1.9, 1],
    [-0.5, 0],
    [NaN, 0],
    [Infinity, 3],
    [-Infinity, 0],
  ])('clamps %s into 0..3 as %s', ([index, expected]) => {
    expect(clampIndex(index, 3)).toBe(expected)
  })
})

describe('isIndexInRange', () => {
  it.for([
    [0, true],
    [3, true],
    [4, false],
    [-1, false],
    [1.5, false],
    [NaN, false],
    [Infinity, false],
  ] as const)('index %s in a list of 4 is %s', ([index, expected]) => {
    expect(isIndexInRange(index, 4)).toBe(expected)
  })

  it('is never in range for an empty list', () => {
    expect(isIndexInRange(0, 0)).toBe(false)
  })
})

describe('list helpers', () => {
  it('moves an item and shifts the ones in between', () => {
    const list = [...source]

    moveListItem(list, 0, 2)

    expect(list).toStrictEqual(['b', 'c', 'a', 'd'])
  })

  it('swaps two items and leaves the rest alone', () => {
    const list = [...source]

    swapListItems(list, 0, 3)

    expect(list).toStrictEqual(['d', 'b', 'c', 'a'])
  })
})

/* eslint-disable vitest/expect-expect */
describe('index mappers agree with the real list operation', () => {
  it.for([0, 1, 2, 3, 4])('insert at %i', (at) => {
    const after = [...source]

    after.splice(at, 0, 'new')

    expectMapperToMatch(source, after, createInsertMapper(at))
  })

  it.for(indexes)('remove at %i', (at) => {
    const after = [...source]

    after.splice(at, 1)

    expectMapperToMatch(source, after, createRemoveMapper(at))
  })

  it.for(indexes)('discard (replace in place) at %i', (at) => {
    const after = [...source]

    after[at] = 'replacement'

    expectMapperToMatch(source, after, createDiscardMapper(at))
  })

  it.for(pairs)('move %i -> %i', ([from, to]) => {
    const after = [...source]

    moveListItem(after, from, to)

    expectMapperToMatch(source, after, createMoveMapper(from, to))
  })

  it.for(pairs)('swap %i <-> %i', ([indexA, indexB]) => {
    const after = [...source]

    swapListItems(after, indexA, indexB)

    expectMapperToMatch(source, after, createSwapMapper(indexA, indexB))
  })
})
/* eslint-enable vitest/expect-expect */
