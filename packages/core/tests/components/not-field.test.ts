import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NotField, type NotFieldProps, NotForm, useNotForm, type UseNotFormConfig } from '../../src'
import { object, string } from '../test-utils/not-validator'

const schema = object({
  email: string(5, 100),
  name: string(2, 50),
})

const baseConfig: UseNotFormConfig<typeof schema> = {
  schema,
  validateOn: {
    onBlur: false,
    onChange: false,
    onInput: false,
  },
}

const singleFieldTemplate = `
  <NotForm :form="form" @submit="form.submit">
    <NotField path="name" v-bind="fieldProps" v-slot="{ events }">
      <input id="name" v-model="form.values.name" v-bind="events" />
    </NotField>
  </NotForm>
`

const singletonTemplate = `
  <div>
    <NotField :form="form" path="name" v-slot="{ events }">
      <input id="name" v-model="form.values.name" v-bind="events" />
    </NotField>
  </div>
`

const priorityTemplate = `
  <NotForm :form="primaryForm" @submit="primaryForm.submit">
    <NotField :form="secondaryForm" path="name" v-slot="{ events }">
      <input id="name" v-model="secondaryForm.values.name" v-bind="events" />
    </NotField>
  </NotForm>
`

/**
 * Mounts a form with a `name` field and its input.
 *
 * The template and components can be overridden to cover multi-field,
 * custom rendering, and singleton (no NotForm ancestor) scenarios.
 * @param formConfig Form configuration.
 * @param fieldProps Field props.
 * @param template Template string for the form.
 * @returns An object containing the form instance and the wrapper.
 */
function mountForm(formConfig?: Partial<UseNotFormConfig<typeof schema>>, fieldProps?: Partial<NotFieldProps>, template?: string) {
  const form = useNotForm({ ...baseConfig, ...formConfig })

  const wrapper = mount({
    components: { NotField, NotForm },
    setup: () => ({ fieldProps, form }),
    template: template ?? singleFieldTemplate,
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

describe('onMount', () => {
  it('validates on mount when onMount is enabled', async () => {
    const { form } = mountForm({ validateOn: { onMount: true } })

    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it('does not validate on mount when onMount is disabled', async () => {
    const { form } = mountForm()

    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })
})

// onInput and onChange gate revalidation identically in eager mode
describe.for(['onInput', 'onChange'])('%s', (trigger) => {
  const triggerEvent = trigger.replace('on', '').toLocaleLowerCase()

  it(`validates on ${trigger} when ${trigger} is enabled`, async () => {
    const { form, wrapper } = mountForm({
      validateOn: { onBlur: true, [trigger]: true },
    })

    await wrapper.get('#name').trigger(triggerEvent)
    await wrapper.get('#name').trigger('blur')
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it(`does not validate on ${trigger} when ${trigger} is disabled`, async () => {
    const { form, wrapper } = mountForm({
      validateOn: { onBlur: true, [trigger]: false },
    })

    await wrapper.get('#name').trigger('blur')
    await flushPromises()

    const errorsBefore = form.getFieldErrors('name').length

    expect(errorsBefore).toBeGreaterThan(0)

    await wrapper.get('#name').trigger(triggerEvent)
    await wrapper.get('#name').trigger('blur')
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(errorsBefore)
  })
})

describe('lazy mode', () => {
  it.for(['onInput', 'onChange'])(
    'does not revalidate %s in lazy mode even when errors exist',
    async (trigger) => {
      const triggerEvent = trigger.replace('on', '').toLocaleLowerCase()

      const { form, wrapper } = mountForm({
        validateOn: { onBlur: true, [trigger]: false },
        validationMode: 'lazy',
      })

      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      const errorsBefore = form.getFieldErrors('name').length

      expect(errorsBefore).toBeGreaterThan(0)

      await wrapper.get('#name').trigger(triggerEvent)
      await wrapper.get('#name').trigger('blur')
      await flushPromises()

      expect(form.getFieldErrors('name')).toHaveLength(errorsBefore)
    },
  )
})

describe('per-field validateOn override', () => {
  it('enables a trigger disabled at form level', async () => {
    const { form, wrapper } = mountForm({ validateOn: { onBlur: true } })

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
    const form = useNotForm({
      ...baseConfig,
      validateOn: { onBlur: true },
    })

    const wrapper = mount({
      components: { NotField },
      setup: () => ({ form }),
      template: singletonTemplate,
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
      template: priorityTemplate,
    })

    await wrapper.get('#name').trigger('blur')
    await flushPromises()

    expect(secondaryForm.touchedFields.has('name')).toBe(true)
    expect(primaryForm.touchedFields.has('name')).toBe(false)
  })
})

describe('debounce', () => {
  const debounceMs = 50

  const debounceMountFormArgs = {
    fieldProps: { debounce: debounceMs },
    formConfig: {
      validateOn: {
        onBlur: true,
        onChange: false,
        onInput: true,
      },
    },
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
    const { form, wrapper } = mountForm(debounceMountFormArgs.formConfig, debounceMountFormArgs.fieldProps)

    const input = wrapper.get('#name')

    // Trigger blur first — this creates an error state
    await input.trigger('blur')

    // Set the value of the input
    await input.setValue('ada')

    // The error should still be present because the debounce timer has not expired
    expect(form.getFieldErrors('name')).toHaveLength(1)

    // Fast-forward time instantly past the 50ms debounce threshold
    vi.advanceTimersByTime(debounceMs + 10)

    await flushPromises()

    // The error should be gone because the debounce timer has expired
    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('only runs the last validation when inputs arrive rapidly', async () => {
    const { form, wrapper } = mountForm(debounceMountFormArgs.formConfig, debounceMountFormArgs.fieldProps)

    const input = wrapper.get('#name')

    // Trigger blur first — this creates an error state
    await input.trigger('blur')

    // Set the value of the input multiple times
    await input.setValue('a')
    await input.setValue('Ja')
    await input.setValue('Jane')

    // The error should still be present because the debounce timer has not expired
    expect(form.getFieldErrors('name')).toHaveLength(1)

    // Fast-forward time instantly past the 50ms debounce threshold
    vi.advanceTimersByTime(debounceMs + 10)

    await flushPromises()

    // The error should be gone because the debounce timer has expired
    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('validates immediately on blur, cancelling the pending debounce', async () => {
    const { form, wrapper } = mountForm(debounceMountFormArgs.formConfig, debounceMountFormArgs.fieldProps)

    const input = wrapper.get('#name')

    // Force an error state via blur
    await input.trigger('blur')
    await flushPromises()

    // Confirmed: we have an error
    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    // Type a VALID value. This schedules a debounce timer to REMOVE the error.
    await input.setValue('ada')

    // Immediately change the input back to an INVALID value and BLUR.
    // This blur executes immediately, evaluating the invalid value.
    await input.setValue('')
    await input.trigger('blur')
    await flushPromises()

    // Blur happened instantly. The field is still invalid, so the error remains.
    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    // Fast-forward past the original 50ms debounce threshold
    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    // If cancellation works, the old 'ada' debounce was destroyed.
    // The error must STILL be present.
    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it('cancels the pending debounce timer on unmount', async () => {
    const { form, wrapper } = mountForm(debounceMountFormArgs.formConfig, debounceMountFormArgs.fieldProps)

    const input = wrapper.get('#name')

    // Force an error state via blur
    await input.trigger('blur')
    await flushPromises()

    // Confirmed: we have an error
    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    // Type a VALID value. This schedules a debounce timer to REMOVE the error.
    await input.setValue('ada')

    //  Destroy/Unmount the component immediately before the timer finishes
    wrapper.unmount()

    // Fast-forward past the original 50ms debounce threshold
    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    // The error must still be present after the debounce timer expires.
    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })
})
