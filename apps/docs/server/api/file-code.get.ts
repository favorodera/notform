import { readFile } from 'node:fs/promises'
import { resolve, basename } from 'node:path'

export default defineEventHandler(async (event) => {
  const { path, language } = getQuery(event)

  const filePath = resolve(process.cwd(), path as string)
  const file = await readFile(filePath, 'utf-8')

  const filename = basename(filePath)
  const lang = language ?? filename.split('.').pop() ?? 'txt'

  return `\`\`\`${lang} \n${file.trim()}\n\`\`\``
})
