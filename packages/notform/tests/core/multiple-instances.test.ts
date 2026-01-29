import { describe, expect, test } from 'vitest'
import { withSetup } from '../utils'
import { NotField, NotForm, NotMessage, useNotForm } from '../../src'
import { notRules } from '../utils'

describe('Multiple form instances - Core', () => {
  const schema = notRules.object({
    field: notRules.string(1),
  })

  function setupForm() {
    const rendered = withSetup(() => {
      const formOne = useNotForm({
        schema,
        initialState: {
          field: 'value1',
        },
      })
      const formTwo = useNotForm({
        schema,
        initialState: {
          field: 'value2',
        },
      })
      return { formOne, formTwo }
    }).render(`
      <div>
        <NotForm :id="formOne.id" title="Form One" @submit.prevent="formOne.submit">
          <NotField name="field" v-slot="{ methods, name }">
            <label :for="name">
              Field
              <input 
                type="text" 
                v-model="formOne.state.value.field" 
                v-bind="methods" 
                :name="name" 
                :id="name"
              />
            </label>
            <NotMessage :name="name" v-slot="{ message }">
              <span role="alert" title="field-message-one">{{ message }}</span>
            </NotMessage>
          </NotField>
          <button type="submit">Submit Form One</button>
        </NotForm>
        <NotForm :id="formTwo.id" title="Form Two" @submit.prevent="formTwo.submit">
          <NotField name="field" v-slot="{ methods, name }">
            <label :for="name">
              Field
              <input 
                type="text" 
                v-model="formTwo.state.value.field" 
                v-bind="methods" 
                :name="name" 
                :id="name"
              />
            </label>
            <NotMessage :name="name" v-slot="{ message }">
              <span role="alert" title="field-message-two">{{ message }}</span>
            </NotMessage>
          </NotField>
          <button type="submit">Submit Form Two</button>
        </NotForm>
      </div>
    `, { NotForm, NotField, NotMessage })

    const inputs = rendered.getByRole('textbox')
    const input1 = inputs.first()
    const input2 = inputs.last()
    const formOne = rendered.formOne
    const formTwo = rendered.formTwo

    return {
      ...rendered,
      input1,
      input2,
      formOne,
      formTwo,
    }

  }

  test('Verify forms do not have same id', () => {
    const { formOne, formTwo } = setupForm()
    expect(formOne.id).not.toBe(formTwo.id)
  })

  test('verify initial separation', async () => {
    const { input1, input2 } = setupForm()

    await expect.element(input1).toHaveValue('value1')
    await expect.element(input2).toHaveValue('value2')
  })

  test('update first form and verify second form is unaffected', async () => {
    const { input1, input2, formOne, formTwo } = setupForm()

    await input1.fill('updated1')

    await expect.element(input1).toHaveValue('updated1')
    await expect.element(input2).toHaveValue('value2')
    expect(formOne.state.value.field).toBe('updated1')
    expect(formTwo.state.value.field).toBe('value2')
  })

  describe('Submission', () => {
  
    test('triggers validation on form submission', async () => {
      const { input1, formOne, formTwo, getByRole } = setupForm()
    
      await input1.fill('')
    
      await getByRole('button', { name: 'Submit Form One' }).click()
      await getByRole('button', { name: 'Submit Form Two' }).click()
    
      expect(formOne.isValid.value).toBeFalsy()
      expect(formTwo.isValid.value).toBeTruthy()
    })
  
    test('displays correct error messages after submission', async () => {
      const { input1, getByRole } = setupForm()
    
      await input1.fill('')
      await getByRole('button', { name: 'Submit Form One' }).click()
      await getByRole('button', { name: 'Submit Form Two' }).click()
    
      expect(getByRole('alert', { name: 'field-message-one' })).not.toBeEmptyDOMElement()
      expect(getByRole('alert', { name: 'field-message-two' })).toBeEmptyDOMElement()
    })
  })
})
