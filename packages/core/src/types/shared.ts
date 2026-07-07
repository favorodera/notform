import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { PartialDeep, Paths as TypeFestPaths } from 'type-fest'

/**
 * The validation mode determines when validation occurs.
 * - `lazy`: Validates on blur or submission.
 * - `eager`: Validates on blur, then on every change if an error exists.
 */
export type ValidationMode = 'eager' | 'lazy'

/**
 * Interaction events that can trigger a validation check for a field.
 * - onBlur: Trigger validation when the field loses focus.
 * - onChange: Trigger validation when the field value is committed.
 * - onInput: Trigger validation on every keystroke.
 * - onMount: Trigger validation when the field is mounted.
 * - onFocus: Trigger validation when the field gains focus.
 */
export type ValidationTrigger = 'onBlur' | 'onChange' | 'onFocus' | 'onInput' | 'onMount'

/**
 * Constructs a type where all properties of the input type are optional recursively.
 * @template TData The base data structure to transform.
 */
export type DeepPartial<TData> = PartialDeep<TData, {
  allowUndefinedInNonTupleArrays: true
  recurseIntoArrays: true
}>

/**
 * Constructs a type representing all possible dot-separated paths within an object.
 * @template TReference The object type for which to generate paths.
 */
export type Paths<TReference> = Extract<TypeFestPaths<TReference, { maxRecursionDepth: 10 }>, string> | (string & {})

/**
 * Represents a validation schema for object-based data structures.
 * Complies with the Standard Schema specification.
 */
export type ObjectSchema = StandardSchemaV1 & {
  '~standard': StandardSchemaV1['~standard'] & {
    types?: {
      input: object
    }
  }
}

/**
 * Represents a segment of a validation path.
 * It can be either a string (for object properties) or a number (for array indices).
 */
export type Segment = PropertyKey | StandardSchemaV1.PathSegment

/**
 * Maps the index an array item occupied before a mutation to the index it
 * occupies after that mutation, or to `undefined` when the mutation removed the
 * item entirely.
 *
 * Each array mutation in `NotArrayField` (`prepend`, `remove`, `insert`,
 * `swap`, `move`) builds one of these to describe exactly how it reshuffles
 * indices, then passes it to `remapArrayFieldState`.
 * @param previousIndex The index the item occupied before the mutation.
 * @returns The index the item occupies after the mutation, or `undefined` if the item was removed.
 */
export type ArrayItemIndexMap = (previousIndex: number) => number | undefined
