import type { Photo } from './photo.types'

type Coordinate = [number, number]

/* ---------------- // SECTION // ---------------- */
// Base Post interface, only used to extend different types of posts
export interface __TripBase__ {
  // Title of the trip
  title: string
  // Optional description of the trip
  description: string | null
  // Properties for the map
  map: {
    zoom: number
    center: Coordinate
    // markers: Coordinate[]
  }
  // Country code, used to get additional data about a country
  iso: string
  date: number
  images: Photo[]
}

/* ---------------- // SECTION // ---------------- */
// Interface for what the API returns
export interface TripResponse extends __TripBase__ {
  id: number
  // Dates in which a country was visited
  // Each items in the array is also used for how many times a country was visited
  visits: string[]
}

export interface TripDB extends __TripBase__ {
  id: number
}
