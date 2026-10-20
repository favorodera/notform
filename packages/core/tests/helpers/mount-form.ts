import { mount } from '@vue/test-utils'
import type { nameEmailSchema } from './not-validator'
import { Field, Form, type FormInstanceSettings } from '../../src'
import { createNameEmailForm } from './create-form'

/** Minimal DOM fixture for name/email field and native form-event tests. */
export const nameEmailFormTemplate = `
  <Form :form="form">
    <Field path="name" v-slot="{ events }">
      <input id="name" v-model="form.values.name" v-bind="events" />
    </Field>
    <Field path="email" v-slot="{ events }">
      <input id="email" v-model="form.values.email" v-bind="events" />
    </Field>
    <button id="submit" type="submit">Submit</button>
    <button id="reset" type="reset">Reset</button>
  </Form>
`

/**
 * Mounts the shared name/email form template.
 * @param formConfig Overrides for the base name/email config.
 * @returns The form instance and mounted wrapper.
 */
export function mountNameEmailForm(formConfig?: Partial<FormInstanceSettings<typeof nameEmailSchema>>) {
  const form = createNameEmailForm(formConfig)

  const wrapper = mount({
    components: { Field, Form },
    setup: () => ({ form }),
    template: nameEmailFormTemplate,
  })

  return { form, wrapper }
}
