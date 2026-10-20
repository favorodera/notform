import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Field, type FieldProps, Form, useForm } from '../../src'
import { nameEmailSchema, object, string } from '../helpers/not-validator'

/** Shared schema for field component tests. */
const schema = nameEmailSchema

/** Template for a field with an explicit form and no `<Form>` ancestor. */
const singletonTemplate = `
  <div>
    <Field :form="form" v-bind="fieldProps" path="name" v-slot="{ events }">
      <input id="name" v-model="form.values.name" v-bind="events" />
    </Field>
  </div>
`

/** Template proving an explicit field form overrides the ancestor form. */
const priorityTemplate = `
  <Form :form="primaryForm" @submit="primaryForm.submit">
    <Field :form="secondaryForm" path="name" v-slot="{ events }">
      <input id="name" v-model="secondaryForm.values.name" v-bind="events" />
    </Field>
  </Form>
`

describe('singleton', () => {
  it('works without a Form ancestor', async () => {
    const form = useForm({ schema })

    const wrapper = mount({
      components: { Field },
      setup: () => ({
        fieldProps: { validateOn: { onBlur: true, onChange: false } } satisfies Partial<FieldProps<typeof schema>>,
        form,
      }),
      template: singletonTemplate,
    })

    await wrapper.get('#name').trigger('blur')
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it(':form prop takes priority over Form ancestor', async () => {
    const primaryForm = useForm({
      schema: object({ name: string(10, 50) }),
    })
    const secondaryForm = useForm({
      schema: object({ name: string(2, 50) }),
    })

    const wrapper = mount({
      components: { Field, Form },
      setup: () => ({ primaryForm, secondaryForm }),
      template: priorityTemplate,
    })

    await wrapper.get('#name').setValue('Jo')
    await wrapper.get('#name').trigger('blur')
    await flushPromises()

    expect(secondaryForm.values.name).toBe('Jo')
    expect(secondaryForm.getFieldErrors('name')).toHaveLength(0)
    expect(primaryForm.getFieldErrors('name')).toHaveLength(0)
    expect(primaryForm.values.name).not.toBe('Jo')
  })
})
