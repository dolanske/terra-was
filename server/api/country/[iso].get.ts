import { CountryModel } from '~~/server/models/country'

export default defineEventHandler(async (event) => {
  const { iso } = event.context.params

  return CountryModel.findOne({ iso })
    .then((res) => {
      if (!res) {
        event.node.res.statusCode = 404

        return {
          code: 'NOT_FOUND',
          message: `[country.get[id]] Trip with id ${iso} does not exist.`,
        }
      }

      return {
        iso: res.iso,
        visits: res.visits.map(({ date, postId }) => ({ date, postId })),
      }
    })
    .catch((err) => {
      event.node.res.statusCode = 500

      return {
        code: 'ERROR',
        message: `[country.get[id]] Something went wrong. ${err.message}`,
      }
    })
})
