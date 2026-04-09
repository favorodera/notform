import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { PartialDeep, Paths as TypeFestPaths } from 'type-fest'

/**
 * Validation execution strategy.
 * - `lazy`: Validates on blur or submission.
 * - `eager`: Validates on blur, then on every change if an error exists.
 */
export type ValidationMode = 'lazy' | 'eager'

/** Interaction events that can trigger a validation check for a field. */
export type ValidationTriggers = {
  /** Trigger validation when the field is blurred. */
  onBlur?: boolean
  /** Trigger validation when the field value changes. */
  onChange?: boolean
  /** Trigger validation when the field value is input. */
  onInput?: boolean
  /** Trigger validation when the field is mounted. */
  onMount?: boolean
  /** Trigger validation when the field is focused. */
  onFocus?: boolean
}

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
export type Paths<TReference> = TypeFestPaths<TReference, {
  maxRecursionDepth: 10
  bracketNotation: true
  leavesOnly: false
}> | (string & {})


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
