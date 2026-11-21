import { site } from '#shared/site'

/**
 * Sends an authenticated application request to a GitHub API endpoint.
 * @template TData - Response data type returned by the GitHub endpoint.
 * @param path GitHub API path appended to the configured API base URL.
 * @param query Optional query parameters to append to the request.
 * @returns A promise that resolves with the decoded GitHub API response.
 * @throws Rejects when the request fails or exceeds five seconds.
 * @example
 * ```ts
 * const stars = await githubFetch<{ stargazers_count: number }>('/repos/favorodera/notform')
 * ```
 */
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
