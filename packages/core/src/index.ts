/**
 * @module @notform/core
 *
 * Core package for NotForm — a schema-driven, headless form library for Vue.
 * Re-exports the public component, composable, and type definitions.
 */

// Components
export { default as NotForm } from './components/not-form.vue'

// Composables
export { default as useNotForm } from './composables/use-not-form'

// Types
export type * from './types/not-form'
export type * from './types/not-form-api'
export type * from './types/not-form-config'
