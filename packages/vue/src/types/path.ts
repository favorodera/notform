import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get, Paths } from 'type-fest'
import type { SchemaInput, SchemaOutput } from './schema'

/**
 * @file
 * Vocabulary used across the library:
 *
 * - PATH      A location written as dot-notation text, e.g. 'address.city' or 'tags.0'.
 * This is what you pass to `form.field()`.
 *
 * - SEGMENTS  The same location split into steps, e.g. ['address', 'city'] or ['tags', 0].
 * Schema libraries report issue locations this way.
 */

/**
 * The item type of an array type. `never` when `TArray` is not an array.
 * @template TArray - An array type, optionally `null` / `undefined`.
 * @example
 * // ArrayItem<string[] | undefined> -> string
 */
export type ArrayItem<TArray> = NonNullable<TArray> extends readonly (infer TItem)[] ? TItem : never

/**
 * Every valid path into the schema's INPUT data that points at an array.
 * These are the paths accepted by `form.arrayField()`.
 * @template TSchema - Any Standard Schema compatible schema.
 */
export type InputArrayPath<TSchema extends StandardSchemaV1> = ValueArrayPath<SchemaInput<TSchema>>

/**
 * Every valid path into the schema's INPUT data (the shape of `form.values`).
 * These are the paths accepted by `form.field()` and `form.setValue()`.
 * @template TSchema - Any Standard Schema compatible schema.
 * @example
 * // For z.object({ email: z.string(), tags: z.array(z.string()) }):
 * // 'email' | 'tags' | `tags.${number}`
 */
export type InputPath<TSchema extends StandardSchemaV1> = ValuePath<SchemaInput<TSchema>>

/**
 * The type of the INPUT value found at `TPath`.
 * @template TSchema - Any Standard Schema compatible schema.
 * @template TPath - Dot-notation path, e.g. `'address.city'`.
 */
export type InputPathValue<TSchema extends StandardSchemaV1, TPath extends string> = ValuePathValue<SchemaInput<TSchema>, TPath>

/**
 * Every valid path into the schema's OUTPUT data (the shape `onSubmit` receives).
 * @template TSchema - Any Standard Schema compatible schema.
 */
export type OutputPath<TSchema extends StandardSchemaV1> = ValuePath<SchemaOutput<TSchema>>

/**
 * The type of the OUTPUT value found at `TPath`.
 * @template TSchema - Any Standard Schema compatible schema.
 * @template TPath - Dot-notation path.
 */
export type OutputPathValue<TSchema extends StandardSchemaV1, TPath extends string> = ValuePathValue<SchemaOutput<TSchema>, TPath>

/**
 * One step of a split path. Standard Schema allows a bare key (`'email'`, `0`)
 * or a wrapper (`{ key: 'email' }`); read it with `getSegmentKey`.
 */
export type PathSegment = PropertyKey | { readonly key: PropertyKey }

/** A path split into steps, e.g. `['address', 'city']`. Compatible with a Standard Schema issue's `path`. */
export type PathSegments = readonly PathSegment[]

/**
 * Every dot-notation path inside `TValue` that points at an array.
 * @template TValue - The object type to look into.
 */
export type ValueArrayPath<TValue> = Extract<ArrayPathsOf<TValue, ValuePath<TValue>>, string>

/**
 * Every dot-notation path inside `TValue`.
 * @template TValue - The object type to look into.
 * @remarks Recursion is capped at depth 10 to keep TypeScript fast.
 */
export type ValuePath<TValue> = Extract<Paths<TValue, { maxRecursionDepth: 10 }>, string>

/**
 * The type found at `TPath` inside `TValue`.
 * @template TValue - The object type to look into.
 * @template TPath - Dot-notation path.
 */
export type ValuePathValue<TValue, TPath extends string> = Get<TValue, TPath, { strict: false }>

/** Keeps only the paths whose value is an array (distributes over the path union). */
type ArrayPathsOf<TValue, TPath extends string> = TPath extends unknown
  ? NonNullable<ValuePathValue<TValue, TPath>> extends readonly unknown[] ? TPath : never
  : never
