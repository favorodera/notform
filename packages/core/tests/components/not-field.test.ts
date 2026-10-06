import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { NotField, type NotFieldProps, NotForm, useNotForm } from '../../src'
import { nameEmailSchema, object, string } from '../helpers/not-validator'

/** Shared schema for field component tests. */
const schema = nameEmailSchema

/** Template for a field with an explicit form and no `<NotForm>` ancestor. */
const singletonTemplate = `
  <div>
    <NotField :form="form" v-bind="fieldProps" path="name" v-slot="{ events }">
      <input id="name" v-model="form.values.name" v-bind="events" />
    </NotField>
  </div>
`

/** Template proving an explicit field form overrides the ancestor form. */
const priorityTemplate = `
  <NotForm :form="primaryForm" @submit="primaryForm.submit">
    <NotField :form="secondaryForm" path="name" v-slot="{ events }">
      <input id="name" v-model="secondaryForm.values.name" v-bind="events" />
    </NotField>
  </NotForm>
`

describe('singleton', () => {
  it('works without a NotForm ancestor', async () => {
    const form = useNotForm({ schema })

    const wrapper = mount({
      components: { NotField },
      setup: () => ({
        fieldProps: { validateOn: { onBlur: true, onChange: false } } satisfies Partial<NotFieldProps<typeof schema>>,
        form,
      }),
      template: singletonTemplate,
    })

    await wrapper.get('#name').trigger('blur')
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it(':form prop takes priority over NotForm ancestor', async () => {
    const primaryForm = useNotForm({
      schema: object({ name: string(10, 50) }),
    })
    const secondaryForm = useNotForm({
      schema: object({ name: string(2, 50) }),
    })

    const wrapper = mount({
      components: { NotField, NotForm },
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
