/**
 * Synchronizes `@vue/repl`'s prebuilt worker chunks to public/vue-repl-workers/
 * under stable filenames. Ensures the Worker constructor patch in
 * app/plugins/monaco-worker-patch.client.ts always up to date.
 *
 * Runs by default via a "postinstall" script in package.json so it
 * self-heals whenever `@vue/repl` is updated.
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const rootDir = path.join(__dirname, '..')
const nodeModules = path.join(rootDir, 'node_modules')

const outputDir = path.join(rootDir, 'public', 'repl-workers')

/**
 * Maps a substring found in the source filename → the stable output filename
 * this project's Worker patch expects.
 */
const workersMap = [
  { match: 'vue.worker', output: 'vue.worker.js' },
  { match: 'editor.worker', output: 'editor.worker.js' },
]

/** Validates that all files in the workersMap exist and copies them to the output directory. */
function main() {
  if (!existsSync(nodeModules)) {
    console.warn('[sync-repl-workers] node_modules not found, skipping.')
    return
  }

  const replAssetsDir = path.join(nodeModules, '@vue', 'repl', 'dist', 'assets')

  if (!existsSync(replAssetsDir)) {
    console.warn('[sync-repl-workers] Repl assets directory not found.')
    process.exitCode = 1
    return
  }

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  const assetsJsFiles = readdirSync(replAssetsDir).filter((file) => {
    const fullPath = path.join(replAssetsDir, file)
    return statSync(fullPath).isFile() && file.endsWith('.js')
  })

  let copiedCount = 0

  for (const { match, output } of workersMap) {
    const sourceFile = assetsJsFiles.find(file => file.includes(match))

    if (!sourceFile) {
      console.warn(`[sync-repl-workers] No file matching "${match}" found in ${replAssetsDir}. Skipping.`)
      continue
    }

    copyFileSync(path.join(replAssetsDir, sourceFile), path.join(outputDir, output))
    copiedCount++
  }

  if (copiedCount === 0) {
    console.error('[sync-repl-workers] No workers copied. Recheck workersMap "match" values against actual filenames in the dist folder.')
    process.exitCode = 1
  } else {
    // eslint-disable-next-line no-console
    console.log(`[sync-repl-workers] Copied ${copiedCount}/${workersMap.length} worker(s).`)
  }
}

main()
