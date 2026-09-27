import { computed, nextTick, onMounted, onUnmounted, reactive } from 'vue'
import type { NotFieldProps, NotFieldSlots } from '../types/not-field'
import type { ObjectSchema } from '../types/shared'
import { useNotFormInstance } from './use-not-form-instance'

/**
 * Field state, validation, and mutation helpers for `<NotField>`.
 * @template TSchema The form schema.
 * @internal
 * @param props Path and optional form and validation triggers.
 * @returns Slot state for `<NotField>`.
 */
export function useNotField<TSchema extends ObjectSchema>(props: NotFieldProps<TSchema>): Parameters<NonNullable<NotFieldSlots['default']>>[0] {
  // #region Setup

  const form = useNotFormInstance<TSchema>(props.form)

  // #endregion

  // #region State

  const errors = computed(() => form.getFieldErrors(props.path))

  const isValid = computed(() => errors.value.length === 0)

  const isTouched = computed(() => form.touchedFields.has(props.path))

  const isDirty = computed(() => form.dirtyFields.has(props.path))

  const isValidating = computed(() => form.validatingFields.has(props.path))

  // Merged over the defaults rather than replacing them wholesale, so a
  // caller passing `validateOn={{ onInput: true }}` still keeps blur/change
  // validation instead of silently losing it.
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
    // No debounce configured — validate right away rather than scheduling a
    // zero-delay timer, which would still cost a tick for no reason.
    if (!props.debounce) {
      form.validateField(props.path)
      return
    }

    // Restart the timer on every call so only the last input in a burst
    // actually triggers validation.
    clearDebounce()
    debounceTimer = setTimeout(() => {
      form.validateField(props.path)
    }, props.debounce)
  }

  // #endregion

  // #region Event handlers

  /** Marks touched and validates on blur when enabled. */
  function onBlur() {
    // Blur should validate immediately regardless of any pending debounce
    // from a prior input/change — cancel it so it can't fire a stale,
    // redundant validation right after this one.
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

    // Eager mode only revalidates while the field is already invalid — a
    // valid field doesn't re-run on every keystroke, only once it needs to
    // recover from an error.
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

  /**
   * Validates on mount when `validateOn.onMount` is set. This is the only
   * trigger not exposed through `events` below, since there's no DOM event
   * to bind — it runs on its own via the `onMounted` hook further down.
   */
  function onMount() {
    if (validateOn.value?.onMount) {
      form.validateField(props.path)
    }
  }

  const events: Parameters<NonNullable<NotFieldSlots['default']>>[0]['events'] = {
    onBlur,
    onChange,
    onInput,
  }

  // #endregion

  // #region Lifecycle

  onMounted(async () => {
    // Deferred a tick so `v-model`'s initial DOM sync has actually landed
    // before validation reads the field's value — validating immediately on
    // mount could otherwise run against a not-yet-settled value.
    await nextTick()
    onMount()
  })

  onUnmounted(() => {
    // Prevents a pending debounced validation from firing (and touching a
    // form instance) after the field's own component is already gone.
    clearDebounce()
  })

  // #endregion

  return reactive({
    errors,
    events,
    isDirty,
    isTouched,
    isValid,
    isValidating,
    path: computed(() => props.path),
  })
}
