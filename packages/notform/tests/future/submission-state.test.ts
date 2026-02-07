import { describe, expect, test, vi } from 'vitest'
import { NotField, NotForm, useNotForm } from '../../src'
import { notRules, withSetup } from '../utils'

describe('Form Submission State', () => {
  const schema = notRules.object({
    name: notRules.string(1),
  })

  function setupForm() {
    const rendered = withSetup(() => {
      const { state, id, submit, isSubmitting } = useNotForm({
        schema,
        initialState: { name: 'John' },
        async onSubmit() {
          // Imitate a 5 seconds promise
          await new Promise(resolve => setTimeout(resolve, 5000))
        },
      })
      return { state, id, submit, isSubmitting }
    }).render(`
      <NotForm :id="id" @submit="submit">
        <NotField name="name" v-slot="{ methods, name }">
          <input type="text" v-model="state.name" v-bind="methods" :name="name" :disabled="isSubmitting" />
        </NotField>

        <button type="submit" :disabled="isSubmitting">Submit</button>
      </NotForm>
    `, { NotForm, NotField })
    
    const submitButton = rendered.getByRole('button', { name: 'Submit' })

    return {
      ...rendered,
      submitButton,
    }
    
  }

  test('Is false by default', async () => {
    const { isSubmitting, submitButton } = setupForm()
    
    expect(isSubmitting.value).toBeFalsy()
    await expect.element(submitButton).not.toBeDisabled()
  })

  test('Is true on submit and false on post-submit', async () => {
    vi.useFakeTimers()
    const { isSubmitting, submitButton } = setupForm()
  
    await submitButton.click()
  
    await vi.waitFor(() => {
      expect(isSubmitting.value).toBeTruthy()
    })
  
    await expect.element(submitButton).toBeDisabled()
  
    await vi.advanceTimersByTimeAsync(5000)
  
    await vi.waitFor(() => {
      expect(isSubmitting.value).toBeFalsy()
    })

    await expect.element(submitButton).not.toBeDisabled()

    vi.useRealTimers()
  })
})
