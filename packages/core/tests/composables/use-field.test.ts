import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FieldProps } from '../../src/types/field'
import type { nameEmailSchema } from '../helpers/not-validator'
import { useField } from '../../src/composables/use-field'
import { createNameEmailForm } from '../helpers/create-form'
import { withSetup } from '../helpers/with-setup'

/**
 * Creates a name field inside a headless component so lifecycle hooks run.
 * Explicitly disables blur/change so trigger tests isolate one event.
 * @param overrides Field props merged over the test defaults.
 * @returns The form instance and the field's slot state.
 */
function setupNameField(overrides?: Partial<FieldProps<typeof nameEmailSchema>>) {
  const form = createNameEmailForm()

  const { result: field } = withSetup(() => useField({
    form,
    path: 'name',
    validateOn: { onBlur: false, onChange: false },
    validationMode: 'eager',
    ...overrides,
  }))

  return { field, form }
}

describe('onBlur', () => {
  it('validates on blur when enabled', async () => {
    const { field, form } = setupNameField({ validateOn: { onBlur: true } })

    field.events.onBlur()
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it('does not validate on blur when disabled', async () => {
    const { field, form } = setupNameField()

    field.events.onBlur()
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })
})

describe('onMount', () => {
  it('validates on mount when enabled', async () => {
    const { form } = setupNameField({ validateOn: { onMount: true } })

    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it('does not validate on mount when disabled', async () => {
    const { form } = setupNameField()

    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })
})

describe.each(['onInput', 'onChange'] as const)('%s', trigger => {
  it(`performs the first validation when ${trigger} is enabled`, async () => {
    const { field, form } = setupNameField({
      validateOn: { onBlur: false, [trigger]: true },
    })

    field.events[trigger]()
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it(`does not validate when ${trigger} is disabled`, async () => {
    const { field, form } = setupNameField({
      validateOn: { onBlur: false, [trigger]: false },
    })

    field.events[trigger]()
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })
})

describe('lazy mode', () => {
  it.for(['onInput', 'onChange'] as const)(
    'does not validate %s in lazy mode',
    async trigger => {
      const { field, form } = setupNameField({
        validateOn: { onBlur: false, [trigger]: true },
        validationMode: 'lazy',
      })

      field.events[trigger]()
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(0)
    },
  )
})

describe('debounce', () => {
  const debounceMs = 50

  const debounceOverrides = {
    debounce: debounceMs,
    validateOn: { onBlur: true, onChange: false, onInput: true },
  }

  // eslint-disable-next-line test/no-hooks
  beforeEach(() => {
    vi.useFakeTimers()
  })

  // eslint-disable-next-line test/no-hooks
  afterEach(() => {
    vi.useRealTimers()
  })

  it('defers input-triggered validation until the debounce timer expires', async () => {
    const { field, form } = setupNameField(debounceOverrides)

    field.events.onBlur()
    await vi.advanceTimersByTimeAsync(0)

    form.setValue('name', 'ada')
    field.events.onInput()

    expect(form.getFieldErrors('name')).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(debounceMs + 10)

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('only runs the last validation when inputs arrive rapidly', async () => {
    const { field, form } = setupNameField(debounceOverrides)

    field.events.onBlur()
    await vi.advanceTimersByTimeAsync(0)

    for (const value of ['a', 'Ja', 'Jane']) {
      form.setValue('name', value)
      field.events.onInput()
    }

    expect(form.getFieldErrors('name')).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(debounceMs + 10)

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('keeps a pending input debounce when blur validation is disabled', async () => {
    const { field, form } = setupNameField({
      debounce: debounceMs,
      validateOn: { onBlur: false, onChange: false, onInput: true },
    })

    form.setValue('name', 'ada')
    field.events.onInput()
    field.events.onBlur()

    expect(form.getFieldErrors('name')).toHaveLength(0)

    await vi.advanceTimersByTimeAsync(debounceMs + 10)

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('validates immediately on blur, cancelling the pending debounce', async () => {
    const { field, form } = setupNameField(debounceOverrides)

    field.events.onBlur()
    await vi.advanceTimersByTimeAsync(0)

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    form.setValue('name', 'ada')
    field.events.onInput()
    form.setValue('name', '')
    field.events.onInput()
    field.events.onBlur()
    await vi.advanceTimersByTimeAsync(0)

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    await vi.advanceTimersByTimeAsync(debounceMs + 10)

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it('cancels the pending debounce timer on unmount', async () => {
    const form = createNameEmailForm()
    const { app, result: field } = withSetup(() => useField({
      form,
      path: 'name',
      ...debounceOverrides,
    }))

    field.events.onBlur()
    await vi.advanceTimersByTimeAsync(0)

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    form.setValue('name', 'ada')
    field.events.onInput()
    app.unmount()

    await vi.advanceTimersByTimeAsync(debounceMs + 10)

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })
})
