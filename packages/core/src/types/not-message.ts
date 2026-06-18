import type { NotFormInstance } from './not-form'

/** Props for the `NotMessage` component. */
export interface NotMessageProps {
  /** The name/path of the field whose error message should be displayed */
  path: string

  /**
   * Explicit form instance override.
   * Takes priority over the instance provided by a `NotForm` ancestor.
   * Required when using `NotMessage` outside of a `NotForm` (singleton fields).
   * @example
   * ```vue
   * <template>
   *   <NotMessage :form="form" path="email" />
   * </template>
   * ```
   */
  form?: NotFormInstance<any>
}

/** Slots for the `NotMessage` component. */
export interface NotMessageSlots {
  /** The default slot receives the error message context for custom rendering */
  default?: (props: {
    /** The first active validation error message for the specified field */
    message?: string
  }) => any
}
