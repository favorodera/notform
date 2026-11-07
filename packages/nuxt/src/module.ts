import { addComponent, addImports, createResolver, defineNuxtModule } from '@nuxt/kit'
import packageJson from '../package.json'

const componentNames = ['Form', 'Field', 'ArrayField', 'FieldError'] as const

const composableName = 'useForm' as const

export interface ModuleOptions {
  aliases?: Partial<Record<typeof componentNames[number] | typeof composableName, string>>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    compatibility: { nuxt: '>=4.0.0' },
    configKey: 'notform',
    name: packageJson.name,
    version: packageJson.version,
  },

  async setup(options) {
    const { resolvePath } = createResolver(import.meta.url)

    const corePackagePath = await resolvePath('notform')

    for (const componentExportName of componentNames) {
      const registeredComponentName = options.aliases?.[componentExportName] ?? componentExportName

      addComponent({
        export: componentExportName,
        filePath: corePackagePath,
        name: registeredComponentName,
        priority: 1,
      })
    }

    const registeredComposableName = options.aliases?.[composableName] ?? composableName

    addImports({
      as: registeredComposableName,
      from: corePackagePath,
      name: composableName,
      priority: 1,
    })
  },
})
