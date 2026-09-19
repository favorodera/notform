/**
 * @module @notform/core
 *
 * Core package for NotForm — a schema-driven, headless form library for Vue.
 * Re-exports the public component, composable, and type definitions.
 */

// Components
export { default as NotArrayField } from './components/not-array-field.vue'
export { default as NotField } from './components/not-field.vue'
export { default as NotForm } from './components/not-form.vue'
export { default as NotMessage } from './components/not-message.vue'

// Composables
export { default as useNotForm } from './composables/use-not-form'

// Types
export type * from './types/not-array-field'
export type * from './types/not-field'
export type * from './types/not-form'
export type * from './types/not-form-api'
export type * from './types/not-form-config'
export type * from './types/not-message'
