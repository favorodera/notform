import type { StandardSchemaV1 } from '@standard-schema/spec'
import { type VNodeChild } from 'vue'
import type { ObjectSchema } from './shared'

/** Configuration properties for the Field component */
export type FieldProps = {
  /** The unique name/path identifying the field within the form state */
  name: string
}

/**
 * State and methods provided to the Field component's scope.
 */
export type FieldContext = {
  /** The name/path of the field */
  name: string
  /** Array of validation error messages currently active for this field */
  errors: string[]
  /** Indicates if the field has been interacted with (focus lost) */
  isTouched: boolean
  /** Indicates if the field's current value differs from its initial value */
  isDirty: boolean
  /** Indicates if the field currently passes all validation rules */
  isValid: boolean
  /**
   * Triggers a manual validation check for only this field.
   * @returns Resolve with the validation result object.
   */
  validate: () => Promise<StandardSchemaV1.Result<ObjectSchema>>

  methods: {
    /** Logic to execute when the field loses focus */
    onBlur: () => void
    /** Logic to execute when the field's value is committed */
    onChange: () => void
    /** Logic to execute when the field receives user input */
    onInput: () => void
    /** Logic to execute when the field gains focus */
    onFocus: () => void
  }
}

/**
 * Slots provided by the Field component.
 */
export type FieldSlots = {
  /** The default slot receives the field context for use within templates */
  default: (props: FieldContext) => VNodeChild
}
