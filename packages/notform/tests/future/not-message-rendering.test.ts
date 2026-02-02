import { describe, expect, test } from 'vitest'
import { NotField, NotForm, useNotForm, NotMessage } from '../../src'
import { notRules, withSetup } from '../utils'

describe('Not Message Rendering', () => {
  const schema = notRules.object({
    name: notRules.string(20),
  })

  test('Renders as default span tag with extra attributes', async () => {
    const { getByRole, container } = withSetup(() => {
      const { state, id } = useNotForm({
        schema,
        initialState: { name: 'John' },
        initialErrors: [
          {
            path: ['name'],
            message: 'Name is too short',
          },
        ],
      })
      return { state, id }
    }).render(`
      <NotForm :id="id">
        <NotField name="name" v-slot="{ methods, name }">
          <input type="text" v-model="state.name" v-bind="methods" :name="name" />
          <NotMessage :name="name" class="color-red" role="alert" title="name-message-with-default-tag"  />
        </NotField>
      </NotForm>
    `, { NotForm, NotField, NotMessage })
    
    const messageWithDefaultTag = getByRole('alert', { name: 'name-message-with-default-tag' })
    const messageWithDefaultTagQuery = container.querySelector('[title="name-message-with-default-tag"]')
    
    expect(messageWithDefaultTagQuery?.tagName).toBe('SPAN')
    await expect.element(messageWithDefaultTag).toHaveClass('color-red')
  })

  test('Renders with custom tag when "as" prop is specified', async () => {
    const { getByRole, container } = withSetup(() => {
      const { state, id } = useNotForm({
        schema,
        initialState: { name: 'John' },
        initialErrors: [
          {
            path: ['name'],
            message: 'Name is too short',
          },
        ],
      })
      return { state, id }
    }).render(`
      <NotForm :id="id">
        <NotField name="name" v-slot="{ methods, name }">
          <input type="text" v-model="state.name" v-bind="methods" :name="name" />
          <NotMessage as="p" :name="name" class="color-blue" role="alert" title="name-message-with-p"  />
        </NotField>
      </NotForm>
    `, { NotForm, NotField, NotMessage })
    
    const messageWithPTag = getByRole('alert', { name: 'name-message-with-p' })
    const messageWithPTagQuery = container.querySelector('[title="name-message-with-p"]')
    
    expect(messageWithPTagQuery?.tagName).toBe('P')
    await expect.element(messageWithPTag).toHaveClass('color-blue')
  })

  test('Renders with different custom tags and preserves attributes', async () => {
    const { getByRole, container } = withSetup(() => {
      const { state, id } = useNotForm({
        schema,
        initialState: { name: 'John' },
        initialErrors: [
          {
            path: ['name'],
            message: 'Name is too short',
          },
        ],
      })
      return { state, id }
    }).render(`
      <NotForm :id="id">
        <NotField name="name" v-slot="{ methods, name }">
          <input type="text" v-model="state.name" v-bind="methods" :name="name" />
          <NotMessage :name="name" class="color-red" role="alert" title="name-message-span"  />
          <NotMessage as="div" :name="name" class="color-green" role="status" title="name-message-div"  />
        </NotField>
      </NotForm>
    `, { NotForm, NotField, NotMessage })
    
    const spanMessage = getByRole('alert', { name: 'name-message-span' })
    const spanQuery = container.querySelector('[title="name-message-span"]')
    const divMessage = getByRole('status', { name: 'name-message-div' })
    const divQuery = container.querySelector('[title="name-message-div"]')
    
    expect(spanQuery?.tagName).toBe('SPAN')
    await expect.element(spanMessage).toHaveClass('color-red')
    
    expect(divQuery?.tagName).toBe('DIV')
    await expect.element(divMessage).toHaveClass('color-green')
  })

  test('Default slot receives message and attributes', async () => {
    const { getByRole, container } = withSetup(() => {
      const { state, id } = useNotForm({
        schema,
        initialState: { name: 'John' },
        initialErrors: [
          {
            path: ['name'],
            message: 'Name is too short',
          },
        ],
      })
      return { state, id }
    }).render(`
      <NotForm :id="id">
        <NotField name="name" v-slot="{ methods, name }">
          <input type="text" v-model="state.name" v-bind="methods" :name="name" />
          <NotMessage :name="name" v-slot="{ message, attributes }">
            <span v-bind="attributes" class="custom-error" role="alert" title="custom-message">
              {{ message }}
            </span>
          </NotMessage>
        </NotField>
      </NotForm>
    `, { NotForm, NotField, NotMessage })
    
    const customMessage = getByRole('alert', { name: 'custom-message' })
    const customMessageQuery = container.querySelector('[title="custom-message"]')
    
    expect(customMessageQuery?.tagName).toBe('SPAN')
    await expect.element(customMessage).toHaveClass('custom-error')
    await expect.element(customMessage).toHaveTextContent('Name is too short')
  })
})
