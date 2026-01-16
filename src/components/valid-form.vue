<script lang="ts" setup generic="TSchema extends Schema">
import { getProperty, parsePath, setProperty } from 'dot-prop'
import { klona } from 'klona'
import { computed, provide, ref, toRaw, useId, type ComputedRef } from 'vue'
import * as zod from 'zod/v4/core'
import type { Form, FormEmits, FormExpose, FormProps, FormSlots, SubmitResult } from '../types/form'
import type { Schema } from '../types/shared'
import type { InferOutput, InputPaths, InputPathValue, OutputPaths, OutputPathValue } from '../types/utils'
import { formFactoryKey } from '../utils/symbol-keys'

// Props
const props = withDefaults(defineProps<FormProps<TSchema>>(), {
  mode: 'lazy',
  novalidate: true,
  id: () => useId(),
  validateOn: () => ['blur', 'input', 'change'],
})


// Emits
const emit = defineEmits<FormEmits<TSchema>>()


// Slots
defineSlots<FormSlots<TSchema>>()

// Internal state
/**
 * Single source of truth for all errors (automatic + manual).
 * Storing them as a flat list of ZodIssues allows to re-treeify easily.
 */
const _issues = ref<zod.$ZodIssue[]>([])

/** Tracks submission status */
const _isSubmitting = ref(false)

/** Deep copy of initial state for dirty checking. Captured once on component creation. */
const _initialState = klona(toRaw(props.state))


// Computed properties
/**
 * Automatically re-calculates the nested error tree whenever _issues change.
 * This is the reactive property exposed to the parent.
 */
const _errors = computed(() => {
  if (_issues.value.length === 0) return {}
  const error = new zod.$ZodError(_issues.value)
  // Access .properties to get the nested field structure
  return zod.treeifyError(error as zod.$ZodError<TSchema>).properties
})


// Methods


// Form factory
const form: Form<TSchema> = {
  state: computed(() => props.state),

  initialState: _initialState,

  errors: _errors,

  mode: props.mode,

  validateOn: props.validateOn,

  setValue<TPath extends InputPaths<TSchema>>(field: TPath, value: InputPathValue<TSchema, TPath>) {
    setProperty(props.state, field, value)
  },

  getValue<TPath extends OutputPaths<TSchema>>(field: TPath) {
    return getProperty(props.state, field) as OutputPathValue<TSchema, TPath>
  },

  setError<TPath extends OutputPaths<TSchema>>(field: TPath, messages: string[]) {
    const path = parsePath(field)
    const normalizedPath = path.join('.')

    // Filter out existing issues for this specific path to avoid duplicates
    const otherIssues = _issues.value.filter(issue => issue.path.join('.') !== normalizedPath)

    const newIssues: zod.$ZodIssue[] = messages.map(message => ({
      code: 'custom',
      message,
      path,
    }))

    _issues.value = [...otherIssues, ...newIssues]
  },

  getError<TPath extends OutputPaths<TSchema>>(field: TPath) {
    return getProperty(_errors.value, field) as string[] // TODO: Fix Logic
  },

  clearError<TPath extends OutputPaths<TSchema>>(field: TPath) {
    const path = parsePath(field)
    const normalizedPath = path.join('.')

    _issues.value = _issues.value.filter(issue => issue.path.join('.') !== normalizedPath)
  },

  clearErrors() {
    _issues.value = []
  },

  async validateForm() {

    const { success, data, error } = await zod.safeParseAsync(props.schema, props.state)

    if (!success) {
      // Schema validation failed
      _issues.value = [...error.issues]
      emit('error', _errors.value as ComputedRef<zod.$ZodErrorTree<TSchema>['properties']>)
      emit('validate', false)
      return false
    }

    // Schema validation passed, now run custom validation if provided
    if (props.validate) {
      const isValid = await props.validate(data, form)

      if (!isValid) {
        // Custom validation failed (assume it set errors via setError)
        emit('validate', false)
        return false
      }
    }

    // All validation passed
    _issues.value = []
    emit('validate', true)
    return true

  },

  async submit<TData = void, TError = Error>(event: Event, callback?: (values: InferOutput<TSchema>) => TData | Promise<TData>): Promise<SubmitResult<TData, TError>> {
    event.preventDefault()

    _isSubmitting.value = true

    try {
      const isValid = await form.validateForm()

      if (!isValid) {
        return { success: false }
      }

      const state = props.state as InferOutput<TSchema>
      let data: TData | undefined

      if (callback) {
        data = await callback(state)
      }

      emit('submit', state)

      return { success: true, data }
    }
    catch (error) {
      return { success: false, error: error as TError }
    }
    finally {
      _isSubmitting.value = false
    }
  },

  isValid: computed(() => !_issues.value.length),

  isSubmitting: computed(() => _isSubmitting.value),

  reset() {
    _issues.value = []
    _isSubmitting.value = false
  },
}


// Provide and inject factory
provide(formFactoryKey, form)


// Expose form factory to parent
defineExpose<FormExpose<TSchema>>({
  submit: form.submit,
  errors: form.errors,
  clearErrors: form.clearErrors,
  clearError: form.clearError,
  getError: form.getError,
  isSubmitting: form.isSubmitting,
  isValid: form.isValid,
  initialState: form.initialState,
})

</script>

<template>
<form v-bind="props" @submit="form.submit">
  <slot :errors="form.errors" :isSubmitting="form.isSubmitting" :isValid="form.isValid" :initialState="form.initialState" />
</form>
</template>
