import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import type { FormConfig } from '../../src'
import { object, string } from '../../schemas'
import { mountForm } from '../helpers/mount-form'

const schema = object({
  email: string(5),
  name: string(2),
})

const bareTemplate = `
  <div>
    <Field :field="form.field('name')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
    </Field>
  </div>
`

const stateTemplate = `
  <div>
    <Field :field="form.field('name')" v-slot="{ field }">
      <input :id="field.path" v-model="field.model" v-bind="field.events" />
      <span id="dirty">{{ field.isDirty }}</span>
      <span id="touched">{{ field.isTouched }}</span>
    </Field>
  </div>
`

const attrsTemplate = `
  <div>
    <Field :field="form.field('name')" data-hint="hello" v-slot="slotProps">
      <span id="probe">{{ slotProps['data-hint'] }}</span>
    </Field>
  </div>
`

const twinTemplate = `
  <div>
    <Field :field="form.field('name')" v-slot="{ field }">
      <input class="first" v-model="field.model" />
    </Field>
 
    <Field :field="form.field('name')" v-slot="{ field }">
      <input class="second" v-model="field.model" />
    </Field>
  </div>
`

function useMountedForm(...args: Partial<Parameters<typeof mountForm>>) {
  const [userConfig = {}, template = bareTemplate] = args

  const config = {
    schema,
    ...userConfig,
  } as FormConfig<typeof schema>

  const form = mountForm(config, template)
  return form
}

function valueOf(element: Element): string {
  return (element as HTMLInputElement).value
}

describe('rendering', () => {
  it('renders no markup of its own', () => {
    const { wrapper } = useMountedForm()
    const children = [...wrapper.element.children]

    expect(children).toHaveLength(1)
    expect(children.at(0)?.tagName).toBe('INPUT')
  })

  it('hands the field to the slot', () => {
    const { wrapper } = useMountedForm()

    expect(wrapper.get('input').attributes('id')).toBe('name')
  })

  it('forwards extra attributes to the slot as props', () => {
    const { wrapper } = useMountedForm(undefined, attrsTemplate)

    expect(wrapper.get('#probe').text()).toBe('hello')
  })
})

describe('two-way binding', () => {
  it('writes what the user types into form.values', async () => {
    const { form, wrapper } = useMountedForm({ initialValues: { name: 'Jane' } })

    await wrapper.get('#name').setValue('Janet')

    expect(form.values.name).toBe('Janet')
  })

  it('shows values written from outside', async () => {
    const { form, wrapper } = useMountedForm({ initialValues: { name: 'Jane' } })

    expect(valueOf(wrapper.get('#name').element)).toBe('Jane')

    form.setValue('name', 'Bob')
    await nextTick()

    expect(valueOf(wrapper.get('#name').element)).toBe('Bob')
  })

  it('keeps two components on the same path in sync, because the field is cached', async () => {
    const { wrapper } = useMountedForm({ initialValues: { name: 'Jane' } }, twinTemplate)

    await wrapper.get('.first').setValue('Typed in the first')

    expect(valueOf(wrapper.get('.second').element)).toBe('Typed in the first')
  })
})

describe('field state in the slot', () => {
  it('tracks dirty after typing', async () => {
    const { wrapper } = useMountedForm({ initialValues: { name: 'Jane' } }, stateTemplate)

    expect(wrapper.get('#dirty').text()).toBe('false')

    await wrapper.get('#name').setValue('Changed')

    expect(wrapper.get('#dirty').text()).toBe('true')

    await wrapper.get('#name').setValue('Jane')

    expect(wrapper.get('#dirty').text()).toBe('false')
  })

  it('tracks touched after blur', async () => {
    const { wrapper } = useMountedForm({ initialValues: { name: 'Jane' } }, stateTemplate)

    expect(wrapper.get('#touched').text()).toBe('false')

    await wrapper.get('#name').trigger('blur')

    expect(wrapper.get('#touched').text()).toBe('true')
  })
})
