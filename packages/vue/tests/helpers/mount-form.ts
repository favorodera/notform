import { mount } from '@vue/test-utils'
import { ArrayField, Field, FieldError, Form, type FormConfig, type FormSchema } from '../../src'
import { createForm } from '../../src/factories/create-form'

/**
 * Registers and mounts the NotForm components and composable.
 * @param config Config to setup the form instance.
 * @param template The template to render.
 * @returns The form instance and mounted wrapper.
 */
export function mountForm<TSchema extends FormSchema>(config: Partial<FormConfig<TSchema>>, template: string) {
  const form = createForm(config as FormConfig<TSchema>)

  const wrapper = mount({
    components: { ArrayField, Field, FieldError, Form },
    setup: () => {
      return { form }
    },
    template,
  })

  return { form, wrapper }
}
