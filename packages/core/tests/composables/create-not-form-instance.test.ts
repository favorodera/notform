import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NotField, NotForm, type UseNotFormConfig } from '../../src'
import { createNotFormInstance } from '../../src/composables/create-not-form-instance'
import { object, string, vendorVersion } from '../not-validator'

const schema = object({
  email: string(5, 100),
  name: string(2, 50),
})

const baseConfig: UseNotFormConfig<typeof schema> = {
  initialValues: { email: '', name: '' },
  schema,
}

const template = `
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
`

/**
 * Mounts a form with a `name` and `email` field, backed by the full internal
 * instance (not the public `useNotForm` API), since this file exercises the
 * engine directly — including members like `touchedFields`/`dirtyFields`
 * that are intentionally excluded from the consumer-facing `NotFormAPI`.
 * @param formConfig Form configuration.
 * @returns An object containing the full form instance and the wrapper.
 */
function mountForm(formConfig?: Partial<UseNotFormConfig<typeof schema>>) {
  const form = createNotFormInstance({ ...baseConfig, ...formConfig })

  const wrapper = mount({
    components: { NotField, NotForm },
    setup: () => ({ form }),
    template,
  })

  return { form, wrapper }
}

/**
 * Builds a schema whose `validate` blocks on `promise` for its first call
 * and completes synchronously with `{ value }` on any later call — used to
 * deterministically control which of several concurrent validations settles
 * first.
 * @param promise Promise the first call awaits before resolving.
 * @returns A minimal Standard Schema–compliant schema.
 */
function createBlockingSchema(promise: Promise<void>) {
  let callCount = 0

  return {
    '~standard': {
      types: { input: {} as any, output: {} as any },
      async validate(value: any) {
        callCount++

        if (callCount === 1) {
          await promise
          return { issues: [{ message: 'Stale validation failed' }] }
        }

        return { value }
      },
      ...vendorVersion,
    },
  }
}

describe('values', () => {
  it('initializes with provided initial values', () => {
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
    expect(form.isDirty).toBe(true)
  })

  it('setValue marks the field clean when value matches initial', () => {
    const { form } = mountForm()

    form.setValue('name', 'Jane')
    form.setValue('name', '')

    expect(form.dirtyFields.has('name')).toBe(false)
    expect(form.isDirty).toBe(false)
  })
})

describe('touch', () => {
  it('markFieldAsTouched marks the field as touched', () => {
    const { form } = mountForm()
    form.markFieldAsTouched('name')

    expect(form.touchedFields.has('name')).toBe(true)
    expect(form.isTouched).toBe(true)
  })

  it('markAllFieldsAsTouched marks every field as touched', () => {
    const { form } = mountForm()
    form.markAllFieldsAsTouched()

    expect(form.touchedFields.has('name')).toBe(true)
    expect(form.touchedFields.has('email')).toBe(true)
  })

  it('isTouched is false when no fields have been touched', () => {
    const { form } = mountForm()

    expect(form.isTouched).toBe(false)
  })

  it('unmarkFieldAsTouched clears touched state for a single field', () => {
    const { form } = mountForm()
    form.markAllFieldsAsTouched()
    form.unmarkFieldAsTouched('name')

    expect(form.touchedFields.has('name')).toBe(false)
    expect(form.touchedFields.has('email')).toBe(true)
  })
})

describe('dirty', () => {
  it('markFieldAsDirty marks the field as dirty', () => {
    const { form } = mountForm()
    form.markFieldAsDirty('name')

    expect(form.dirtyFields.has('name')).toBe(true)
    expect(form.isDirty).toBe(true)
  })

  it('markAllFieldsAsDirty marks every field as dirty', () => {
    const { form } = mountForm()
    form.markAllFieldsAsDirty()

    expect(form.dirtyFields.has('name')).toBe(true)
    expect(form.dirtyFields.has('email')).toBe(true)
  })

  it('isDirty is false when no fields have been dirtied', () => {
    const { form } = mountForm()

    expect(form.isDirty).toBe(false)
  })

  it('unmarkFieldAsDirty clears dirty state for a single field', () => {
    const { form } = mountForm()
    form.markAllFieldsAsDirty()
    form.unmarkFieldAsDirty('name')

    expect(form.dirtyFields.has('name')).toBe(false)
    expect(form.dirtyFields.has('email')).toBe(true)
  })
})

describe('errors', () => {
  it('errors is empty on initialization', () => {
    const { form } = mountForm()

    expect(form.errors).toHaveLength(0)
    expect(form.isValid).toBe(true)
  })

  it('initializes with provided initial errors', () => {
    const { form } = mountForm({
      initialErrors: [{ message: 'Server rejected this field', path: ['name'] }],
    })

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Server rejected this field')
    expect(form.isValid).toBe(false)
  })

  it('setError appends a new error', () => {
    const { form } = mountForm()
    form.setError({ message: 'Required', path: [{ key: 'name' }] })

    expect(form.errors).toHaveLength(1)
    expect(form.isValid).toBe(false)
  })

  it('setError replaces an existing error for the same path', () => {
    const { form } = mountForm()

    form.setError({ message: 'Too short', path: [{ key: 'name' }] })
    form.setError({ message: 'Required', path: [{ key: 'name' }] })

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Required')
  })

  it('setError appends a pathless error', () => {
    const { form } = mountForm()

    form.setError({ message: 'Form-level failure' })

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Form-level failure')
  })

  it('replaceErrors replaces all errors', () => {
    const { form } = mountForm()

    form.setError({ message: 'Too short', path: [{ key: 'name' }] })
    form.replaceErrors([{ message: 'Invalid email', path: [{ key: 'email' }] }])

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Invalid email')
  })

  it('clearErrors removes all errors', () => {
    const { form } = mountForm()

    form.setError({ message: 'Required', path: [{ key: 'name' }] })
    form.clearErrors()

    expect(form.errors).toHaveLength(0)
    expect(form.isValid).toBe(true)
  })

  it('getFieldErrors returns only errors for the given path', () => {
    const { form } = mountForm()

    form.replaceErrors([
      { message: 'Too short', path: [{ key: 'name' }] },
      { message: 'Invalid email', path: [{ key: 'email' }] },
    ])
    const nameErrors = form.getFieldErrors('name')

    expect(nameErrors).toHaveLength(1)
    expect(nameErrors[0].message).toBe('Too short')
  })
})

describe('validation', () => {
  it('validate resolves with issues when values are invalid', async () => {
    const { form } = mountForm()
    const result = await form.validate()

    expect(result.issues).toBeDefined()
    expect(form.errors.length).toBeGreaterThan(0)
    expect(form.isValid).toBe(false)
  })

  it('validate resolves with value when values are valid', async () => {
    const { form } = mountForm()

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    const result = await form.validate()

    expect(result.issues).toBeUndefined()
    expect(form.isValid).toBe(true)
  })

  it('validateField only updates errors for the targeted field', async () => {
    const { form } = mountForm()
    await form.validateField('name')

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    expect(form.getFieldErrors('email')).toHaveLength(0)
  })

  it('validateField clears stale errors for a field that becomes valid while other errors persist', async () => {
    const { form } = mountForm()

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
    const { form } = mountForm()

    const validationPromise = form.validate()

    expect(form.isValidating).toBe(true)

    await validationPromise

    expect(form.isValidating).toBe(false)
  })

  // `validate` and `validateField` share the same staleness mechanism
  // (generation counter for validate, per-field cycle for validateField),
  // so both are exercised the same way against the same blocking schema.
  describe.for(['validate', 'validateField'] as const)('%s', (method) => {
    it('ignores a stale result once a newer call has started', async () => {
      // eslint-disable-next-line ts/no-invalid-void-type
      const { promise: stalePromise, resolve: resolveStale } = Promise.withResolvers<void>()

      const { form } = mountForm({
        initialValues: { name: 'Jane' },
        // @ts-expect-error-next-line minimal schema differs from full schema but is still Standard Schema compliant
        schema: createBlockingSchema(stalePromise),
      })

      const run = method === 'validate' ? () => form.validate() : () => form.validateField('name')

      // Fire the first (stale) call — it blocks on `stalePromise`.
      const first = run()
      await flushPromises()

      // Fire a second call immediately — it resolves instantly and clears errors.
      const second = run()
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(0)

      // Let the stale first call finish LAST.
      resolveStale()
      await Promise.all([first, second])
      await flushPromises()

      // If staleness weren't handled, this would now show 'Stale validation failed'.
      expect(form.getFieldErrors('name')).toHaveLength(0)
    })
  })

  it('allows concurrent validation of different fields to update independently', async () => {
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: namePromise, resolve: resolveName } = Promise.withResolvers<void>()
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: emailPromise, resolve: resolveEmail } = Promise.withResolvers<void>()

    let validationCount = 0

    const asyncSchema = {
      '~standard': {
        types: { input: {} as any, output: {} as any },
        async validate() {
          validationCount++

          if (validationCount === 1) {
            await namePromise
            return { issues: [{ message: 'Invalid name', path: ['name'] }] }
          }

          await emailPromise
          return { issues: [{ message: 'Invalid email', path: ['email'] }] }
        },
        ...vendorVersion,
      },
    }

    const { form } = mountForm({
      // @ts-expect-error-next-line type of asyncSchema differs from schema but still standard-schema compliant
      schema: asyncSchema,
    })

    // Start name validation first, email second.
    const nameValidation = form.validateField('name')
    await flushPromises()
    const emailValidation = form.validateField('email')
    await flushPromises()

    // Let the newer email validation finish first.
    resolveEmail()
    await emailValidation
    await flushPromises()

    expect(form.getFieldErrors('email')).toHaveLength(1)
    expect(form.getFieldErrors('name')).toHaveLength(0)

    // Now let the older name validation finish — it should still land.
    resolveName()
    await nameValidation
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(1)
    expect(form.getFieldErrors('email')).toHaveLength(1)
  })

  // The two overlap scenarios (two validate() calls, two validateField()
  // calls on the same path) exercise the exact same reference-counted
  // isValidating mechanism, so they share one parameterized test.
  describe.for([
    { label: 'validate', run: (form: ReturnType<typeof createNotFormInstance<typeof schema>>) => form.validate() },
    { label: 'validateField', run: (form: ReturnType<typeof createNotFormInstance<typeof schema>>) => form.validateField('name') },
  ] as const)('$label overlap', ({ run }) => {
    it('isValidating stays true until every overlapping call has settled', async () => {
      // eslint-disable-next-line ts/no-invalid-void-type
      const { promise: firstPromise, resolve: resolveFirst } = Promise.withResolvers<void>()
      // eslint-disable-next-line ts/no-invalid-void-type
      const { promise: secondPromise, resolve: resolveSecond } = Promise.withResolvers<void>()

      let validationCount = 0

      const spySchema = {
        '~standard': {
          types: { input: {} as any, output: {} as any },
          async validate(value: any) {
            validationCount++

            if (validationCount === 1) await firstPromise
            else if (validationCount === 2) await secondPromise

            return { value }
          },
          ...vendorVersion,
        },
      }

      const { form } = mountForm({
        initialValues: { name: 'Jane' },
        // @ts-expect-error-next-line minimal schema differs from full schema but is still Standard Schema compliant
        schema: spySchema,
      })

      const first = run(form)
      await flushPromises()

      expect(form.isValidating).toBe(true)

      const second = run(form)
      await flushPromises()

      expect(form.isValidating).toBe(true)

      // First call settles — but the second is still active on the same
      // field, so isValidating must NOT drop yet (reference counting).
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
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: rootPromise, resolve: resolveRoot } = Promise.withResolvers<void>()
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: fieldPromise, resolve: resolveField } = Promise.withResolvers<void>()

    let validationCount = 0

    const spySchema = {
      '~standard': {
        types: { input: {} as any, output: {} as any },
        async validate(value: any) {
          validationCount++

          if (validationCount === 1) await rootPromise
          else if (validationCount === 2) await fieldPromise

          return { value }
        },
        ...vendorVersion,
      },
    }

    const { form } = mountForm({
      initialValues: { name: 'Jane' },
      // @ts-expect-error-next-line minimal schema differs from full schema but is still Standard Schema compliant
      schema: spySchema,
    })

    const rootValidate = form.validate()
    await flushPromises()

    expect(form.isValidating).toBe(true)

    const fieldValidate = form.validateField('name')
    await flushPromises()

    expect(form.isValidating).toBe(true)

    resolveRoot()
    await flushPromises()

    // Root finished, but the field validation on 'name' is still running.
    expect(form.isValidating).toBe(true)

    resolveField()
    await flushPromises()
    await Promise.all([rootValidate, fieldValidate])

    expect(form.isValidating).toBe(false)
  })
})

describe('submission', () => {
  const onSubmit = vi.fn()

  const submitEvent = {
    preventDefault: vi.fn(),
  } as unknown as SubmitEvent

  // eslint-disable-next-line test/no-hooks
  beforeEach(() => {
    onSubmit.mockClear()
    // @ts-expect-error-next-line type of preventDefault differ from mock signature
    submitEvent.preventDefault.mockClear()
  })

  it('submit marks all fields as touched and dirty', async () => {
    const { form } = mountForm()

    // Values must actually change for syncAllDirtyStates to mark them dirty —
    // dirty tracking reflects "differs from initial", not "was submitted".
    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    await form.submit(submitEvent)

    expect(form.touchedFields.has('name')).toBe(true)
    expect(form.touchedFields.has('email')).toBe(true)
    expect(form.dirtyFields.has('name')).toBe(true)
    expect(form.dirtyFields.has('email')).toBe(true)
  })

  it('submit does not call onSubmit when form is invalid', async () => {
    const { form } = mountForm({ onSubmit })

    await form.submit(submitEvent)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submit calls onSubmit with validated values when form is valid', async () => {
    const { form } = mountForm({ onSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    await form.submit(submitEvent)

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'jane@example.com',
      name: 'Jane',
    })
  })

  it('isSubmitting is true during submission and false after', async () => {
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()

    const onSubmit = vi.fn(() => submitPromise)

    const { form, wrapper } = mountForm({ onSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(form.isSubmitting).toBe(true)

    resolveSubmit()
    await flushPromises()

    expect(form.isSubmitting).toBe(false)
  })

  it('submit ignores the second call while the first is in progress', async () => {
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()

    const onSubmit = vi.fn(() => submitPromise)

    const { form, wrapper } = mountForm({ onSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    const formElement = wrapper.get('form')

    await formElement.trigger('submit')
    await flushPromises()

    expect(form.isSubmitting).toBe(true)
    expect(onSubmit).toHaveBeenCalledTimes(1)

    await formElement.trigger('submit')
    await flushPromises()

    expect(form.isSubmitting).toBe(true)
    expect(onSubmit).toHaveBeenCalledTimes(1)

    resolveSubmit()
    await flushPromises()

    expect(form.isSubmitting).toBe(false)
    // eslint-disable-next-line test/max-expects
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('submit bails out when a newer validation starts during its validation phase', async () => {
    const { form } = mountForm({
      initialValues: { name: 'Jane' },
      onSubmit,
    })

    const submitPromise = form.submit(submitEvent)

    // Interrupt mid-validation with a value change, forcing a newer generation.
    form.setValue('name', 'Jane Doe')

    await flushPromises()
    await submitPromise

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('resets isSubmitting even when onSubmit throws', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'))

    const form = createNotFormInstance({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      onSubmit,
      schema,
    })

    await expect(form.submit(submitEvent)).rejects.toThrow('Network error')

    expect(form.isSubmitting).toBe(false)
  })

  it('submit resets isSubmitting when validation fails', async () => {
    const { form } = mountForm({ onSubmit })

    const submitPromise = form.submit(submitEvent)
    await flushPromises()
    await submitPromise
    await flushPromises()

    expect(onSubmit).not.toHaveBeenCalled()
    expect(form.isSubmitting).toBe(false)
    expect(form.errors.length).toBeGreaterThan(0)
  })

  it('submit calls preventDefault on the event', async () => {
    const { form } = mountForm({ onSubmit })

    await form.submit(submitEvent)
    await flushPromises()

    expect(submitEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('submit with no onSubmit handler still validates and completes', async () => {
    const { form } = mountForm()

    await expect(form.submit(submitEvent)).resolves.not.toThrow()

    await flushPromises()

    expect(form.isSubmitting).toBe(false)
  })

  it('ignores new submissions while the guard is active even with concurrent validate calls', async () => {
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()

    const onSubmit = vi.fn(() => submitPromise)

    const { form } = mountForm({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      onSubmit,
    })

    const firstSubmitResult = form.submit(submitEvent)
    await flushPromises()

    expect(form.isSubmitting).toBe(true)
    expect(onSubmit).toHaveBeenCalledTimes(1)

    await form.validate()
    await flushPromises()

    const secondSubmitResult = form.submit(submitEvent)
    await flushPromises()

    expect(onSubmit).toHaveBeenCalledTimes(1)

    resolveSubmit()
    await flushPromises()
    await Promise.all([firstSubmitResult, secondSubmitResult])

    expect(form.isSubmitting).toBe(false)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})

describe('reset', () => {
  it('reset restores values to initial state', async () => {
    const { form } = mountForm()
    form.setValue('name', 'Jane')

    form.reset()

    expect(form.values.name).toBe('')
  })

  it('native reset does not overwrite restored input values', async () => {
    const { form, wrapper } = mountForm({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
    })

    const nameInput = wrapper.get('#name')
    const nameInputElement = nameInput.element as HTMLInputElement
    const emailInput = wrapper.get('#email')
    const emailInputElement = emailInput.element as HTMLInputElement

    await nameInput.setValue('ChangedName')
    await emailInput.setValue('ChangedEmail')
    await flushPromises()

    expect(form.values.name).toBe('ChangedName')
    expect(form.values.email).toBe('ChangedEmail')
    expect(nameInputElement.value).toBe('ChangedName')
    expect(emailInputElement.value).toBe('ChangedEmail')

    await wrapper.get('#reset').trigger('click')

    expect(form.values.name).toBe('Jane')
    // eslint-disable-next-line test/max-expects
    expect(form.values.email).toBe('jane@example.com')
    // eslint-disable-next-line test/max-expects
    expect(nameInputElement.value).toBe('Jane')
    // eslint-disable-next-line test/max-expects
    expect(emailInputElement.value).toBe('jane@example.com')
  })

  it('reset clears touched and dirty fields', async () => {
    const { form } = mountForm()

    form.markFieldAsTouched('name')
    form.markFieldAsDirty('email')

    form.reset()

    expect(form.touchedFields.size).toBe(0)
    expect(form.dirtyFields.size).toBe(0)
    expect(form.isTouched).toBe(false)
    expect(form.isDirty).toBe(false)
  })

  it('reset clears all errors', async () => {
    const { form } = mountForm()

    form.setError({ message: 'Required', path: [{ key: 'name' }] })
    form.reset()

    expect(form.errors).toHaveLength(0)
  })

  it('reset restores initialErrors', () => {
    const { form } = mountForm({
      initialErrors: [{ message: 'Server error', path: ['email'] }],
    })

    form.clearErrors()

    expect(form.errors).toHaveLength(0)

    form.reset()

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Server error')
  })

  it('reset with new values updates the baseline', async () => {
    const { form } = mountForm()

    form.reset({ email: 'jane@example.com', name: 'Jane' })

    expect(form.values.name).toBe('Jane')
    expect(form.values.email).toBe('jane@example.com')

    form.setValue('name', 'John')
    form.reset()

    expect(form.values.name).toBe('Jane')
  })

  it('reset with new values drops keys absent from the new baseline', async () => {
    const { form } = mountForm()

    form.reset({ name: 'Jane' })

    // The new baseline has only `name` — `email` must be dropped, not merged in.
    expect(form.values).toStrictEqual({ name: 'Jane' })

    form.setValue('name', 'John')
    form.reset()

    // A follow-up plain reset() must restore that SAME baseline — still no `email`.
    expect(form.values).toStrictEqual({ name: 'Jane' })
  })

  it('reset invalidates an in-flight validation result', async () => {
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise, resolve } = Promise.withResolvers<void>()

    const { form } = mountForm({
      // @ts-expect-error-next-line minimal schema differs from full schema but is still Standard Schema compliant
      schema: createBlockingSchema(promise),
    })

    const validation = form.validate()
    await flushPromises()

    form.reset()

    expect(form.errors).toHaveLength(0)

    resolve()
    await validation
    await flushPromises()

    expect(form.errors).toHaveLength(0)
  })

  it('reset does not leave isValidating stuck true after invalidating an in-flight validation', async () => {
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise, resolve } = Promise.withResolvers<void>()

    const { form } = mountForm({
      // @ts-expect-error-next-line minimal schema differs from full schema but is still Standard Schema compliant
      schema: createBlockingSchema(promise),
    })

    const validation = form.validate()
    await flushPromises()

    expect(form.isValidating).toBe(true)

    form.reset()

    resolve()
    await validation
    await flushPromises()

    // Regression guard for the validatingFields ref-counting fix: the stale
    // validation's finally block must not leave a dangling count after reset
    // has already cleared the tracking map.
    expect(form.isValidating).toBe(false)
  })
})
