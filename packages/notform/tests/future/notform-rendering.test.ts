import { describe, expect, test } from 'vitest'
import { NotField, NotForm, useNotForm } from '../../src'
import { notRules, withSetup } from '../utils'

describe('NotForm rendering modes', () => {

  const schema = notRules.object({
    name: notRules.string(1),
  })

  test('Renders as default form tag', async () => {
    const { container, id } = withSetup(() => {
      const { state, id } = useNotForm({
        schema,
        initialState: { name: 'John' },
      })
      return { state, id }
    }).render(`
      <NotForm :id="id">
        <NotField name="name" v-slot="{ methods, name }">
          <input type="text" v-model="state.name" v-bind="methods" :name="name" />
        </NotField>
      </NotForm>
    `, { NotForm, NotField })

    const form = container.querySelector(`#${id}  `)
    expect(form).toBeInTheDocument()
    expect(form?.tagName).toBe('FORM')
  })

  test('Renders as custom tag using "as" prop', async () => {
    const { container, id } = withSetup(() => {
      const { state, id } = useNotForm({
        schema,
        initialState: { name: 'John' },
      })
      return { state, id }
    }).render(`
      <NotForm :id="id" as="div" data-testid="custom-form">
        <NotField name="name" v-slot="{ methods, name }">
          <input type="text" v-model="state.name" v-bind="methods" :name="name" />
        </NotField>
      </NotForm>
    `, { NotForm, NotField })

    const form = container.querySelector(`#${id}`)
    expect(form).toBeInTheDocument()
    expect(form?.tagName).toBe('DIV')
  })

  test('Renders as child (renderless) using asChild prop', async () => {
    const { container, id } = withSetup(() => {
      const { state, id } = useNotForm({
        schema,
        initialState: { name: 'John' },
      })
      return { state, id }
    }).render(`
      <NotForm :id="id" :asChild="true" v-slot="{ attributes }">
        <form v-bind="attributes" data-testid="custom-wrapper">
          <NotField name="name" v-slot="{ methods, name }">
            <input type="text" v-model="state.name" v-bind="methods" :name="name" />
          </NotField>
        </form>
      </NotForm>
    `, { NotForm, NotField })

    const form = container.querySelector(`#${id}`)
    expect(form).toBeInTheDocument()
    // Should render the custom form directly, not wrapped by NotForm
    expect(form).toHaveAttribute('data-testid', 'custom-wrapper')
    // Verify the child bears the binding of the form
    expect(form).toHaveAttribute('id', id)
  })

  test('Maintains isolated contexts with multiple renderless instances', async () => {
    const { getByRole, getByTitle, formOne, formTwo } = withSetup(() => {
      const formOne = useNotForm({
        schema,
        initialState: { name: 'Alice' },
      })
      const formTwo = useNotForm({
        schema,
        initialState: { name: 'Bob' },
      })
      return { formOne, formTwo }
    }).render(`
    <div>
      <NotForm :id="formOne.id" :asChild="true" v-slot="{ attributes }">
        <form v-bind="attributes" title="Form One">
          <NotField name="name" v-slot="{ methods, name }">
            <input 
              type="text" 
              v-model="formOne.state.value.name" 
              v-bind="methods" 
              :name="name" 
            />
          </NotField>
        </form>
      </NotForm>

      <NotForm :id="formTwo.id" :asChild="true" v-slot="{ attributes }">
        <form v-bind="attributes" title="Form Two">
          <NotField name="name" v-slot="{ methods, name }">
            <input 
              type="text" 
              v-model="formTwo.state.value.name" 
              v-bind="methods" 
              :name="name" 
            />
          </NotField>
        </form>
      </NotForm>
    </div>
  `, { NotForm, NotField })

    const inputs = getByRole('textbox')
    const input1 = inputs.first()
    const input2 = inputs.last()

    const formOneElement = getByTitle('Form One')
    const formTwoElement = getByTitle('Form Two')

    // Verify forms have different IDs
    expect(formOne.id).not.toBe(formTwo.id)

    // Verify the children bear the binding of the form
    await expect.element(formOneElement).toHaveAttribute('id', formOne.id)
    await expect.element(formTwoElement).toHaveAttribute('id', formTwo.id)

    // Verify initial states are isolated
    await expect.element(input1).toHaveValue('Alice')
    await expect.element(input2).toHaveValue('Bob')

    // Update first form
    await input1.fill('Alice Updated')

    // Verify second form remains unaffected
    await expect.element(input1).toHaveValue('Alice Updated')
    await expect.element(input2).toHaveValue('Bob')
    expect(formOne.state.value.name).toBe('Alice Updated')
    expect(formTwo.state.value.name).toBe('Bob')
  })

})
