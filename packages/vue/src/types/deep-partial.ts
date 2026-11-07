import type { PartialDeep } from 'type-fest'

/**
 * Makes every property optional, at every depth (including items inside arrays).
 *
 * Used for initial form values: a form can start empty or half-filled even
 * though the schema eventually demands complete data.
 * @template TValue - The type to make deeply optional.
 */
export type DeepPartial<TValue> = PartialDeep<TValue, {
  allowUndefinedInNonTupleArrays: true
  recurseIntoArrays: true
}>
