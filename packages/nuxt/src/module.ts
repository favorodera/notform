import { addComponent, addImports, createResolver, defineNuxtModule } from '@nuxt/kit'

const components = [
  'NotForm',
  'NotField',
  'NotArrayField',
  'NotMessage',
] as const

export default defineNuxtModule({
  meta: {
    compatibility: {
      nuxt: '>=4.0.0',
    },
    configKey: 'notform',
    name: 'notform-nuxt',
  },

  async setup() {
    const { resolvePath } = createResolver(import.meta.url)

    const notformPath = await resolvePath('notform')

    for (const name of components) {
      addComponent({
        export: name,
        filePath: notformPath,
        name,
      })
    }

    addImports({
      as: 'useNotForm',
      from: notformPath,
      name: 'useNotForm',
    })
  },

})
