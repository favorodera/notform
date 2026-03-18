import { describe, expect, test } from 'vitest'
import { NotField, NotForm, NotMessage, useNotForm } from '../src'
import { notRules, withSetup } from './utils'

describe('Basic Form Test', () => {
  const schema = notRules.object({
    name: notRules.string(1),
    age: notRules.number(18),
  })

  function setupForm() {
    const rendered = withSetup(() => {
      const { state, getFieldErrors, id } = useNotForm({
        schema,
        initialState: {
          name: 'John',
          age: 15,
        },
        initialErrors: [
          {
            path: ['age'],
            message: 'Not up to 18',
          },
        ],
      })
      return { state, getFieldErrors, id }
    }).render(`
      <NotForm :id="id">
        <NotField name="name" v-slot="{ methods, name }">
          <label :for="name">
            Name
            <input type="text" v-model="state.name" v-bind="methods" :name="name" :id="name"/>
          </label>
        </NotField>
        <NotField name="age" v-slot="{ methods, name }">
          <label :for="name">
            Age
            <input type="number" v-model="state.age" v-bind="methods" :name="name" :id="name"/>
          </label>
          <NotMessage name="age" v-slot="{message}">
            <span role="alert" title="age-message">{{ message }}</span>
          </NotMessage>
        </NotField>
      </NotForm>
    `, { NotForm, NotField, NotMessage })


    const nameInput = rendered.getByRole('textbox', { name: 'name' })
    const ageInput = rendered.getByRole('spinbutton', { name: 'age' })
    const ageMessage = rendered.getByRole('alert', { name: 'age-message' })

    return {
      ...rendered,
      nameInput,
      ageInput,
      ageMessage,
    }
  }

  test('State', async () => {
    const { state, nameInput, ageInput } = setupForm()

    expect(state.value).toEqual({
      name: 'John',
      age: 15,
    })
    await expect.element(nameInput).toHaveValue('John')
    await expect.element(ageInput).toHaveValue(15)
  })

  test('Errors', async () => {
    const { getFieldErrors, ageMessage } = setupForm()

    expect(getFieldErrors('age')).toEqual([{
      path: ['age'],
      message: 'Not up to 18',
    }])
    await expect.element(ageMessage).toHaveTextContent('Not up to 18')
  })

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

  describe('Not Message Rendering', () => {
    const schema = notRules.object({
      name: notRules.string(20),
    })
  
    test('Renders as default span tag with extra attributes', async () => {
      const { getByRole, container } = withSetup(() => {
        const { state, id } = useNotForm({
          schema,
          initialState: { name: 'John' },
          initialErrors: [
            {
              path: ['name'],
              message: 'Name is too short',
            },
          ],
        })
        return { state, id }
      }).render(`
        <NotForm :id="id">
          <NotField name="name" v-slot="{ methods, name }">
            <input type="text" v-model="state.name" v-bind="methods" :name="name" />
            <NotMessage :name="name" class="color-red" role="alert" title="name-message-with-default-tag"  />
          </NotField>
        </NotForm>
      `, { NotForm, NotField, NotMessage })
      
      const messageWithDefaultTag = getByRole('alert', { name: 'name-message-with-default-tag' })
      const messageWithDefaultTagQuery = container.querySelector('[title="name-message-with-default-tag"]')
      
      expect(messageWithDefaultTagQuery?.tagName).toBe('SPAN')
      await expect.element(messageWithDefaultTag).toHaveClass('color-red')
    })
  
    test('Renders with custom tag when "as" prop is specified', async () => {
      const { getByRole, container } = withSetup(() => {
        const { state, id } = useNotForm({
          schema,
          initialState: { name: 'John' },
          initialErrors: [
            {
              path: ['name'],
              message: 'Name is too short',
            },
          ],
        })
        return { state, id }
      }).render(`
        <NotForm :id="id">
          <NotField name="name" v-slot="{ methods, name }">
            <input type="text" v-model="state.name" v-bind="methods" :name="name" />
            <NotMessage as="p" :name="name" class="color-blue" role="alert" title="name-message-with-p"  />
          </NotField>
        </NotForm>
      `, { NotForm, NotField, NotMessage })
      
      const messageWithPTag = getByRole('alert', { name: 'name-message-with-p' })
      const messageWithPTagQuery = container.querySelector('[title="name-message-with-p"]')
      
      expect(messageWithPTagQuery?.tagName).toBe('P')
      await expect.element(messageWithPTag).toHaveClass('color-blue')
    })
  
    test('Renders with different custom tags and preserves attributes', async () => {
      const { getByRole, container } = withSetup(() => {
        const { state, id } = useNotForm({
          schema,
          initialState: { name: 'John' },
          initialErrors: [
            {
              path: ['name'],
              message: 'Name is too short',
            },
          ],
        })
        return { state, id }
      }).render(`
        <NotForm :id="id">
          <NotField name="name" v-slot="{ methods, name }">
            <input type="text" v-model="state.name" v-bind="methods" :name="name" />
            <NotMessage :name="name" class="color-red" role="alert" title="name-message-span"  />
            <NotMessage as="div" :name="name" class="color-green" role="status" title="name-message-div"  />
          </NotField>
        </NotForm>
      `, { NotForm, NotField, NotMessage })
      
      const spanMessage = getByRole('alert', { name: 'name-message-span' })
      const spanQuery = container.querySelector('[title="name-message-span"]')
      const divMessage = getByRole('status', { name: 'name-message-div' })
      const divQuery = container.querySelector('[title="name-message-div"]')
      
      expect(spanQuery?.tagName).toBe('SPAN')
      await expect.element(spanMessage).toHaveClass('color-red')
      
      expect(divQuery?.tagName).toBe('DIV')
      await expect.element(divMessage).toHaveClass('color-green')
    })
  
    test('Default slot receives message and attributes', async () => {
      const { getByRole, container } = withSetup(() => {
        const { state, id } = useNotForm({
          schema,
          initialState: { name: 'John' },
          initialErrors: [
            {
              path: ['name'],
              message: 'Name is too short',
            },
          ],
        })
        return { state, id }
      }).render(`
        <NotForm :id="id">
          <NotField name="name" v-slot="{ methods, name }">
            <input type="text" v-model="state.name" v-bind="methods" :name="name" />
            <NotMessage :name="name" v-slot="{ message, attributes }">
              <span v-bind="attributes" class="custom-error" role="alert" title="custom-message">
                {{ message }}
              </span>
            </NotMessage>
          </NotField>
        </NotForm>
      `, { NotForm, NotField, NotMessage })
      
      const customMessage = getByRole('alert', { name: 'custom-message' })
      const customMessageQuery = container.querySelector('[title="custom-message"]')
      
      expect(customMessageQuery?.tagName).toBe('SPAN')
      await expect.element(customMessage).toHaveClass('custom-error')
      await expect.element(customMessage).toHaveTextContent('Name is too short')
    })
  })
})
