// Form-related type definitions
export type * from './types/not-form'

// Field type definitions
export type * from './types/not-field'

// Validation message type definitions
export type * from './types/not-message'

// Shared validation and schema types
export type * from './types/shared'

// Internal utility types
export type * from './types/utils'

// Component for wrapping and providing form context
export { default as NotForm } from './components/not-form.vue'

// Component for individual form fields
export { default as NotField } from './components/not-field.vue'

// Component for displaying field validation messages
export { default as NotMessage } from './components/not-message.vue'

// Component for managing array-based fields
export { default as NotArrayField } from './components/not-array-field.vue'

// Main composable for form initialization and management
export { default as useNotForm } from './composables/use-not-form'

// Form context symbols
export { CURRENT_NOT_FORM_ID_KEY } from './utils/not-form-context'
