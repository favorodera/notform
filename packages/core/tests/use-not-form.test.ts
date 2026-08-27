import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { NotField, NotForm, useNotForm } from '../src'
import { notValidator } from './utils/not-validator'

describe('core', () => {
  const schema = notValidator.object({
    email: notValidator.string(5, 100),
    name: notValidator.string(2, 50),
  })

  const mountForm = (onSubmit = vi.fn()) => {
    const form = useNotForm({
      initialValues: { email: '', name: '' },
      onSubmit,
      schema,
    })

    const wrapper = mount({
      components: { NotField, NotForm },
      setup: () => ({ form }),
      template: `
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
      `,
    })

    return { form, wrapper }
  }

  describe('values', () => {
    it('initialises with provided initial values', () => {
      const { form } = mountForm()

      expect(form.values.name).toBe('')
      expect(form.values.email).toBe('')
    })

    it('setValue updates the value at the given path', () => {
      const { form } = mountForm()
      form.setValue('name', 'Jane')

      expect(form.values.name).toBe('Jane')
    })

    it('setValue marks the field dirty when value differs from initial', () => {
      const { form } = mountForm()
      form.setValue('name', 'Jane')

      expect(form.dirtyFields.has('name')).toBe(true)
      expect(form.isDirty.value).toBe(true)
    })

    it('setValue marks the field clean when value matches initial', () => {
      const { form } = mountForm()

      form.setValue('name', 'Jane')
      form.setValue('name', '')

      expect(form.dirtyFields.has('name')).toBe(false)
      expect(form.isDirty.value).toBe(false)
    })
  })

  describe('touch', () => {
    it('touchField marks the field as touched', () => {
      const { form } = mountForm()
      form.touchField('name')

      expect(form.touchedFields.has('name')).toBe(true)
      expect(form.isTouched.value).toBe(true)
    })

    it('isTouched is false when no fields have been touched', () => {
      const { form } = mountForm()

      expect(form.isTouched.value).toBe(false)
    })
  })

  describe('dirty', () => {
    it('dirtyField marks the field as dirty', () => {
      const { form } = mountForm()
      form.dirtyField('name')

      expect(form.dirtyFields.has('name')).toBe(true)
      expect(form.isDirty.value).toBe(true)
    })

    it('isDirty is false when no fields have been dirtied', () => {
      const { form } = mountForm()

      expect(form.isDirty.value).toBe(false)
    })
  })

  describe('errors', () => {
    it('errors is empty on initialisation', () => {
      const { form } = mountForm()

      expect(form.errors).toHaveLength(0)
      expect(form.isValid.value).toBe(true)
    })

    it('setError appends a new error', () => {
      const { form } = mountForm()
      form.setError({ message: 'Required', path: [{ key: 'name' }] })

      expect(form.errors).toHaveLength(1)
      expect(form.isValid.value).toBe(false)
    })

    it('setError replaces an existing error for the same path', () => {
      const { form } = mountForm()

      form.setError({ message: 'Too short', path: [{ key: 'name' }] })
      form.setError({ message: 'Required', path: [{ key: 'name' }] })

      expect(form.errors).toHaveLength(1)
      expect(form.errors[0].message).toBe('Required')
    })

    it('setErrors replaces all errors', () => {
      const { form } = mountForm()

      form.setError({ message: 'Too short', path: [{ key: 'name' }] })
      form.setErrors([{ message: 'Invalid email', path: [{ key: 'email' }] }])

      expect(form.errors).toHaveLength(1)
      expect(form.errors[0].message).toBe('Invalid email')
    })

    it('clearErrors removes all errors', () => {
      const { form } = mountForm()

      form.setError({ message: 'Required', path: [{ key: 'name' }] })
      form.clearErrors()

      expect(form.errors).toHaveLength(0)
      expect(form.isValid.value).toBe(true)
    })

    it('getFieldErrors returns only errors for the given path', () => {
      const { form } = mountForm()

      form.setErrors([
        { message: 'Too short', path: [{ key: 'name' }] },
        { message: 'Invalid email', path: [{ key: 'email' }] },
      ])
      const nameErrors = form.getFieldErrors('name')

      expect(nameErrors).toHaveLength(1)
      expect(nameErrors[0].message).toBe('Too short')
    })

    it('errorsMap contains the first error message per field path', () => {
      const { form } = mountForm()
      form.setErrors([
        { message: 'Too short', path: [{ key: 'name' }] },
        { message: 'Invalid email', path: [{ key: 'email' }] },
      ])

      expect(form.errorsMap.value.name).toBe('Too short')
      expect(form.errorsMap.value.email).toBe('Invalid email')
    })
  })

  describe('validation', () => {
    it('validate resolves with issues when values are invalid', async () => {
      const { form } = mountForm()
      const result = await form.validate()

      expect(result.issues).toBeDefined()
      expect(form.errors.length).toBeGreaterThan(0)
      expect(form.isValid.value).toBe(false)
    })

    it('validate resolves with value when values are valid', async () => {
      const { form } = mountForm()

      form.setValue('name', 'Jane')
      form.setValue('email', 'jane@example.com')

      const result = await form.validate()

      expect(result.issues).toBeUndefined()
      expect(form.isValid.value).toBe(true)
    })

    it('validateField only updates errors for the targeted field', async () => {
      const { form } = mountForm()
      await form.validateField('name')

      expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
      expect(form.getFieldErrors('email')).toHaveLength(0)
    })

    it('isValidating is true during validation and false after', async () => {
      const { form } = mountForm()

      const validationPromise = form.validate()

      expect(form.isValidating.value).toBe(true)

      await validationPromise

      expect(form.isValidating.value).toBe(false)
    })
  })

  describe('submission', () => {
    it('submit marks all fields as touched and dirty', async () => {
      const { form, wrapper } = mountForm()

      await wrapper.get('form').trigger('submit')
      await nextTick()

      expect(form.touchedFields.has('name')).toBe(true)
      expect(form.touchedFields.has('email')).toBe(true)

      expect(form.dirtyFields.has('name')).toBe(true)
      expect(form.dirtyFields.has('email')).toBe(true)
    })

    it('submit does not call onSubmit when form is invalid', async () => {
      const onSubmit = vi.fn()
      const { wrapper } = mountForm(onSubmit)

      await wrapper.get('form').trigger('submit')
      await nextTick()

      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('submit calls onSubmit with validated values when form is valid', async () => {
      const onSubmit = vi.fn()
      const { form, wrapper } = mountForm(onSubmit)

      form.setValue('name', 'Jane')
      form.setValue('email', 'jane@example.com')

      await wrapper.get('form').trigger('submit')
      await nextTick()

      expect(onSubmit).toHaveBeenCalledWith({ email: 'jane@example.com', name: 'Jane' })
    })

    it('isSubmitting is true during submission and false after', async () => {
      let isSubmittingDuring = false
      const onSubmit = vi.fn(async () => {
        isSubmittingDuring = true
      })

      const { form, wrapper } = mountForm(onSubmit)

      form.setValue('name', 'Jane')
      form.setValue('email', 'jane@example.com')

      await wrapper.get('form').trigger('submit')
      await flushPromises()

      expect(isSubmittingDuring).toBe(true)
      expect(form.isSubmitting.value).toBe(false)
    })
  })

  describe('reset', () => {
    it('reset restores values to initial state', async () => {
      const { form, wrapper } = mountForm()
      form.setValue('name', 'Jane')

      await wrapper.get('form').trigger('reset')

      expect(form.values.name).toBe('')
    })

    it('reset clears touched and dirty fields', async () => {
      const { form, wrapper } = mountForm()

      form.touchField('name')
      form.dirtyField('email')

      await wrapper.get('form').trigger('reset')

      expect(form.touchedFields.size).toBe(0)
      expect(form.dirtyFields.size).toBe(0)
      expect(form.isTouched.value).toBe(false)
      expect(form.isDirty.value).toBe(false)
    })

    it('reset clears all errors', async () => {
      const { form, wrapper } = mountForm()

      form.setError({ message: 'Required', path: [{ key: 'name' }] })

      await wrapper.get('form').trigger('reset')

      expect(form.errors).toHaveLength(0)
    })

    it('reset with new values updates the baseline', async () => {
      const { form, wrapper } = mountForm()

      form.reset({ email: 'jane@example.com', name: 'Jane' })

      expect(form.values.name).toBe('Jane')
      expect(form.values.email).toBe('jane@example.com')

      form.setValue('name', 'John')

      await wrapper.get('form').trigger('reset')

      expect(form.values.name).toBe('Jane')
    })
  })
})
