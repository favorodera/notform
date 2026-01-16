// tests/unit/state-management.test.ts
import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
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

    const wrapper = mount(ValidForm, {
      props: {
        schema,
        state,
      },
      slots: {
        default: () => [
          h('input', {
            name: 'name',
            value: state.name,
            onInput: (event: Event) => {
              state.name = (event.target as HTMLInputElement).value
            },
          }),
          h('input', {
            name: 'age',
            type: 'number',
            value: state.age,
            onInput: (event: Event) => {
              state.age = Number((event.target as HTMLInputElement).value)
            },
          }),
        ],
      },
    })

    expect(wrapper.exists()).toBe(true)

    const nameInput = wrapper.find('input[name="name"]')
    const ageInput = wrapper.find('input[name="age"]')

    expect(nameInput.exists()).toBe(true)
    expect(ageInput.exists()).toBe(true)

    await nameInput.setValue('John Doe')
    await ageInput.setValue('30')

    expect(state.name).toBe('John Doe')
    expect(state.age).toBe(30)
  })
})
