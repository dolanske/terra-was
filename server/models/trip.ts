import mongoose from 'mongoose'
import bcrypt from 'mongoose-bcrypt'

import type { TripDB } from '~~/utils/trip.types'

const schema = new mongoose.Schema<TripDB>(
  {
    id: { type: Number, unique: true },
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
  { timestamps: true },
)

schema.plugin(bcrypt)

export const TripModel = mongoose.model<TripDB>('Trip', schema, 'trip')
