import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { useForm } from '../../../src'
import { withSetup } from '../../utils'

describe('multiple-form-instances', () => {
  // define shared schema
  const schema = z.object({
    field: z.string().min(1),
  })

  test('maintains isolated state between instances', () => {
    const { result } = withSetup(() => {
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
    })

    const { form1, form2 } = result

    // verify initial separation
    expect(form1.state.value.field).toBe('value1')
    expect(form2.state.value.field).toBe('value2')

    // update first form
    form1.state.value.field = 'updated1'

    // verify second form is unaffected
    expect(form1.state.value.field).toBe('updated1')
    expect(form2.state.value.field).toBe('value2')
  })

  test('validates independently', async () => {
    const { result } = withSetup(() => {
      // create two forms
      const form1 = useForm({ schema, id: 'f1' })
      const form2 = useForm({ schema, id: 'f2' })
      return { form1, form2 }
    })

    const { form1, form2 } = result

    // make form1 invalid
    form1.state.value.field = ''
    // make form2 valid
    form2.state.value.field = 'valid'

    // validate both
    await form1.validate()
    await form2.validate()

    // check results
    expect(form1.isValid.value).toBe(false)
    expect(form1.errors.value.length).toBeGreaterThan(0)

    expect(form2.isValid.value).toBe(true)
    expect(form2.errors.value.length).toBe(0)
  })
})
