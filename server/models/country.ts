import mongoose from 'mongoose'
import bcrypt from 'mongoose-bcrypt'
import type { Country } from '~~/utils/country.types'

const schema = new mongoose.Schema<Country>(
  {
    iso: String,
    visits: Array,
  },
  { timestamps: true, strict: true, strictQuery: true },
)

schema.plugin(bcrypt)

export const countryModel = mongoose.model<Country>('Country', schema, 'country')
