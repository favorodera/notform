/* eslint-disable test/max-expects, ts/no-invalid-void-type */
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { NotForm } from '../../src'
import { createNameEmailForm } from '../helpers/create-form'
import { mountNameEmailForm } from '../helpers/mount-form'

describe('rendering', () => {
  it('renders a native <form> element', () => {
    const form = createNameEmailForm()

    const wrapper = mount({
      components: { NotForm },
      setup: () => ({ form }),
      template: `<NotForm :form="form" />`,
    })

    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('forwards non-prop attributes to the rendered <form>', () => {
    const form = createNameEmailForm()

    const wrapper = mount({
      components: { NotForm },
      setup: () => ({ form }),
      template: `<NotForm :form="form" action="/submit" method="post" novalidate />`,
    })

    const formElement = wrapper.get('form')

    expect(formElement.attributes('action')).toBe('/submit')
    expect(formElement.attributes('method')).toBe('post')
    expect(formElement.attributes('novalidate')).toBe('')
  })
})

describe('context', () => {
  it('provides the form instance to descendant NotField components without an explicit :form prop', async () => {
    const { form, wrapper } = mountNameEmailForm()

    await wrapper.get('#name').setValue('Jane')

    expect(form.values.name).toBe('Jane')
  })
})

describe('reset', () => {
  it('always prevents the native reset, even with no @reset listener bound', () => {
    const form = createNameEmailForm()

    const wrapper = mount({
      components: { NotForm },
      setup: () => ({ form }),
      template: `
        <NotForm :form="form">
          <button id="reset" type="reset">Reset</button>
        </NotForm>
      `,
    })

    const formElement = wrapper.get('form').element
    const resetEvent = new Event('reset', { cancelable: true })

    formElement.dispatchEvent(resetEvent)

    expect(resetEvent.defaultPrevented).toBe(true)
  })

  it('native reset does not overwrite values already restored by form.reset()', async () => {
    const { form, wrapper } = mountNameEmailForm({
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
    expect(form.values.email).toBe('jane@example.com')
    expect(nameInputElement.value).toBe('Jane')
    expect(emailInputElement.value).toBe('jane@example.com')
  })
})

describe('submit', () => {
  it('wires a native submit event through to the bound handler and prevents default navigation', async () => {
    const onSubmit = vi.fn()
    const { form, wrapper } = mountNameEmailForm({ onSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    const formElement = wrapper.get('form').element
    const submitEvent = new Event('submit', { cancelable: true })

    formElement.dispatchEvent(submitEvent)

    expect(submitEvent.defaultPrevented).toBe(true)

    await flushPromises()

    expect(onSubmit).toHaveBeenCalledWith({ email: 'jane@example.com', name: 'Jane' })
  })

  it('ignores a second native submit while the first is still in flight', async () => {
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()
    const pendingOnSubmit = vi.fn(() => submitPromise)

    const { form, wrapper } = mountNameEmailForm({ onSubmit: pendingOnSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    const formElement = wrapper.get('form').element

    formElement.dispatchEvent(new Event('submit', { cancelable: true }))
    await flushPromises()

    expect(form.isSubmitting).toBe(true)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)

    formElement.dispatchEvent(new Event('submit', { cancelable: true }))
    await flushPromises()

    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)

    resolveSubmit()
    await flushPromises()

    expect(form.isSubmitting).toBe(false)
  })
})
