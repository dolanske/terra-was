// https://medium.com/@shahriarrahi/create-api-with-nuxt3-adcb7b6a17dd
// https://medium.com/@flanker72/nuxt3-complex-solutions-database-integration-8df941f0fb82

import { tripModel } from '~~/server/models/trip'

export default defineEventHandler(async (event) => {
  const id = event.context.params.id

  return tripModel.findOne({ _id: id })
    .then((res) => {
      if (!res) {
        event.node.res.statusCode = 404

        return {
          code: 'TRIP_NOT_FOUND',
          message: `Trip with id ${id} does not exist.`,
        }
      }

      return res
    })
    .catch(() => {
      event.node.res.statusCode = 500

      return {
        code: 'ERROR',
        message: 'Something went wrong.',
      }
    })
})
