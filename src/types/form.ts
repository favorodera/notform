import { type ComputedRef } from 'vue'
import * as zod from 'zod/v4/core'
import type { Schema, ValidationMode, ValidationTriggers } from './shared'
import type { DeepPartial } from './utils'

/**
 * The context the form is running on.
 * Provides access to form state, errors, and validation methods.
 *
 * @template TSchema - The zod schema of the form
 */
export type Form<TSchema extends Schema = Schema> = {
  /** Reactive reference to the current form state (values) */
  state: ComputedRef<DeepPartial<zod.output<TSchema>> | zod.output<TSchema>>

  /** Reactive reference to the current form errors */
  errors: ComputedRef<zod.$ZodErrorTree<TSchema>['properties']>

  /** The validation mode of the form
   * @see {@link ValidationMode}
   * @defaultValue 'lazy'
   */
  mode: ValidationMode

  /** The validation triggers of the form
   * @see {@link ValidationTriggers}
   * @defaultValue ['blur', 'input']
   */
  validateOn: ValidationTriggers[]

  /** Validate the form */
  validateForm(): Promise<boolean>
}


/**
 * Props for the Form component
 * @template TSchema - The zod schema of the form
*/
export type FormProps<TSchema extends Schema = Schema> = Partial<Pick<Form<TSchema>, 'mode' | 'validateOn'>> & {
  /** The schema used for validation */
  schema: TSchema
  /** The data/value state of the form */
  state: DeepPartial<zod.output<TSchema>> | zod.output<TSchema>
}
