import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createFormInstance } from '../../src/factories/create-form-instance'
import { createNameEmailForm } from '../helpers/create-form'
import { createFirstCallBlockingSchema, createGatedCallSchema, type nameEmailSchema } from '../helpers/schema-fixtures'

describe('validation', () => {
  it('validate resolves with issues when values are invalid', async () => {
    const form = createNameEmailForm()
    const result = await form.validate()

    expect(result.issues).toBeDefined()
    expect(form.errors.length).toBeGreaterThan(0)
    expect(form.isValid).toBe(false)
  })

  it('validate resolves with value when values are valid', async () => {
    const form = createNameEmailForm()

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    const result = await form.validate()

    expect(result.issues).toBeUndefined()
    expect(form.isValid).toBe(true)
  })

  it('validateField only updates errors for the targeted field', async () => {
    const form = createNameEmailForm()
    await form.validateField('name')

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    expect(form.getFieldErrors('email')).toHaveLength(0)
  })

  it('validateField returns the schema output result honestly', async () => {
    const schema = {
      '~standard': {
        types: {
          input: {} as { name: string },
          output: {} as { name: string, normalized: boolean },
        },

        // Trims the name and returns a transformed output value.
        validate(value: unknown) {
          const input = value as { name?: unknown }
          return {
            value: {
              name: String(input.name ?? '').trim(),
              normalized: true,
            },
          }
        },
        vendor: 'test',
        version: 1 as const,
      },
    }

    const form = createFormInstance({
      initialValues: { name: ' Jane ' },
      schema,
    })

    const result = await form.validateField('name')

    expect(result).toStrictEqual({
      value: {
        name: 'Jane',
        normalized: true,
      },
    })
  })

  it('validateField clears stale errors for a field that becomes valid while other errors persist', async () => {
    const form = createNameEmailForm()

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

  it('isValidating is true even when the current value tree has no leaf keys', async () => {
    const { promise: gate, resolve } = Promise.withResolvers<void>()
    const form = createNameEmailForm({
      initialValues: {},
      schema: createGatedCallSchema(
        () => gate,
        (_callNumber, value) => ({ value }),
      ) as typeof nameEmailSchema,
    })

    const validation = form.validate()
    await flushPromises()

    expect(form.isValidating).toBe(true)

    resolve()
    await validation

    expect(form.isValidating).toBe(false)
  })

  it('invalidates in-flight validation when any reactive value changes', async () => {
    const { promise: gate, resolve } = Promise.withResolvers<void>()
    const form = createNameEmailForm({
      initialValues: { name: 'Jane' },
      schema: createFirstCallBlockingSchema(gate) as typeof nameEmailSchema,
    })

    const validationPromise = form.validate()
    await flushPromises()

    expect(form.isValidating).toBe(true)

    form.values.name = 'John'

    expect(form.isValidating).toBe(false)

    resolve()
    await validationPromise

    expect(form.errors).toStrictEqual([])
  })

  it('a newer overlapping field validation wins over an older whole-form run', async () => {
    const { promise: rootGate, resolve: resolveRoot } = Promise.withResolvers<void>()
    const { promise: fieldGate, resolve: resolveField } = Promise.withResolvers<void>()

    let callCount = 0
    const form = createNameEmailForm({
      initialValues: { name: 'Jane' },
      schema: createGatedCallSchema(
        (callNumber) => {
          callCount = callNumber
          return callNumber === 1 ? rootGate : fieldGate
        },
        (_callNumber, value) => ({ value }),
      ) as typeof nameEmailSchema,
    })

    const root = form.validate()
    await flushPromises()

    expect(callCount).toBe(1)
    expect(form.isValidating).toBe(true)

    const field = form.validateField('name')
    await flushPromises()

    expect(form.isValidating).toBe(true)

    resolveRoot()
    await root

    expect(form.isValidating).toBe(true)

    resolveField()
    await field

    expect(form.isValidating).toBe(false)
  })

  it('allows concurrent validation of different fields to update independently', async () => {
    const { promise: namePromise, resolve: resolveName } = Promise.withResolvers<void>()
    const { promise: emailPromise, resolve: resolveEmail } = Promise.withResolvers<void>()

    const form = createNameEmailForm({
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

    expect(form.getFieldErrors('email')).toHaveLength(1)
    expect(form.getFieldErrors('name')).toHaveLength(0)

    resolveName()
    await nameValidation

    expect(form.getFieldErrors('name')).toHaveLength(1)
    expect(form.getFieldErrors('email')).toHaveLength(1)
    expect(form.isValidating).toBe(false)
  })

  it('a newer field validation supersedes an older validation for the same path', async () => {
    const { promise: staleGate, resolve: resolveStale } = Promise.withResolvers<void>()

    const { promise: currentGate, resolve: resolveCurrent } = Promise.withResolvers<void>()

    const form = createNameEmailForm({
      initialValues: { name: 'Jane' },
      schema: createGatedCallSchema(
        callNumber => (callNumber === 1 ? staleGate : currentGate),
        (callNumber, value) => (callNumber === 1
          ? {
              issues: [
                {
                  message: 'Stale validation failed',
                  path: ['name'],
                },
              ],
            }
          : { value }),
      ) as typeof nameEmailSchema,
    })

    const first = form.validateField('name')
    await flushPromises()

    const second = form.validateField('name')
    await flushPromises()

    // The newer validation is still pending.
    expect(form.isValidating).toBe(true)

    resolveStale()
    await first

    // Completing the stale validation must not clear the newer run.
    expect(form.isValidating).toBe(true)

    resolveCurrent()
    await second

    // The stale error must not overwrite the successful newer result.
    expect(form.getFieldErrors('name')).toHaveLength(0)
    expect(form.isValidating).toBe(false)
  })
})
