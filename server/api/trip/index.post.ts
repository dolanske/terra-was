import { CountryModel } from '~~/server/models/country'
import { TripModel } from '~~/server/models/trip'
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

  // Fail if required parameters are missing
  if (!title || !iso || !date) {
    event.node.res.statusCode = 400
    return {
      code: 'MISSING_REQUIRED_PARAM',
      message: '[trip.post] Missing required parameters.',
    }
  }

  const id = await TripModel.countDocuments() + 1

  /**
   * We do not save the visits folder, but
   */
  const newTrip: TripDB = { id, title, description, map, iso, images, date }

  // Save a new visit to a country db schema
  const countryExists = await CountryModel.findOne({ iso })

  if (!countryExists) {
    // Create entry first
    await $fetch('/api/country', { method: 'POST', body: { iso } })
  }

  // Update country by giving it the posts date. This will save it as a visit within that country.
  await $fetch('/api/country', { method: 'PUT', body: { iso, date, postId: id } })

  TripModel.create(newTrip)
})
