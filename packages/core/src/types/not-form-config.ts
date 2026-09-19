import type { MaybeRefOrGetter } from 'vue'
import type { DeepPartial, InferInput, InferOutput, Issue, ObjectSchema } from './shared'

/**
 * Options passed to `useNotForm`.
 * @template TSchema Validation schema.
 */
export interface UseNotFormConfig<TSchema extends ObjectSchema> {
  /** Schema used to parse and validate values. */
  schema: MaybeRefOrGetter<TSchema>

  /** Starting values; deep-cloned before use. */
  initialValues?: DeepPartial<InferInput<TSchema>>

  /** Issues shown before the first validation run. */
  initialErrors?: Array<Issue>

  /**
   * Called after a successful submit validation.
   * @param data Validated output.
   */
  onSubmit?: (data: InferOutput<TSchema>) => Promise<void> | void
}
