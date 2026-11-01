<script setup lang="ts">
import { computed, ref } from 'vue'
import { z } from 'zod'
import { ArrayField, FieldError, Form, useForm } from '../../src'
import FieldFlags from './components/field-flags.vue'
import ItemActions from './components/item-actions.vue'
import TextField from './components/text-field.vue'

/* eslint-disable unicorn/max-nested-calls */
const schema = z.object({
  contacts: z.array(z.object({
    address: z.object({
      city: z.string().min(1, 'City is required'),
    }),
    email: z.email('Enter a valid email'),
    label: z.string().min(1, 'Label is required'),
    phones: z.array(z.object({
      kind: z.string().min(1, 'Kind is required'),
      number: z.string().min(5, 'At least 5 characters'),
    })).min(1, 'Add at least one phone'),
  })),
  // async transform: whole-form validation takes a moment, so `validating` is visible
  dob: z.iso.date('Pick a date')
    .transform(async (value) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 800)
      })

      return Date.parse(value)
    }),
  name: z.string().min(1, 'Name is required'),
  profile: z.object({
    address: z.object({
      city: z.string().min(1, 'City is required'),
      street: z.string().min(1, 'Street is required'),
    }),
    links: z.array(z.url('Enter a valid URL')),
  }),
  tags: z.array(z.string().min(2, 'At least 2 characters')).min(1, 'Add at least one tag'),
})

const submitted = ref<string>()

const form = useForm({
  initialValues: {
    contacts: [
      {
        address: { city: 'London' },
        email: 'ada@example.com',
        label: 'Work',
        phones: [{ kind: 'mobile', number: '555-0100' }],
      },
      {
        address: { city: '' },
        email: '',
        label: 'Home',
        phones: [],
      },
    ],
    dob: '',
    name: '',
    profile: {
      address: { city: '', street: '' },
      links: ['https://vuejs.org'],
    },
    tags: ['vue', 'forms'],
  },
  onSubmit: (data) => {
    submitted.value = JSON.stringify(data, undefined, 2)
  },
  schema,
})
</script>

<template>
  <main class="layout">
    <Form
      :form
      class="column"
    >
      <h1>NotForm playground</h1>

      <!-- plain fields: `form.field()` is called on every render and still returns the same field -->
      <TextField
        :field="form.field('name')"
        label="Name"
      />

      <TextField
        :field="form.field('dob')"
        label="Date of birth"
        type="date"
      />

      <!-- nested object: a dot path reaches any depth -->
      <fieldset>
        <legend>Profile</legend>

        <TextField
          :field="form.field('profile.address.street')"
          label="Street"
        />

        <TextField
          :field="form.field('profile.address.city')"
          label="City"
        />

        <!-- array inside a nested object -->
        <ArrayField
          v-slot="{ arrayField: links }"
          :array-field="form.arrayField('profile.links')"
        >
          <fieldset>
            <legend>Links</legend>

            <button
              type="button"
              @click="links.append('')"
            >
              Add link
            </button>

            <FieldError
              :errors="links"
              class="error"
            />

            <FieldFlags :field="links" />

            <div
              v-for="link in links.items"
              :key="link.id"
              class="item"
            >
              <TextField
                :field="link"
                label="Link"
              />

              <ItemActions :item="link" />
            </div>
          </fieldset>
        </ArrayField>
      </fieldset>

      <!-- array of primitives: every item is itself a field. Full toolbar to try every mutation -->
      <ArrayField
        v-slot="{ arrayField: tags }"
        :array-field="form.arrayField('tags')"
      >
        <fieldset>
          <legend>Tags</legend>

          <div class="row">
            <button
              type="button"
              @click="tags.append('')"
            >
              Append
            </button>

            <button
              type="button"
              @click="tags.prepend('')"
            >
              Prepend
            </button>

            <button
              type="button"
              @click="tags.insert(1, '')"
            >
              Insert at 1
            </button>

            <button
              type="button"
              @click="tags.swap(0, 1)"
            >
              Swap 0 and 1
            </button>

            <button
              type="button"
              @click="tags.move(tags.items.length - 1, 0)"
            >
              Last to first
            </button>
          </div>

          <FieldError
            :errors="tags"
            class="error"
          />

          <FieldFlags :field="tags" />

          <div
            v-for="tag in tags.items"
            :key="tag.id"
            class="item"
          >
            <TextField
              :field="tag"
              label="Tag"
            />

            <ItemActions :item="tag" />
          </div>
        </fieldset>
      </ArrayField>

      <!--
        array of objects, with an object and another array nested in every item.
        `contact.field()` / `contact.arrayField()` take paths relative to the item and follow it when it moves.
      -->
      <ArrayField
        v-slot="{ arrayField: contacts }"
        :array-field="form.arrayField('contacts')"
      >
        <fieldset>
          <legend>Contacts</legend>

          <div class="row">
            <button
              type="button"
              @click="contacts.append({ address: { city: '' }, email: '', label: '', phones: [] })"
            >
              Add contact
            </button>

            <button
              type="button"
              @click="contacts.swap(0, 1)"
            >
              Swap 0 and 1
            </button>
          </div>

          <FieldFlags :field="contacts" />

          <div
            v-for="contact in contacts.items"
            :key="contact.id"
            class="item"
          >
            <TextField
              :field="contact.field('label')"
              label="Label"
            />

            <TextField
              :field="contact.field('email')"
              label="Email"
            />

            <TextField
              :field="contact.field('address.city')"
              label="City"
            />

            <ArrayField
              v-slot="{ arrayField: phones }"
              :array-field="contact.arrayField('phones')"
            >
              <fieldset>
                <legend>Phones</legend>

                <button
                  type="button"
                  @click="phones.append({ kind: '', number: '' })"
                >
                  Add phone
                </button>

                <FieldError
                  :errors="phones"
                  class="error"
                />

                <FieldFlags :field="phones" />

                <div
                  v-for="phone in phones.items"
                  :key="phone.id"
                  class="item"
                >
                  <TextField
                    :field="phone.field('kind')"
                    label="Kind"
                  />

                  <TextField
                    :field="phone.field('number')"
                    label="Number"
                  />

                  <ItemActions :item="phone" />
                </div>
              </fieldset>
            </ArrayField>

            <ItemActions :item="contact" />
          </div>
        </fieldset>
      </ArrayField>

      <div class="row">
        <button type="submit">
          Submit
        </button>

        <button type="reset">
          Reset
        </button>

        <button
          type="button"
          @click="form.validate()"
        >
          Validate all
        </button>
      </div>
    </Form>

    <aside class="column state">
      <h2>Form state</h2>

      <pre>{{ JSON.stringify(form, null, 2) }}</pre>

      <h2>Submitted output</h2>

      <pre>{{ submitted ?? 'Nothing submitted yet' }}</pre>
    </aside>
  </main>
</template>

<style>
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
  padding: 1rem;
  font-family: system-ui, sans-serif;
}

.column {
  min-width: 0;
}

.state {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow: auto;
}

fieldset {
  margin: 0.75rem 0;
}

p {
  margin: 0.5rem 0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.item {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #ddd;
}

.error {
  color: #b00020;
}

.flags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: #555;
}

.flags span {
  opacity: 0.35;
}

.flags span.on {
  opacity: 1;
  font-weight: 600;
}

pre {
  padding: 0.75rem;
  overflow: auto;
  font-size: 12px;
  background: #f5f5f5;
}

@media (max-width: 800px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .state {
    position: static;
    max-height: none;
  }
}
</style>
