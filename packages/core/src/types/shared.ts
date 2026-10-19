import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { PartialDeep, Paths as TypeFestPaths } from "type-fest"

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

/** A Standard Schema issue */
export type Issue = StandardSchemaV1.Issue

/**
 * Dot-notated field paths derived from a schema's input type.
 *
 * The `| (string & {})` union member is deliberate as it keeps editor
 * autocomplete suggesting the schema's real paths, while still letting any
 * arbitrary string through the type checker
 * @template TSchema Validation schema.
 */
export type Paths<TSchema extends StandardSchemaV1> = Extract<TypeFestPaths<InferInput<TSchema>, { maxRecursionDepth: 10 }>, string> | (string & {})

/** Standard Schema constrained to object input.*/
export type ObjectSchema = StandardSchemaV1 & {
  '~standard': StandardSchemaV1['~standard'] & {
    types?: {
      input: object
    }
  }
}