import mongoose from 'mongoose'
import bcrypt from 'mongoose-bcrypt'
import type { Photo } from '~~/utils/photo.types'

const schema = new mongoose.Schema<Photo>(
  {
    id: { unique: true, type: String },
    path: String,
  },
  { timestamps: true },
)

schema.plugin(bcrypt)

export const PhotoModel = mongoose.model<Photo>('Photo', schema, 'photo')
