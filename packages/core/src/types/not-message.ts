import type { useAttrs } from 'vue'
import type { NotFormInstance } from './not-form'


// PROPS

/** Props for the `NotMessage` component. */
export type NotMessageProps = {
  /** The name/path of the field whose error message should be displayed */
  path: string
  /** HTML Tag `NotMessage` should render as - default is `span`. */
  as?: string
  /**
   * Explicit form instance override.
   * Takes priority over the instance provided by a `NotForm` ancestor.
   * Required when using `NotMessage` outside of a `NotForm` (singleton fields).
   *
   * ```vue
   * <template>
   *   <NotMessage :form="form" path="email" />
   * </template>
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: NotFormInstance<any>
}


// SLOT PROPS


/** Everything available inside the `NotMessage` default slot. */
export type NotMessageSlotProps = {
  /** The first active validation error message for the specified field */
  message?: string
  /** Attributes passed to the `NotMessage` component */
  attributes?: ReturnType<typeof useAttrs>
}


// SLOTS


/** Slots for the `NotMessage` component. */
export type NotMessageSlots = {
  /** The default slot receives the error message context for custom rendering */
  default: (props: NotMessageSlotProps) => []
}
