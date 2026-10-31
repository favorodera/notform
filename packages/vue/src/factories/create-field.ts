import { dequal } from 'dequal'
import { computed, reactive } from 'vue'
import type { FieldConfig, FieldInstance } from '../types/field'
import type { FormInstance } from '../types/form'
import type { InputPath, InputPathValue } from '../types/path'
import type { FormSchema } from '../types/schema'
import { normalizeDebounce } from '../utils/debounce'
import { getValueAtPath, setValueAtPath } from '../utils/path'

/**
 * Creates a field: a small reactive handle bound to one value inside a form.
 *
 * The field does not own any data. Its `model` reads and writes straight into
 * `form.values` at `path`, so the form stays the single source of truth.
 * @template TSchema - The schema describing the form's data.
 * @template TPath - The dot-notation path this field points at.
 * @param form The form the field belongs to.
 * @param path Dot-notation path to the value, e.g. `'address.city'`.
 * @param config Optional per-field behavior settings.
 * @returns A reactive field. `field.model` and `field.isDirty` can be used without `.value`.
 * @remarks Prefer `form.field(path)`, which calls this for you.
 * @example
 * const emailField = createField(form, 'email')
 * emailField.model = 'a@b.com' // writes form.values.email
 * emailField.isDirty // true if different from the initial email
 */
export function createField<TSchema extends FormSchema, TPath extends InputPath<TSchema>>(form: FormInstance<TSchema>, path: TPath, config?: FieldConfig) {
  type BoundField = FieldInstance<InputPathValue<TSchema, TPath>>

  /**
   * ── Config (not used yet) ──────────────────────────────────────────
   * @todo Wire these up: validate on `validateOn` events, honour `validationMode`, apply `debounce`.
   */

  /** The user's config merged with defaults (validate on blur and change; eager mode). */
  const resolvedFieldConfig = reactive({
    debounce: normalizeDebounce(config?.debounce),
    validateOn: {
      blur: true,
      change: true,
      input: false,
      mount: false,
      ...config?.validateOn,
    },
    validationMode: config?.validationMode || 'eager',
  }) satisfies FieldConfig

  /** Unique identity of this field instance. */
  const fieldId = Symbol('notform.field')

  /** Timer for a delayed validation that has been scheduled but has not fired yet. */
  let pendingDebounceTimer: ReturnType<typeof setTimeout> | undefined

  /** Cancels the scheduled validation, if there is one. */
  function cancelPendingDebounce(): void {
    if (pendingDebounceTimer === undefined) {
      return
    }

    clearTimeout(pendingDebounceTimer)
    pendingDebounceTimer = undefined
  }

  function validateThisField(): void {
    form.validateField(path)
  }

  function scheduleThisFieldValidation(): void {
    cancelPendingDebounce()

    if (!resolvedFieldConfig.debounce || resolvedFieldConfig.debounce <= 0) {
      validateThisField()
      return
    }

    pendingDebounceTimer = setTimeout(() => {
      pendingDebounceTimer = undefined
      validateThisField()
    }, resolvedFieldConfig.debounce)
  }

  function onBlur(): void {
    form.touchField(fieldId)

    if (!resolvedFieldConfig.validateOn.blur) {
      return
    }

    scheduleThisFieldValidation()
    validateThisField()
  }

  function onInput(): void {
    if (!resolvedFieldConfig.validateOn.input || resolvedFieldConfig.validationMode === 'lazy') {
      return
    }

    scheduleThisFieldValidation()
  }

  function onChange(): void {
    if (!resolvedFieldConfig.validateOn.change || resolvedFieldConfig.validationMode === 'lazy') {
      return
    }

    scheduleThisFieldValidation()
  }

  function onMount(): void {
    if (resolvedFieldConfig.validateOn.mount) {
      scheduleThisFieldValidation()
    }
  }

  // ── Value ──────────────────────────────────────────────────────────

  /** Two-way link to the form's value at `path`. */
  const model = computed<BoundField['model']>({
    get: () => {
      return getValueAtPath(form.values, path) as BoundField['model']
    },
    set: (value) => {
      setValueAtPath(form.values, path, value)
    },
  })

  /** `true` when the current value differs (deep comparison) from the form's initial value at `path`. */
  const isDirty = computed(() => {
    return !dequal(model.value, getValueAtPath(form.initialValues, path))
  })

  const isTouched = computed(() => {
    return form.isFieldTouched(fieldId)
  })

  const errors = computed(() => {
    return form.getFieldErrors(path)
  })

  const isValid = computed(() => {
    return errors.value.length === 0
  })

  const isValidating = computed(() => {
    return form.isFieldValidating(path)
  })

  // ── Assemble ───────────────────────────────────────────────────────

  // `reactive()` unwraps the computed values, so consumers write `field.model`, not `field.model.value`
  const field: BoundField = reactive({
    errors,
    events: {
      onBlur,
      onChange,
      onInput,
    },
    id: fieldId,
    isDirty,
    isTouched,
    isValid,
    isValidating,
    model,
    onMount,
    path,
  })

  return field
}
