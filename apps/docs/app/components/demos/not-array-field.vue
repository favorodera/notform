<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()
const itemSchema = z.string().min(1, 'Tag cannot be empty')

const form = useNotForm({
  schema: z.object({
    tags: z.array(itemSchema).min(2, 'Add at least two tags'),
  }),
  initialValues: { tags: ['vue', 'typescript'] },
  onSubmit: async () => {
    await new Promise(resolve => setTimeout(resolve, 600))

    toast.add({
      title: 'Form submitted successfully',
      color: 'success',
    })

    setTimeout(() => {
      form.reset()
    }, 2000)

  },
})
</script>

<template>
  <NotForm
    :form="form"
    class="form"
    @submit="form.submit"
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
        <div class="field">
          <UFieldGroup class="w-full">
            <input
              v-bind="events"
              :id="item.path"
              v-model="form.values.tags[item.index]"
              placeholder="Enter tag name..."
              class="input flex-1"
              :name="item.path"
            >

            <UButton
              icon="i-lucide-arrow-up"
              variant="soft"
              size="sm"
              :disabled="item.index === 0"
              @click="move(item.index, item.index - 1)"
            />
            <UButton
              icon="i-lucide-arrow-down"
              variant="soft"
              size="sm"
              :disabled="item.index === items.length - 1"
              @click="move(item.index, item.index + 1)"
            />

            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="soft"
              size="sm"
              class="shrink-0"
              :disabled="items.length === 1"
              @click="remove(item.index)"
            />
            
          </UFieldGroup>
          
          <NotMessage
            :path="item.path"
            class="message block"
          />
        </div>
      </NotField>

      <NotMessage
        :path="path"
        class="message"
      />

      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="outline"
        size="sm"
        block
        class="mt-2"
        @click="append('')"
      >
        Add tag
      </UButton>
    </NotArrayField>

    <UButton
      type="submit"
      block
      color="primary"
      :loading="form.isSubmitting.value"
    >
      Save all tags
    </UButton>
  </NotForm>
</template>
