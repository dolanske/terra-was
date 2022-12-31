import { CountryModel } from '~~/server/models/country'

export default defineEventHandler(async (event) => {
  // TODO: use useQuery instead
  const id = event.context.params.iso

  return CountryModel.findOne({ _id: id })
    .then((res) => {
      if (!res) {
        event.node.res.statusCode = 404

        return {
          code: 'NOT_FOUND',
          message: `[country.get[id]] Trip with id ${id} does not exist.`,
        }
      }

      return res
    })
    .catch(() => {
      event.node.res.statusCode = 500

      return {
        code: 'ERROR',
        message: '[country.get[id]] Something went wrong.',
      }
    })
})
