import { describe, expect, test } from 'vitest'
import { withSetup } from '../utils'
import { NotField, NotForm, NotMessage, useNotForm } from '../../src'
import { notRules } from '../utils'
import { ref } from 'vue'

describe('Schema Manipulation - Core', () => {

  test('Supports dynamic schema updates', async () => {
    const { isValid, schemaTwo, activeSchema, getByRole } = await withSetup(() => {
      const schemaOne = notRules.object({
        amount: notRules.number(0, 10),
      })

      const schemaTwo = notRules.object({
        amount: notRules.number(0, 20),
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
            <input type="number" v-model.number="state.amount" v-bind="methods" :name="name" :id="name"/>
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

    // Fails on SchemaOne (Max 10)
    await submitButton.click()

    await expect.element(amountMessage).not.toBeEmptyDOMElement()
    expect(isValid.value).toBe(false)

    // Switch to SchemaTwo (Max 20)
    activeSchema.value = schemaTwo

    // Should pass
    await submitButton.click()
    await expect.element(amountMessage).toBeEmptyDOMElement()
    expect(isValid.value).toBeTruthy()
  })

})
