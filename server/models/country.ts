import mongoose from 'mongoose'
import bcrypt from 'mongoose-bcrypt'
import type { Country } from '~~/utils/country.types'

const schema = new mongoose.Schema<Country>(
  {
    iso: { type: String, unique: true },
    visits: [{ date: Number, postId: String }],
  },
  { timestamps: true, strict: true, strictQuery: true },
)

schema.plugin(bcrypt)

export const CountryModel = mongoose.model<Country>('Country', schema, 'country')
