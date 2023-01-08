import { CountryModel } from '~~/server/models/country'
import { TripModel } from '~~/server/models/trip'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params

  if (!id) {
    event.node.res.statusCode = 400
    return {
      code: '[trip.delete] MISSING_REQUIRED_PARAM',
      message: 'Missing required parameters.',
    }
  }

  // Fetch post from DB
  const trip = await TripModel.findOne({ id })

  if (!trip) {
    event.node.res.statusCode = 500
    return {
      code: '[trip.delete] SERVER_ERROR',
      message: `Cannot delete trip. Trip with id ${id} does not exist.`,
    }
  }

  // If trip contains image, delete them from the DB + files
  if (trip.images.length > 0) {
    try {
      for (const image of trip.images)
        $fetch(`/api/photo/${image.id}`, { method: 'DELETE' })
    }
    catch (err: any) {
      // Here we do not have to log anything as image deletion
      // has its own error handling
    }
  }

  // Remove a visit item from a country by trip ID
  // Get a country
  const iso = trip.iso
  const country = await CountryModel.findOne({ iso })

  // Filter from array of visits
  if (!country) {
    event.node.res.statusCode = 500
    return {
      code: '[trip.delete] SERVER_ERROR',
      message: 'Error when removing country visit. Country does not exist',
    }
  }

  const visits = country.visits.filter(({ postId }) => postId !== trip.id)

  // Update country by ID
  await country.update({ visits })
  // await CountryModel.findOneAndUpdate({iso}, )

  /**
   *
   *
   * #3 Remove a visit item from a country by trip ID
   *
   * #4 Remove trip object from the DB
   */
})
