import type { MaybeRefOrGetter } from 'vue'
import type { DeepPartial, InferInput, InferOutput, Issue, ObjectSchema } from './shared'

/**
 * Configuration for initialising a form instance via `useNotForm`.
 * @template TSchema - The validation schema used to parse form data.
 */
export interface UseNotFormConfig<TSchema extends ObjectSchema> {
  /** The validation schema used to parse and validate form data. */
  schema: MaybeRefOrGetter<TSchema>

  /** Starting field values; deep-cloned before use to prevent mutation. */
  initialValues?: DeepPartial<InferInput<TSchema>>

  /** Pre-populated validation issues shown before first user interaction. */
  initialErrors?: Array<Issue>

  /**
   * Called after schema validation passes during submission.
   * @param data The validated output data.
   */
  onSubmit?: (data: InferOutput<TSchema>) => Promise<void> | void
}
