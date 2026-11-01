import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { object, string } from '../../schemas'
import { mountForm } from '../helpers/mount-form'

const schema = object({
  email: string(5),
  name: string(2),
})

const defaultTemplate = `
  <Form :form>
    <Field :field="form.field('name')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
      <FieldError :errors="field" />
    </Field>
  </Form>
`

const errorsArrayTemplate = `
  <Form :form>
    <Field :field="form.field('name')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
      <FieldError :errors="field.errors" />
    </Field>
  </Form>
`

const multiTemplate = `
  <Form :form>
    <Field :field="form.field('name')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
      <FieldError :errors="field" />
    </Field>

    <Field :field="form.field('email')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
      <FieldError :errors="field" />
    </Field>
  </Form>
`

const pTagTemplate = `
  <Form :form>
    <Field :field="form.field('name')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
      <FieldError :errors="field" as="p" />
    </Field>
  </Form>
`

const customRenderTemplate = `
  <Form :form>
    <Field :field="form.field('name')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
      <FieldError :errors="field" v-slot="{ message }" as="div">
        <p id="custom">{{ message }}</p>
      </FieldError>
    </Field>
  </Form>
`

function useMountedForm(...args: Partial<Parameters<typeof mountForm>>) {
  const [config = { schema }, template = defaultTemplate, setup = {}] = args

  const form = mountForm(config, template, setup)

  return form
}

describe('rendering', () => {
  it('renders nothing when the field has no error', () => {
    const { wrapper } = useMountedForm()

    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('renders the error message after blur on an invalid field', async () => {
    const { wrapper } = useMountedForm()

    await wrapper.find('#name').setValue('H')
    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Must be at least 2 characters')
  })

  it('accepts and resolves bare errors array', async () => {
    const { wrapper } = useMountedForm(undefined, errorsArrayTemplate)

    await wrapper.find('#name').setValue('H')
    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Must be at least 2 characters')
  })

  it('clears the message after the field becomes valid', async () => {
    const { wrapper } = useMountedForm()

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)

    await wrapper.find('#name').setValue('Jane')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('shows errors independently across multiple fields', async () => {
    const { wrapper } = useMountedForm(undefined, multiTemplate)

    await wrapper.find('#name').setValue('H')
    await wrapper.find('#name').trigger('blur')

    await wrapper.find('#email').setValue('H')
    await wrapper.find('#email').trigger('blur')
    await flushPromises()

    expect(wrapper.findAll('span')).toHaveLength(2)
    expect(wrapper.findAll('span')[0].text()).toBe('Must be at least 2 characters')
    expect(wrapper.findAll('span')[1].text()).toBe('Must be at least 5 characters')
  })

  it('renders as span by default', async () => {
    const { wrapper } = useMountedForm()

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders as the specified element', async () => {
    const { wrapper } = useMountedForm(undefined, pTagTemplate)

    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('exposes message via the default slot for custom rendering', async () => {
    const { wrapper } = useMountedForm(undefined, customRenderTemplate)

    await wrapper.find('#name').setValue('H')
    await wrapper.find('#name').trigger('blur')
    await flushPromises()

    expect(wrapper.find('#custom').text()).toBe('Must be at least 2 characters')
  })
})
