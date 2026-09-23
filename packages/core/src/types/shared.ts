import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { PartialDeep, Paths as TypeFestPaths } from 'type-fest'

/** Events that can trigger field validation. */
export type ValidationTrigger = 'onBlur' | 'onChange' | 'onInput' | 'onMount'

/**
 * Recursively optional version of `TData`, including array items.
 * @template TData Source data type.
 */
export type DeepPartial<TData> = PartialDeep<TData, {
  allowUndefinedInNonTupleArrays: true
  recurseIntoArrays: true
}>

/**
 * Input type accepted by a Standard Schema.
 * @template TSchema Validation schema.
 */
export type InferInput<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferInput<TSchema>

/**
 * Output type produced by a Standard Schema.
 * @template TSchema Validation schema.
 */
export type InferOutput<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferOutput<TSchema>

/** One issue from a Standard Schema validation run. */
export type Issue = StandardSchemaV1.Issue

/**
 * Dot-notated field paths derived from a schema's input type.
 *
 * The `| (string & {})` union member is deliberate: it keeps editor
 * autocomplete suggesting the schema's real paths, while still letting any
 * arbitrary string through the type checker — needed because a dynamically
 * built path (e.g. `` `${item.path}.name` ``) can't always be proven to match
 * the literal union `TypeFestPaths` computes.
 * @template TSchema Validation schema.
 */
export type Paths<TSchema extends StandardSchemaV1> = Extract<TypeFestPaths<InferInput<TSchema>, { maxRecursionDepth: 10 }>, string> | (string & {})

/**
 * Standard Schema constrained to object input.
 *
 * The `~standard.types.input` check exists purely at the type level, so that
 * `useNotForm`'s `TSchema` is only inferred when the schema's input type is
 * actually an `object` — this is what makes passing a non-object schema
 * (e.g. `z.string()`) a compile-time error rather than a runtime surprise.
 * @see {@linkcode https://github.com/standard-schema/standard-schema Standard Schema spec}
 */
export type ObjectSchema = StandardSchemaV1 & {
  '~standard': StandardSchemaV1['~standard'] & {
    types?: {
      input: object
    }
  }
}

/**
 * One segment of a validation issue path: a property key or `{ key }`.
 */
export type PathSegment = PropertyKey | StandardSchemaV1.PathSegment

/**
 * Maps a previous array item index to its new index, or `undefined` if removed.
 * @internal
 * @param previousIndex Index before the mutation.
 * @returns Index after the mutation, or `undefined` if the item was removed.
 */
export type ArrayItemIndexMap = (previousIndex: number) => number | undefined

/**
 * Path segment accepted by `dot-prop` (`parsePath` / `stringifyPath`).
 * @internal
 */
export type DotPropPathSegment = number | string
