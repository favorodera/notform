import { klona } from 'klona'
import { reactive } from 'vue'
import type { FieldConfig } from '../types/field'
import type { Form as CreateFormReturn, FormConfig } from '../types/form'
import type { ObjectSchema, Path } from '../types/schema'
import { createField } from './create-field'

export function createForm<TSchema extends ObjectSchema>(config: FormConfig<TSchema>) {
  type Form = CreateFormReturn<TSchema>

  const initialValues = klona(config.initialValues ?? {} as Form['initialValues'])
  const initialErrors = klona(config.initialErrors ?? [] as Form['initialErrors'])

  const values = reactive(klona(initialValues)) as Form['values']
  const errors = reactive(klona(initialErrors)) as Form['errors']

  const form: Form = reactive({
    errors,
    field,
    initialErrors,
    initialValues,
    values,
  })

  function field<TPath extends Path<TSchema>>(path: TPath, config?: FieldConfig) {
    const field = createField<TSchema, TPath>(form, path, config)

    return field
  }

  return form
}
