import { rm } from 'fs/promises'
import path from 'path'
import { PhotoModel } from '~~/server/models/photo'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params

  if (!id) {
    event.node.res.statusCode = 400
    return {
      code: '[photo.delete] MISSING_REQUIRED_PARAM',
      message: 'Missing required parameters.',
    }
  }

  const exists = PhotoModel.findOne({ id })

  if (!exists) {
    event.node.res.statusCode = 500
    return {
      code: '[photo.delete] SERVER_ERROR',
      message: `Photo with id ${id} does not exist`,
    }
  }

  return PhotoModel.deleteOne({ id })
    .then(async () => {
      // Compose path
      const filePath = path.join('public', 'photos', id)

      // Delete image from the folder
      await rm(filePath, { force: true })

      return {
        status: 'success',
      }
    })
    .catch((err) => {
      event.node.res.statusCode = 500
      return {
        code: '[photo.delete] SERVER_ERROR',
        message: `Internal server error. ${err.message}`,
      }
    })
})
