<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()

const tagItemSchema = z.string().min(1, 'Tag cannot be empty')

const groupItemSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  tags: z.array(tagItemSchema).min(1, 'Add at least one tag'),
})

const form = useForm({
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
  <Form
    :form="form"
  >
    <div>
      <ArrayField
        v-slot="{ items: groups, append: appendGroup, remove: removeGroup, path: groupsPath }"
        path="groups"
        :item-schema="groupItemSchema"
      >
        <div>
          <div
            v-for="group in groups"
            :key="group.key"
            class="
              border-muted

              not-first:mbs-6 not-first:border-bs not-first:pbs-6
            "
          >
            <div

              class="flex-row"
            >
              <Field
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
              </Field>

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

            <Error
              :path="`${group.path}.name`"
            />

            <ArrayField
              v-slot="{ items: tags, append: appendTag, remove: removeTag, move: moveTag, path: tagsPath }"
              :path="`${group.path}.tags`"
              :item-schema="tagItemSchema"
            >
              <Field
                v-for="tag in tags"
                :key="tag.key"
                v-slot="{ events }"
                :path="tag.path"
              >
                <div

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

                <Error
                  :path="tag.path"
                />
              </Field>

              <Error
                :path="tagsPath"
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
            </ArrayField>
          </div>
        </div>

        <Error
          :path="groupsPath"
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
      </ArrayField>
    </div>

    <div

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
  </Form>
</template>
