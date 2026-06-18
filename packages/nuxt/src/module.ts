import { addComponent, addImports, defineNuxtModule } from '@nuxt/kit'

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

  setup() {
    for (const name of components) {
      addComponent({
        export: name,
        filePath: 'notform',
        name,
      })
    }

    addImports({
      as: 'useNotForm',
      from: 'notform',
      name: 'useNotForm',
    })
  },

})
