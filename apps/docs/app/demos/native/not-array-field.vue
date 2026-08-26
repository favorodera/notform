<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()

const itemSchema = z.string().min(1, 'Tag cannot be empty')

const form = useNotForm({
  initialValues: {
    tags: ['vue', 'typescript'],
  },
  async onSubmit(data) {
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })

    toast.add({
      color: 'success',
      description: h('pre', JSON.stringify(data, undefined, 2)),
      title: 'Form submitted successfully',
    })
  },
  schema: z.object({
    tags: z.array(itemSchema).min(2, 'Add at least two tags'),
  }),
})
</script>

<template>
  <NotForm
    :form="form"
    data-demo-form
    @submit="form.submit"
    @reset="form.reset()"
  >
    <div data-demo-field>
      <div data-demo-label>
        Tags (Min. 2)
      </div>

      <NotArrayField
        v-slot="{ items, append, remove, move, path }"
        path="tags"
        :item-schema="itemSchema"
      >
        <NotField
          v-for="item in items"
          :key="item.key"
          v-slot="{ events }"
          :path="item.path"
        >
          <div data-demo-field>
            <div
              data-demo-field
              class="flex-row"
            >
              <input
                :id="item.path"
                v-model="form.values.tags[item.index]"
                placeholder="Enter tag name..."
                v-bind="events"
                autocomplete="off"
                class="flex-1"
              >

              <div
                data-demo-field
                class="flex-row gap-2 inline-fit"
              >
                <Button
                  icon="tabler:chevron-up"
                  type="button"
                  :disabled="item.index === 0"
                  variant="soft"
                  title="Move up"
                  size="sm"
                  @click="move(item.index, item.index - 1)"
                />

                <Button
                  icon="tabler:chevron-down"
                  type="button"
                  :disabled="item.index === items.length - 1"
                  variant="soft"
                  title="Move down"
                  size="sm"
                  @click="move(item.index, item.index + 1)"
                />

                <Button
                  icon="tabler:trash"
                  type="button"
                  :disabled="items.length === 1"
                  variant="soft"
                  color="error"
                  title="Remove"
                  size="sm"
                  @click="remove(item.index)"
                />
              </div>
            </div>

            <NotMessage
              :path="item.path"
              data-demo-message
            />
          </div>
        </NotField>

        <NotMessage
          :path="path"
          data-demo-message
        />

        <Button
          icon="tabler:plus"
          type="button"
          variant="subtle"
          label="Add tag"
          block
          class="mbs-2"
          @click="append('')"
        />
      </NotArrayField>
    </div>

    <div
      data-demo-field
      class="flex-row"
    >
      <Button
        type="reset"
        :disabled="form.isSubmitting.value"
        block
        variant="soft"
        label="Reset"
      />

      <Button
        type="submit"
        block
        :disabled="form.isSubmitting.value"
        :loading="form.isSubmitting.value"
        :label="form.isSubmitting.value ? 'Submitting...' : 'Submit'"
      />
    </div>
  </NotForm>
</template>
