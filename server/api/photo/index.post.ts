// https://stackoverflow.com/questions/74054152/nuxt-3-file-upload-and-store-in-locally-in-the-project

import { copyFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import formidable from 'formidable'
import type { Image } from '~~/utils/image.types'
import { ImageModel } from '~~/server/models/image'

export default defineEventHandler(async (event) => {
  const form = formidable({ multiples: true })

  const res = new Promise<Image>((resolve, reject) => {
    form.parse(event.node.req, async (err, fields, files) => {
      // We know files will always be a single file
      const file: formidable.File = Array.isArray(files) ? files[0].photo : files.photo

      if (err)
        reject(err)

      if (!file)
        reject(new TypeError('You must provide a file to upload'))

      if (file.mimetype?.startsWith('image/')) {
        const type = file.mimetype.split('/')[1]
        const name = `${randomUUID()}.${type}`

        const { IS_DEV } = useRuntimeConfig()

        // Depending on if we are in dev or prod, the paths are different
        // Production assets live in /public/* while in dev they are in
        const PATH = IS_DEV ? ['assets', 'uploads', name] : ['dist', 'uploads', name]

        const oldPath = file.filepath
        const newPath = path.join(...PATH)

        // fs.copyFileSync(oldPath, newPath)
        await copyFile(oldPath, newPath)

        const newImage: Image = { path: PATH.join('/'), id: name }

        // Save image ID to the DB
        await ImageModel.create(newImage)
          .then(() => resolve(newImage))
          .catch(() => reject(new Error('Error when creating a DB entry for image')))
      }
      else {
        reject(new TypeError('Only image file types are allowed'))
      }
    })
  })

  return res
    // Return the image object
    .then(res => res)
    .catch((err) => {
      event.node.res.statusCode = 500

      return {
        code: 'ERROR',
        message: `[photo.post] Something went wrong. ${err.message}`,
      }
    })
})
