import type { MaybeRefOrGetter } from 'vue'
import type { ObjectSchema } from './shared'

export type UseNotFormOptions<TSchema extends ObjectSchema> = {
  /** The validation schema used to parse and validate form data */
  schema: MaybeRefOrGetter<TSchema>
}
