import type { FormInstanceSettings } from '../../src'
import { createFormInstance } from '../../src/factories/create-form-instance'
import { nameEmailSchema } from './not-validator'

/** Default config for tests using the name/email schema. */
export const nameEmailFormConfig: FormInstanceSettings<typeof nameEmailSchema> = {
  initialValues: { email: '', name: '' },
  schema: nameEmailSchema,
}

/**
 * Creates a form instance without mounting a component.
 * Use the mount helper when a test needs rendered DOM or native events.
 * @param formConfig Overrides merged over {@link nameEmailFormConfig}.
 * @returns The created form instance.
 */
export function createNameEmailForm(formConfig?: Partial<FormInstanceSettings<typeof nameEmailSchema>>) {
  return createFormInstance({ ...nameEmailFormConfig, ...formConfig })
}
