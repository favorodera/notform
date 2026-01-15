<script lang="ts" setup generic="TSchema extends Schema">
import { formFactoryKey } from '../utils/symbol-keys'
import type { Form, FormEmits, FormProps } from '../types/form'
import type { Schema } from '../types/shared'
import type { InferOutput, InputPaths, InputPathValue, OutputPaths, OutputPathValue } from '../types/utils'
import { getProperty, setProperty, parsePath } from 'dot-prop'
import { klona } from 'klona'
import { computed, nextTick, onMounted, provide, ref, toRaw, watch, type ComputedRef } from 'vue'
import * as zod from 'zod/v4/core'

// Props
const props = withDefaults(defineProps<FormProps<TSchema>>(), {
  mode: 'lazy',
  validateOn: () => ['blur', 'input'],
})


// Emits
const emit = defineEmits<FormEmits<TSchema>>()

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
async function submit(event: Event) {
  event.preventDefault()
  event.stopPropagation()

  _isSubmitting.value = true

  try {
    const isValid = await form.validateForm()

    if (isValid) {
      emit('submit', props.state as InferOutput<TSchema>)
    }
  }
  catch {
    // Silent
  }
  finally {
    _isSubmitting.value = false
  }
}


// Form factory
const form: Form<TSchema> = {
  state: computed(() => props.state),

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

    try {
      await zod.parseAsync(props.schema, props.state)
      _issues.value = []
      emit('validate', true)
      return true
    }
    catch (error) {
      if (error instanceof zod.$ZodError) {
        // Replace current issues with fresh ones from Zod
        _issues.value = [...error.issues]
        emit('error', _errors.value as ComputedRef<zod.$ZodErrorTree<TSchema>['properties']>)
        emit('validate', false)
      }
      return false
    }
  },

  isValid: computed(() => !_issues.value.length),

  isSubmitting: computed(() => _isSubmitting.value),

  reset() {
    _issues.value = []
    _isSubmitting.value = false
  },
}


// Lifecycle hooks TODO: Remove mount validation(move to fields)
onMounted(async () => {

  await nextTick()

  if (props.validateOn.includes('mount')) {
    form.validateForm()
  }
})


// Watchers TODO: Remove state watcher(move to fields)


// TODO:TEST ONLY - Will remove
watch(() => props.state, () => {
  form.validateForm()
}, { deep: true })


// Provide and inject factory
provide(formFactoryKey, form)

// Expose form factory to parent
defineExpose(form)
</script>

<template>
<form novalidate @submit="submit">
  <slot />
  {{ _initialState }}
</form>
</template>
