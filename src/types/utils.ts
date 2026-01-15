import * as zod from 'zod/v4/core'
import type { Schema } from './shared'
import type { PartialDeep, Paths, Get } from 'type-fest'

/**
 * Extracts the input type from a Zod schema.
 * Alias for `zod.input<TSchema>`.
 *
 * @template TSchema - The Zod schema to infer the input type from.
 */
export type InferInput<TSchema extends Schema = Schema> = zod.input<TSchema>

/**
 * Extracts the output type from a Zod schema.
 * Alias for `zod.output<TSchema>`.
 *
 * @template TSchema - The Zod schema to infer the output type from.
 */
export type InferOutput<TSchema extends Schema = Schema> = zod.output<TSchema>

/**
 * Recursively makes all properties in a type optional.
 * Configured to recurse into arrays and allow undefined in non-tuple arrays.
 *
 * @template TData - The type to make deeply partial.
 */
export type DeepPartial<TData> = PartialDeep<TData, {
  recurseIntoArrays: true
  allowUndefinedInNonTupleArrays: true
}>

/**
 * Generates specific dot-notation paths for the input type of a schema.
 * Useful for referencing fields in the form input data.
 *
 * @template TSchema - The Zod schema providing the input type.
 */
export type InputPaths<TSchema extends Schema = Schema> = Paths<InferInput<TSchema>, {
  bracketNotation: true
  leavesOnly: false
  maxRecursionDepth: 10
}>

/**
 * Generates specific dot-notation paths for the output type of a schema.
 * Useful for referencing fields in the form output data.
 *
 * @template TSchema - The Zod schema providing the output type.
 */
export type OutputPaths<TSchema extends Schema = Schema> = Paths<InferOutput<TSchema>, {
  bracketNotation: true
  leavesOnly: false
  maxRecursionDepth: 10
}>

/**
 * Retrieves the type of a value at a specific path within the schema's output type.
 *
 * @template TSchema - The Zod schema.
 * @template TPath - The dot-notation path string.
 */
export type OutputPathValue<TSchema extends Schema, TPath extends string> = Get<InferOutput<TSchema>, TPath, {
  strict: true
}>

/**
 * Retrieves the type of a value at a specific path within the schema's input type.
 *
 * @template TSchema - The Zod schema.
 * @template TPath - The dot-notation path string.
 */
export type InputPathValue<TSchema extends Schema, TPath extends string> = Get<InferInput<TSchema>, TPath, {
  strict: true
}>


