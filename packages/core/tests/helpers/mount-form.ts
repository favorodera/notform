import { mount } from '@vue/test-utils'
import { NotField, NotForm, type UseNotFormConfig } from '../../src'
import { createNotFormInstance } from '../../src/composables/create-not-form-instance'
import { nameEmailSchema } from './not-validator'

export const nameEmailFormConfig: UseNotFormConfig<typeof nameEmailSchema> = {
  initialValues: { email: '', name: '' },
  schema: nameEmailSchema,
}

export const nameEmailFormTemplate = `
  <NotForm :form="form" @submit="form.submit" @reset="form.reset()">
    <NotField path="name" v-slot="{ events }">
      <input id="name" v-model="form.values.name" v-bind="events" />
    </NotField>
    <NotField path="email" v-slot="{ events }">
      <input id="email" v-model="form.values.email" v-bind="events" />
    </NotField>
    <button id="submit" type="submit">Submit</button>
    <button id="reset" type="reset">Reset</button>
  </NotForm>
`

/**
 * Mounts a name/email form on the full internal instance.
 * @param formConfig Overrides merged over {@link nameEmailFormConfig}.
 * @returns The instance and wrapper.
 */
export function mountNameEmailForm(formConfig?: Partial<UseNotFormConfig<typeof nameEmailSchema>>) {
  const form = createNotFormInstance({ ...nameEmailFormConfig, ...formConfig })

  const wrapper = mount({
    components: { NotField, NotForm },
    setup: () => ({ form }),
    template: nameEmailFormTemplate,
  })

  return { form, wrapper }
}
