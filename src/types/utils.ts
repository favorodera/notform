import type { PartialDeep, Paths as TypeFestPaths } from 'type-fest'

/**
 * Constructs a type where all properties of the input type are optional.
 * This rule applies recursively to all nested objects and arrays within the structure.
 * Arrays are processed such that their elements can also be partially defined.
 * It also allows undefined values to be present in non-tuple array structures.
 * @template TData The base data structure to transform into a partial representation.
 */
export type DeepPartial<TData> = PartialDeep<TData, {
  recurseIntoArrays: true
  allowUndefinedInNonTupleArrays: true
}>

/**
 * Constructs a type that represents all possible dot-separated paths to the leaves of an object.
 * This type is useful for creating string literal types that can be used as keys for accessing nested properties.
 * @template TReference The object type for which to generate paths.
 */
export type Paths<TReference> = TypeFestPaths<TReference, {
  maxRecursionDepth: 10
  bracketNotation: true
  leavesOnly: false
}> extends infer P ? [P] extends [never] ? string : P : never

