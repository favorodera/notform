import { flushPromises, mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import { NotForm, NotField, NotMessage, useNotForm } from '../src'
import { notValidator } from './utils/not-validator'

describe('NotMessage', () => {
  const schema = notValidator.object({
    name: notValidator.string(2, 50),
    email: notValidator.string(5, 100),
  })

  const baseConfig = {
    schema,
    initialValues: { name: '', email: '' },
  }


  describe('Error message display', () => {
    test('renders nothing when field has no error', () => {
      const form = useNotForm({ ...baseConfig })

      const wrapper = mount({
        components: { NotForm, NotField, NotMessage },
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

    test('renders the error message after blur on an invalid field', async () => {
      const form = useNotForm({ ...baseConfig })

      const wrapper = mount({
        components: { NotForm, NotField, NotMessage },
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

    test('clears the message after the field becomes valid', async () => {
      const form = useNotForm({ ...baseConfig })

      const wrapper = mount({
        components: { NotForm, NotField, NotMessage },
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

    test('shows errors independently across multiple fields', async () => {
      const form = useNotForm({ ...baseConfig })

      const wrapper = mount({
        components: { NotForm, NotField, NotMessage },
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

      expect(wrapper.findAll('span').length).toBe(2)
    })
  })


  describe('"as" prop', () => {
    test('renders as span by default', async () => {
      const form = useNotForm({ ...baseConfig })

      const wrapper = mount({
        components: { NotForm, NotField, NotMessage },
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

    test('renders as the element specified by the "as" prop', async () => {
      const form = useNotForm({ ...baseConfig })

      const wrapper = mount({
        components: { NotForm, NotField, NotMessage },
        setup: () => ({ form }),
        template: `
          <NotForm :form="form" @submit="form.submit">
            <NotField path="name" v-slot="{ events, path }">
              <input :id="path" v-model="form.values.name" v-bind="events" />
              <NotMessage :path as="p" />
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


  describe('Default slot', () => {
    test('exposes message via the default slot for custom rendering', async () => {
      const form = useNotForm({ ...baseConfig })

      const wrapper = mount({
        components: { NotForm, NotField, NotMessage },
        setup: () => ({ form }),
        template: `
          <NotForm :form="form" @submit="form.submit">
            <NotField path="name" v-slot="{ events, path }">
              <input :id="path" v-model="form.values.name" v-bind="events" />
              <NotMessage :path v-slot="{ message }">
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


  describe('Singleton', () => {
    test('works without a NotForm ancestor when :form is passed directly', async () => {
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

    test(':form prop takes priority over NotForm ancestor', async () => {
      const primaryForm = useNotForm({ ...baseConfig })
      const secondaryForm = useNotForm({ ...baseConfig })

      const wrapper = mount({
        components: { NotForm, NotField, NotMessage },
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
})
