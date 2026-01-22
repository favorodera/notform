/**
 * Export all form-related type definitions.
 */
export type * from './types/form'

/**
 * Export all field type definitions.
 */
export type * from './types/field'

/**
 * Export all shared validation and schema type definitions.
 */
export type * from './types/shared'

/**
 * Export all internal utility type definitions.
 */
export type * from './types/utils'

/**
 * The primary Form component used to wrap and provide context to form fields.
 */
export { default as Form } from './components/Form.vue'

/**
 * The Field component used to create and manage form fields.
 */
export { default as Field } from './components/Field.vue'

/**
 * The main composable function for creating and managing form instances.
 */
export { default as useForm } from './composables/use-form'

/**
 * Utility function to access the form context for a specific form ID.
 */
export { withContext } from './utils/form-context'

/**
 * Export standard schema for convenience
 */
export type { StandardSchemaV1 } from '@standard-schema/spec'
