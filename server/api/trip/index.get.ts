// https://medium.com/@shahriarrahi/create-api-with-nuxt3-adcb7b6a17dd
// https://medium.com/@flanker72/nuxt3-complex-solutions-database-integration-8df941f0fb82

import { tripModel } from '~/server/models/trip'

export default defineEventHandler(async (event) => {
  return tripModel.find()
    .then((res) => {
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
