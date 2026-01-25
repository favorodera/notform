import type { PartialDeep, Paths as TypeFestPaths } from 'type-fest'

/**
 * Constructs a type where all properties of the input type are optional recursively.
 * @template TData The base data structure to transform.
 */
export type DeepPartial<TData> = PartialDeep<TData, {
  recurseIntoArrays: true
  allowUndefinedInNonTupleArrays: true
}>

/**
 * Constructs a type representing all possible dot-separated paths within an object.
 * @template TReference The object type for which to generate paths.
 */
export type Paths<TReference> = TypeFestPaths<TReference, {
  maxRecursionDepth: 10
  bracketNotation: true
  leavesOnly: false
}> | (string & {})


