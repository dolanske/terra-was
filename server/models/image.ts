import mongoose from 'mongoose'
import bcrypt from 'mongoose-bcrypt'
import type { Image } from '~~/utils/image.types'

const schema = new mongoose.Schema<Image>(
  {
    id: { unique: true, type: String },
    path: String,
  },
  { timestamps: true, strict: true, strictQuery: true },
)

schema.plugin(bcrypt)

export const ImageModel = mongoose.model<Image>('Image', schema, 'image')
