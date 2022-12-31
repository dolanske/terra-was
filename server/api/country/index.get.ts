import { CountryModel } from '~~/server/models/country'

export default defineEventHandler(async (event) => {
  return CountryModel.find()
    .then(res => res)
    .catch(() => {
      event.node.res.statusCode = 500

      return {
        code: 'ERROR',
        message: '[country.get] Something went wrong.',
      }
    })
})
