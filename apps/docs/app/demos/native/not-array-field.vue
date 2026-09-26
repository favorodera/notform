<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()

const tagItemSchema = z.string().min(1, 'Tag cannot be empty')

const groupItemSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  tags: z.array(tagItemSchema).min(1, 'Add at least one tag'),
})

const form = useNotForm({
  initialValues: {
    groups: [{ name: 'Frontend', tags: ['vue', 'typescript'] }],
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
    groups: z.array(groupItemSchema).min(1, 'Add at least one group'),
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
      <NotArrayField
        v-slot="{ items: groups, append: appendGroup, remove: removeGroup, path: groupsPath }"
        path="groups"
        :item-schema="groupItemSchema"
      >
        <div
          data-demo-field
        >
          <div
            v-for="group in groups"
            :key="group.key"
            class="
              border-muted

              not-first:mbs-6 not-first:border-bs not-first:pbs-6
            "
            data-demo-field
          >
            <div
              data-demo-field
              class="flex-row"
            >
              <NotField
                v-slot="{ events }"
                :path="`${group.path}.name`"
              >
                <input
                  :id="`${group.path}.name`"
                  v-model="form.values.groups[group.index]!.name"
                  placeholder="Group name..."
                  v-bind="events"
                  autocomplete="off"
                  class="flex-1"
                >
              </NotField>

              <Button
                icon="tabler:trash"
                type="button"
                variant="soft"
                color="error"
                title="Remove group"
                size="sm"
                @click="removeGroup(group.index)"
              />
            </div>

            <NotMessage
              :path="`${group.path}.name`"
              data-demo-message
            />

            <NotArrayField
              v-slot="{ items: tags, append: appendTag, remove: removeTag, move: moveTag, path: tagsPath }"
              :path="`${group.path}.tags`"
              :item-schema="tagItemSchema"
            >
              <NotField
                v-for="tag in tags"
                :key="tag.key"
                v-slot="{ events }"
                :path="tag.path"
              >
                <div
                  data-demo-field
                  class="flex-row"
                >
                  <input
                    :id="tag.path"
                    v-model="form.values.groups[group.index]!.tags[tag.index]"
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
                      :disabled="tag.index === 0"
                      variant="soft"
                      title="Move up"
                      size="sm"
                      @click="moveTag(tag.index, tag.index - 1)"
                    />

                    <Button
                      icon="tabler:chevron-down"
                      type="button"
                      :disabled="tag.index === tags.length - 1"
                      variant="soft"
                      title="Move down"
                      size="sm"
                      @click="moveTag(tag.index, tag.index + 1)"
                    />

                    <Button
                      icon="tabler:trash"
                      type="button"
                      :disabled="tags.length === 1"
                      variant="soft"
                      color="error"
                      title="Remove"
                      size="sm"
                      @click="removeTag(tag.index)"
                    />
                  </div>
                </div>

                <NotMessage
                  :path="tag.path"
                  data-demo-message
                />
              </NotField>

              <NotMessage
                :path="tagsPath"
                data-demo-message
              />

              <Button
                icon="tabler:plus"
                type="button"
                variant="subtle"
                label="Add tag"
                block
                class="mbs-2"
                @click="appendTag('')"
              />
            </NotArrayField>
          </div>
        </div>

        <NotMessage
          :path="groupsPath"
          data-demo-message
        />

        <Button
          icon="tabler:plus"
          type="button"
          variant="subtle"
          label="Add group"
          block
          class="mbs-6"
          @click="appendGroup({ name: '', tags: [''] })"
        />
      </NotArrayField>
    </div>

    <div
      data-demo-field
      class="flex-row"
    >
      <Button
        type="reset"
        :disabled="form.isSubmitting"
        block
        variant="soft"
        label="Reset"
      />

      <Button
        type="submit"
        block
        :disabled="form.isSubmitting"
        :loading="form.isSubmitting"
        :label="form.isSubmitting ? 'Submitting...' : 'Submit'"
      />
    </div>
  </NotForm>
</template>
