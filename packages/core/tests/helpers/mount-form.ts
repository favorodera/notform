import { mount } from '@vue/test-utils'
import type { nameEmailSchema } from './not-validator'
import { NotField, NotForm, type UseNotFormConfig } from '../../src'
import { createNameEmailForm } from './create-form'

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
 * Mounts a name/email form. Only use this when a test needs a real DOM —
 * see the note on {@link createNameEmailForm} for when to prefer that instead.
 * @param formConfig Overrides merged over the base name/email config.
 * @returns The instance and wrapper.
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
