<script lang="ts" setup generic="TSchema extends ObjectSchema">
import type { MessageProps, MessageSlots } from '../types/message'
import type { ObjectSchema } from '../types/shared'
import { computed, inject, reactive } from 'vue'
import { CURRENT_FORM_ID_KEY, withContext } from '../utils/form-context'
import type { Paths } from '../types/utils'
import type { StandardSchemaV1 } from '@standard-schema/spec'

const props = defineProps<MessageProps<TSchema>>()
defineSlots<MessageSlots<TSchema>>()

const formID = inject(CURRENT_FORM_ID_KEY)

if (!formID) {
  throw new Error('Message must be used inside a Form component with a valid form ID')
}

const { getFieldErrors } = withContext<TSchema>(formID)

const context = reactive({
  message: computed(() => getFieldErrors(props.name as Paths<StandardSchemaV1.InferInput<TSchema>>).map(error => error.message)[0]),
})
</script>

<template>
  
<slot v-bind="context" v-show="context.message">

  <span>{{ context.message }}</span>

</slot>

</template>
