import { site } from '#shared/site'

const getGithubStars = defineCachedFunction(
  async () => {
    const data = await $fetch<{ repo?: { stars?: number } }>(site.github.api, {
      timeout: 5000,
    })

    const stars = data?.repo?.stars

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
    maxAge: 60 * 60 * 24,
    name: 'ghStars',
  },
)

export default defineEventHandler(() => {
  return getGithubStars()
})
