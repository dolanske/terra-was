import mongoose from 'mongoose'

// https://medium.com/@flanker72/nuxt3-complex-solutions-database-integration-8df941f0fb82

const { error, log } = console

export default async () => {
  const config = useRuntimeConfig()

  mongoose.set('strictQuery', true)

  mongoose.connect(config.MONGO_URL)
    .then(() => log('connected to db'))
    .catch(err => error('Error, no connection.', err))
}
