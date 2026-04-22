import { flushPromises, mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import { NotForm, NotField, useNotForm } from '../src'
import type { NotFieldProps, UseNotFormConfig } from '../src'
import { notValidator } from './utils/not-validator'

describe('NotField', () => {
  const schema = notValidator.object({
    name: notValidator.string(2, 50),
    email: notValidator.string(5, 100),
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseConfig: UseNotFormConfig<any> = {
    schema,
    initialValues: { name: '', email: '' },
    validateOn: { onBlur: false, onChange: false, onInput: false },
  }

  const mountForm = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig?: Partial<UseNotFormConfig<any>>,
    fieldProps?: Partial<NotFieldProps>,
  ) => {
    const form = useNotForm({ ...baseConfig, ...formConfig })

    const wrapper = mount({
      components: { NotForm, NotField },
      setup: () => ({ form, fieldProps }),
      template: `
        <NotForm :form="form" @submit="form.submit">
          <NotField path="name" v-bind="fieldProps" v-slot="{ events }">
            <input id="name" v-model="form.values.name" v-bind="events" />
          </NotField>
        </NotForm>
      `,
    })

    return { form, wrapper }
  }


  describe('onBlur', () => {
    test('validates on blur when onBlur is enabled', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onBlur: true } })
      
      await wrapper.get('#name').trigger('blur')
      await flushPromises()
      
      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    })

    test('does not validate on blur when onBlur is disabled', async () => {
      const { form, wrapper } = mountForm()
      
      await wrapper.get('#name').trigger('blur')
      await flushPromises()
      
      expect(form.getFieldErrors('name').length).toBe(0)
    })
  })


  describe('onFocus', () => {
    test('validates on focus when onFocus is enabled', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onFocus: true } })
      
      await wrapper.get('#name').trigger('focus')
      await flushPromises()
      
      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    })

    test('does not validate on focus when onFocus is disabled', async () => {
      const { form, wrapper } = mountForm()
      
      await wrapper.get('#name').trigger('focus')
      await flushPromises()
      
      expect(form.getFieldErrors('name').length).toBe(0)
    })
  })


  describe('onInput', () => {
    test('revalidates on input in eager mode when errors exist', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onBlur: true, onInput: true } })
      
      await wrapper.get('#name').trigger('blur')
      await flushPromises()
      
      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
      
      await wrapper.get('#name').setValue('Jane')
      await flushPromises()

      expect(form.getFieldErrors('name').length).toBe(0)
    })

    test('does not revalidate on input when onInput is disabled', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onBlur: true, onInput: false, onChange: false } })
      
      await wrapper.get('#name').trigger('blur')
      await flushPromises()
      
      const errorsBefore = form.getFieldErrors('name').length
      expect(errorsBefore).toBeGreaterThan(0)
      
      await wrapper.get('#name').setValue('Jane')
      await flushPromises()

      expect(form.getFieldErrors('name').length).toEqual(errorsBefore)
    })
  })


  describe('onChange', () => {
    test('revalidates on change in eager mode when errors exist', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onBlur: true, onChange: true } })
      
      await wrapper.get('#name').trigger('blur')
      await flushPromises()
      
      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
      
      await wrapper.get('#name').setValue('Jane')
      await flushPromises()
      
      expect(form.getFieldErrors('name').length).toBe(0)
    })

    test('does not revalidate on change when onChange is disabled', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onBlur: true, onChange: false, onInput: false } })
      
      await wrapper.get('#name').trigger('blur')
      await flushPromises()
      
      const errorsBefore = form.getFieldErrors('name').length
      expect(errorsBefore).toBeGreaterThan(0)
      
      await wrapper.get('#name').setValue('Jane')
      await flushPromises()
      
      expect(form.getFieldErrors('name').length).toBe(errorsBefore)
    })
  })


  describe('onMount', () => {
    test('validates immediately on mount when onMount is enabled', async () => {
      const { form } = mountForm({ validateOn: { onMount: true } })
      await flushPromises()
      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    })

    test('does not validate on mount by default', async () => {
      const { form } = mountForm()
      await flushPromises()
      expect(form.getFieldErrors('name').length).toBe(0)
    })
  })


  describe('Per-field validateOn override', () => {
    test('enables a trigger disabled at form level', async () => {
      const { form, wrapper } = mountForm({}, { validateOn: { onBlur: true } })
      
      await wrapper.get('#name').trigger('blur')
      await flushPromises()
      
      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    })

    test('disables a trigger enabled at form level', async () => {
      const { form, wrapper } = mountForm(
        { validateOn: { onBlur: true } },
        { validateOn: { onBlur: false } },
      )
      
      await wrapper.get('#name').trigger('blur')
      await flushPromises()
      
      expect(form.getFieldErrors('name').length).toBe(0)
    })
  })


  describe('Singleton', () => {
    test('works without a NotForm ancestor', async () => {
      const form = useNotForm({ ...baseConfig, validateOn: { onBlur: true } })

      const wrapper = mount({
        components: { NotField },
        setup: () => ({ form }),
        template: `
          <div>
            <NotField :form="form" path="name" v-slot="{ events }">
              <input id="name" v-model="form.values.name" v-bind="events" />
            </NotField>
          </div>
        `,
      })

      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      expect(form.touchedFields.has('name')).toBe(true)
      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    })

    test(':form prop takes priority over NotForm ancestor', async () => {
      const primaryForm = useNotForm({ ...baseConfig, validateOn: { onBlur: true } })
      const secondaryForm = useNotForm({ ...baseConfig, validateOn: { onBlur: true } })

      const wrapper = mount({
        components: { NotForm, NotField },
        setup: () => ({ primaryForm, secondaryForm }),
        template: `
          <NotForm :form="primaryForm" @submit="primaryForm.submit">
            <NotField :form="secondaryForm" path="name" v-slot="{ events }">
              <input id="name" v-model="secondaryForm.values.name" v-bind="events" />
            </NotField>
          </NotForm>
        `,
      })

      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      expect(secondaryForm.touchedFields.has('name')).toBe(true)
      expect(primaryForm.touchedFields.has('name')).toBe(false)
    })
  })
})
