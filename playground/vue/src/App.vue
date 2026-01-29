<script setup lang="ts">
import { useNotForm, NotForm, NotField, NotMessage, NotArrayField } from 'notform'
import { computed, ref, watch } from 'vue'
import useSchema from './composables/use-schema'
import SchemaTabs from './components/schema-tabs.vue'

const { schema, activeSchema } = useSchema()

const form = useNotForm({
  schema,
  initialState: {
    array: [''],
  },
  onSubmit: async (data) => {
    console.log('Combined form submitted:', data)
  },
})

const currentTab = ref<'preview' | 'raw'>('preview')

const arraySchema = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const objectSchema = schema.value as any
  
  switch (activeSchema.value) {
    case 'yup':
      return objectSchema.fields.array

    case 'valibot':
      return objectSchema.entries.array

    default:
      return objectSchema.shape.array
  }
})

watch(activeSchema, () => {
  form.validate()
})
</script>

<template>
  <div class="nf-shell">
    <header
      class="
        mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      <div>
        <h1 class="text-lg font-semibold text-slate-900">
          NotForm Playground
        </h1>
        <p class="mt-1 max-w-2xl text-sm text-slate-600">
          Explore how <span class="font-semibold">notform</span> behaves with different input types and validation schemas.
          Use the schema tabs to switch between Zod, Yup, and Valibot.
        </p>
      </div>

      <SchemaTabs />
    </header>

    <main class="flex flex-1 flex-col gap-4">
      <div
        aria-label="Preview and raw view toggle"
        role="tablist"
        class="
          nf-tabs mt-2
          *:flex-1
        "
      >
        <button
          type="button"
          class="nf-tab"
          :class="{ 'nf-tab-active': currentTab === 'preview' }"
          role="tab"
          :aria-selected="currentTab === 'preview'"
          @click="currentTab = 'preview'"
        >
          Preview
        </button>

        <button
          type="button"
          class="nf-tab"
          :class="{ 'nf-tab-active': currentTab === 'raw' }"
          role="tab"
          :aria-selected="currentTab === 'raw'"
          @click="currentTab = 'raw'"
        >
          Raw
        </button>
      </div>

      <section
        aria-label="Playground display"
        class="
          nf-card flex-1 p-4
          sm:p-5
        "
      >
        <section class="space-y-4">
          <NotForm
            v-if="currentTab === 'preview'"
            :id="form.id"
            class="space-y-4"
            @submit="form.submit"
            @reset="form.reset()"
          >
            <div class="
              grid gap-4
              md:grid-cols-2
            ">
              <NotField v-slot="{ methods, name }" name="text">
                <div class="nf-field">
                  <label class="nf-label" :for="name">Text</label>
                  <input
                    :id="name"
                    v-model="form.state.value.text"
                    class="nf-input"
                    type="text"
                    :name="name"
                    v-bind="methods"
                  >
                  <NotMessage v-slot="{ message }" :name="name">
                    <p class="nf-error capitalize" v-if="message">
                      {{ activeSchema }} : {{ message }}
                    </p>
                  </NotMessage>
                </div>
              </NotField>

              <NotField v-slot="{ methods, name }" name="select">
                <div class="nf-field">
                  <label class="nf-label" :for="name">Select</label>
                  <select
                    :id="name"
                    v-model="form.state.value.select"
                    class="nf-select"
                    :name="name"
                    v-bind="methods"
                  >
                    <option value="">Select a country</option>
                    <option value="ng">Nigeria</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                  </select>
                  <NotMessage v-slot="{ message }" :name="name">
                    <p class="nf-error capitalize" v-if="message">
                      {{ activeSchema }} : {{ message }}
                    </p>
                  </NotMessage>
                </div>
              </NotField>

              <NotField v-slot="{ methods, name }" name="number">
                <div class="nf-field">
                  <label class="nf-label" :for="name">Number</label>
                  <input
                    :id="name"
                    v-model="form.state.value.number"
                    class="nf-input"
                    type="number"
                    :name="name"
                    v-bind="methods"
                  >
                  <NotMessage v-slot="{ message }" :name="name">
                    <p class="nf-error capitalize" v-if="message">
                      {{ activeSchema }} : {{ message }}
                    </p>
                  </NotMessage>
                </div>
              </NotField>

              <NotField v-slot="{ methods, name }" name="range">
                <div class="nf-field">
                  <label class="nf-label" :for="name">
                    Range ({{ form.state.value.range || 50 }})
                  </label>
                  <input
                    :id="name"
                    v-model="form.state.value.range"
                    class="w-full"
                    type="range"
                    min="0"
                    max="100"
                    :name="name"
                    v-bind="methods"
                  >
                  <NotMessage v-slot="{ message }" :name="name">
                    <p class="nf-error capitalize" v-if="message">
                      {{ activeSchema }} : {{ message }}
                    </p>
                  </NotMessage>
                </div>
              </NotField>

              <NotField v-slot="{ methods, name }" name="date">
                <div class="nf-field">
                  <label class="nf-label" :for="name">Date</label>
                  <input
                    :id="name"
                    v-model="form.state.value.date"
                    class="nf-input"
                    type="date"
                    :name="name"
                    v-bind="methods"
                  >
                  <NotMessage v-slot="{ message }" :name="name">
                    <p class="nf-error capitalize" v-if="message">
                      {{ activeSchema }} : {{ message }}
                    </p>
                  </NotMessage>
                </div>
              </NotField>

              <NotField v-slot="{ methods, name }" name="file">
                <div class="nf-field">
                  <label class="nf-label" :for="name">File</label>
                  <input
                    :id="name"
                    class="nf-input"
                    type="file"
                    :name="name"
                    v-bind="methods"
                    @change="(e) => form.state.value.file = (e.target as HTMLInputElement).files?.[0] || null"
                  >
                  <NotMessage v-slot="{ message }" :name="name">
                    <p class="nf-error capitalize" v-if="message">
                      {{ activeSchema }} : {{ message }}
                    </p>
                  </NotMessage>
                </div>
              </NotField>

              <NotArrayField :schema="arraySchema" name="array" v-slot="{fields,append,remove}">

                <div v-for="field, index in fields" :key="field.key">

                <NotField v-slot="{ methods, name }" :name="'array.' + index">
                <div class="nf-field">
                  <label class="nf-label" :for="name">Item {{ index }}</label>
                 
                  <div class="flex items-center gap-2">
                     <input
                    :id="name"
                    v-model="form.state.value.array![index]"
                    class="nf-input"
                    type="text"
                    :name="name"
                    v-bind="methods"
                  >

                  <button @click="remove(index)" class="nf-button font-bold" :disabled="index === 0">x</button>
                  <button @click="append('')" class="nf-button font-bold">+</button>
                  </div>

                  <NotMessage v-slot="{ message }" :name="name">
                    <p class="nf-error capitalize" v-if="message">
                      {{ activeSchema }} : {{ message }}
                    </p>
                  </NotMessage>
                </div>
              </NotField>

                </div>

              </NotArrayField>
            </div>

            <NotField v-slot="{ methods, name }" name="checkbox">
              <div class="nf-field">
                <label class="nf-label flex items-center gap-2">
                  <input
                    v-model="form.state.value.checkbox"
                    class="nf-checkbox"
                    type="checkbox"
                    :name="name"
                    v-bind="methods"
                  >
                  <span>Checkbox</span>
                </label>
                <NotMessage v-slot="{ message }" :name="name">
                  <p class="nf-error capitalize" v-if="message">
                    {{ activeSchema }} : {{ message }}
                  </p>
                </NotMessage>
              </div>
            </NotField>

            <NotField v-slot="{ methods, name }" name="radio">
              <div class="nf-field">
                <label class="nf-label mb-2 block">Radio</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="form.state.value.radio"
                      class="nf-checkbox"
                      type="radio"
                      value="option1"
                      :name="name"
                      v-bind="methods"
                    >
                    <span>Option 1</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="form.state.value.radio"
                      class="nf-checkbox"
                      type="radio"
                      value="option2"
                      :name="name"
                      v-bind="methods"
                    >
                    <span>Option 2</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="form.state.value.radio"
                      class="nf-checkbox"
                      type="radio"
                      value="option3"
                      :name="name"
                      v-bind="methods"
                    >
                    <span>Option 3</span>
                  </label>
                </div>
                <NotMessage v-slot="{ message }" :name="name">
                  <p class="nf-error capitalize" v-if="message">
                    {{ activeSchema }} : {{ message }}
                  </p>
                </NotMessage>
              </div>
            </NotField>

            <div class="nf-form-actions">
              <button type="submit" class="nf-button nf-button-primary">
                Submit form
              </button>
              <button type="reset" class="nf-button">
                Reset form
              </button>
              <p class="text-xs text-slate-500">
                Open devtools console to inspect the submitted payload.
              </p>
            </div>
          </NotForm>

          <pre
            v-else
            class="max-h-[calc(100dvh-20rem)] overflow-auto"
          >{{ form }}</pre>
        </section>
      </section>
    </main>
  </div>
</template>
