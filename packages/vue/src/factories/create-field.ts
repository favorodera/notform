import type { StandardSchemaV1 } from '@standard-schema/spec'
import { dequal } from 'dequal'
import { getProperty, setProperty } from 'dot-prop'
import { computed, reactive } from 'vue'
import type { Field as CreateFieldReturn, FieldConfig } from '../types/field'
import type { Form } from '../types/form'
import type { Path, PathValue } from '../types/schema'

export function createField<TSchema extends StandardSchemaV1, TPath extends Path<TSchema>>(form: Form<TSchema>, path: TPath, config?: FieldConfig) {
  type Field = CreateFieldReturn<PathValue<TSchema, TPath>>

  const resolvedConfig = computed<FieldConfig>(() => {
    return {
      debounce: config?.debounce,
      validateOn: {
        onBlur: true,
        onChange: true,
        ...config?.validateOn,
      },
      validationMode: config?.validationMode || 'eager',
    }
  })

  const id = Symbol('notform.field')

  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  const model = computed<Field['model']>({
    get: () => {
      return getProperty(form.values, path) as Field['model']
    },
    set: (value) => {
      return setProperty(form.values as Record<string, any>, path, value) as Field['model']
    },
  })

  const isDirty = computed(() => {
    return !dequal(model.value, getProperty(form.initialValues, path))
  })

  function clearDebounceTimer(): void {
    if (debounceTimer === undefined) {
      return
    }

    clearTimeout(debounceTimer)
    debounceTimer = undefined
  }

  const field: Field = reactive({
    id,
    isDirty,
    model,
    path,
  })

  return field
}
