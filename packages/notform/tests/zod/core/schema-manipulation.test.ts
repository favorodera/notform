import { describe, expect, test } from 'vitest'
import { withSetup } from '../../utils'
import { NotField, NotForm, NotMessage, useNotForm } from '../../../src'
import { z } from 'zod'
import { ref } from 'vue'

describe('Schema Manipulation - Zod', () => {

  test('Handles refinements', async () => {
    const { isValid, getByRole } = withSetup(() => {
      const schema = z.object({
        password: z.string(),
        confirm: z.string(),
      }).refine(data => data.password === data.confirm, {
        message: "Passwords don't match",
        path: ['confirm'],
      })

      const { state, id, submit, isValid } = useNotForm({
        schema,
        initialState: {
          password: 'abc',
          confirm: 'def',
        },
      })
      
      return { state, id, submit, isValid }
    }).render(`
      
      <NotForm :id="id" @submit.prevent="submit">
        <NotField name="password" v-slot="{ methods, name }">
          <label :for="name">
            Password
            <input type="text" v-model="state.password" v-bind="methods" :name="name" :id="name"/>
          </label>
          <NotMessage name="password" v-slot="{message}">
            <span role="alert" title="password-message">{{ message }}</span>
          </NotMessage>
        </NotField>

        <NotField name="confirm" v-slot="{ methods, name }">
          <label :for="name">
            Confirm
            <input type="text" v-model="state.confirm" v-bind="methods" :name="name" :id="name"/>
          </label>
          <NotMessage name="confirm" v-slot="{message}">
            <span role="alert" title="confirm-message">{{ message }}</span>
          </NotMessage>
        </NotField>

        <button type="submit">Submit</button>
      </NotForm>
    `, { NotForm, NotField, NotMessage })
    
    const confirmInput = getByRole('textbox', { name: 'confirm' })
    const submitButton = getByRole('button', { name: 'Submit' })
    const confirmMessage = getByRole('alert', { name: 'confirm-message' })
    const passwordMessage = getByRole('alert', { name: 'password-message' })
    
    
    // Should fail validation
    await submitButton.click()

    await expect.element(passwordMessage).toBeEmptyDOMElement
    await expect.element(confirmMessage).toHaveTextContent('Passwords don\'t match')
    expect(isValid.value).toBe(false)

    // Make valid
    await confirmInput.fill('abc')
    await submitButton.click()
    
    await expect.element(passwordMessage).toBeEmptyDOMElement
    await expect.element(confirmMessage).toBeEmptyDOMElement
    expect(isValid.value).toBeTruthy()
    
  })

  test('Handles superRefine', async () => {
    const { isValid, getByRole } = withSetup(() => {
      const schema = z.object({
        password: z.string(),
        confirm: z.string(),
      }).superRefine((data, ctx) => {
        if (data.password !== data.confirm) {
          ctx.addIssue({
            code: 'custom',
            message: "Passwords don't match",
            path: ['confirm'],
          })
        }
      })

      const { state, id, submit, isValid } = useNotForm({
        schema,
        initialState: {
          password: 'abc',
          confirm: 'def',
        },
      })
    
      return { state, id, submit, isValid }
    }).render(`
    
    <NotForm :id="id" @submit.prevent="submit">
      <NotField name="password" v-slot="{ methods, name }">
        <label :for="name">
          Password
          <input type="text" v-model="state.password" v-bind="methods" :name="name" :id="name"/>
        </label>
        <NotMessage name="password" v-slot="{message}">
          <span role="alert" title="password-message">{{ message }}</span>
        </NotMessage>
      </NotField>

      <NotField name="confirm" v-slot="{ methods, name }">
        <label :for="name">
          Confirm
          <input type="text" v-model="state.confirm" v-bind="methods" :name="name" :id="name"/>
        </label>
        <NotMessage name="confirm" v-slot="{message}">
          <span role="alert" title="confirm-message">{{ message }}</span>
        </NotMessage>
      </NotField>

      <button type="submit">Submit</button>
    </NotForm>
  `, { NotForm, NotField, NotMessage })
  
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
      const schemaOne = z.object({
        amount: z.number().max(10),
      })

      const schemaTwo = z.object({
        amount: z.number().max(20),
      })

      const activeSchema = ref(schemaOne)

      const { state, id, submit, isValid } = useNotForm({
        schema: activeSchema,
        initialState: {
          amount: 15,
        },
      })
    
      return { state, id, submit, isValid, schemaOne, schemaTwo, activeSchema }
    }).render(`
    
    <NotForm :id="id" @submit.prevent="submit">
      <NotField name="amount" v-slot="{ methods, name }">
        <label :for="name">
          Amount
          <input type="text" v-model="state.amount" v-bind="methods" :name="name" :id="name"/>
        </label>
        <NotMessage name="amount" v-slot="{message}">
          <span role="alert" title="amount-message">{{ message }}</span>
        </NotMessage>
      </NotField>

      <button type="submit">Submit</button>
    </NotForm>
  `, { NotForm, NotField, NotMessage })
  
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
