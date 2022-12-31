import { CountryModel } from '~~/server/models/country'

export default defineEventHandler(async (event) => {
  return CountryModel.find()
    .then((res) => {
      // Iterate over countries and strip out DB data
      return res.map((country) => {
        return {
          iso: country.iso,
          visits: country.visits.map(({ date, postId }) => ({ date, postId })),
        }
      })
    })
    .catch(() => {
      event.node.res.statusCode = 500

      return {
        code: 'ERROR',
        message: '[country.get] Something went wrong.',
      }
    })
})
