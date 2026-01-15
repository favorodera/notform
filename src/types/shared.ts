import * as zod from 'zod/v4/core'

/**
 * Validation mode for the form
 * - `lazy`: Validate on blur and submit
 * - `eager`: Validate on every input change
 */
export type ValidationMode = 'lazy' | 'eager'

/**
 * Validation triggers for the form
 * - `blur`: Validate on blur
 * - `change`: Validate on change
 * - `input`: Validate on input
 * - `mount`: Validate on mount
 * - `focus`: Validate on focus
 */
export type ValidationTriggers = 'blur' | 'change' | 'input' | 'mount' | 'focus'

export type Schema = zod.$ZodType<object>
