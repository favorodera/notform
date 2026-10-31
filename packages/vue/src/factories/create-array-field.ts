import { dequal } from 'dequal'
import { computed, reactive } from 'vue'
import type { ArrayFieldInstance } from '../types/array-field'
import type { FormInstance } from '../types/form'
import type { InputPath, InputPathValue } from '../types/path'
import type { FormSchema } from '../types/schema'
import { getValueAtPath } from '../utils/path'

/**
 * Creates a field: a small reactive handle bound to one value inside a form.
 *
 * The field does not own any data. Its `model` reads and writes straight into
 * `form.values` at `path`, so the form stays the single source of truth.
 * @template TSchema - The schema describing the form's data.
 * @template TPath - The dot-notation path this field points at.
 * @param form The form the field belongs to.
 * @param path Dot-notation path to the value, e.g. `'address.city'`.
 * @returns A reactive field. `field.model` and `field.isDirty` can be used without `.value`.
 * @remarks Prefer `form.field(path)`, which calls this for you.
 * @example
 * const emailField = createField(form, 'email')
 * emailField.model = 'a@b.com' // writes form.values.email
 * emailField.isDirty // true if different from the initial email
 */
export function createArrayField<TSchema extends FormSchema, TPath extends InputPath<TSchema>>(form: FormInstance<TSchema>, path: TPath) {
  type BoundArrayField = ArrayFieldInstance<InputPathValue<TSchema, TPath>>

  /**
   * ── Config (not used yet) ──────────────────────────────────────────
   * @todo Wire these up: validate on `validateOn` events, honour `validationMode`, apply `debounce`.
   */

  /** Unique identity of this field instance. */
  const arrayFieldId = Symbol('notform.array-field')

  /** `true` when the current value differs (deep comparison) from the form's initial value at `path`. */
  const isDirty = computed(() => {
    return !dequal(model.value, getValueAtPath(form.initialValues, path))
  })

  const isTouched = computed(() => {
    return form.isFieldTouched(arrayFieldId)
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
  const field: BoundArrayField = reactive({
    errors,
    id: arrayFieldId,
    isDirty,
    isTouched,
    isValid,
    isValidating,
    path,
  })

  return field
}
