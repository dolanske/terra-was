// https://medium.com/@shahriarrahi/create-api-with-nuxt3-adcb7b6a17dd
// https://medium.com/@flanker72/nuxt3-complex-solutions-database-integration-8df941f0fb82

import { TripModel } from '~/server/models/trip'

export default defineEventHandler(async (event) => {
  return TripModel.find()
    .then(res => res)
    .catch(() => {
      event.node.res.statusCode = 500

      return {
        code: 'ERROR',
        message: '[trip.get] Something went wrong.',
      }
    })
})
