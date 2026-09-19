<!-- eslint-disable unicorn/no-top-level-assignment-in-function -->
<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { computed, nextTick, onMounted, onUnmounted } from 'vue'
import type { NotFieldProps, NotFieldSlots } from '../types/not-field'
import type { ObjectSchema, ValidationTrigger } from '../types/shared'
import { useNotFormInstance } from '../composables/use-not-form-instance'

// #region Setup

defineSlots<NotFieldSlots>()

const props = withDefaults(defineProps<NotFieldProps<TSchema>>(), {
  debounce: 0,
  validateOn: undefined,
  validationMode: 'eager',
})

const form = useNotFormInstance(props.form)

// #endregion

// #region State

const errors = computed(() => form.getFieldErrors(props.path))

const isValid = computed(() => errors.value.length === 0)

const isTouched = computed(() => form.touchedFields.has(props.path))

const isDirty = computed(() => form.dirtyFields.has(props.path))

const isValidating = computed(() => form.validatingFields.has(props.path))

const validateOn = computed<NotFieldProps<TSchema>['validateOn']>(() => ({
  onBlur: true,
  onChange: true,
  ...props.validateOn,
}))

let debounceTimer: ReturnType<typeof setTimeout> | undefined

// #endregion

// #region Debounce

/** Clears a pending debounce timer. */
function clearDebounce() {
  if (debounceTimer === undefined) {
    return
  }

  clearTimeout(debounceTimer)
  debounceTimer = undefined
}

// #endregion

// #region Validation

/** Runs field validation immediately, or after `debounce` ms. */
function scheduleValidation() {
  if (!props.debounce) {
    form.validateField(props.path)
    return
  }

  clearDebounce()
  debounceTimer = setTimeout(() => {
    form.validateField(props.path)
  }, props.debounce)
}

// #endregion

// #region Event handlers

/** Marks touched and validates on blur when enabled. */
function onBlur() {
  clearDebounce()
  form.markFieldAsTouched(props.path)

  if (validateOn.value?.onBlur) {
    form.validateField(props.path)
  }
}

/** Syncs dirty and, in eager mode, revalidates on input while invalid. */
function onInput() {
  form.syncDirtyState(props.path)

  if (!validateOn.value?.onInput) {
    return
  }

  if (props.validationMode === 'eager' && !isValid.value) {
    scheduleValidation()
  }
}

/** Syncs dirty and, in eager mode, revalidates on change while invalid. */
function onChange() {
  form.syncDirtyState(props.path)

  if (!validateOn.value?.onChange) {
    return
  }

  if (props.validationMode === 'eager' && !isValid.value) {
    scheduleValidation()
  }
}

/** Validates on mount when `validateOn.onMount` is set. */
function onMount() {
  if (validateOn.value?.onMount) {
    form.validateField(props.path)
  }
}

const events: Record<ValidationTrigger, () => void> = {
  onBlur,
  onChange,
  onInput,
  onMount,
}

// #endregion

// #region Lifecycle

onMounted(async () => {
  await nextTick()
  onMount()
})

onUnmounted(() => {
  clearDebounce()
})

// #endregion
</script>

<template>
  <slot
    :errors="errors"
    :events="events"
    :is-dirty="isDirty"
    :is-touched="isTouched"
    :is-valid="isValid"
    :is-validating="isValidating"
    :path="props.path"
  />
</template>
