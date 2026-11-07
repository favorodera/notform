/* eslint-disable no-console */

/**
 * @file
 * Synchronizes `@vue/repl`'s prebuilt worker chunks to public/playground/repl-workers/
 * under stable filenames. Ensures the Worker constructor patch in
 * app/plugins/repl-worker.client.ts always up to date.
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const rootDir = path.join(__dirname, '..')
const nodeModules = path.join(rootDir, 'node_modules')

const outputDir = path.join(rootDir, 'public', 'playground', 'repl-workers')

const workersMap = [
  { match: 'vue.worker', output: 'vue.worker.js' },
  { match: 'editor.worker', output: 'editor.worker.js' },
]

function main() {
  if (!existsSync(nodeModules)) {
    console.warn('[docs:copy-repl-workers] node_modules not found, skipping.')
    return
  }

  const replAssetsDir = path.join(nodeModules, '@vue', 'repl', 'dist', 'assets')

  if (!existsSync(replAssetsDir)) {
    console.warn('[docs:copy-repl-workers] Repl assets directory not found.')
    process.exitCode = 1
    return
  }

  rmSync(outputDir, { force: true, recursive: true })
  mkdirSync(outputDir, { recursive: true })

  const assetsJsFiles = readdirSync(replAssetsDir).filter((file) => {
    const fullPath = path.join(replAssetsDir, file)
    return statSync(fullPath).isFile() && file.endsWith('.js')
  })

  let copiedCount = 0

  for (const { match, output } of workersMap) {
    const sourceFile = assetsJsFiles.find((file) => {
      return file.includes(match)
    })

    if (!sourceFile) {
      console.warn(`[docs:copy-repl-workers] No file matching "${match}" found in ${replAssetsDir}. Skipping.`)
      continue
    }

    copyFileSync(path.join(replAssetsDir, sourceFile), path.join(outputDir, output))
    copiedCount++
  }

  if (copiedCount === 0) {
    console.error('[docs:copy-repl-workers] No workers copied. Recheck workersMap "match" values against actual filenames in the dist folder.')
    process.exitCode = 1
  } else {
    console.log(`[docs:copy-repl-workers] Copied ${copiedCount}/${workersMap.length} worker(s).`)
  }
}

main()
