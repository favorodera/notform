<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()
const itemSchema = z.string().min(1, 'Tag cannot be empty')

const form = useNotForm({
  initialValues: {
    tags: [
      'vue',
      'typescript',
    ],
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
    class="form"
    @submit="form.submit"
    @reset="form.reset()"
  >
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
        <label
          :for="item.path"
          class="label"
        >
          <div class="flex gap-2 field">
            <input
              v-bind="events"
              :id="item.path"
              v-model="form.values.tags[item.index]"
              placeholder="Enter tag name..."
              class="input flex-1"
              autocomplete="off"
            >

            <Button
              icon="i-lucide-chevron-up"
              variant="subtle"
              color="neutral"
              class="rounded-full"
              :disabled="item.index === 0"
              @click="move(item.index, item.index - 1)"
            />

            <Button
              icon="i-lucide-chevron-down"
              variant="subtle"
              color="neutral"
              class="rounded-full"
              :disabled="item.index === items.length - 1"
              @click="move(item.index, item.index + 1)"
            />

            <Button
              icon="i-lucide-trash-2"
              color="error"
              variant="subtle"
              class="rounded-full"
              :disabled="items.length === 1"
              @click="remove(item.index)"
            />
          </div>

          <NotMessage
            :path="item.path"
            class="message block"
          />
        </label>
      </NotField>

      <NotMessage
        :path="path"
        class="message"
      />

      <Button
        icon="i-lucide-plus"
        color="neutral"
        variant="outline"
        class="inline-fit"
        @click="append('')"
      >
        Add tag
      </Button>
    </NotArrayField>

    <div class="field grid-cols-2">
      <Button
        type="reset"
        :disabled="form.isSubmitting.value"
        color="neutral"
        variant="subtle"
        block
      >
        Reset
      </Button>

      <Button
        type="submit"
        :loading="form.isSubmitting.value"
        block
      >
        Submit
      </Button>
    </div>
  </NotForm>
</template>
