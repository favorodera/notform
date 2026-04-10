import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ObjectSchema, Paths } from './shared'
import type { NotFormInstance } from './not-form'

/**
 * Props for the NotField component
 * @template TSchema The validation schema type derived from ObjectSchema.
 * @template TPath The dot-separated path to the field within the form state.
 */
export type NotFieldProps<
  TSchema extends ObjectSchema,
  TPath extends Paths<StandardSchemaV1.InferInput<TSchema>>,
> = {
  /** The dot-separated path to the field within the form state */
  path: TPath
  /** Optional form instance — takes priority over injected context */
  form?: NotFormInstance<TSchema>
}

/**
 * The core state and methods provided by a field instance.
 * @template TSchema The validation schema type derived from ObjectSchema.
 * @template TPath The dot-separated path to the field within the form state.
 */
export type NotFieldInstance<
  TSchema extends ObjectSchema,
  TPath extends Paths<StandardSchemaV1.InferInput<TSchema>>,
> = {
  /** The dot-separated path to the field within the form state */
  path: TPath

  /** The current value of the field */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any

  /** Whether the field is currently being validated */
  isValidating: boolean

  /** The validation issues for this field */
  errors: StandardSchemaV1.Issue[]

  /** Validates this field against the form schema */
  validate: () => ReturnType<NotFormInstance<TSchema>['validateField']>

  /** Marks the field as touched */
  touch: () => void
  /** Marks the field as not touched */
  unTouch: () => void

  /** Marks the field as dirty */
  dirty: () => void
  /** Marks the field as not dirty */
  unDirty: () => void
}

/**
 * Slots for the NotField component
 * @template TSchema The validation schema type derived from ObjectSchema.
 * @template TPath The dot-separated path to the field within the form state.
 */
export type NotFieldSlots<
  TSchema extends ObjectSchema,
  TPath extends Paths<StandardSchemaV1.InferInput<TSchema>>,
> = {
  /** The default slot receives the full field instance */
  default: (props: NotFieldInstance<TSchema, TPath>) => []
}
