import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { PartialDeep, Paths as TypeFestPaths } from 'type-fest'

/** Lifecycle hooks that can trigger field validation in the renderless components. */
export type ValidationTrigger = 'onBlur' | 'onChange' | 'onInput' | 'onMount'

/**
 * Makes each property in a schema input optional while preserving nested arrays.
 * @template TData Input data type to make partial.
 */
export type DeepPartial<TData> = PartialDeep<TData, {
  allowUndefinedInNonTupleArrays: true
  recurseIntoArrays: true
}>

/**
 * Input type inferred from a Standard Schema definition.
 * @template TSchema Schema whose input is being inferred.
 */
export type InferInput<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferInput<TSchema>

/**
 * Output type inferred from a Standard Schema definition.
 * @template TSchema Schema whose output is being inferred.
 */
export type InferOutput<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferOutput<TSchema>

/** Validation issue produced by a Standard Schema check. */
export type Issue = StandardSchemaV1.Issue

/**
 * Strict dot-notated paths derived from a schema input type.
 * @template TSchema Schema whose input is used to infer valid property paths.
 */
export type Paths<TSchema extends StandardSchemaV1> = Extract<TypeFestPaths<InferInput<TSchema>, { maxRecursionDepth: 10 }>, string>

/**
 * Field path accepted by renderless components and validation helpers.
 * Dynamic array item paths are not always representable by the literal path union,
 * so this intentionally includes a string escape hatch for UI-level work.
 * @template TSchema Schema that defines the path union.
 */
export type Path<TSchema extends StandardSchemaV1> = Paths<TSchema> | (string & {})

/** Standard Schema definition whose input is an object. */
export type ObjectSchema = StandardSchemaV1 & {
  '~standard': StandardSchemaV1['~standard'] & {
    types?: {
      input: object
    }
  }
}

/** Path segment represented either by a raw property key or a Standard Schema key wrapper. */
export type PathSegment = PropertyKey | StandardSchemaV1.PathSegment

/**
 * Maps a previous array index to the next index after a reordering mutation.
 * @param previousIndex Index before the array mutation.
 * @returns Replacement index for the item, or `undefined` when the item should be removed.
 */
export type ArrayItemIndexMap = (previousIndex: number) => number | undefined

/** Path segment accepted by the `dot-prop` package when parsing or stringifying paths. */
export type DotPropPathSegment = number | string
