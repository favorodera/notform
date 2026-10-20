import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { PartialDeep, Paths as TypeFestPaths } from 'type-fest'

/** Events that can trigger field validation. */
export type ValidationTrigger = 'onBlur' | 'onChange' | 'onInput' | 'onMount'

/** Recursively optional version of a schema input value. */
export type DeepPartial<TData> = PartialDeep<TData, {
  allowUndefinedInNonTupleArrays: true
  recurseIntoArrays: true
}>

/** Input type accepted by a Standard Schema. */
export type InferInput<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferInput<TSchema>

/** Output type produced by a Standard Schema. */
export type InferOutput<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferOutput<TSchema>

/** Issue from a Standard Schema validation run. */
export type Issue = StandardSchemaV1.Issue

/** Strict dot-notated paths derived from a schema's input type. */
export type Paths<TSchema extends StandardSchemaV1> = Extract<TypeFestPaths<InferInput<TSchema>, { maxRecursionDepth: 10 }>, string>

/**
 * Field path accepted by renderless components and validation helpers.
 *
 * Dynamic array-item paths cannot always be represented by TypeFest's literal
 * path union, so this deliberately has a string escape hatch at UI boundaries.
 */
export type Path<TSchema extends StandardSchemaV1> = Paths<TSchema> | (string & {})

/** Standard Schema constrained to object input. */
export type ObjectSchema = StandardSchemaV1 & {
  '~standard': StandardSchemaV1['~standard'] & {
    types?: {
      input: object
    }
  }
}

/** Segment of a validation issue path: a property key or `{ key }`. */
export type PathSegment = PropertyKey | StandardSchemaV1.PathSegment

/** Maps a previous array item index to its new index, or `undefined` if removed. */
export type ArrayItemIndexMap = (previousIndex: number) => number | undefined

/** Path segment accepted by `dot-prop` parsing/stringifying. */
export type DotPropPathSegment = number | string
