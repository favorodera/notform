import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { FormConfig } from '../../src'
import { object, string } from '../../schemas'
import { mountForm } from '../helpers/mount-form'

const schema = object({
  email: string(5),
  name: string(2),
})

const defaultTemplate = `
  <Form :form>
    <button id="reset" type="reset">Reset</button>
  </Form>
`
const nonPropTemplate = '<Form :form="form" action="/submit" method="post" novalidate />'

const multiTemplate = `
  <Form :form>
    <Field :field="form.field('name')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
    </Field>

    <Field :field="form.field('email')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
    </Field>

    <button id="reset" type="reset">Reset</button>
  </Form>
`

const completeTemplate = `
  <Form :form>
    <Field :field="form.field('name')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
      <FieldError :errors="field" />
    </Field>
 
    <Field :field="form.field('email')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
      <FieldError :errors="field" />
    </Field>
 
    <button id="reset" type="reset">Reset</button>
    <button id="submit" type="submit">Submit</button>
  </Form>
`

function useMountedForm(...args: Partial<Parameters<typeof mountForm>>) {
  const [userConfig = {}, template = defaultTemplate] = args

  const config = {
    schema,
    ...userConfig,
  } as FormConfig<typeof schema>

  const form = mountForm(config, template)
  return form
}

describe('rendering', () => {
  it('renders a native <form> element', () => {
    const { wrapper } = useMountedForm()

    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('forwards non-prop attributes to the rendered <form>', () => {
    const { wrapper } = useMountedForm(undefined, nonPropTemplate)

    const formElement = wrapper.get('form')

    expect(formElement.attributes('action')).toBe('/submit')
    expect(formElement.attributes('method')).toBe('post')
    expect(formElement.attributes('novalidate')).toBe('')
  })
})

describe('reset', () => {
  it('always prevents the native reset, even with no @reset listener bound', () => {
    const { wrapper } = useMountedForm()

    const formElement = wrapper.get('form').element
    const resetEvent = new Event('reset', { cancelable: true })

    formElement.dispatchEvent(resetEvent)

    expect(resetEvent.defaultPrevented).toBe(true)
  })

  it('native reset does not overwrite values already restored by form.reset()', async () => {
    const { form, wrapper } = useMountedForm(
      { initialValues: { email: 'jane@example.com', name: 'Jane' } },
      multiTemplate,
    )

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
    const { form, wrapper } = useMountedForm({ onSubmit }, multiTemplate)

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
    const pendingOnSubmit = vi.fn(() => {
      return submitPromise
    })

    const { form, wrapper } = useMountedForm({ onSubmit: pendingOnSubmit }, multiTemplate)

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

describe('submit and reset through the DOM', () => {
  it('shows an error under every field after an invalid submit, even untouched ones', async () => {
    const { form, wrapper } = useMountedForm(undefined, completeTemplate)

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(form.isSubmitted).toBe(true)
    expect(wrapper.findAll('span')).toHaveLength(2)
  })

  it('clears errors, touched and submitted state when the reset button is used', async () => {
    const { form, wrapper } = useMountedForm(undefined, completeTemplate)

    await wrapper.get('form').trigger('submit')
    await flushPromises()
    await wrapper.get('#reset').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('span')).toHaveLength(0)
    expect(form.isSubmitted).toBe(false)
    expect(form.isTouched).toBe(false)
    expect(form.errors).toHaveLength(0)
  })

  it('submits a valid form without showing errors', async () => {
    const submitted: unknown[] = []

    const { wrapper } = useMountedForm({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      onSubmit: (data) => {
        submitted.push(data)
      },
    }, completeTemplate)

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(submitted).toStrictEqual([{ email: 'jane@example.com', name: 'Jane' }])
    expect(wrapper.findAll('span')).toHaveLength(0)
  })
})
