import { ImageModel } from '~~/server/models/image'

export default defineEventHandler((event) => {
  const { id } = event.context.params
  return ImageModel.findOne({ _id: id }).lean().exec()
})
