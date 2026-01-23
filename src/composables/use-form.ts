import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { FormContext, UseFormOptions, UseFormReturn } from '../types/form'
import type { Ref } from 'vue'
import { computed, provide, ref, toValue, useId } from 'vue'
import type { ObjectSchema } from '../types/shared'
import { getFormContextKey } from '../utils/form-context'
import type { DeepPartial, Paths } from '../types/utils'
import { getProperty, parsePath } from 'dot-prop'
import { getObjectPaths, isIssuePathEqual } from '../utils/helpers'

/**
 * Initializes a form instance with validation logic, reactive state, and lifecycle methods.
 * @template TSchema The validation schema type derived from ObjectSchema.
 * @param options Configuration object for the form behavior and initial state.
 * @returns The gathered form context object.
 */
function useForm<TSchema extends ObjectSchema>(options: UseFormOptions<TSchema>): UseFormReturn<TSchema> {
  const {
    id = useId(),
    schema: _schema,
    initialErrors: _initialErrors = [],
    initialState: _initialState = {},
    mode = 'lazy',
    validateOn = ['blur', 'input', 'change'],
    onValidate,
    onReset,
    onError,
  } = options

  /** Active validation schema reference */
  const schema = computed(() => toValue(_schema))
  /** Baseline reactive state at creation */
  const initialState = structuredClone(_initialState) as StandardSchemaV1.InferInput<TSchema>
  /** Baseline validation issues at creation */
  const initialErrors = structuredClone(_initialErrors) as StandardSchemaV1.Issue[]

  /** Internal state set by last custom reset */
  const onResetState = ref<StandardSchemaV1.InferInput<TSchema> | null>(null)
  /** Internal errors set by last custom reset */
  const onResetErrors = ref<StandardSchemaV1.Issue[] | null>(null)

  /** The unified reactive context for the form instance */
  const context: FormContext<TSchema> = {
    id,
    schema,
    initialState,
    initialErrors,
    mode,
    validateOn,
    state: ref(structuredClone(initialState)) as Ref<StandardSchemaV1.InferInput<TSchema>>,
    errors: ref([...initialErrors]),
    isValidating: ref(false),
    touchedFields: ref(new Set<string>()) as Ref<Set<Paths<StandardSchemaV1.InferInput<TSchema>>>>,
    dirtyFields: ref(new Set<string>()) as Ref<Set<Paths<StandardSchemaV1.InferInput<TSchema>>>>,

    isValid: computed(() => context.errors.value.length === 0),
    isTouched: computed(() => context.touchedFields.value.size > 0),
    isDirty: computed(() => context.dirtyFields.value.size > 0),

    /**
     * Validates all form fields against the schema.
     * @returns Result of the validation process.
     */
    async validate() {
      context.isValidating.value = true
      try {
        const result = await context.schema.value['~standard'].validate(context.state.value)
        if (result.issues) {
          context.errors.value = [...result.issues]
          onError?.([...result.issues])
          return { issues: result.issues }
        }

        if (onValidate) {
          const customResult = await onValidate(result.value)
          if (customResult === false) {
            const formLevelError: StandardSchemaV1.Issue = { message: 'Validation failed', path: [] }
            context.errors.value = [formLevelError]
            onError?.([formLevelError])
            return { issues: [formLevelError] }
          }
          if (Array.isArray(customResult) && customResult.length > 0) {
            context.errors.value = customResult
            onError?.(customResult)
            return { issues: customResult }
          }
        }

        context.errors.value = []
        return { value: result.value }
      }
      finally {
        context.isValidating.value = false
      }
    },

    /**
     * Validates a single specified field in the form.
     * @param path The path of the field to validate.
     * @returns Result for the specific field.
     */
    async validateField(path) {
      context.isValidating.value = true
      try {
        const result = await context.schema.value['~standard'].validate(context.state.value)
        const pathArray = parsePath(path)
        context.errors.value = context.errors.value.filter(error => !isIssuePathEqual(error.path, pathArray))

        if (result.issues) {
          const errorsForPath = result.issues.filter(error => isIssuePathEqual(error.path, pathArray))
          if (errorsForPath.length > 0) {
            context.errors.value = [...context.errors.value, ...errorsForPath]
            return { issues: errorsForPath }
          }
          return { value: getProperty(context.state.value, path) }
        }
        return { value: getProperty(result.value, path) }
      }
      finally {
        context.isValidating.value = false
      }
    },

    /**
     * Reverts form state and errors to initial or custom baseline.
     * @param _state Optional partial state to reset to.
     * @param _errors Optional issues to reset to.
     * @param _validate Re-validate after reset (default: false).
     */
    reset(_state?: DeepPartial<StandardSchemaV1.InferInput<TSchema>>, _errors?: StandardSchemaV1.Issue[], _validate: boolean = false) {
      if (_state) {
        onResetState.value = structuredClone(_state) as StandardSchemaV1.InferInput<TSchema>
        context.state.value = structuredClone(_state) as StandardSchemaV1.InferInput<TSchema>
      }
      else {
        onResetState.value = null
        context.state.value = structuredClone(initialState)
      }

      if (_errors) {
        onResetErrors.value = structuredClone(_errors)
        context.errors.value = [..._errors]
      }
      else {
        onResetErrors.value = null
        context.errors.value = [...initialErrors]
      }

      context.touchedFields.value.clear()
      context.dirtyFields.value.clear()
      onReset?.()
      if (_validate) context.validate()
    },

    /**
     * Directly updates the form state object.
     * @param _state Merged partial state update.
     * @param _validate Trigger validation after update (default: true).
     */
    setState(_state: DeepPartial<StandardSchemaV1.InferInput<TSchema>>, _validate: boolean = true) {
      context.state.value = { ...context.state.value, ..._state }
      if (_validate) context.validate()
    },

    /**
     * Directly merges new issues into the errors list.
     * @param _errors List of issues to add.
     */
    setErrors(_errors) {
      context.errors.value = [...context.errors.value, ..._errors]
    },

    /** Clears all validation issues for the entire form */
    clearErrors() {
      context.errors.value = []
    },

    /**
     * Returns active issues for a single field path.
     * @param field The path to the field.
     * @returns Array of issues.
     */
    getFieldErrors(field) {
      const pathArray = parsePath(field)
      return context.errors.value.filter(error => isIssuePathEqual(error.path, pathArray))
    },

    /**
     * Registers a field as interacted with.
     * @param field The path to the field.
     */
    touchField(field) {
      context.touchedFields.value.add(field)
    },

    /** Registers all existing form fields as touched */
    touchAllFields() {
      const paths = getObjectPaths(context.state.value) as Paths<StandardSchemaV1.InferInput<TSchema>>[]
      context.touchedFields.value = new Set(paths)
    },

    /**
     * Recalculates dirty status for a specific field path.
     * @param field The path to the field.
     */
    dirtyField(field) {
      const currentValue = getProperty(context.state.value, field)
      const baselineState = onResetState.value ?? initialState
      const baselineValue = getProperty(baselineState, field)

      if (currentValue !== baselineValue) {
        context.dirtyFields.value.add(field)
      }
      else {
        context.dirtyFields.value.delete(field)
      }
    },

    /** Registers all fields as having been modified (dirty) */
    dirtyAllFields() {
      const paths = getObjectPaths(context.state.value) as Paths<StandardSchemaV1.InferInput<TSchema>>[]
      context.dirtyFields.value = new Set(paths)
    },

    /**
     * Submits the form after successful validation.
     * @param event Form submission event.
     * @param callback Logic to run if validation passes.
     */
    async submit(event, callback) {
      event?.preventDefault()
      event?.stopPropagation()

      const result = await context.validate()
      if (result.issues) {
        context.errors.value = [...result.issues]
        return
      }

      context.touchAllFields()
      context.dirtyAllFields()
      if (callback) {
        await callback(result.value)
      }
    },
  }

  provide(getFormContextKey<TSchema>(id), context)
  return context
}

export default useForm
