import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ObjectSchema, Paths, ValidationTrigger } from './shared'
import type { NotFormInstance } from './not-form'

/** The event handlers provided by a field instance for binding to native or custom inputs. */
export type NotFieldEvents = {
  /** Triggered when the field loses focus */
  onBlur: () => void
  /** Triggered on every keystroke or value change */
  onInput: () => void
  /** Triggered when the field value is committed */
  onChange: () => void
  /** Triggered when the field gains focus */
  onFocus: () => void
}

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
  /**
   * Per-field validation trigger overrides.
   * Merged over the form-wide validateOn config — only the keys you specify are overridden.
   */
  validateOn?: Partial<Record<ValidationTrigger, boolean>>
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
  /** Validates this field against the form schema */
  validate: () => ReturnType<NotFormInstance<TSchema>['validateField']>

  /** The validation issues for this field */
  errors: StandardSchemaV1.Issue[]

  /** Marks the field as touched */
  touch: () => void
  /** Marks the field as not touched */
  unTouch: () => void

  /** Marks the field as dirty */
  dirty: () => void
  /** Marks the field as not dirty */
  unDirty: () => void

  /**
   * All event handlers combined — spread directly onto native inputs.
   * @example <input v-bind="events" />
   */
  events: NotFieldEvents
  /** Triggered when the field loses focus */
  onBlur: NotFieldEvents['onBlur']
  /** Triggered on every keystroke or value change */
  onInput: NotFieldEvents['onInput']
  /** Triggered when the field value is committed */
  onChange: NotFieldEvents['onChange']
  /** Triggered when the field gains focus */
  onFocus: NotFieldEvents['onFocus']
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
