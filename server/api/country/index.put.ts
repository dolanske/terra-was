import { CountryModel } from '~~/server/models/country'
import type { CountryCreate } from '~~/utils/country.types'

export default defineEventHandler(async (event) => {
  /**
   * Creating a country takes in iso (id) and a date from the post.
   */
  const { iso, date, postId } = await readBody<CountryCreate>(event)

  if (!iso || !date || !postId) {
    event.node.res.statusCode = 400
    return {
      code: 'MISSING_REQUIRED_PARAM',
      message: '[country.put] Missing required parameters.',
    }
  }

  // Check if country exists, if not, error out cause we cannot update it
  const current = await CountryModel.findOne({ iso })

  if (!current) {
    event.node.res.statusCode = 500
    return {
      code: 'SERVER_ERROR',
      message: `[country.put] Country with iso ${iso} does not exist`,
    }
  }

  current.visits.push({ date, postId })

  return CountryModel.updateOne({ iso }, current)
    .then(() => {
      return {
        iso,
        visits: current.visits,
      }
    })
    .catch((err) => {
      event.node.res.statusCode = 500
      return {
        code: 'SERVER_ERROR',
        message: `[country.put] Internal server error. ${err.message}`,
      }
    })
})
