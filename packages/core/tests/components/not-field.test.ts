import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NotField, type NotFieldProps, NotForm, useNotForm } from '../../src'
import { nameEmailSchema, object, string } from '../helpers/not-validator'

const schema = nameEmailSchema

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
 * Mounts a NotForm with the given field props and template.
 * @param fieldProps Optional field props to apply to NotField.
 * @param template Optional template to render.
 * @returns Object containing the form and wrapper.
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

    expect(secondaryForm.values.name).toBe('Jo')
    expect(secondaryForm.getFieldErrors('name')).toHaveLength(0)
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

    await input.trigger('blur')
    await input.setValue('ada')

    expect(form.getFieldErrors('name')).toHaveLength(1)

    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    expect(form.getFieldErrors('name')).toHaveLength(0)
  })

  it('only runs the last validation when inputs arrive rapidly', async () => {
    const { form, wrapper } = mountForm(debounceMountFieldProps)
    const input = wrapper.get('#name')

    await input.trigger('blur')

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

    await input.setValue('ada')
    await input.setValue('')
    await input.trigger('blur')
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it('cancels the pending debounce timer on unmount', async () => {
    const { form, wrapper } = mountForm(debounceMountFieldProps)
    const input = wrapper.get('#name')

    await input.trigger('blur')
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)

    await input.setValue('ada')
    wrapper.unmount()

    vi.advanceTimersByTime(debounceMs + 10)
    await flushPromises()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })
})
