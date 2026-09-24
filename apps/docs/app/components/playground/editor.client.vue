<!-- eslint-disable no-useless-escape -->
<script setup lang="ts">
import type * as monaco from 'monaco-editor-core'
import type { Component } from 'vue'
import { Repl, type SFCOptions, useStore, useVueImportMap } from '@vue/repl'
import { breakpointsTailwind, useBreakpoints, useClipboard } from '@vueuse/core'
import '@vue/repl/style.css'

const colorMode = useColorMode()
const theme = computed(() => (colorMode.value === 'dark' ? 'dark' : 'light'))

const breakpoints = useBreakpoints(breakpointsTailwind)
const replLayout = computed(() => (breakpoints.smaller('lg').value ? 'vertical' : 'horizontal'))

const vueImportMap = useVueImportMap({
  runtimeDev: 'https://esm.sh/vue@3/dist/vue.esm-browser.js',
  runtimeProd: 'https://esm.sh/vue@3/dist/vue.esm-browser.prod.js',
  serverRenderer: 'https://esm.sh/@vue/server-renderer@3/dist/server-renderer.esm-browser.js',
})

const builtinImportMap = computed(() => ({
  imports: {
    ...vueImportMap.importMap.value.imports,
    notform: 'https://esm.sh/notform?external=vue',
    zod: 'https://esm.sh/zod@4?external=vue',
  },
}))

const sfcOptions = computed<SFCOptions>(() => ({
  script: {
    inlineTemplate: vueImportMap.productionMode.value,
    isProd: vueImportMap.productionMode.value,
    propsDestructure: true,
  },
  style: {
    isProd: vueImportMap.productionMode.value,
  },
  template: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag === 'mjx-container' || tag.startsWith('custom-'),
    },
    isProd: vueImportMap.productionMode.value,
  },
}))

const previewOptions = {
  headHTML: [
    '<script>window.__VUE_PROD_DEVTOOLS__=false<\/script>',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:ital,wght@0,100..900;1,100..900&family=Geist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">',
    '<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"><\/script>',
    '<style type="text/tailwindcss">@theme { --font-sans: \'Geist\', sans-serif; --font-mono: \'Geist Mono\', monospace;}</style>',
    '<style>body { font-family: var(--font-sans); }</style>',
    '<style>#app { isolation: isolate; }</style>',
  ].join(''),
}

const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  tabSize: 2,
}

const replStore = useStore({
  builtinImportMap,
  outputMode: ref('preview'),
  sfcOptions,
  showOutput: ref(false),
  typescriptVersion: ref('6.0.3'),
  vueVersion: vueImportMap.vueVersion,
})

const defaultCode = `<script setup lang="ts">
import { NotField, NotForm, NotMessage, useNotForm } from 'notform'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

const form = useNotForm({
  onSubmit(values) {
    console.log('Submitted:', values)
  },
  schema,
})
<\/script>

<template>
  <NotForm :form="form" @submit="form.submit">
    <NotField v-slot="{ events, path }" path="email">
      <label :for="path">Email</label>

      <input
        :id="path"
        v-model="form.values.email"
        v-bind="events"
        type="email"
        placeholder="user@example.com"
      >

      <NotMessage :path="path" />
    </NotField>

    <button type="submit">
      Submit
    </button>
  </NotForm>
</template>
`
const MonacoEditor = shallowRef<Component>()
const loading = ref(true)
let cleanupSync: (() => void) | undefined

/**
 * Resets the playground to its default state.
 * Clears the URL hash to prevent restoring the code from the URL.
 */
function resetToDefault() {
  replStore.setFiles({ 'src/App.vue': defaultCode }, 'src/App.vue')
  if (location.hash) {
    history.replaceState({}, '', location.pathname)
  }
}

const clipboard = useClipboard({
  legacy: true,
  source: () => location.href,
})

onMounted(async () => {
  // 1. Initialize store files: hash state or default code
  const hasInitialHash = !!location.hash
  if (hasInitialHash) {
    replStore.deserialize(location.hash)
  } else {
    replStore.setFiles({ 'src/App.vue': defaultCode }, 'src/App.vue')
  }

  // Always initialize store to register watchers, tsconfig, and compiler pipeline
  replStore.init()

  // 2. Dynamically import Monaco Editor (browser-only)
  const monacoModule = await import('@vue/repl/monaco-editor')
  MonacoEditor.value = monacoModule.default

  loading.value = false

  // 3. Sync store state to URL hash
  const stopSync = watchEffect(() => {
    const serialized = replStore.serialize()
    const isDefault = !hasInitialHash && replStore.getFiles()['App.vue']?.trimEnd() === defaultCode.trimEnd()

    if (isDefault) {
      if (location.hash) {
        history.replaceState({}, '', location.pathname)
      }
      return
    }

    history.replaceState({}, '', serialized)
  })

  // eslint-disable-next-line unicorn/no-top-level-assignment-in-function
  cleanupSync = stopSync
})

onBeforeUnmount(() => {
  cleanupSync?.()

  // Dispose Monaco models to prevent duplicate models and memory leaks on route changes
  try {
    const monaco = (globalThis as any).monaco as typeof import('monaco-editor-core')
    if (monaco?.editor) {
      for (const model of monaco.editor.getModels()) {
        model.dispose()
      }
    }
  } catch {
    // ignore
  }
})
</script>

<template>
  <div
    class="
      flex flex-col overflow-hidden rounded-xl border border-default bg-default
      shadow-xs shadow-neutral-800 block-full inline-full
    "
  >
    <!-- Playground Top Toolbar -->
    <div
      class="
        flex shrink-0 items-center justify-between gap-2 border-be
        border-default bg-muted/30 px-4 py-2
      "
    >
      <h1
        class="text-xs font-semibold tracking-wider text-highlighted uppercase"
      >
        NotForm Playground
      </h1>

      <div class="flex items-center gap-2">
        <Button
          icon="tabler:rotate"
          label="Reset"
          variant="outline"
          size="sm"
          @click="resetToDefault"
        />

        <Button
          :icon="clipboard.copied.value ? 'tabler:check' : 'tabler:share'"
          :label="clipboard.copied.value ? 'Copied!' : 'Share'"
          variant="outline"
          size="sm"
          @click="clipboard.copy()"
        />
      </div>
    </div>

    <!-- Editor / REPL container -->
    <div class="relative flex flex-1 flex-col inline-full min-block-0">
      <PlaygroundSpinner v-if="loading">
        Initializing editor & compiler
      </PlaygroundSpinner>

      <Repl
        v-else-if="MonacoEditor"
        :store="replStore"
        :editor="MonacoEditor"
        :theme="theme"
        :layout="replLayout"
        :show-compile-output="false"
        :show-ts-config="false"
        :show-import-map="true"
        :clear-console="false"
        :auto-resize="true"
        :editor-options="{ monacoOptions }"
        :preview-options="previewOptions"
        preview-theme
        class="flex-1! block-full! inline-full!"
      />
    </div>
  </div>
</template>

<style lang="css">
@reference "../../assets/css/main.css";

.iframe-container iframe {
  @apply bg-default! p-2;
}

.monaco-editor {
  --vscode-editor-background: var(--ui-bg) !important;
  --vscode-editor-foreground: var(--ui-text) !important;
  --vscode-editorGutter-background: var(--ui-bg) !important;
}

.vue-repl,
.dark .vue-repl {
  --bg: var(--ui-bg);
  --bg-soft: var(--ui-bg-muted);
  --border: var(--ui-border);
  --text-light: var(--ui-text-muted);
  --color-branding: var(--ui-primary);
  --color-branding-dark: var(--ui-primary);

  & .file-selector {
    @apply px-4;
  }

  & .output-container {
    @apply h-full;
  }

  & .tab-buttons {
    @apply hidden;
  }
}
</style>
