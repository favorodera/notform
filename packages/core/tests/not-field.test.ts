import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { NotField, type NotFieldProps, NotForm, useNotForm, type UseNotFormConfig } from '../src'

import { notValidator } from './utils/not-validator'

describe('notField', () => {
  const schema = notValidator.object({
    email: notValidator.string(5, 100),
    name: notValidator.string(2, 50),
  })

  // eslint-disable-next-line ts/no-explicit-any
  const baseConfig: UseNotFormConfig<any> = {
    initialValues: { email: '', name: '' },
    schema,
    validateOn: { onBlur: false, onChange: false, onInput: false },
  }

  const mountForm = (
    // eslint-disable-next-line ts/no-explicit-any
    formConfig?: Partial<UseNotFormConfig<any>>,
    fieldProps?: Partial<NotFieldProps>,
  ) => {
    const form = useNotForm({ ...baseConfig, ...formConfig })

    const wrapper = mount({
      components: { NotField, NotForm },
      setup: () => ({ fieldProps, form }),
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
    it('validates on blur when onBlur is enabled', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onBlur: true } })

      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    })

    it('does not validate on blur when onBlur is disabled', async () => {
      const { form, wrapper } = mountForm()

      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(0)
    })
  })

  describe('onFocus', () => {
    it('validates on focus when onFocus is enabled', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onFocus: true } })

      await wrapper.get('#name').trigger('focus')
      await flushPromises()

      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    })

    it('does not validate on focus when onFocus is disabled', async () => {
      const { form, wrapper } = mountForm()

      await wrapper.get('#name').trigger('focus')
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(0)
    })
  })

  describe('onInput', () => {
    it('revalidates on input in eager mode when errors exist', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onBlur: true, onInput: true } })

      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

      await wrapper.get('#name').setValue('Jane')
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(0)
    })

    it('does not revalidate on input when onInput is disabled', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onBlur: true, onChange: false, onInput: false } })

      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      const errorsBefore = form.getFieldErrors('name').length

      expect(errorsBefore).toBeGreaterThan(0)

      await wrapper.get('#name').setValue('Jane')
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(errorsBefore)
    })
  })

  describe('onChange', () => {
    it('revalidates on change in eager mode when errors exist', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onBlur: true, onChange: true } })

      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

      await wrapper.get('#name').setValue('Jane')
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(0)
    })

    it('does not revalidate on change when onChange is disabled', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onBlur: true, onChange: false, onInput: false } })

      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      const errorsBefore = form.getFieldErrors('name').length

      expect(errorsBefore).toBeGreaterThan(0)

      await wrapper.get('#name').setValue('Jane')
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(errorsBefore)
    })
  })

  describe('onMount', () => {
    it('validates immediately on mount when onMount is enabled', async () => {
      const { form } = mountForm({ validateOn: { onMount: true } })
      await flushPromises()

      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    })

    it('does not validate on mount by default', async () => {
      const { form } = mountForm()
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(0)
    })
  })

  describe('per-field validateOn override', () => {
    it('enables a trigger disabled at form level', async () => {
      const { form, wrapper } = mountForm({}, { validateOn: { onBlur: true } })

      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    })

    it('disables a trigger enabled at form level', async () => {
      const { form, wrapper } = mountForm(
        { validateOn: { onBlur: true } },
        { validateOn: { onBlur: false } },
      )

      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(0)
    })
  })

  describe('singleton', () => {
    it('works without a NotForm ancestor', async () => {
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

    it(':form prop takes priority over NotForm ancestor', async () => {
      const primaryForm = useNotForm({ ...baseConfig, validateOn: { onBlur: true } })
      const secondaryForm = useNotForm({ ...baseConfig, validateOn: { onBlur: true } })

      const wrapper = mount({
        components: { NotField, NotForm },
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
