import type { StandardSchemaV1 } from '@standard-schema/spec'

/**
 * Defines when the form should evaluate validation rules.
 * lazy: Validation occurs only when a field loses focus or the form is submitted.
 * eager: Validation occurs immediately upon any change to the input value.
 */
export type ValidationMode = 'lazy' | 'eager'

/**
 * Determines which interactions should cause a validation check to start.
 * blur: Triggered when an input element loses focus.
 * change: Triggered when the value of an input element is committed.
 * input: Triggered immediately as the user types or interacts with the input.
 * mount: Triggered once the component is initially added to the page.
 * focus: Triggered when an input element receives focus.
 */
export type ValidationTriggers = 'blur' | 'change' | 'input' | 'mount' | 'focus'

/**
 * Represents a validation schema that follows the Standard Schema specification.
 * It extends the base StandardSchemaV1 to specifically handle object-based data structures.
 * The standard property contains the validation logic and metadata.
 * The types property, if present, specifies the expected shape of the input object.
 */
export type ObjectSchema = StandardSchemaV1 & {
  '~standard': StandardSchemaV1['~standard'] & {
    types?: {
      input: object
    }
  }
}
