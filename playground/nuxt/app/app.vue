<script setup lang="ts">
const { schema, activeSchema } = useSchema()

const form = useNotForm({
  schema,
  onSubmit: async (data) => {
     
    console.log('Combined form submitted:', data)
  },
})

const currentTab = ref<'preview' | 'raw'>('preview')

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

        <section
          class="space-y-4"
        >
          <NotForm
            v-if="currentTab === 'preview'"
            :id="form.id"
            class="space-y-4"
            @submit="form.submit"
            @reset="form.reset()"
          >
            <div
              class="
                grid gap-4
                md:grid-cols-2
              "
            >
              <NotField
                v-slot="{ methods, name }"
                name="text"
              >
                <div class="nf-field">
                  <label
                    class="nf-label"
                    :for="name"
                  >
                    Text
                  </label>
                  <input
                    :id="name"
                    v-model="form.state.value.text"
                    class="nf-input"
                    type="text"
                    autocomplete="username"
                    :name="name"
                    v-bind="methods"
                  >
                  <NotMessage
                    v-slot="{ message }"
                    :name="name"
                  >
                    <p
                      v-if="message"
                      class="nf-error capitalize"
                    >
                      {{ activeSchema }} : {{ message }}
                    </p>
                  </NotMessage>
                </div>
              </NotField>

              <NotField
                v-slot="{ methods, name }"
                name="email"
              >
                <div class="nf-field">
                  <label
                    class="nf-label"
                    :for="name"
                  >
                    Email
                  </label>
                  <input
                    :id="name"
                    v-model="form.state.value.email"
                    class="nf-input"
                    type="email"
                    autocomplete="email"
                    :name="name"
                    v-bind="methods"
                  >
                  <NotMessage
                    v-slot="{ message }"
                    :name="name"
                  >
                    <p
                      v-if="message"
                      class="nf-error capitalize"
                    >
                      {{ activeSchema }} : {{ message }}
                    </p>
                  </NotMessage>
                </div>
              </NotField>
            </div>

            <NotField
              v-slot="{ methods, name }"
              name="textarea"
            >
              <div class="nf-field">
                <label
                  class="nf-label"
                  :for="name"
                >
                  Textarea
                </label>
                <textarea
                  :id="name"
                  v-model="form.state.value.textarea"
                  class="nf-textarea"
                  rows="3"
                  :name="name"
                  v-bind="methods"
                />
                <NotMessage
                  v-slot="{ message }"
                  :name="name"
                >
                  <p
                    v-if="message"
                    class="nf-error capitalize"
                  >
                    {{ activeSchema }} : {{ message }}
                  </p>
                </NotMessage>
              </div>
            </NotField>

            <div
              class="
                grid gap-4
                md:grid-cols-2
              "
            >
              <NotField
                v-slot="{ methods, name }"
                name="select"
              >
                <div class="nf-field">
                  <label
                    class="nf-label"
                    :for="name"
                  >
                    Select
                  </label>
                  <select
                    :id="name"
                    v-model="form.state.value.select"
                    class="nf-select"
                    :name="name"
                    v-bind="methods"
                  >
                    <option value="">
                      Select a country
                    </option>
                    <option value="ng">
                      Nigeria
                    </option>
                    <option value="us">
                      United States
                    </option>
                    <option value="uk">
                      United Kingdom
                    </option>
                  </select>
                  <NotMessage
                    v-slot="{ message }"
                    :name="name"
                  >
                    <p
                      v-if="message"
                      class="nf-error capitalize"
                    >
                      {{ activeSchema }} : {{ message }}
                    </p>
                  </NotMessage>
                </div>
              </NotField>

              <NotField
                v-slot="{ methods, name }"
                name="tel"
              >
                <div class="nf-field">
                  <label
                    class="nf-label"
                    :for="name"
                  >
                    Tel
                  </label>
                  <input
                    :id="name"
                    v-model="form.state.value.tel"
                    class="nf-input"
                    type="tel"
                    inputmode="tel"
                    autocomplete="tel"
                    :name="name"
                    v-bind="methods"
                  >
                  <NotMessage
                    v-slot="{ message }"
                    :name="name"
                  >
                    <p
                      v-if="message"
                      class="nf-error capitalize"
                    >
                      {{ activeSchema }} : {{ message }}
                    </p>
                  </NotMessage>
                </div>
              </NotField>
            </div>

            <NotField
              v-slot="{ methods, name }"
              name="checkbox"
            >
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
                <NotMessage
                  v-slot="{ message }"
                  :name="name"
                >
                  <p
                    v-if="message"
                    class="nf-error capitalize"
                  >
                    {{ activeSchema }} : {{ message }}
                  </p>
                </NotMessage>
              </div>
            </NotField>

            <div class="nf-form-actions">
              <button
                type="submit"
                class="nf-button nf-button-primary"
              >
                Submit form
              </button>

              <button
                type="reset"
                class="nf-button"
              >
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
