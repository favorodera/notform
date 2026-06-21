import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { NotField, NotForm, NotMessage, useNotForm } from '../src'
import { notValidator } from './utils/not-validator'

const schema = notValidator.object({
  email: notValidator.string(5, 100),
  name: notValidator.string(2, 50),
})

const baseConfig = {
  initialValues: { email: '', name: '' },
  schema,
}

describe('error message display', () => {
  it('renders nothing when field has no error', () => {
    const form = useNotForm({ ...baseConfig })

    const wrapper = mount({
      components: { NotField, NotForm, NotMessage },
      setup: () => ({ form }),
      template: `
          <NotForm :form="form" @submit="form.submit">
            <NotField path="name" v-slot="{ events, path }">
              <input :id="path" v-model="form.values.name" v-bind="events" />
              <NotMessage :path />
            </NotField>
          </NotForm>
        `,
    })

    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('renders the error message after blur on an invalid field', async () => {
    const form = useNotForm({ ...baseConfig })

    const wrapper = mount({
      components: { NotField, NotForm, NotMessage },
      setup: () => ({ form }),
      template: `
          <NotForm :form="form" @submit="form.submit">
            <NotField path="name" v-slot="{ events, path }">
              <input :id="path" v-model="form.values.name" v-bind="events" />
              <NotMessage :path />
            </NotField>
          </NotForm>
        `,
    })

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Must be at least 2 characters')
  })

  it('clears the message after the field becomes valid', async () => {
    const form = useNotForm({ ...baseConfig })

    const wrapper = mount({
      components: { NotField, NotForm, NotMessage },
      setup: () => ({ form }),
      template: `
          <NotForm :form="form" @submit="form.submit">
            <NotField path="name" v-slot="{ events, path }">
              <input :id="path" v-model="form.values.name" v-bind="events" />
              <NotMessage :path />
            </NotField>
          </NotForm>
        `,
    })

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)

    await wrapper.find('#name').setValue('Jane')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('shows errors independently across multiple fields', async () => {
    const form = useNotForm({ ...baseConfig })

    const wrapper = mount({
      components: { NotField, NotForm, NotMessage },
      setup: () => ({ form }),
      template: `
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
        `,
    })

    await wrapper.find('#name').trigger('blur')
    await wrapper.find('#email').trigger('blur')
    await flushPromises()

    expect(wrapper.findAll('span')).toHaveLength(2)
  })
})

describe('rendering', () => {
  it('renders as span by default', async () => {
    const form = useNotForm({ ...baseConfig })

    const wrapper = mount({
      components: { NotField, NotForm, NotMessage },
      setup: () => ({ form }),
      template: `
          <NotForm :form="form" @submit="form.submit">
            <NotField path="name" v-slot="{ events, path }">
              <input :id="path" v-model="form.values.name" v-bind="events" />
              <NotMessage :path />
            </NotField>
          </NotForm>
        `,
    })

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders as the specified element', async () => {
    const form = useNotForm({ ...baseConfig })

    const wrapper = mount({
      components: { NotField, NotForm, NotMessage },
      setup: () => ({ form }),
      template: `
          <NotForm :form="form" @submit="form.submit">
            <NotField path="name" v-slot="{ events, path }">
              <input :id="path" v-model="form.values.name" v-bind="events" />
              <NotMessage :path v-slot="{ message }" as="p" />
            </NotField>
          </NotForm>
        `,
    })

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.find('span').exists()).toBe(false)
  })
})

describe('default slot', () => {
  it('exposes message via the default slot for custom rendering', async () => {
    const form = useNotForm({ ...baseConfig })

    const wrapper = mount({
      components: { NotField, NotForm, NotMessage },
      setup: () => ({ form }),
      template: `
          <NotForm :form="form" @submit="form.submit">
            <NotField path="name" v-slot="{ events, path }">
              <input :id="path" v-model="form.values.name" v-bind="events" />
              <NotMessage :path v-slot="{ message }" as="div">
                <p id="custom">{{ message }}</p>
              </NotMessage>
            </NotField>
          </NotForm>
        `,
    })

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('#custom').text()).toBe('Must be at least 2 characters')
  })
})

describe('singleton', () => {
  it('works without a NotForm ancestor when :form is passed directly', async () => {
    const form = useNotForm({ ...baseConfig })

    const wrapper = mount({
      components: { NotField, NotMessage },
      setup: () => ({ form }),
      template: `
          <div>
            <NotField :form="form" path="name" v-slot="{ events, path }">
              <input :id="path" v-model="form.values.name" v-bind="events" />
              <NotMessage :form="form" :path />
            </NotField>
          </div>
        `,
    })

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Must be at least 2 characters')
  })

  it(':form prop takes priority over NotForm ancestor', async () => {
    const primaryForm = useNotForm({ ...baseConfig })
    const secondaryForm = useNotForm({ ...baseConfig })

    const wrapper = mount({
      components: { NotField, NotForm, NotMessage },
      setup: () => ({ primaryForm, secondaryForm }),
      template: `
          <NotForm :form="primaryForm" @submit="primaryForm.submit">
            <NotField :form="secondaryForm" path="name" v-slot="{ events, path }">
              <input :id="path" v-model="secondaryForm.values.name" v-bind="events" />
              <NotMessage :form="secondaryForm" :path />
            </NotField>
          </NotForm>
        `,
    })

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)
    expect(primaryForm.touchedFields.has('name')).toBe(false)
  })
})
