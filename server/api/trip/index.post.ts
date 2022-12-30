import type { TripDB, __TripBase__ } from '~~/utils/trip.types'

export default defineEventHandler(async (event) => {
  const {
    title,
    description,
    map,
    iso,
    date,
    images,
  } = await readBody<__TripBase__>(event)

  const id = crypto.randomUUID()

  // Fail if required parameters are missing
  if (!title || !iso || !date) {
    event.res.statusCode = 400
    return {
      code: 'MISSING_REQUIRED_PARAM',
      message: 'Missing required parameters.',
    }
  }

  /**
   * We do not save the visits folder, but
   */
  const newPost: TripDB = {
    id,
    title,
    description,
    map,
    iso,
    images,
    date,
  }

  // Save a new visit to a country db schema
})
