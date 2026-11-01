import { dequal } from 'dequal'
import { computed, reactive } from 'vue'
import type { FieldConfig, FieldEvents, FieldInstance } from '../types/field'
import type { FieldHost, FieldNode, FieldOptions } from '../types/internal'
import type { ValidationResult } from '../types/validation'
import { normalizeDebounce } from '../utils/debounce'
import { createFieldId } from '../utils/id'

/**
 * Creates a field: a small reactive handle bound to one value inside a form.
 * @template TValue - Type of the value the field holds.
 * @param host The form the field belongs to.
 * @param options Identity, path source and behavior.
 * @returns The field instance and its teardown.
 * @remarks Internal. Use `form.field(path)`, which caches the result.
 */
export function createField<TValue>(host: FieldHost, options: FieldOptions): FieldNode<FieldInstance<TValue>> {
  const { dispose, parts } = createFieldState<TValue>(host, options)

  return {
    dispose,
    // `reactive()` unwraps the computed values, so consumers write `field.model`, not `field.model.value`
    instance: reactive(parts) as unknown as FieldInstance<TValue>,
  }
}

/**
 * Builds the state every kind of field shares (plain field, array field, array item).
 *
 * The field owns no data: `model` reads and writes straight into the form's values,
 * and the path is resolved on every read, so the field stays correct when it moves.
 * @template TValue - Type of the value the field holds.
 * @param host The form the field belongs to.
 * @param options Identity, path source and behavior.
 * @returns `parts`, the raw members (computed refs and functions) to wrap in `reactive()`, and `dispose`.
 */
export function createFieldState<TValue>(host: FieldHost, options: FieldOptions) {
  const id = options.id ?? createFieldId('field')
  const config = resolveFieldConfig(options.config)

  let isDisposed = false
  let lastKnownPath = ''

  /** Current path. Frozen at its last value once the field is disposed. */
  const path = computed(() => {
    if (!isDisposed) {
      lastKnownPath = options.getPath()
    }

    return lastKnownPath
  })

  /** Two-way link to the form's value at `path`. */
  const model = computed<TValue>({
    get: () => {
      return host.getValue(path.value) as TValue
    },
    set: (value) => {
      if (!isDisposed) {
        host.setValue(path.value, value)
      }
    },
  })

  const isDirty = computed(() => {
    return !dequal(model.value, host.getInitialValue(path.value))
  })

  const isTouched = computed(() => {
    return host.isFieldTouched(id)
  })

  const errors = computed(() => {
    return host.getFieldErrors(path.value)
  })

  const isValid = computed(() => {
    return errors.value.length === 0
  })

  const isValidating = computed(() => {
    return host.isFieldValidating(path.value)
  })

  function validate(): Promise<ValidationResult<unknown>> {
    host.cancelFieldTask(id)

    return host.validateField(path.value)
  }

  /**
   * Validates in response to `change` / `input`, honouring `validateOn`, the mode and the debounce.
   * @param event The event that fired.
   */
  function validateOnEvent(event: 'change' | 'input'): void {
    if (isDisposed) {
      return
    }

    const isEnabled = config.validateOn[event] || (config.validationMode === 'eager' && errors.value.length > 0)

    if (!isEnabled) {
      return
    }

    if (config.debounce) {
      host.scheduleFieldTask(id, config.debounce, () => {
        void validate()
      })

      return
    }

    void validate()
  }

  function onBlur(): void {
    if (isDisposed) {
      return
    }

    host.touchField(id)

    if (config.validateOn.blur) {
      void validate()
    }
  }

  function onChange(): void {
    validateOnEvent('change')
  }

  function onInput(): void {
    validateOnEvent('input')
  }

  function dispose(): void {
    if (isDisposed) {
      return
    }

    isDisposed = true
    host.cancelFieldTask(id)
    host.untouchField(id)
  }

  const events: FieldEvents = { onBlur, onChange, onInput }

  return {
    dispose,
    parts: {
      errors,
      events,
      id,
      isDirty,
      isTouched,
      isValid,
      isValidating,
      model,
      path,
      validate,
    },
  }
}

/**
 * Merges the user's config over the defaults.
 * @param config The config passed to `form.field()`.
 * @returns A complete config (blur and change validate, input does not; eager mode).
 */
function resolveFieldConfig(config?: FieldConfig) {
  return {
    debounce: normalizeDebounce(config?.debounce),
    validateOn: {
      blur: config?.validateOn?.blur ?? true,
      change: config?.validateOn?.change ?? true,
      input: config?.validateOn?.input ?? false,
    },
    validationMode: config?.validationMode ?? 'eager',
  }
}
