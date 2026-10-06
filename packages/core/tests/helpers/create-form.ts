import type { UseNotFormConfig } from '../../src'
import { createNotFormInstance } from '../../src/factories/create-not-form-instance'
import { nameEmailSchema } from './not-validator'

/** Default config for tests using the name/email schema. */
export const nameEmailFormConfig: UseNotFormConfig<typeof nameEmailSchema> = {
  initialValues: { email: '', name: '' },
  schema: nameEmailSchema,
}

/**
 * Creates a form instance without mounting a component.
 * Use the mount helper when a test needs rendered DOM or native events.
 * @param formConfig Overrides merged over {@link nameEmailFormConfig}.
 * @returns The created form instance.
 */
export function createNameEmailForm(formConfig?: Partial<UseNotFormConfig<typeof nameEmailSchema>>) {
  return createNotFormInstance({ ...nameEmailFormConfig, ...formConfig })
}
