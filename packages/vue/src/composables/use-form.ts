import type { FormConfig, FormInstance } from '../types/form'
import type { FormSchema } from '../types/schema'
import { createForm } from '../factories/create-form'

/**
 * Creates a reactive, schema-validated form. Call it inside `setup()`, so its
 * watchers and pending timers are cleaned up when the component unmounts.
 * @template TSchema - A Standard Schema (Zod, Valibot, ArkType, ...) describing the form's data. Must be an object schema.
 * @param config The schema, optional starting values/errors, and an optional submit handler.
 * @returns The form. Pass it to `<Form :form />` and use `form.field(path)` / `form.arrayField(path)` to create fields.
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { z } from 'zod'
 * import { Field, Form, useForm } from 'notform'
 *
 * const form = useForm({
 *   schema: z.object({ email: z.email() }),
 *   initialValues: { email: '' },
 *   onSubmit: async (data) => {
 *     await api.signUp(data) // `data` is the validated output
 *   },
 * })
 * </script>
 *
 * <template>
 *   <Form :form>
 *     <Field v-slot="{ field }" :field="form.field('email')">
 *       <input v-model="field.model" v-bind="field.events" type="email">
 *     </Field>
 *     <button type="submit" :disabled="form.isSubmitting">Sign up</button>
 *   </Form>
 * </template>
 * ```
 */
export function useForm<TSchema extends FormSchema>(config: FormConfig<TSchema>): FormInstance<TSchema> {
  return createForm(config)
}
