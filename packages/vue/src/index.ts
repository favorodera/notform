/**
 * @packageDocumentation
 * Headless, schema-driven form handling for Vue.
 *
 * Bring any Standard Schema compatible schema (Zod, Valibot, ArkType, ...),
 * create a form with `useForm`, and render it with `<Form>`, `<Field>` and `<ArrayField>`.
 */

// Components
export { default as ArrayField } from './components/array-field.vue'
export { default as FieldError } from './components/field-error.vue'
export { default as Field } from './components/field.vue'
export { default as Form } from './components/form.vue'

// Composable
export { useForm } from './composables/use-form'

// Types
export type { ArrayFieldInstance, ArrayFieldProps, ArrayFieldSlots, ArrayItemInstance } from './types/array-field'
export type { FieldConfig, FieldEvents, FieldInstance, FieldProps, FieldSlots, FieldValidationEvent } from './types/field'
export type { FieldErrorProps, FieldErrorSlots } from './types/field-error'
export type { FormConfig, FormInstance, FormProps, FormSlots, UseFormInstance } from './types/form'
export type { ArrayItem, InputArrayPath, InputPath, InputPathValue, OutputPath, OutputPathValue } from './types/path'
export type { FormSchema, SchemaInput, SchemaOutput } from './types/schema'
export type { ValidationIssue, ValidationResult } from './types/validation'
