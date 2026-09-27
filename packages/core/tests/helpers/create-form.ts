import type { UseNotFormConfig } from '../../src'
import { createNotFormInstance } from '../../src/factories/create-not-form-instance'
import { nameEmailSchema } from './not-validator'

export const nameEmailFormConfig: UseNotFormConfig<typeof nameEmailSchema> = {
  initialValues: { email: '', name: '' },
  schema: nameEmailSchema,
}

/**
 * Creates a name/email form instance directly, without mounting any
 * component. Reach for this whenever a test only calls instance methods
 * and reads instance state — no real DOM, no `@vue/test-utils` mount cost.
 *
 * Use `mountNameEmailForm` instead only when a test genuinely depends on
 * DOM behavior: native form events, rendered input values, or a lifecycle
 * hook (like `onMounted`) that needs a real component to fire — and even
 * then, prefer `withSetup` over a full mount when no actual markup needs
 * to be rendered or interacted with.
 * @param formConfig Overrides merged over {@link nameEmailFormConfig}.
 * @returns The created form instance.
 */
export function createNameEmailForm(formConfig?: Partial<UseNotFormConfig<typeof nameEmailSchema>>) {
  return createNotFormInstance({ ...nameEmailFormConfig, ...formConfig })
}
