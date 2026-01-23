import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { useForm, Form } from '../../../src'
import { withSetup } from '../../utils'

describe('multiple_form_instances', () => {
  // define shared schema
  const schema = z.object({
    field: z.string().min(1),
  })

  test('maintains isolated state between instances', async () => {
    const { getByRole, form1, form2 } = withSetup(() => {
      // create first form
      const form1 = useForm({
        schema,
        id: 'form1',
        initialState: { field: 'value1' },
      })

      // create second form
      const form2 = useForm({
        schema,
        id: 'form2',
        initialState: { field: 'value2' },
      })

      return { form1, form2 }
    }).render(
      `
      <div>
        <Form :id="form1.id">
          <input name="field" v-model="form1.state.value.field" aria-label="field1" />
        </Form>
        <Form :id="form2.id">
          <input name="field" v-model="form2.state.value.field" aria-label="field2" />
        </Form>
      </div>
      `,
      { Form },
    )

    const input1 = getByRole('textbox', { name: 'field1' })
    const input2 = getByRole('textbox', { name: 'field2' })

    // verify initial separation
    await expect.element(input1).toHaveValue('value1')
    await expect.element(input2).toHaveValue('value2')

    // update first form
    await input1.fill('updated1')

    // verify second form is unaffected
    await expect.element(input1).toHaveValue('updated1')
    await expect.element(input2).toHaveValue('value2')

    expect(form1.state.value.field).toBe('updated1')
    expect(form2.state.value.field).toBe('value2')
  })

  test('validates independently', async () => {
    const { form1, form2, getByRole } = withSetup(() => {
      const form1 = useForm({ schema, id: 'f1' })
      const form2 = useForm({ schema, id: 'f2' })
      return { form1, form2 }
    }).render(
      `
      <div>
        <Form :id="form1.id">
            <input name="field" v-model="form1.state.value.field" aria-label="field1" />
        </Form>
        <Form :id="form2.id">
            <input name="field" v-model="form2.state.value.field" aria-label="field2" />
        </Form>
      </div>
      `,
      { Form },
    )

    const input1 = getByRole('textbox', { name: 'field1' })
    const input2 = getByRole('textbox', { name: 'field2' })

    // make form1 invalid (empty)
    await input1.fill('')
    // make form2 valid
    await input2.fill('valid')

    // validate both
    await form1.validate()
    await form2.validate()

    // check results
    expect(form1.isValid.value).toBe(false)
    expect(form2.isValid.value).toBe(true)
  })
})
