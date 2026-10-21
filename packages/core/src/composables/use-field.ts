import { computed, nextTick, onMounted, onUnmounted, reactive } from 'vue'
import type { FieldProps, FieldSlots } from '../types/field'
import type { ObjectSchema } from '../types/shared'
import { useFormInstance } from './use-form-instance'

/**
 * Creates reactive field state and validation event handlers.
 * @template TSchema Schema that defines the field path.
 * @param props Field path, validation options, and optional form instance.
 * @returns Field state and event handlers for the `<Field>` slot.
 */
export function useField<TSchema extends ObjectSchema>(props: FieldProps<TSchema>): Parameters<NonNullable<FieldSlots['default']>>[0] {
  /** Form instance resolved from the prop or nearest `<Form>`. */
  const form = useFormInstance<TSchema>(props.form)

  /** Current issues and derived field state. */
  const errors = computed(() => form.getFieldErrors(props.path))

  /** Whether no current issue belongs to this field. */
  const isValid = computed(() => errors.value.length === 0)

  /** Whether the form considers this path touched. */
  const isTouched = computed(() => form.isPathTouched(props.path))

  /** Whether the field value differs from its reset baseline. */
  const isDirty = computed(() => form.isPathDirty(props.path))

  /** Whether validation currently overlaps this field. */
  const isValidating = computed(() => form.isPathValidating(props.path))

  /** Effective trigger settings, with blur and change enabled by default. */
  const validateOn = computed(() => ({
    onBlur: true,
    onChange: true,
    ...props.validateOn,
  }))

  /** Pending delayed validation, if any. */
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  /** Prevents validation before mount and after unmount. */
  let isMounted = false

  /** Cancels a queued validation and clears its timer handle. */
  function clearDebounce(): void {
    if (debounceTimer === undefined) {
      return
    }

    clearTimeout(debounceTimer)
    debounceTimer = undefined
  }

  /** Validates the field only while its component is mounted. */
  function validateCurrentField(): void {
    if (!isMounted) {
      return
    }

    void form.validateField(props.path)
  }

  /** Runs validation immediately or after the configured debounce delay. */
  function scheduleValidation(): void {
    clearDebounce()

    if (!props.debounce || props.debounce <= 0) {
      validateCurrentField()
      return
    }

    debounceTimer = setTimeout(() => {
      debounceTimer = undefined
      validateCurrentField()
    }, props.debounce)
  }

  /** Marks the field touched and validates immediately when enabled. */
  function onBlur(): void {
    form.markFieldAsTouched(props.path)

    if (!validateOn.value.onBlur) {
      return
    }

    clearDebounce()
    validateCurrentField()
  }

  /** Schedules input validation unless the field uses lazy mode. */
  function onInput(): void {
    if (!validateOn.value.onInput || props.validationMode === 'lazy') {
      return
    }

    scheduleValidation()
  }

  /** Schedules change validation unless the field uses lazy mode. */
  function onChange(): void {
    if (!validateOn.value.onChange || props.validationMode === 'lazy') {
      return
    }

    scheduleValidation()
  }

  /** Runs the optional initial validation after the component mounts. */
  function onMount(): void {
    if (validateOn.value.onMount) {
      validateCurrentField()
    }
  }

  /** Event handlers exposed to input elements through the field slot. */
  const events: Parameters<NonNullable<FieldSlots['default']>>[0]['events'] = {
    onBlur,
    onChange,
    onInput,
  }

  onMounted(() => {
    isMounted = true

    void nextTick().then(() => {
      if (isMounted) {
        onMount()
      }
    })
  })

  onUnmounted(() => {
    // Cancel delayed work so an unmounted field cannot trigger validation.
    isMounted = false
    clearDebounce()
  })

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
