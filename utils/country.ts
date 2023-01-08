import type { Country } from './country.types'

export async function fetchCountryInfo(iso: string): Promise<Country | null> {
  const { data } = await useFetch(`/api/country/${iso}`)

  if (!data.value)
    return null

  return data.value as Country
}
