// tests/unit/state-management.test.ts
import { describe, expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { h, reactive } from 'vue'
import { z } from 'zod'
import ValidForm from '../../src/components/valid-form.vue'

const schema = z.object({
  name: z.string(),
  age: z.number(),
})

describe('state management', () => {
  test('Input fields update form state correctly', async () => {
    const state = reactive<Partial<z.infer<typeof schema>>>({})

    const { getByRole } = render(ValidForm, {
      props: {
        schema,
        state,
      },
      slots: {
        default: () => h({
          setup() {
            return { state }
          },
          template: `
            <label for="name">name</label>
            <input id="name" name="name" type="text" v-model="state.name" />

            <label for="age">age</label>
            <input id="age" name="age" type="number" v-model.number="state.age" />
          `,
        }),
      },
    })

    const nameInput = getByRole('textbox', { name: 'name' })
    const ageInput = getByRole('spinbutton', { name: 'age' })

    await nameInput.fill('John Doe')
    await ageInput.fill('30')

    await expect.element(nameInput).toHaveValue('John Doe')
    await expect.element(ageInput).toHaveValue(30)
    
    expect(state.name).toBe('John Doe')
    expect(state.age).toBe(30)
  })
})
