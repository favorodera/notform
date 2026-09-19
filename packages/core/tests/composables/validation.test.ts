/* eslint-disable ts/no-invalid-void-type */
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { createNotFormInstance } from '../../src/composables/create-not-form-instance'
import { mountNameEmailForm } from '../helpers/mount-form'
import { createFirstCallBlockingSchema, createGatedCallSchema, type nameEmailSchema } from '../helpers/not-validator'

describe('validation', () => {
  it('validate resolves with issues when values are invalid', async () => {
    const { form } = mountNameEmailForm()
    const result = await form.validate()

    expect(result.issues).toBeDefined()
    expect(form.errors.length).toBeGreaterThan(0)
    expect(form.isValid).toBe(false)
  })

  it('validate resolves with value when values are valid', async () => {
    const { form } = mountNameEmailForm()

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    const result = await form.validate()

    expect(result.issues).toBeUndefined()
    expect(form.isValid).toBe(true)
  })

  it('validateField only updates errors for the targeted field', async () => {
    const { form } = mountNameEmailForm()
    await form.validateField('name')

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    expect(form.getFieldErrors('email')).toHaveLength(0)
  })

  it('validateField clears stale errors for a field that becomes valid while other errors persist', async () => {
    const { form } = mountNameEmailForm()

    form.setValue('name', 'a')

    await form.validate()

    expect(form.getFieldErrors('name')).toHaveLength(1)
    expect(form.getFieldErrors('email')).toHaveLength(1)

    form.setValue('name', 'Jane')
    await form.validateField('name')

    expect(form.getFieldErrors('name')).toHaveLength(0)
    expect(form.getFieldErrors('email')).toHaveLength(1)
    expect(form.isValid).toBe(false)
  })

  it('isValidating is true during validation and false after', async () => {
    const { form } = mountNameEmailForm()

    const validationPromise = form.validate()

    expect(form.isValidating).toBe(true)

    await validationPromise

    expect(form.isValidating).toBe(false)
  })

  describe.for(['validate', 'validateField'] as const)('%s', (method) => {
    it('ignores a stale result once a newer call has started', async () => {
      const { promise: stalePromise, resolve: resolveStale } = Promise.withResolvers<void>()

      const { form } = mountNameEmailForm({
        initialValues: { name: 'Jane' },
        schema: createFirstCallBlockingSchema(stalePromise) as typeof nameEmailSchema,
      })

      const run = method === 'validate' ? () => form.validate() : () => form.validateField('name')

      const first = run()
      await flushPromises()

      const second = run()
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(0)

      resolveStale()
      await Promise.all([first, second])
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(0)
    })
  })

  it('allows concurrent validation of different fields to update independently', async () => {
    const { promise: namePromise, resolve: resolveName } = Promise.withResolvers<void>()
    const { promise: emailPromise, resolve: resolveEmail } = Promise.withResolvers<void>()

    const { form } = mountNameEmailForm({
      schema: createGatedCallSchema(
        callNumber => (callNumber === 1 ? namePromise : emailPromise),
        callNumber => ({
          issues: [
            {
              message: callNumber === 1 ? 'Invalid name' : 'Invalid email',
              path: [callNumber === 1 ? 'name' : 'email'],
            },
          ],
        }),
      ) as typeof nameEmailSchema,
    })

    const nameValidation = form.validateField('name')
    await flushPromises()
    const emailValidation = form.validateField('email')
    await flushPromises()

    resolveEmail()
    await emailValidation
    await flushPromises()

    expect(form.getFieldErrors('email')).toHaveLength(1)
    expect(form.getFieldErrors('name')).toHaveLength(0)

    resolveName()
    await nameValidation
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(1)
    expect(form.getFieldErrors('email')).toHaveLength(1)
  })

  describe.for([
    { label: 'validate', run: (form: ReturnType<typeof createNotFormInstance<typeof nameEmailSchema>>) => form.validate() },
    { label: 'validateField', run: (form: ReturnType<typeof createNotFormInstance<typeof nameEmailSchema>>) => form.validateField('name') },
  ] as const)('$label overlap', ({ run }) => {
    it('isValidating stays true until every overlapping call has settled', async () => {
      const { promise: firstPromise, resolve: resolveFirst } = Promise.withResolvers<void>()
      const { promise: secondPromise, resolve: resolveSecond } = Promise.withResolvers<void>()

      const { form } = mountNameEmailForm({
        initialValues: { name: 'Jane' },
        schema: createGatedCallSchema(
          callNumber => (callNumber === 1 ? firstPromise : secondPromise),
          (_callNumber, value) => ({ value }),
        ) as typeof nameEmailSchema,
      })

      const first = run(form)
      await flushPromises()

      expect(form.isValidating).toBe(true)

      const second = run(form)
      await flushPromises()

      expect(form.isValidating).toBe(true)

      resolveFirst()
      await flushPromises()

      expect(form.isValidating).toBe(true)

      resolveSecond()
      await flushPromises()
      await Promise.all([first, second])

      expect(form.isValidating).toBe(false)
    })
  })

  it('mixed validate and validateField calls keep isValidating true until all finish', async () => {
    const { promise: rootPromise, resolve: resolveRoot } = Promise.withResolvers<void>()
    const { promise: fieldPromise, resolve: resolveField } = Promise.withResolvers<void>()

    const { form } = mountNameEmailForm({
      initialValues: { name: 'Jane' },
      schema: createGatedCallSchema(
        callNumber => (callNumber === 1 ? rootPromise : fieldPromise),
        (_callNumber, value) => ({ value }),
      ) as typeof nameEmailSchema,
    })

    const rootValidate = form.validate()
    await flushPromises()

    expect(form.isValidating).toBe(true)

    const fieldValidate = form.validateField('name')
    await flushPromises()

    expect(form.isValidating).toBe(true)

    resolveRoot()
    await flushPromises()

    expect(form.isValidating).toBe(true)

    resolveField()
    await flushPromises()
    await Promise.all([rootValidate, fieldValidate])

    expect(form.isValidating).toBe(false)
  })
})
