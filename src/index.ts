import { type ComputedRef } from 'vue'
import { z } from 'zod'

/**
 * Validation mode for the form
 * - `lazy`: Validate on blur and submit
 * - `eager`: Validate on every input change
 */
export type ValidationMode = 'lazy' | 'eager'

/**
 * The context the form is running on.
 * Provides access to form state, errors, and validation methods.
 *
 * @template TSchema - The zod schema of the form
 */
export type Form<TSchema extends z.ZodObject = z.ZodObject> = {
  /** Reactive reference to the current form state (values) */
  state: ComputedRef<z.output<TSchema>>
}
