import { site } from '#shared/site'

export async function githubFetch<TData>(path: string, query?: Record<string, number | string>): Promise<TData> {
  return $fetch<TData>(`${site.github.api}${path}`, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2026-03-10',
    },
    query,
    timeout: 5000,
  })
}
