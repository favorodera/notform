<script setup lang="ts" generic="
  TSchema extends ObjectSchema,
  TPath extends Paths<StandardSchemaV1.InferInput<TSchema>>
"
>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { getProperty } from 'dot-prop'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { NotFieldProps, NotFieldSlots } from '../types/not-field'
import type { ObjectSchema, Paths } from '../types/shared'
import { useNotFormInstance } from '../utils/instance-utils'
import { dequal } from 'dequal'

defineOptions({ inheritAttrs: false })
defineSlots<NotFieldSlots<TSchema, TPath>>()

const props = defineProps<NotFieldProps<TSchema, TPath>>()


// BASELINE
const formInstance = useNotFormInstance(props.form)


// STATE
const isValidating = ref(false)


// COMPUTED
const path = computed(() => props.path)

const value = computed(() => getProperty(formInstance.values.value, props.path))
const errors = computed(() => formInstance.getFieldErrors(path.value))

const isTouched = computed(() => formInstance.allTouched.value || formInstance.touchedFields.value?.has(path.value))
const isDirty = computed(() => formInstance.allDirty.value || formInstance.dirtyFields.value?.has(path.value))

const isValid = computed(() => errors.value.length === 0)

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


// TRIGGERS
const validateOn = computed(() => ({
  ...formInstance.validateOn,
  ...props.validateOn,
}))

const validationMode = computed(() => ({
  ...formInstance.validationMode,
  ...props.validationMode,
}))

/**
 * Handles input or change events on the field to avoid double validation loops.
 * @param eventType The type of event to handle.
 */
const handleOnInputOrChange = (eventType: 'onInput' | 'onChange') => {
  dirty()

  const isFieldClean = dequal(value.value, getProperty(formInstance.initialValues, path.value))

  if (isFieldClean) unDirty()
  else dirty()

  // Exit early if this event type isn't supposed to trigger validation
  if (!validateOn.value[eventType] || validationMode.value.lazy) return

  // Eager: validates if there are errors
  if (validationMode.value.eager && errors.value.length > 0) {
    validate()
  }
}

const onBlur = () => {
  touch()
  if (validateOn.value.onBlur) validate()
}

const onChange = () => handleOnInputOrChange('onChange')

const onInput = () => handleOnInputOrChange('onInput')

const onFocus = () => {
  if (validateOn.value.onFocus) validate()
}

const events = computed(() => ({
  onBlur,
  onInput,
  onChange,
  onFocus,
}))


// INSTANCE
const fieldInstance = reactive({
  path,

  value,

  isValidating,
  validate,
  isValid,

  errors,
  
  touch,
  unTouch,
  isTouched,
  
  dirty,
  unDirty,
  isDirty,

  events,
  onBlur,
  onInput,
  onChange,
  onFocus,
}) // as NotFieldInstance<TSchema, TPath>

onMounted(async () => {
  await nextTick()
  if (validateOn.value.onMount) validate()
})
</script>

<template>
  <slot v-bind="fieldInstance" />
</template>
