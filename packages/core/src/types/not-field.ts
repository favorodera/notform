import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ObjectSchema } from './shared'
import type { NotFormInstance } from './not-form'

/**
 * Props for the NotField component
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type NotFieldProps<TSchema extends ObjectSchema> = {
  /** The unique name/path identifying the field within the form state */
  path: string
  /** The optional form instance to use - takes priority over injected context */
  form?: NotFormInstance<TSchema>
}

/**
 * The core state and methods provided by a field instance.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type NotFieldInstance<TSchema extends ObjectSchema> = {
  /** The unique name/path identifying the field within the form state */
  path: string

  
  /** The errors of the field */
  errors: StandardSchemaV1.Issue[]


  /** The validate method of the field */
  validate: () => ReturnType<NotFormInstance<TSchema>['validateField']>
}

/**
 * Slots for the NotField component
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type NotFieldSlots<TSchema extends ObjectSchema> = {
  /** The default slot receives the field instance for use within templates */
  default: (props: NotFieldInstance<TSchema>) => []
}
