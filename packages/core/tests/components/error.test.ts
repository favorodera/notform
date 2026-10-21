import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Error, Field, Form, type FormInstanceSettings, useForm } from '../../src'
import { nameEmailSchema, object, string } from '../helpers/schema-fixtures'

/** Shared schema for message rendering tests. */
const schema = nameEmailSchema

/** Base form config; individual tests provide values as needed. */
const baseConfig: FormInstanceSettings<typeof schema> = { schema }

/** Renders a message beside one field. */
const singleFieldTemplate = `
  <Form :form="form" @submit="form.submit">
    <Field path="name" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.name" v-bind="events" />
      <Error :path />
    </Field>
  </Form>
`

/** Renders messages for both name and email fields. */
const multiFieldTemplate = `
  <Form :form="form" @submit="form.submit">
    <Field path="name" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.name" v-bind="events" />
      <Error :path />
    </Field>
    <Field path="email" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.email" v-bind="events" />
      <Error :path />
    </Field>
  </Form>
`

/** Uses the message slot to customize the rendered content. */
const customRenderTemplate = `
  <Form :form="form" @submit="form.submit">
    <Field path="name" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.name" v-bind="events" />
      <Error :path v-slot="{ message }" as="div">
        <p id="custom">{{ message }}</p>
      </Error>
    </Field>
  </Form>
`

/** Uses an explicit form without a `<Form>` ancestor. */
const singletonTemplate = `
  <div>
    <Field :form="form" path="name" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.name" v-bind="events" />
      <Error :form="form" :path />
    </Field>
  </div>
`

/** Proves an explicit message form overrides the ancestor form. */
const priorityTemplate = `
  <Form :form="primaryForm" @submit="primaryForm.submit">
    <Field :form="secondaryForm" path="name" v-slot="{ events, path }">
      <input :id="path" v-model="secondaryForm.values.name" v-bind="events" />
      <Error :form="secondaryForm" :path />
    </Field>
  </Form>
`

/** Renders the message as a paragraph element. */
const pTagTemplate = `
  <Form :form="form" @submit="form.submit">
    <Field path="name" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.name" v-bind="events" />
      <Error :path v-slot="{ message }" as="p" />
    </Field>
  </Form>
`

/**
 * Mounts the message test form with an optional template override.
 * @param template Template to render; defaults to the single-field fixture.
 * @returns The form instance and mounted wrapper.
 */
function mountForm(template?: string) {
  const form = useForm(baseConfig)

  const wrapper = mount({
    components: { Error, Field, Form },
    setup: () => ({ form }),
    template: template ?? singleFieldTemplate,
  })

  return { form, wrapper }
}

describe('error message display', () => {
  it('renders nothing when the field has no error', () => {
    const { wrapper } = mountForm()

    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('renders the error message after blur on an invalid field', async () => {
    const { wrapper } = mountForm()

    await wrapper.find('#name').setValue('H')
    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Must be at least 2 characters')
  })

  it('clears the message after the field becomes valid', async () => {
    const { wrapper } = mountForm()

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)

    await wrapper.find('#name').setValue('Jane')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('shows errors independently across multiple fields', async () => {
    const { wrapper } = mountForm(multiFieldTemplate)

    await wrapper.find('#name').trigger('blur')
    await wrapper.find('#email').trigger('blur')
    await flushPromises()

    expect(wrapper.findAll('span')).toHaveLength(2)
  })
})

describe('rendering', () => {
  it('renders as span by default', async () => {
    const { wrapper } = mountForm()

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders as the specified element', async () => {
    const { wrapper } = mountForm(pTagTemplate)

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.find('span').exists()).toBe(false)
  })
})

describe('default slot', () => {
  it('exposes message via the default slot for custom rendering', async () => {
    const { wrapper } = mountForm(customRenderTemplate)

    await wrapper.find('#name').setValue('H')
    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('#custom').text()).toBe('Must be at least 2 characters')
  })
})

describe('singleton', () => {
  it('works without a Form ancestor when :form is passed directly', async () => {
    const { wrapper } = mountForm(singletonTemplate)

    await wrapper.find('#name').setValue('H')
    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Must be at least 2 characters')
  })

  it(':form prop takes priority over Form ancestor', async () => {
    const primaryForm = useForm({
      schema: object({ name: string(10, 50) }),
    })
    const secondaryForm = useForm({
      schema: object({ name: string(2, 50) }),
    })

    const wrapper = mount({
      components: { Error, Field, Form },
      setup: () => ({ primaryForm, secondaryForm }),
      template: priorityTemplate,
    })

    await wrapper.find('#name').setValue('Jo')
    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(false)
    expect(secondaryForm.getFieldErrors('name')).toHaveLength(0)
    expect(primaryForm.getFieldErrors('name')).toHaveLength(0)

    primaryForm.setError({ message: 'wrong form error', path: ['name'] })
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(false)
    expect(primaryForm.getFieldErrors('name')).toHaveLength(1)
  })
})
