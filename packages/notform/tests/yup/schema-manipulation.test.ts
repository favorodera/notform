import { describe, expect, test } from 'vitest'
import { withSetup } from '../utils'
import { Field, Form, Message, useForm } from '../../src'
import * as yup from 'yup'
import { ref } from 'vue'

describe('Schema Manipulation - Yup', () => {

  test('Handles refinements', async () => {
    const { isValid, getByRole } = withSetup(() => {
      const schema = yup.object({
        password: yup.string(),
        confirm: yup.string(),
      }).test('passwords-match', "Passwords don't match", function (value) {
        if (value.password !== value.confirm) {
          return this.createError({ path: 'confirm', message: "Passwords don't match" })
        }
        return true
      })

      const { state, id, submit, isValid } = useForm({
        schema,
        initialState: {
          password: 'abc',
          confirm: 'def',
        },
      })

      return { state, id, submit, isValid }
    }).render(`
      
      <Form :id="id" @submit.prevent="submit">
        <Field name="password" v-slot="{ methods, name }">
          <label :for="name">
            Password
            <input type="text" v-model="state.password" v-bind="methods" :name="name" :id="name"/>
          </label>
          <Message name="password" v-slot="{message}">
            <span role="alert" title="password-message">{{ message }}</span>
          </Message>
        </Field>

        <Field name="confirm" v-slot="{ methods, name }">
          <label :for="name">
            Confirm
            <input type="text" v-model="state.confirm" v-bind="methods" :name="name" :id="name"/>
          </label>
          <Message name="confirm" v-slot="{message}">
            <span role="alert" title="confirm-message">{{ message }}</span>
          </Message>
        </Field>

        <button type="submit">Submit</button>
      </Form>
    `, { Form, Field, Message })

    const confirmInput = getByRole('textbox', { name: 'confirm' })
    const submitButton = getByRole('button', { name: 'Submit' })
    const confirmMessage = getByRole('alert', { name: 'confirm-message' })
    const passwordMessage = getByRole('alert', { name: 'password-message' })


    // Should fail validation
    await submitButton.click()

    await expect.element(passwordMessage).toBeEmptyDOMElement()
    await expect.element(confirmMessage).toHaveTextContent('Passwords don\'t match')
    expect(isValid.value).toBe(false)

    // Make valid
    await confirmInput.fill('abc')
    await submitButton.click()

    await expect.element(passwordMessage).toBeEmptyDOMElement()
    await expect.element(confirmMessage).toBeEmptyDOMElement()
    expect(isValid.value).toBeTruthy()

  })

  test('Supports dynamic schema updates', async () => {
    const { isValid, schemaTwo, activeSchema, getByRole } = withSetup(() => {
      const schemaOne = yup.object({
        amount: yup.number().max(10),
      })

      const schemaTwo = yup.object({
        amount: yup.number().max(20),
      })

      const activeSchema = ref(schemaOne)

      const { state, id, submit, isValid } = useForm({
        schema: activeSchema,
        initialState: {
          amount: 15,
        },
      })

      return { state, id, submit, isValid, schemaOne, schemaTwo, activeSchema }
    }).render(`
    
    <Form :id="id" @submit.prevent="submit">
      <Field name="amount" v-slot="{ methods, name }">
        <label :for="name">
          Amount
          <input type="text" v-model="state.amount" v-bind="methods" :name="name" :id="name"/>
        </label>
        <Message name="amount" v-slot="{message}">
          <span role="alert" title="amount-message">{{ message }}</span>
        </Message>
      </Field>

      <button type="submit">Submit</button>
    </Form>
  `, { Form, Field, Message })

    const submitButton = getByRole('button', { name: 'Submit' })
    const amountMessage = getByRole('alert', { name: 'amount-message' })

    // Fails on SchemaOne(Max 10)
    await submitButton.click()

    await expect.element(amountMessage).not.toBeEmptyDOMElement()
    expect(isValid.value).toBe(false)

    // Switch to SchemaTwo(Max 20)
    activeSchema.value = schemaTwo

    // Should pass
    await submitButton.click()
    await expect.element(amountMessage).toBeEmptyDOMElement()
    expect(isValid.value).toBeTruthy()

  })

})
