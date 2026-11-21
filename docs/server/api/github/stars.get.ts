const getGithubStars = defineCachedFunction(
  async () => {
    const data = await githubFetch<{ count: number }>(`/stargazers/count`)

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
