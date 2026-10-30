import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get, Paths } from 'type-fest'
import type { SchemaInput, SchemaOutput } from './schema'

/*
 * Vocabulary used across the library:
 *
 *  - PATH      A location written as dot-notation text, e.g. 'address.city' or 'tags.0'.
 *              This is what you pass to `form.field()`.
 *  - SEGMENTS  The same location split into steps, e.g. ['address', 'city'] or ['tags', 0].
 *              Schema libraries report issue locations this way, and path comparisons work on it.
 */

/**
 * Every valid dot-notation path into the schema's INPUT data (the shape of `form.values`).
 * These are the paths accepted by `form.field()` and `form.setValue()`.
 * @template TSchema - Any Standard Schema compatible schema.
 * @remarks Recursion is capped at depth 10 to keep TypeScript fast.
 * @example
 * // For z.object({ email: z.string(), tags: z.array(z.string()) }):
 * // InputPath<typeof schema> -> 'email' | 'tags' | `tags.${number}`
 */
export type InputPath<TSchema extends StandardSchemaV1> = Extract<Paths<SchemaInput<TSchema>, { maxRecursionDepth: 10 }>, string>

/**
 * The type of the INPUT value found at `TPath`.
 * @template TSchema - Any Standard Schema compatible schema.
 * @template TPath - Dot-notation path, e.g. `'address.city'`.
 */
export type InputPathValue<TSchema extends StandardSchemaV1, TPath extends string> = Get<SchemaInput<TSchema>, TPath, { strict: false }>

/**
 * Every valid dot-notation path into the schema's OUTPUT data (the shape `onSubmit` receives).
 * @template TSchema - Any Standard Schema compatible schema.
 * @remarks Recursion is capped at depth 10 to keep TypeScript fast.
 */
export type OutputPath<TSchema extends StandardSchemaV1> = Extract<Paths<SchemaOutput<TSchema>, { maxRecursionDepth: 10 }>, string>

/**
 * The type of the OUTPUT value found at `TPath`.
 * @template TSchema - Any Standard Schema compatible schema.
 * @template TPath - Dot-notation path, e.g. `'address.city'`.
 */
export type OutputPathValue<TSchema extends StandardSchemaV1, TPath extends string> = Get<SchemaOutput<TSchema>, TPath, { strict: false }>

/**
 * One step of a path split into segments.
 *
 * Standard Schema allows either a bare key (`'email'`, `0`) or a wrapper
 * object (`{ key: 'email' }`). Use `getSegmentKey` to read the key from either shape.
 */
export type PathSegment = PropertyKey | { readonly key: PropertyKey }

/**
 * A path split into its steps, e.g. `['address', 'city']` or `['tags', 0]`.
 * Compatible with the `path` of a Standard Schema issue.
 */
export type PathSegments = readonly PathSegment[]
