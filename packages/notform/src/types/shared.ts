import type { StandardSchemaV1 } from '@standard-schema/spec'

/**
 * Validation execution strategy.
 * - `lazy`: Validates on blur or submission.
 * - `eager`: Validates on blur, then on every change if an error exists.
 */
export type ValidationMode = 'lazy' | 'eager'

/**
 * Interaction events that can trigger a validation check for a field.
 */
export type ValidationTriggers = 'blur' | 'change' | 'input' | 'mount' | 'focus'

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
