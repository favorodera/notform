import { klona } from 'klona'
import { reactive } from 'vue'
import type { FormInstance, FormInstanceSettings } from '../types/form-instance'
import type { InferInput, Issue, ObjectSchema } from '../types/shared'

/**
 * Builds the full form instance.
 * @template TSchema The form schema.
 * @param settings Settings to configure the form instance
 * @returns Assembled form instance.
 */
export function createFormInstance<TSchema extends ObjectSchema>(settings: FormInstanceSettings<TSchema>) {
  type Instance = FormInstance<TSchema>

  // #region State

  /** Deep-cloned baseline values restored by reset. */
  const initialValues = klona(settings.initialValues ?? {} as InferInput<TSchema>)

  /** Reactive field values, independent from the reset baseline. */
  const values = reactive(klona(initialValues))

  /** Baseline issues for reset. */
  const initialErrors = klona(settings.initialErrors ?? [] as Array<Issue>)

  /** Current validation issues. */
  const errors = reactive<Array<Issue>>([...initialErrors])

  // #endregion

  // #region Instance assembly

  /** Full reactive form instance, including methods reserved for components. */
  const instance: Instance = reactive({
    errors,
    values,
  })

  return instance

  // #endregion
}
