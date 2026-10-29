import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Form } from './form'

export type UseFormReturn<TSchema extends StandardSchemaV1> = Pick<
  Form<TSchema>,
  'values'
>
