<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { computed, nextTick, onMounted, onUnmounted } from 'vue'
import type { NotFieldProps, NotFieldSlots } from '../types/not-field'
import type { ObjectSchema, ValidationTrigger } from '../types/shared'
import { useNotFormInstance } from '../composables/use-not-form-instance'

// ──────────────────────────────────────────────
// #region Setup
// ──────────────────────────────────────────────

defineSlots<NotFieldSlots>()

const props = withDefaults(defineProps<NotFieldProps<TSchema>>(), {
  debounce: 0,
  validateOn: undefined,
  validationMode: 'eager',
})

const form = useNotFormInstance(props.form)

// #endregion

// ──────────────────────────────────────────────
// #region State
// ──────────────────────────────────────────────

/** All validation issues matching this field's path. */
const errors = computed(() => form.getFieldErrors(props.path))

/** Whether this field has zero validation errors. */
const isValid = computed(() => errors.value.length === 0)

/** Whether the user has interacted with this field. */
const isTouched = computed(() => form.touchedFields.has(props.path))

/** Whether this field's current value differs from its baseline. */
const isDirty = computed(() => form.dirtyFields.has(props.path))

/** Whether an async validation run is currently active for this field. */
const isValidating = computed(() => form.validatingFields.has(props.path))

/** Effective validation triggers: consumer overrides merged over the defaults. */
const validateOn = computed<NotFieldProps<TSchema>['validateOn']>(() => ({
  onBlur: true,
  onChange: true,
  ...props.validateOn,
}))

/** Handle for any pending debounced validation timer. */
let debounceTimer: ReturnType<typeof setTimeout> | undefined

// #endregion

// ──────────────────────────────────────────────
// #region Debounce
// ──────────────────────────────────────────────

/** Cancels any in-flight debounce timer. */
function clearDebounce() {
  if (debounceTimer === undefined) {
    return
  }

  clearTimeout(debounceTimer)
  // eslint-disable-next-line unicorn/no-top-level-assignment-in-function
  debounceTimer = undefined
}

// #endregion

// ──────────────────────────────────────────────
// #region Validation
// ──────────────────────────────────────────────

/** Schedules validation after the configured debounce interval, or executes immediately if debounce is 0. */
function scheduleValidation() {
  if (!props.debounce) {
    form.validateField(props.path)
    return
  }

  clearDebounce()
  // eslint-disable-next-line unicorn/no-top-level-assignment-in-function
  debounceTimer = setTimeout(() => {
    form.validateField(props.path)
  }, props.debounce)
}

// #endregion

// ──────────────────────────────────────────────
// #region Event Handlers
// ──────────────────────────────────────────────

/**
 * Handles field blur events.
 * Immediately cancels debouncing, records touched state, and runs validation if enabled.
 */
function onBlur() {
  clearDebounce()
  form.markFieldAsTouched(props.path)

  if (validateOn.value?.onBlur) {
    form.validateField(props.path)
  }
}

/**
 * Handles field input events (keystrokes).
 * Marks the field dirty and triggers debounced validation according to the validation mode.
 */
function onInput() {
  form.syncDirtyState(props.path)

  if (!validateOn.value?.onInput) {
    return
  }

  // Eager mode: revalidate on input only when an active error exists to be cleared
  if (props.validationMode === 'eager' && !isValid.value) {
    scheduleValidation()
  }
}

/**
 * Handles field change events (value commit).
 * Marks the field dirty and triggers debounced validation according to the validation mode.
 */
function onChange() {
  form.syncDirtyState(props.path)

  if (!validateOn.value?.onChange) {
    return
  }

  // Eager mode: revalidate on change only when an active error exists to be cleared
  if (props.validationMode === 'eager' && !isValid.value) {
    scheduleValidation()
  }
}

/** Handles component mount validation if configured. */
function onMount() {
  if (validateOn.value?.onMount) {
    form.validateField(props.path)
  }
}

/** Event handlers exposed to the default slot for binding to DOM inputs. */
const events: Record<ValidationTrigger, () => void> = {
  onBlur,
  onChange,
  onInput,
  onMount,
}

// #endregion

// ──────────────────────────────────────────────
// #region Lifecycle
// ──────────────────────────────────────────────

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
