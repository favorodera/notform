/**
 * @packageDocumentation
 * Headless, schema-driven form handling for Vue.
 *
 * Bring any Standard Schema compatible schema (Zod, Valibot, ArkType, ...),
 * create a form with `useForm`, and render it with `<Form>` and `<Field>`.
 */

// ── Components ───────────────────────────────────────────────────────
export { default as Field } from './components/field.vue'
export { default as Form } from './components/form.vue'

// ── Composables ──────────────────────────────────────────────────────
export { useForm } from './composables/use-form'

// ── Types ────────────────────────────────────────────────────────────
export type { FieldConfig, FieldInstance, FieldProps, FieldSlots, FieldValidationEvent } from './types/field'
export type { FormConfig, FormInstance, FormProps, FormSlots } from './types/form'
export type { InputPath, InputPathValue, OutputPath, OutputPathValue } from './types/path'
export type { FormSchema, SchemaInput, SchemaOutput } from './types/schema'
export type { ValidationIssue, ValidationResult } from './types/validation'

// ── Coming soon ──────────────────────────────────────────────────────
/*
 * export { default as ArrayField } from './components/array-field.vue'
 * export { default as FieldError } from './components/field-error.vue'
 */
