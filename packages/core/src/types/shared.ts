import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { PartialDeep, Paths as TypeFestPaths } from 'type-fest'

/**
 * Determines when field validation is triggered.
 * - `lazy` — on blur or submission only.
 * - `eager` — on blur, then on every change while errors exist.
 */
export type ValidationMode = 'eager' | 'lazy'

/**
 * Interaction events that trigger field validation.
 * - `onBlur` — when the field loses focus.
 * - `onChange` — when the field value is committed.
 * - `onInput` — on every keystroke.
 * - `onMount` — when the field component mounts.
 */
export type ValidationTrigger = 'onBlur' | 'onChange' | 'onInput' | 'onMount'

/**
 * Recursively makes all properties of `TData` optional.
 * @template TData - The base data structure to transform.
 */
export type DeepPartial<TData> = PartialDeep<TData, {
  allowUndefinedInNonTupleArrays: true
  recurseIntoArrays: true
}>

/**
 * Infers the input type accepted by a validation schema.
 * @template TSchema - The validation schema.
 */
export type InferInput<TSchema extends ObjectSchema> = StandardSchemaV1.InferInput<TSchema>

/**
 * Infers the validated output type produced by a validation schema.
 * @template TSchema - The validation schema.
 */
export type InferOutput<TSchema extends ObjectSchema> = StandardSchemaV1.InferOutput<TSchema>

/** A single validation issue from a Standard Schema validation run. */
export type Issue = StandardSchemaV1.Issue

/**
 * Union of all dot-notated field paths derivable from a schema's input type.
 * @template TSchema - The validation schema.
 */
export type Paths<TSchema extends ObjectSchema> = Extract<TypeFestPaths<InferInput<TSchema>, { maxRecursionDepth: 10 }>, string> | (string & {})

/**
 * A Standard Schema–compliant validation schema constrained to object inputs.
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
 * A single segment within a validation issue's path.
 * Either a plain `PropertyKey` (string, number, symbol) or a Standard Schema path segment object.
 */
export type PathSegment = PropertyKey | StandardSchemaV1.PathSegment
