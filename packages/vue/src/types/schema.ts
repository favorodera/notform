import type { StandardSchemaV1 } from '@standard-schema/spec'

/**
 * A Standard Schema whose input AND output are objects.
 *
 * Forms require this because form values are always a keyed object, never a
 * lone string or number.
 */
export type FormSchema = StandardSchemaV1 & {
  '~standard': StandardSchemaV1['~standard'] & {
    types?: {
      input: object
      output: object
    }
  }
}

/**
 * The data a schema *accepts*: what the user types, before parsing,
 * transforming or defaults. This is the shape of `form.values`.
 * @template TSchema - Any Standard Schema compatible schema (Zod, Valibot, ArkType, ...).
 * @example
 * // A schema that turns the text '42' into the number 42:
 * // SchemaInput  -> { age: string }
 * // SchemaOutput -> { age: number }
 */
export type SchemaInput<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferInput<TSchema>

/**
 * The data a schema *produces* after a successful validation. This is the shape `onSubmit` receives.
 * @template TSchema - Any Standard Schema compatible schema.
 */
export type SchemaOutput<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferOutput<TSchema>
