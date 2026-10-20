import { computed, nextTick, onMounted, onUnmounted, reactive } from 'vue'
import type { FieldProps, FieldSlots } from '../types/field'
import type { ObjectSchema } from '../types/shared'
import { useFormInstance } from './use-form-instance'

/**
 * Field state, validation, and event handlers for `<NotField>`.
 * @param props
 */
export function useField<TSchema extends ObjectSchema>(props: FieldProps<TSchema>): Parameters<NonNullable<FieldSlots['default']>>[0] {
  const form = useFormInstance<TSchema>(props.form)

  const errors = computed(() => form.getFieldErrors(props.path))
  const isValid = computed(() => errors.value.length === 0)
  const isTouched = computed(() => form.isPathTouched(props.path))
  const isDirty = computed(() => form.isPathDirty(props.path))
  const isValidating = computed(() => form.isPathValidating(props.path))

  const validateOn = computed(() => ({
    onBlur: true,
    onChange: true,
    ...props.validateOn,
  }))

  let debounceTimer: ReturnType<typeof setTimeout> | undefined
  let isMounted = false

  /**
   *
   */
  function clearDebounce() {
    if (debounceTimer === undefined) {
      return
    }

    clearTimeout(debounceTimer)
    debounceTimer = undefined
  }

  /**
   *
   */
  function validateCurrentField() {
    if (!isMounted) {
      return
    }

    void form.validateField(props.path)
  }

  /**
   *
   */
  function scheduleValidation() {
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

  /**
   *
   */
  function onBlur() {
    form.markFieldAsTouched(props.path)

    if (!validateOn.value.onBlur) {
      return
    }

    clearDebounce()
    validateCurrentField()
  }

  /**
   *
   */
  function onInput() {
    if (!validateOn.value.onInput || props.validationMode === 'lazy') {
      return
    }

    scheduleValidation()
  }

  /**
   *
   */
  function onChange() {
    if (!validateOn.value.onChange || props.validationMode === 'lazy') {
      return
    }

    scheduleValidation()
  }

  /**
   *
   */
  function onMount() {
    if (validateOn.value.onMount) {
      validateCurrentField()
    }
  }

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
