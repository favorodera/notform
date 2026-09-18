import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NotField, type NotFieldProps, NotForm, useNotForm } from '../../src'
import { object, string } from '../not-validator'

const schema = object({
  email: string(5, 100),
  name: string(2, 50),
})

/**
 * Every test in this file disables onBlur/onChange by default so each
 * describe block can enable exactly the trigger(s) it's testing, without
 * the other defaults firing and muddying the assertions.
 */
const baseFieldProps: Partial<NotFieldProps<typeof schema>> = {
  validateOn: {
    onBlur: false,
    onChange: false,
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
    <NotField :form="form" v-bind="fieldProps" path="name" v-slot="{ events }">
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
 * Mounts a form with a single `name` field, wiring `fieldProps` onto
 * `<NotField>` via `v-bind` so each test can override `validateOn`,
 * `validationMode`, or `debounce` without needing a new template.
 * @param fieldProps Overrides merged over {@linkcode baseFieldProps}.
 * @param template Template string to mount. Defaults to {@linkcode singleFieldTemplate}.
 * @returns The form instance and the mounted wrapper.
 */
function mountForm(fieldProps?: Partial<NotFieldProps<typeof schema>>, template?: string) {
  const form = useNotForm({ schema })

  const wrapper = mount({
    components: { NotField, NotForm },
    setup: () => ({
      fieldProps: { ...baseFieldProps, ...fieldProps },
      form,
    }),
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

// onInput and onChange gate revalidation identically in eager mode, so both
// triggers are exercised through the same two tests via `describe.for`.
describe.for(['onInput', 'onChange'] as const)('%s', (trigger) => {
  const triggerEvent = trigger.replace('on', '').toLowerCase()

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

    // Seed an error via blur first, so a would-be revalidation on the
    // disabled trigger has something to (incorrectly) clear if it fired.
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
  it.for(['onInput', 'onChange'] as const)(
    'does not revalidate %s in lazy mode even when errors exist',
    async (trigger) => {
      const triggerEvent = trigger.replace('on', '').toLowerCase()

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

describe('singleton', () => {
  it('works without a NotForm ancestor', async () => {
    const { form, wrapper } = mountForm(
      { validateOn: { onBlur: true } },
      singletonTemplate,
    )

    await wrapper.get('#name').trigger('blur')
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it(':form prop takes priority over NotForm ancestor', async () => {
    // Deliberately mismatched constraints: 'Jo' passes secondaryForm's
    // schema but would fail primaryForm's. This turns "which form actually
    // validated the field" into a visible content difference rather than
    // something only detectable via internal touch/dirty bookkeeping.
    const primaryForm = useNotForm({
      schema: object({ name: string(10, 50) }),
    })
    const secondaryForm = useNotForm({
      schema: object({ name: string(2, 50) }),
    })

    const wrapper = mount({
      components: { NotField, NotForm },
      setup: () => ({ primaryForm, secondaryForm }),
      template: priorityTemplate,
    })

    await wrapper.get('#name').setValue('Jo')
    await wrapper.get('#name').trigger('blur')
    await flushPromises()

    // Confirms the input, blur, and validation all landed on secondaryForm.
    expect(secondaryForm.values.name).toBe('Jo')
    expect(secondaryForm.getFieldErrors('name')).toHaveLength(0)

    // If :form priority were broken and NotField fell back to primaryForm,
    // this would show a validation error instead.
    expect(primaryForm.getFieldErrors('name')).toHaveLength(0)
    expect(primaryForm.values.name).not.toBe('Jo')
  })
})

describe('debounce', () => {
  const debounceMs = 50

  const debounceMountFieldProps = {
    debounce: debounceMs,
    validateOn: {
      onBlur: true,
      onChange: false,
      onInput: true,
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
    const { form, wrapper } = mountForm(debounceMountFieldProps)
    const input = wrapper.get('#name')

    // Blur first, creating an error state to observe clearing.
    await input.trigger('blur')
    await input.setValue('ada')

    // Debounce hasn't elapsed yet — the stale error must still be present.
    expect(form.getFieldErrors('name')).toHaveLength(1)

    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('only runs the last validation when inputs arrive rapidly', async () => {
    const { form, wrapper } = mountForm(debounceMountFieldProps)
    const input = wrapper.get('#name')

    await input.trigger('blur')

    // Multiple rapid inputs should each reset the same debounce timer,
    // not queue up multiple validation runs.
    await input.setValue('a')
    await input.setValue('Ja')
    await input.setValue('Jane')

    expect(form.getFieldErrors('name')).toHaveLength(1)

    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('validates immediately on blur, cancelling the pending debounce', async () => {
    const { form, wrapper } = mountForm(debounceMountFieldProps)
    const input = wrapper.get('#name')

    await input.trigger('blur')
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    // Type a VALID value — this schedules a debounce timer that would clear the error.
    await input.setValue('ada')

    // Immediately overwrite with an INVALID value and blur, which validates synchronously.
    await input.setValue('')
    await input.trigger('blur')
    await flushPromises()

    // Blur ran immediately against the invalid value, so the error remains.
    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    // If the stale 'ada' debounce wasn't cancelled by blur, it would have
    // fired after the fact and incorrectly cleared this error.
    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it('cancels the pending debounce timer on unmount', async () => {
    const { form, wrapper } = mountForm(debounceMountFieldProps)
    const input = wrapper.get('#name')

    await input.trigger('blur')
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    // Schedule a debounce timer, then destroy the component before it fires.
    await input.setValue('ada')
    wrapper.unmount()

    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    // If the timer weren't cleared on unmount, it would still fire here and
    // attempt to validate a field that no longer has a mounted component.
    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })
})
