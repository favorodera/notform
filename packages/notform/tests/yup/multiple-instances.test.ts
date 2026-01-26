import { describe, expect, test } from 'vitest'
import { withSetup } from '../utils'
import { NotField, NotForm, NotMessage, useNotForm } from '../../src'
import * as yup from 'yup'

describe('Multiple form instances - Yup', () => {
  // define shared schema
  const schema = yup.object({
    field: yup.string().required(),
  })

  test('Maintains isolated states and validation', async () => {
    const { getByRole, formOne, formTwo } = withSetup(() => {
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

    const inputs = getByRole('textbox')
    const input1 = inputs.first()
    const input2 = inputs.last()


    // Verify forms do not have same id
    expect(formOne.id).not.toBe(formTwo.id)

    // verify initial separation
    await expect.element(input1).toHaveValue('value1')
    await expect.element(input2).toHaveValue('value2')

    // update first form
    await input1.fill('updated1')

    // verify second form is unaffected
    await expect.element(input1).toHaveValue('updated1')
    await expect.element(input2).toHaveValue('value2')
    expect(formOne.state.value.field).toBe('updated1')
    expect(formTwo.state.value.field).toBe('value2')

    // Make FormOne Invalid
    await input1.fill('')
    await expect.element(input1).toHaveValue('')

    // submit forms to trigger validation
    await getByRole('button', { name: 'Submit Form One' }).click()
    await getByRole('button', { name: 'Submit Form Two' }).click()

    // check results
    expect(formOne.isValid.value).toBeFalsy()
    expect(formTwo.isValid.value).toBeTruthy()

    // check messages
    expect(getByRole('alert', { name: 'field-message-one' })).not.toBeEmptyDOMElement()
    expect(getByRole('alert', { name: 'field-message-two' })).toBeEmptyDOMElement()
  })
})
