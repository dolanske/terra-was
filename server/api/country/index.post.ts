import type { Country } from '~~/utils/country.types'
import { CountryModel } from '~~/server/models/country'

export default defineEventHandler(async (event) => {
  /**
   * To create a country, we just need to know the ISO. It will automatically create a db entry with the visits array
   */
  const { iso } = await readBody<{ iso: string }>(event)

  if (!iso) {
    event.node.res.statusCode = 400
    return {
      code: '[country.post] MISSING_REQUIRED_PARAM',
      message: 'Missing required parameters.',
    }
  }

  // Check if country already exists. If yes, error out
  const exists = await CountryModel.findOne({ iso })

  if (exists) {
    event.node.res.statusCode = 500
    return {
      code: '[country.post] SERVER_ERROR',
      message: `Country with iso ${iso} already exists`,
    }
  }

  // Proceed and create country
  const newCountry: Country = { iso, visits: [] }

  return CountryModel.create(newCountry)
    .then(({ iso, visits }) => {
      // Return only values we want
      return {
        iso,
        // Filter out db stuff
        visits: visits.map(({ date, postId }) => ({ date, postId })),
      }
    })
    .catch((err) => {
      event.node.res.statusCode = 500
      return {
        code: '[country.post] SERVER_ERROR',
        message: `Internal server error. ${err.message}`,
      }
    })
})
