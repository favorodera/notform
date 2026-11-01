/**
 * Translates an array index across one mutation (insert, remove, move, ...).
 * @param index The index before the mutation.
 * @returns The index after it, or `undefined` when the item at `index` no longer exists.
 */
export type IndexMapper = (index: number) => number | undefined

/**
 * Forces an index into `0..max` (inclusive). `NaN` becomes `0`, `Infinity` becomes `max`.
 * @param index The requested index.
 * @param max The highest allowed index.
 * @returns The clamped integer index.
 */
export function clampIndex(index: number, max: number): number {
  return Math.min(Math.max(Math.trunc(index) || 0, 0), max)
}

/**
 * Maps indexes after an item was replaced in place: the replaced item is gone, the rest stay.
 * @param at Index of the replaced item.
 * @returns The mapper.
 */
export function createDiscardMapper(at: number): IndexMapper {
  return (index) => {
    return index === at ? undefined : index
  }
}

/**
 * Maps indexes after an item was inserted: everything from `at` on shifts up by one.
 * @param at Index the new item was inserted at.
 * @returns The mapper.
 */
export function createInsertMapper(at: number): IndexMapper {
  return (index) => {
    return index >= at ? index + 1 : index
  }
}

/**
 * Maps indexes after an item moved from `from` to `to`.
 * @param from Index the item left.
 * @param to Index the item landed on.
 * @returns The mapper.
 */
export function createMoveMapper(from: number, to: number): IndexMapper {
  return (index) => {
    if (index === from) {
      return to
    }

    if (from < to && index > from && index <= to) {
      return index - 1
    }

    if (from > to && index >= to && index < from) {
      return index + 1
    }

    return index
  }
}

/**
 * Maps indexes after an item was removed: the removed item is gone, later ones shift down by one.
 * @param at Index of the removed item.
 * @returns The mapper.
 */
export function createRemoveMapper(at: number): IndexMapper {
  return (index) => {
    if (index === at) {
      return
    }

    return index > at ? index - 1 : index
  }
}

/**
 * Maps indexes after two items traded places.
 * @param indexA Index of the first item.
 * @param indexB Index of the second item.
 * @returns The mapper.
 */
export function createSwapMapper(indexA: number, indexB: number): IndexMapper {
  return (index) => {
    if (index === indexA) {
      return indexB
    }

    return index === indexB ? indexA : index
  }
}

/**
 * Checks that an index points at an existing item.
 * @param index The index to test.
 * @param length The length of the list.
 * @returns `true` for an integer in `0..length - 1`.
 */
export function isIndexInRange(index: number, length: number): boolean {
  return Number.isSafeInteger(index) && index >= 0 && index < length
}

/**
 * Moves one item inside a list, in place. Both indexes must be in range.
 * @param list The list to change.
 * @param from Current index of the item.
 * @param to Index the item should end up at.
 */
export function moveListItem<TItem>(list: TItem[], from: number, to: number): void {
  const [item] = list.splice(from, 1)

  list.splice(to, 0, item as TItem)
}

/**
 * Swaps two items of a list, in place. Both indexes must be in range.
 * @param list The list to change.
 * @param indexA Index of the first item.
 * @param indexB Index of the second item.
 */
export function swapListItems<TItem>(list: TItem[], indexA: number, indexB: number): void {
  const first = list[indexA] as TItem

  list[indexA] = list[indexB] as TItem
  list[indexB] = first
}
