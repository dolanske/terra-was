import { PhotoModel } from '~~/server/models/photo'

export default defineEventHandler((event) => {
  const { id } = event.context.params
  // TODO
  return PhotoModel.findOne({ _id: id }).lean().exec()
})
