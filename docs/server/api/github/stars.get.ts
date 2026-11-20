import { site } from '#shared/site'

const getGithubStars = defineCachedFunction(
  async () => {
    const data = await $fetch<{ count: number }>(`${site.github.api}/stargazers/count`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2026-03-10',
      },
      timeout: 5000,
    })

    const stars = data?.count

    if (typeof stars !== 'number' || Number.isNaN(stars)) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Unexpected API response shape',
      })
    }

    return stars
  },
  {
    getKey: () => {
      return 'githubStarsGet'
    },
    maxAge: 60 * 60 * 24, // 24 hours
    name: 'ghStars',
  },
)

export default defineEventHandler(() => {
  return getGithubStars()
})
