<script lang="ts" setup generic="TSchema extends Schema">
import { deepKeys, getProperty, parsePath, setProperty } from 'dot-prop'
import { klona } from 'klona'
import { computed, provide, ref, toRaw, useId, type ComputedRef } from 'vue'
import * as zod from 'zod/v4/core'
import type { Form, FormEmits, FormExpose, FormProps, FormSlots, SubmitResult } from '../types/valid-form'
import type { Schema } from '../types/shared'
import type { DeepPartial, InferOutput, InputPaths, InputPathValue, OutputPaths, OutputPathValue } from '../types/utils'
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

/** Set of touched field paths */
const _touchedFields = ref<Set<string>>(new Set())

/** Set of dirty field paths */
const _dirtyFields = ref<Set<string>>(new Set())

/** Currently focused field path (only one field can be focused at a time) */
const _focusedField = ref<string | null>(null)

// Computed properties
/**
 * Automatically re-calculates the nested error tree whenever `_issues` change.
 * This is the reactive property exposed to the parent.
 */
const _errors = computed(() => {
  if (_issues.value.length === 0) return {}
  const error = new zod.$ZodError(_issues.value)
  // Access .properties to get the nested field structure
  return zod.treeifyError(error as zod.$ZodError<TSchema>).properties
})

// Form factory
const form: Form<TSchema> = {
  state: computed(() => props.state),

  initialState: _initialState,

  errors: _errors,

  mode: props.mode,

  validateOn: props.validateOn,

  setValue<TPath extends InputPaths<TSchema>>(field: TPath, value: InputPathValue<TSchema, TPath>) {
    setProperty(props.state, field, value)

    // Auto-mark as dirty if value differs from initial
    const initialValue = getProperty(_initialState, field)
    if (value !== initialValue) {
      _dirtyFields.value.add(field)
    }
    else {
      _dirtyFields.value.delete(field)
    }
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
    const path = parsePath(field)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = { properties: _errors.value }

    for (const segment of path) {
      if (!current) break

      // Try properties for objects or items for arrays
      if (current.properties && segment in current.properties) {
        current = current.properties[segment]
      }
      else if (current.items && !isNaN(Number(segment)) && current.items[Number(segment)]) {
        current = current.items[Number(segment)]
      }
      else {
        current = null
      }
    }

    return (current?.errors || []) as string[]
  },

  clearError<TPath extends OutputPaths<TSchema>>(field: TPath) {
    const path = parsePath(field)
    const normalizedPath = path.join('.')

    _issues.value = _issues.value.filter(issue => issue.path.join('.') !== normalizedPath)
  },

  clearErrors() {
    _issues.value = []
  },

  isTouched<TPath extends InputPaths<TSchema>>(field: TPath): boolean {
    return _touchedFields.value.has(field)
  },

  touch<TPath extends InputPaths<TSchema>>(field: TPath) {
    _touchedFields.value.add(field)
  },

  untouch<TPath extends InputPaths<TSchema>>(field: TPath) {
    _touchedFields.value.delete(field)
  },

  touchAll() {
    const _schema = props.schema as unknown as zod.$ZodObject
    const shape = _schema._zod.def.shape

    // Touch all static fields defined in Schema
    const allFields = deepKeys(shape)
    allFields.forEach((field) => {
      _touchedFields.value.add(field)
    })

    // Touch indexed paths ONLY if there is actual data in the state
    const statePaths = deepKeys(props.state)
    statePaths.forEach((path) => {
      const formattedPath = path.replace(/\.(\d+)(\.|$)/g, '[$1]$2')
      _touchedFields.value.add(formattedPath)
    })
  },

  untouchAll() {
    _touchedFields.value.clear()
  },

  getTouchedFields() {
    return Array.from(_touchedFields.value) as InputPaths<TSchema>[]
  },

  isDirty<TPath extends InputPaths<TSchema>>(field: TPath): boolean {
    return _dirtyFields.value.has(field)
  },

  markDirty<TPath extends InputPaths<TSchema>>(field: TPath) {
    _dirtyFields.value.add(field)
  },

  markPristine<TPath extends InputPaths<TSchema>>(field: TPath) {
    _dirtyFields.value.delete(field)
  },

  markAllPristine() {
    _dirtyFields.value.clear()
  },

  getDirtyFields() {
    return Array.from(_dirtyFields.value) as InputPaths<TSchema>[]
  },

  isFocused<TPath extends InputPaths<TSchema>>(field: TPath): boolean {
    return _focusedField.value === field
  },

  focus<TPath extends InputPaths<TSchema>>(field: TPath) {
    _focusedField.value = field
  },

  blur<TPath extends InputPaths<TSchema>>(field: TPath) {
    if (_focusedField.value === field) {
      _focusedField.value = null
    }
    // Mark as touched when blurred
    _touchedFields.value.add(field)
  },

  getFocusedField() {
    return _focusedField.value as InputPaths<TSchema> | null
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

  async validateField<TPath extends InputPaths<TSchema>>(field: TPath) {
    const value = getProperty(props.state, field)
    const pathSegments = parsePath(field)

    let schema = props.schema as unknown as zod.$ZodTypes

    for (const segment of pathSegments) {
      if (!schema) break

      // Unwrap Optional, Nullable, or Default types to get to the core type
      // We use a while loop because a field could be .optional().nullable()
      while (
        schema._zod.def.type === 'optional'
        || schema._zod.def.type === 'nullable'
        || schema._zod.def.type === 'default'
      ) {
        schema = schema._zod.def.innerType as zod.$ZodTypes
      }

      const definition = schema._zod.def

      // Handle the segment based on the core type
      switch (definition.type) {
        case 'object':
          schema = definition.shape[segment] as zod.$ZodTypes
          break
        case 'array':
        // In an array path (e.g., users.0), the segment is the index.
        // We move to the element schema and ignore the index value.
          schema = definition.element as zod.$ZodTypes
          break
        case 'tuple':
          schema = definition.items[Number(segment)] as zod.$ZodTypes
          break
        case 'record':
          schema = definition.valueType as zod.$ZodTypes
          break
        default:
        // If we reach a leaf node (string, number) but still have segments,
        // the path is invalid for this schema.
          break
      }
    }

    // Validate
    const { success, error } = await zod.safeParseAsync(schema, value)

    // Update Issues
    const normalizedPath = pathSegments.join('.')
    _issues.value = _issues.value.filter(issue => issue.path.join('.') !== normalizedPath)

    if (!success) {
      _issues.value.push(...error.issues.map(issue => ({
        ...issue,
        path: pathSegments, // Keep full path for treeify
      })))
    }

    return success
  },

  async submit<TData = void, TError = Error>(_event: Event, callback?: (values: InferOutput<TSchema>) => TData | Promise<TData>): Promise<SubmitResult<TData, TError>> {

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

  isAnyTouched: computed(() => _touchedFields.value.size > 0),

  isAnyDirty: computed(() => _dirtyFields.value.size > 0),

  async reset(callback?: (initialState: DeepPartial<InferOutput<TSchema>> | InferOutput<TSchema>) => void | Promise<void>) {
    _issues.value = []
    _isSubmitting.value = false
    _touchedFields.value.clear()
    _dirtyFields.value.clear()
    _focusedField.value = null

    if (callback) {
      await callback(_initialState)
    }
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
  isTouched: form.isTouched,
  touch: form.touch,
  untouch: form.untouch,
  touchAll: form.touchAll,
  untouchAll: form.untouchAll,
  getTouchedFields: form.getTouchedFields,
  isDirty: form.isDirty,
  markDirty: form.markDirty,
  markPristine: form.markPristine,
  markAllPristine: form.markAllPristine,
  getDirtyFields: form.getDirtyFields,
  isFocused: form.isFocused,
  focus: form.focus,
  blur: form.blur,
  getFocusedField: form.getFocusedField,
  isAnyTouched: form.isAnyTouched,
  isAnyDirty: form.isAnyDirty,
})
</script>

<template>
  <form v-bind="props">
    <slot
      :errors="form.errors"
      :is-submitting="form.isSubmitting"
      :is-valid="form.isValid"
      :initial-state="form.initialState"
      :is-any-touched="form.isAnyTouched"
      :is-any-dirty="form.isAnyDirty"
    />
  </form>
</template>
