import type { PartialDeep } from 'type-fest'

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
