/** Form-related type definitions */
export type * from './types/form'

/** Field type definitions */
export type * from './types/field'

/** Validation message type definitions */
export type * from './types/message'

/** Shared validation and schema types */
export type * from './types/shared'

/** Internal utility types */
export type * from './types/utils'

/** Component for wrapping and providing form context */
export { default as Form } from './components/Form.vue'

/** Component for individual form fields */
export { default as Field } from './components/Field.vue'

/** Component for displaying field validation messages */
export { default as Message } from './components/Message.vue'

/** Component for managing array-based fields */
export { default as ArrayField } from './components/ArrayField.vue'

/** Main composable for form initialization and management */
export { default as useForm } from './composables/use-form'

/** Utility for accessing form context by its unique identifier */
export { withContext } from './utils/form-context'

/** Standard Schema specification types */
export type { StandardSchemaV1 } from '@standard-schema/spec'
