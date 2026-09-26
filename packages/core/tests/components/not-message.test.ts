import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { NotField, NotForm, NotMessage, useNotForm, type UseNotFormConfig } from '../../src'
import { nameEmailSchema, object, string } from '../helpers/not-validator'

const schema = nameEmailSchema

const baseConfig: UseNotFormConfig<typeof schema> = { schema }

const singleFieldTemplate = `
  <NotForm :form="form" @submit="form.submit">
    <NotField path="name" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.name" v-bind="events" />
      <NotMessage :path />
    </NotField>
  </NotForm>
`

const multiFieldTemplate = `
  <NotForm :form="form" @submit="form.submit">
    <NotField path="name" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.name" v-bind="events" />
      <NotMessage :path />
    </NotField>
    <NotField path="email" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.email" v-bind="events" />
      <NotMessage :path />
    </NotField>
  </NotForm>
`

const customRenderTemplate = `
  <NotForm :form="form" @submit="form.submit">
    <NotField path="name" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.name" v-bind="events" />
      <NotMessage :path v-slot="{ message }" as="div">
        <p id="custom">{{ message }}</p>
      </NotMessage>
    </NotField>
  </NotForm>
`

const singletonTemplate = `
  <div>
    <NotField :form="form" path="name" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.name" v-bind="events" />
      <NotMessage :form="form" :path />
    </NotField>
  </div>
`

const priorityTemplate = `
  <NotForm :form="primaryForm" @submit="primaryForm.submit">
    <NotField :form="secondaryForm" path="name" v-slot="{ events, path }">
      <input :id="path" v-model="secondaryForm.values.name" v-bind="events" />
      <NotMessage :form="secondaryForm" :path />
    </NotField>
  </NotForm>
`

const pTagTemplate = `
  <NotForm :form="form" @submit="form.submit">
    <NotField path="name" v-slot="{ events, path }">
      <input :id="path" v-model="form.values.name" v-bind="events" />
      <NotMessage :path v-slot="{ message }" as="p" />
    </NotField>
  </NotForm>
`

/**
 * Mounts a NotForm with the given template.
 * @param template Optional template to render.
 * @returns Object containing the form and wrapper.
 */
function mountForm(template?: string) {
  const form = useNotForm(baseConfig)

  const wrapper = mount({
    components: { NotField, NotForm, NotMessage },
    setup: () => ({ form }),
    template: template ?? singleFieldTemplate,
  })

  return { form, wrapper }
}

describe('error message display', () => {
  it('renders nothing when field has no error', () => {
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
  it('works without a NotForm ancestor when :form is passed directly', async () => {
    const { wrapper } = mountForm(singletonTemplate)

    await wrapper.find('#name').setValue('H')
    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Must be at least 2 characters')
  })

  it(':form prop takes priority over NotForm ancestor', async () => {
    const primaryForm = useNotForm({
      schema: object({ name: string(10, 50) }),
    })
    const secondaryForm = useNotForm({
      schema: object({ name: string(2, 50) }),
    })

    const wrapper = mount({
      components: { NotField, NotForm, NotMessage },
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
