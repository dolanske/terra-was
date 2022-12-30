import mongoose from 'mongoose'
import bcrypt from 'mongoose-bcrypt'

import type { TripDB } from '~~/utils/trip.types'

const schema = new mongoose.Schema<TripDB>(
  {
    id: { type: String, unique: true },
    title: String,
    description: String,
    map: {
      zoom: Number,
      center: [Number, Number],
    },
    iso: String,
    date: Number,
    images: Array,
  },
  { timestamps: true, strict: true, strictQuery: true },
)

schema.plugin(bcrypt)

export const tripModel = mongoose.model<TripDB>('Trip', schema, 'trip')
