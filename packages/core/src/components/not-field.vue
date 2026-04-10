<script setup lang="ts" generic="
  TSchema extends ObjectSchema,
  TPath extends Paths<StandardSchemaV1.InferInput<TSchema>>
"
>
import { computed, reactive, ref } from 'vue'
import { getProperty } from 'dot-prop'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { NotFieldProps, NotFieldSlots, NotFieldInstance } from '../types/not-field'
import type { ObjectSchema, Paths } from '../types/shared'
import { useNotFormInstance } from '../utils/instance-utils'

defineOptions({ inheritAttrs: false })
defineSlots<NotFieldSlots<TSchema, TPath>>()

const props = defineProps<NotFieldProps<TSchema, TPath>>()


// BASELINE
const formInstance = useNotFormInstance(props.form)


// STATE
const isValidating = ref(false)

const path = computed(() => props.path)
const value = computed(() => getProperty(formInstance.values.value, props.path) as NotFieldInstance<TSchema, TPath>['value'])
const errors = computed(() => formInstance.getFieldErrors(path.value))


// TOUCH
const touch = () => formInstance.touchField(path.value)
const unTouch = () => formInstance.unTouchField(path.value)


// DIRTY
const dirty = () => formInstance.dirtyField(path.value)
const unDirty = () => formInstance.unDirtyField(path.value)


// VALIDATION
const validate = async () => {
  isValidating.value = true
  try {
    return await formInstance.validateField(path.value)
  }
  finally {
    isValidating.value = false
  }
}


// INSTANCE
const fieldInstance = reactive({
  path,
  value,
  isValidating,
  errors,
  validate,
  touch,
  unTouch,
  dirty,
  unDirty,
}) as NotFieldInstance<TSchema, TPath>
</script>

<template>
  <slot v-bind="fieldInstance" />
</template>
