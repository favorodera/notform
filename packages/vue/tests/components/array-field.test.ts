import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { array, object, string } from '../../schemas'
import { mountForm } from '../helpers/mount-form'

const itemSchema = object({ name: string(2) })
const schema = object({ people: array(itemSchema, 1) })

const initialValues = { people: [{ name: 'Ada' }, { name: 'Bea' }, { name: 'Cal' }] }

const template = `
  <Form :form>
    <ArrayField :array-field="form.arrayField('people')" v-slot="{ arrayField }">
      <div v-for="item in arrayField.items" :key="item.id" class="row">
        <Field :field="item.field('name')" v-slot="{ field }">
          <input :id="field.path" v-model="field.model" v-bind="field.events" />
          <FieldError :errors="field" />
        </Field>

        <button class="remove" type="button" @click="arrayField.remove(item.index)">Remove</button>
      </div>

      <FieldError id="array-error" :errors="arrayField" />

      <button id="add" type="button" @click="arrayField.append({ name: 'New' })">Add</button>
    </ArrayField>
  </Form>
`

type Mounted = ReturnType<typeof mountForm>['wrapper']

function inputIds(wrapper: Mounted): (string | undefined)[] {
  return wrapper.findAll('.row input').map((input) => {
    return input.attributes('id')
  })
}

function inputValues(wrapper: Mounted): string[] {
  return wrapper.findAll('.row input').map((input) => {
    return (input.element as HTMLInputElement).value
  })
}

function mountPeople() {
  return mountForm({ initialValues, schema }, template)
}

function rowErrors(wrapper: Mounted): string[][] {
  return wrapper.findAll('.row').map((row) => {
    return row.findAll('span').map((span) => {
      return span.text()
    })
  })
}

describe('rendering', () => {
  it('renders one row per item, addressed by path', () => {
    const { wrapper } = mountPeople()

    expect(inputValues(wrapper)).toStrictEqual(['Ada', 'Bea', 'Cal'])
    expect(inputIds(wrapper)).toStrictEqual(['people.0.name', 'people.1.name', 'people.2.name'])
  })

  it('adds a row on append', async () => {
    const { form, wrapper } = mountPeople()

    await wrapper.get('#add').trigger('click')
    await flushPromises()

    expect(form.values.people).toHaveLength(4)
    expect(inputValues(wrapper)).toStrictEqual(['Ada', 'Bea', 'Cal', 'New'])
    expect(inputIds(wrapper).at(3)).toBe('people.3.name')
  })

  it('removes the row that was clicked and renumbers the rest', async () => {
    const { wrapper } = mountPeople()

    await wrapper.findAll('.remove').at(1)
      ?.trigger('click')
    await flushPromises()

    expect(inputValues(wrapper)).toStrictEqual(['Ada', 'Cal'])
    expect(inputIds(wrapper)).toStrictEqual(['people.0.name', 'people.1.name'])
  })

  it('writes typing into the right item only', async () => {
    const { form, wrapper } = mountPeople()

    await wrapper.findAll('.row input').at(1)
      ?.setValue('Bob')

    expect(form.values.people.map((person) => {
      return person.name
    })).toStrictEqual(['Ada', 'Bob', 'Cal'])
  })
})

describe('identity', () => {
  it('moves DOM nodes instead of recreating them, because rows are keyed by item id', async () => {
    const { form, wrapper } = mountPeople()
    const firstRowElement = wrapper.findAll('.row').at(0)?.element

    form.arrayField('people').move(0, 2)
    await nextTick()

    expect(wrapper.findAll('.row').at(2)?.element).toBe(firstRowElement)
    expect(inputValues(wrapper)).toStrictEqual(['Bea', 'Cal', 'Ada'])
    expect(inputIds(wrapper)).toStrictEqual(['people.0.name', 'people.1.name', 'people.2.name'])
  })

  it('keeps touched state with the item when it moves', async () => {
    const { form, wrapper } = mountPeople()
    const people = form.arrayField('people')

    await wrapper.findAll('.row input').at(0)
      ?.trigger('blur')
    await flushPromises()

    people.move(0, 2)
    await nextTick()

    expect(people.items.map((item) => {
      return item.field('name').isTouched
    })).toStrictEqual([false, false, true])
  })

  it('keeps errors with the item when it moves, and shows them next to it', async () => {
    const { form, wrapper } = mountPeople()

    form.setError({ message: 'Bad Ada', path: ['people', 0, 'name'] })
    await nextTick()

    expect(rowErrors(wrapper)).toStrictEqual([['Bad Ada'], [], []])

    form.arrayField('people').move(0, 2)
    await nextTick()

    expect(rowErrors(wrapper)).toStrictEqual([[], [], ['Bad Ada']])
  })

  it('shows the rows of the initial values again after a reset', async () => {
    const { form, wrapper } = mountPeople()

    form.arrayField('people').remove(0)
    await nextTick()

    expect(inputValues(wrapper)).toStrictEqual(['Bea', 'Cal'])

    form.reset()
    await nextTick()

    expect(inputValues(wrapper)).toStrictEqual(['Ada', 'Bea', 'Cal'])
  })
})

describe('array-level errors', () => {
  it('shows "at least one item" when the list is emptied, and clears it on append', async () => {
    const { form, wrapper } = mountPeople()
    const people = form.arrayField('people')

    people.remove(2)
    people.remove(1)
    people.remove(0)
    await people.validate()
    await flushPromises()

    expect(wrapper.get('#array-error').text()).toBe('Must have at least 1 item')

    await wrapper.get('#add').trigger('click')
    await flushPromises()

    expect(wrapper.find('#array-error').exists()).toBe(false)
  })
})
