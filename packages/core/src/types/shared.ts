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
export type ValidationTrigger = 'onBlur' | 'onChange' | 'onInput' | 'onMount' | 'onFocus'

/**
 * Constructs a type where all properties of the input type are optional recursively.
 * @template TData The base data structure to transform.
 */
export type DeepPartial<TData> = PartialDeep<TData, {
  recurseIntoArrays: true
  allowUndefinedInNonTupleArrays: true
}>

/**
 * Constructs a type representing all possible dot-separated paths within an object.
 * @template TReference The object type for which to generate paths.
 */
export type Paths<TReference> = Extract<
  TypeFestPaths<TReference, { maxRecursionDepth: 10 }>,
  string
> | (string & {})

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
 * Represents a validation schema for array-based data structures.
 * Complies with the Standard Schema specification.
 */
export type ArraySchema = StandardSchemaV1 & {
  '~standard': StandardSchemaV1['~standard'] & {
    types?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input: Array<any>
    }
  }
}
