import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { NotFieldProps } from '../../src/types/not-field'
import type { nameEmailSchema } from '../helpers/not-validator'
import { useNotField } from '../../src/composables/use-not-field'
import { createNameEmailForm } from '../helpers/create-form'
import { withSetup } from '../helpers/with-setup'

/**
 * Sets up a `name` field via `useNotField`, inside a real (but headless)
 * component instance so `onMounted`/`onUnmounted` behave correctly — see
 * {@link withSetup}. `overrides.validateOn`, if given, fully replaces the
 * base `{ onBlur: false, onChange: false }` rather than merging into it
 * (a plain object spread, matching how `useNotField` itself treats its
 * `validateOn` prop as a single value, not deep-merged per key by callers).
 * @param overrides Extra `useNotField` props merged over the base config.
 * @returns The form instance and the field's slot state.
 */
function setupNameField(overrides?: Partial<NotFieldProps<typeof nameEmailSchema>>) {
  const form = createNameEmailForm()

  const { result: field } = withSetup(() => useNotField({
    form,
    path: 'name',
    validateOn: { onBlur: false, onChange: false },
    ...overrides,
  }))

  return { field, form }
}

describe('onBlur', () => {
  it('validates on blur when onBlur is enabled', async () => {
    const { field, form } = setupNameField({ validateOn: { onBlur: true } })

    field.events.onBlur()
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it('does not validate on blur when onBlur is disabled', async () => {
    const { field, form } = setupNameField()

    field.events.onBlur()
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })
})

describe('onMount', () => {
  it('validates on mount when onMount is enabled', async () => {
    const { form } = setupNameField({ validateOn: { onMount: true } })

    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it('does not validate on mount when onMount is disabled', async () => {
    const { form } = setupNameField()

    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })
})

describe.for(['onInput', 'onChange'] as const)('%s', (trigger) => {
  it(`validates on ${trigger} when ${trigger} is enabled`, async () => {
    const { field, form } = setupNameField({
      validateOn: { onBlur: true, [trigger]: true },
    })

    field.events[trigger]()
    field.events.onBlur()
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it(`does not validate on ${trigger} when ${trigger} is disabled`, async () => {
    const { field, form } = setupNameField({
      validateOn: { onBlur: true, [trigger]: false },
    })

    field.events.onBlur()
    await flushPromises()

    const errorsBefore = form.getFieldErrors('name').length

    expect(errorsBefore).toBeGreaterThan(0)

    field.events[trigger]()
    field.events.onBlur()
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(errorsBefore)
  })
})

describe('lazy mode', () => {
  it.for(['onInput', 'onChange'] as const)(
    'does not revalidate %s in lazy mode even when errors exist',
    async (trigger) => {
      const { field, form } = setupNameField({
        validateOn: { onBlur: true, [trigger]: false },
        validationMode: 'lazy',
      })

      field.events.onBlur()
      await flushPromises()

      const errorsBefore = form.getFieldErrors('name').length

      expect(errorsBefore).toBeGreaterThan(0)

      field.events[trigger]()
      field.events.onBlur()
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(errorsBefore)
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
    await flushPromises()

    form.setValue('name', 'ada')
    field.events.onInput()

    expect(form.getFieldErrors('name')).toHaveLength(1)

    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('only runs the last validation when inputs arrive rapidly', async () => {
    const { field, form } = setupNameField(debounceOverrides)

    field.events.onBlur()
    await flushPromises()

    for (const value of ['a', 'Ja', 'Jane']) {
      form.setValue('name', value)
      field.events.onInput()
    }

    expect(form.getFieldErrors('name')).toHaveLength(1)

    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('validates immediately on blur, cancelling the pending debounce', async () => {
    const { field, form } = setupNameField(debounceOverrides)

    field.events.onBlur()
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    form.setValue('name', 'ada')
    field.events.onInput()
    form.setValue('name', '')
    field.events.onInput()
    field.events.onBlur()
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it('cancels the pending debounce timer on unmount', async () => {
    const form = createNameEmailForm()
    const { app, result: field } = withSetup(() => useNotField({
      form,
      path: 'name',
      ...debounceOverrides,
    }))

    field.events.onBlur()
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    form.setValue('name', 'ada')
    field.events.onInput()
    app.unmount()

    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })
})
