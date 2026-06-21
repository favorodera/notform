import type { Collections } from '@nuxt/content'
import { queryCollection } from '@nuxt/content/server'
import { stringify } from 'minimark/stringify'
import { withLeadingSlash } from 'ufo'

export default eventHandler(async (event) => {
  const slug = getRouterParams(event)['slug.md']
  if (!slug?.endsWith('.md')) {
    throw createError({ fatal: true, statusCode: 404, statusMessage: 'Page not found' })
  }

  const path = withLeadingSlash(slug.replace('.md', ''))

  // eslint-disable-next-line ts/no-explicit-any
  const page = await queryCollection(event as any, 'docs' as keyof Collections)
    .path(path)
    .first()

  if (!page) {
    throw createError({ fatal: true, statusCode: 404, statusMessage: 'Page not found' })
  }

  // Add title and description to the top of the page if missing
  if (page.body.value[0]?.[0] !== 'h1') {
    page.body.value.unshift([
      'h1',
      {},
      page.title,
    ], [
      'blockquote',
      {},
      page.description,
    ])
  }

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  return stringify({ ...page.body, type: 'minimark' }, { format: 'markdown/html' })
})
