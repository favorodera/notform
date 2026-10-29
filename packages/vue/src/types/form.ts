import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { MaybeRefOrGetter } from 'vue'
import type { Field, FieldConfig } from './field'
import type { Input, Issue, ObjectSchema, Output, Path, PathValue } from './schema'
import type { DeepPartial } from './utils'

export type Form<TSchema extends StandardSchemaV1> = {
  errors: Issue[]
  field: <TPath extends Path<TSchema>>(path: TPath, config?: FieldConfig) => Field<PathValue<TSchema, TPath>>
  initialErrors: Issue[]
  initialValues: DeepPartial<Input<TSchema>>
  values: Input<TSchema>
}

export type FormConfig<TSchema extends ObjectSchema> = {
  initialErrors?: Issue[]
  initialValues?: DeepPartial<Input<TSchema>>
  onSubmit?: (data: Output<TSchema>) => Promise<void> | void
  schema: MaybeRefOrGetter<TSchema>
}

export type FormProps<TSchema extends StandardSchemaV1> = {
  form: UseFormReturn<TSchema>
}

export type FormSlots = {
  default?: () => void
}

export type UseFormReturn<TSchema extends StandardSchemaV1> = Pick<
  Form<TSchema>,
  'errors'
  | 'field'
  | 'values'
>
