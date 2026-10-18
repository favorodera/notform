import { mount } from '@vue/test-utils'
import type { nameEmailSchema } from './not-validator'
import { NotField, NotForm, type UseNotFormConfig } from '../../src'
import { createNameEmailForm } from './create-form'

/** Minimal DOM fixture for name/email field and native form-event tests. */
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
 * Mounts the shared name/email form template.
 * @param formConfig Overrides for the base name/email config.
 * @returns The form instance and mounted wrapper.
 */
export function mountNameEmailForm(formConfig?: Partial<UseNotFormConfig<typeof nameEmailSchema>>) {
  const form = createNameEmailForm(formConfig)

  const wrapper = mount({
    components: { NotField, NotForm },
    setup: () => ({ form }),
    template: nameEmailFormTemplate,
  })

  return { form, wrapper }
}
