import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NotField, NotForm, useNotForm, type UseNotFormConfig } from '../../src'
import { object, string, vendorVersion } from '../test-utils/not-validator'

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
 * Mounts a form with a `name` field and its input.
 *
 * The template and components can be overridden to cover multi-field,
 * custom rendering, and singleton (no NotForm ancestor) scenarios.
 * @param formConfig Form configuration.
 * @returns An object containing the form instance and the wrapper.
 */
function mountForm(formConfig?: Partial<UseNotFormConfig<typeof schema>>) {
  const form = useNotForm({ ...baseConfig, ...formConfig })

  const wrapper = mount({
    components: { NotField, NotForm },
    setup: () => ({ form }),
    template,
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

  it('initialises with provided initial errors', () => {
    const { form } = mountForm({
      initialErrors: [{ message: 'Server rejected this field', path: ['name'] }],
    })

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Server rejected this field')
    expect(form.isValid.value).toBe(false)
    expect(form.errorsMap.value.name).toBe('Server rejected this field')
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

  it('setError appends a pathless error', () => {
    const { form } = mountForm()

    form.setError({ message: 'Form-level failure' })

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Form-level failure')
    // A pathless error surfaces in the raw collection only — not per-field
    expect(Object.keys(form.errorsMap.value)).toHaveLength(0)
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

  it('errorsMap skips issues without a path', () => {
    const { form } = mountForm()

    form.setErrors([
      { message: 'Something went wrong' },
      { message: 'Invalid email', path: [{ key: 'email' }] },
    ])

    expect(form.errors).toHaveLength(2)
    expect(Object.keys(form.errorsMap.value)).toHaveLength(1)
    expect(form.errorsMap.value.email).toBe('Invalid email')
  })

  it('errorsMap keeps only the first message when a path has multiple errors', () => {
    const { form } = mountForm()

    form.setErrors([
      { message: 'First', path: [{ key: 'name' }] },
      { message: 'Second', path: [{ key: 'name' }] },
    ])

    expect(form.errors).toHaveLength(2)
    expect(form.errorsMap.value.name).toBe('First')
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
    expect(form.isValid.value).toBe(false)
  })

  it('isValidating is true during validation and false after', async () => {
    const { form } = mountForm()

    const validationPromise = form.validate()

    expect(form.isValidating.value).toBe(true)

    await validationPromise

    expect(form.isValidating.value).toBe(false)
  })

  it('validate ignores stale results when a newer validation starts', async () => {
  // A deferred promise to freeze the first validation call
  // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: stalePromise, resolve: resolveStaleValidation } = Promise.withResolvers<void>()

    let validationCount = 0

    // An inline schema that behaves differently on call 1 vs call 2
    const spySchema = {
      '~standard': {
        types: { input: {} as any, output: {} as any },
        async validate(value: any) {
          validationCount++

          if (validationCount === 1) {
          // Validation Run #1 (Stale): Hold it mid-flight, then return an error issue
            await stalePromise
            return { issues: [{ message: 'Stale validation failed' }] }
          }

          // Validation Run #2 (Newest): Complete instantly and return success
          return { value }
        },
        ...vendorVersion,
      },
    }

    // Mount form with the custom spy schema mapping
    const { form } = mountForm({
      initialValues: { name: 'Jane' },
      // @ts-expect-error-next-line type of spySchema differ from schema but still standard-schema compliant
      schema: spySchema,
    })

    // Fire Validation #1 (Stale). It halts on the `await stalePromise` block.
    const firstValidate = form.validate()
    await flushPromises()

    // Instantly change values or call validate again to schedule Validation #2 (Newest).
    // This executes instantly, resolves successfully, and wipes previous errors.
    const secondValidate = form.validate()
    await flushPromises()

    // The rapid validation cleared errors or is currently at 0
    expect(form.getFieldErrors('name')).toHaveLength(0)

    // Now release the lock on Validation #1 so it finishes completely LAST
    resolveStaleValidation()

    // Wait for all async validation cycles to completely wind down
    await Promise.all([firstValidate, secondValidate])
    await flushPromises()

    // The field errors must STILL be 0.
    // If the stale validation was not ignored, it would have resolved last
    // and overwritten the form state with 'Stale validation failed'.
    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('validateField ignores stale results when a newer validation starts', async () => {
  // A deferred promise to freeze the first validation call
  // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: stalePromise, resolve: resolveStaleValidation } = Promise.withResolvers<void>()

    let validationCount = 0

    // An inline schema that behaves differently on call 1 vs call 2
    const spySchema = {
      '~standard': {
        types: { input: {} as any, output: {} as any },
        async validate(value: any) {
          validationCount++

          if (validationCount === 1) {
          // Validation Run #1 (Stale): Hold it mid-flight, then return an error issue
            await stalePromise
            return { issues: [{ message: 'Stale validation failed' }] }
          }

          // Validation Run #2 (Newest): Complete instantly and return success
          return { value }
        },
        ...vendorVersion,
      },
    }

    // Mount form with the custom spy schema mapping
    const { form } = mountForm({
      initialValues: { name: 'Jane' },
      // @ts-expect-error-next-line type of spySchema differ from schema but still standard-schema compliant
      schema: spySchema,
    })

    // Fire Validation #1 (Stale). It halts on the `await stalePromise` block.
    const firstValidate = form.validateField('name')
    await flushPromises()

    // Instantly change values or call validate again to schedule Validation #2 (Newest).
    // This executes instantly, resolves successfully, and wipes previous errors.
    const secondValidate = form.validateField('name')
    await flushPromises()

    // The rapid validation cleared errors or is currently at 0
    expect(form.getFieldErrors('name')).toHaveLength(0)

    // Now release the lock on Validation #1 so it finishes completely LAST
    resolveStaleValidation()

    // Wait for all async validation cycles to completely wind down
    await Promise.all([firstValidate, secondValidate])
    await flushPromises()

    // The field errors must STILL be 0.
    // If the stale validation was not ignored, it would have resolved last
    // and overwritten the form state with 'Stale validation failed'.
    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('isValidating stays true while concurrent validations overlap', async () => {
  // Separate promise controllers to control each validation run independently
  // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: firstPromise, resolve: resolveFirst } = Promise.withResolvers<void>()
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: secondPromise, resolve: resolveSecond } = Promise.withResolvers<void>()

    let validationCount = 0

    // An inline schema that behaves differently on call 1 vs call 2
    const spySchema = {
      '~standard': {
        types: { input: {} as any, output: {} as any },
        async validate(value: any) {
          validationCount++

          if (validationCount === 1) {
            await firstPromise
          } else if (validationCount === 2) {
            await secondPromise
          }

          return { value }
        },
        ...vendorVersion,
      },
    }

    // Mount form with the custom spy schema mapping
    const { form } = mountForm({
      initialValues: { name: 'Jane' },
      // @ts-expect-error-next-line type of spySchema differ from schema but still standard-schema compliant
      schema: spySchema,
    })

    // Fire Validation #1.
    const firstValidate = form.validate()
    await flushPromises()

    // Validation #1 is still active, so isValidating is true
    expect(form.isValidating.value).toBe(true)

    // Fire Validation #2.
    const secondValidate = form.validate()
    await flushPromises()

    // It's still true because both are currently active
    expect(form.isValidating.value).toBe(true)

    // Resolve the FIRST validation cycle
    resolveFirst()
    await flushPromises()

    // Even though the first validation finished, isValidating MUST stay true
    // because the second validation cycle is still running in the background.
    expect(form.isValidating.value).toBe(true)

    // Resolve the SECOND validation cycle
    resolveSecond()
    await flushPromises()
    await Promise.all([firstValidate, secondValidate])

    // Now that all validation requests have settled, isValidating drops to false.
    expect(form.isValidating.value).toBe(false)
  })

  it('isValidating stays true while concurrent field validations overlap', async () => {
  // Separate promise controllers to control each validation run independently
  // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: firstPromise, resolve: resolveFirst } = Promise.withResolvers<void>()
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: secondPromise, resolve: resolveSecond } = Promise.withResolvers<void>()

    let validationCount = 0

    // An inline schema that behaves differently on call 1 vs call 2
    const spySchema = {
      '~standard': {
        types: { input: {} as any, output: {} as any },
        async validate(value: any) {
          validationCount++

          if (validationCount === 1) {
            await firstPromise
          } else if (validationCount === 2) {
            await secondPromise
          }

          return { value }
        },
        ...vendorVersion,
      },
    }

    // Mount form with the custom spy schema mapping
    const { form } = mountForm({
      initialValues: { name: 'Jane' },
      // @ts-expect-error-next-line type of spySchema differ from schema but still standard-schema compliant
      schema: spySchema,
    })

    // Fire Validation #1.
    const firstValidate = form.validateField('name')
    await flushPromises()

    // Validation #1 is still active, so isValidating is true
    expect(form.isValidating.value).toBe(true)

    // Fire Validation #2.
    const secondValidate = form.validateField('name')
    await flushPromises()

    // It's still true because both are currently active
    expect(form.isValidating.value).toBe(true)

    // Resolve the FIRST validation cycle
    resolveFirst()
    await flushPromises()

    // Even though the first validation finished, isValidating MUST stay true
    // because the second validation cycle is still running in the background.
    expect(form.isValidating.value).toBe(true)

    // Resolve the SECOND validation cycle
    resolveSecond()
    await flushPromises()
    await Promise.all([firstValidate, secondValidate])

    // Now that all validation requests have settled, isValidating drops to false.
    expect(form.isValidating.value).toBe(false)
  })

  it('mixed validate and validateField calls keep isValidating true until all finish', async () => {
  // Separate promise controllers to control each validation run independently
  // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: rootPromise, resolve: resolveRoot } = Promise.withResolvers<void>()
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: fieldPromise, resolve: resolveField } = Promise.withResolvers<void>()

    let validationCount = 0

    // An inline schema that behaves differently on call 1 vs call 2
    const spySchema = {
      '~standard': {
        types: { input: {} as any, output: {} as any },
        async validate(value: any) {
          validationCount++

          if (validationCount === 1) {
            await rootPromise
          } else if (validationCount === 2) {
            await fieldPromise
          }

          return { value }
        },
        ...vendorVersion,
      },
    }

    // Mount form with the custom spy schema mapping
    const { form } = mountForm({
      initialValues: { name: 'Jane' },
      // @ts-expect-error-next-line type of spySchema differ from schema but still standard-schema compliant
      schema: spySchema,
    })

    // Fire root Validation.
    const rootValidate = form.validate()
    await flushPromises()

    // Root validation is still active, so isValidating is true
    expect(form.isValidating.value).toBe(true)

    // Fire field Validation.
    const fieldValidate = form.validateField('name')
    await flushPromises()

    // It's still true because both are currently active
    expect(form.isValidating.value).toBe(true)

    // Finish the root validation process
    resolveRoot()
    await flushPromises()

    // Even though the root validation finished, isValidating MUST stay true
    // because the field validation cycle is still running in the background.
    expect(form.isValidating.value).toBe(true)

    // Resolve the field validation cycle
    resolveField()
    await flushPromises()
    await Promise.all([rootValidate, fieldValidate])

    // Now that all validation requests have settled, isValidating drops to false.
    expect(form.isValidating.value).toBe(false)
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

    expect(form.isSubmitting.value).toBe(true)

    resolveSubmit()

    await flushPromises()

    expect(form.isSubmitting.value).toBe(false)
  })

  it('submit ignores the second call while the first is in progress', async () => {
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()

    const onSubmit = vi.fn(() => submitPromise)

    const { form, wrapper } = mountForm({ onSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    const formElement = wrapper.get('form')

    // Trigger the first submit
    await formElement.trigger('submit')
    await flushPromises()

    // Confirmed: First submission is busy and running
    expect(form.isSubmitting.value).toBe(true)
    expect(onSubmit).toHaveBeenCalledTimes(1)

    // Attempt a SECOND submit while the first is still running
    await formElement.trigger('submit')
    await flushPromises()

    // It should be ignored (no new submit call, isSubmitting unchanged)
    expect(form.isSubmitting.value).toBe(true)
    expect(onSubmit).toHaveBeenCalledTimes(1)

    // Cleanup: finish the first submission
    resolveSubmit()
    await flushPromises()

    // The form settles back to false, and final tally is still only 1 call
    expect(form.isSubmitting.value).toBe(false)
    // eslint-disable-next-line test/max-expects
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('submit bails out when a newer validation starts during its validation phase', async () => {
    const { form } = mountForm({
      initialValues: { name: 'Jane' },
      onSubmit,
    })

    // Start the submission process.
    // This internally kicks off the submission's validation phase.
    const submitPromise = form.submit(submitEvent)

    // MID-VALIDATION INTERRUPTION:
    // Before letting the event loop fully resolve, update the form value.
    // This forces the composable to kick off a brand new validation run.
    form.setValue('name', 'Jane Doe')

    // Flush all microtasks and await the submission lifecycle to completely settle
    await flushPromises()
    await submitPromise

    // Because a newer validation cut in line during the initial validation phase,
    // the original submission pipeline must bail out. 'onSubmit' should never be called.
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('resets isSubmitting even when onSubmit throws', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'))

    const form = useNotForm({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      onSubmit,
      schema,
    })

    await expect(form.submit(submitEvent)).rejects.toThrow('Network error')

    expect(form.isSubmitting.value).toBe(false)
  })

  it('submit resets isSubmitting when validation fails', async () => {
    const { form } = mountForm({
      initialValues: { email: '', name: '' },
      onSubmit,
    })

    // Trigger the submission process which immediately runs validation
    const submitPromise = form.submit(submitEvent)
    await flushPromises()

    // Await the full submission promise chain to resolve or reject early
    await submitPromise
    await flushPromises()

    // The submit handler must never run because the validation check blocked it
    expect(onSubmit).not.toHaveBeenCalled()

    // The form must safely reset its submitting status back to false after the failure
    expect(form.isSubmitting.value).toBe(false)

    // Ensure the validation errors are still present
    expect(form.errors.length).toBeGreaterThan(0)
  })

  it('submit calls preventDefault on the event', async () => {
    const { form } = mountForm({
      initialValues: { email: '', name: '' },
      onSubmit,
    })

    await form.submit(submitEvent)
    await flushPromises()

    expect(submitEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('submit with no onSubmit handler still validates and completes', async () => {
    const { form } = mountForm({
      initialValues: { email: '', name: '' },
    })

    // Resolves without throwing
    await expect(form.submit(submitEvent)).resolves.not.toThrow()

    await flushPromises()

    // Ensure that the submission state settles back to false upon completion
    expect(form.isSubmitting.value).toBe(false)
  })

  it('ignores new submissions while the guard is active even with concurrent validate calls', async () => {
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()

    const onSubmit = vi.fn(() => submitPromise)

    const { form } = mountForm({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      onSubmit,
    })

    // Trigger the first submit to lock the form
    const firstSubmitResult = form.submit(submitEvent)
    await flushPromises()

    // First submission is active and the mock handler has been called once
    expect(form.isSubmitting.value).toBe(true)
    expect(onSubmit).toHaveBeenCalledTimes(1)

    // Execute an independent validation check mid-flight
    await form.validate()
    await flushPromises()

    // Attempt a SECOND submit while the first submission is still pending
    const secondSubmitResult = form.submit(submitEvent)
    await flushPromises()

    // The submission lock held firm! The second call was completely ignored
    expect(onSubmit).toHaveBeenCalledTimes(1)

    // Release the lock by resolving the original submission promise
    resolveSubmit()
    await flushPromises()

    // Ensure both pipeline results settle down
    await Promise.all([firstSubmitResult, secondSubmitResult])

    // The state returns to normal, and the final tally is still exactly 1 call
    expect(form.isSubmitting.value).toBe(false)
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

  it('reset clears touched and dirty fields', async () => {
    const { form } = mountForm()

    form.touchField('name')
    form.dirtyField('email')

    form.reset()

    expect(form.touchedFields.size).toBe(0)
    expect(form.dirtyFields.size).toBe(0)
    expect(form.isTouched.value).toBe(false)
    expect(form.isDirty.value).toBe(false)
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

    expect(form.values).toStrictEqual({ name: 'Jane' })

    form.setValue('name', 'John')

    form.reset()

    expect(form.values).toStrictEqual({ name: 'Jane' })
  })
})
