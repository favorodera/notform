import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { MaybeRefOrGetter } from 'vue'
import type { Input, Issue, ObjectSchema, Output } from './schema'
import type { UseFormReturn } from './use-form'
import type { DeepPartial } from './utils'

export type Form<TSchema extends StandardSchemaV1> = {
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
