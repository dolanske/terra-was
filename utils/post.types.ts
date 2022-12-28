type Coordinate = [number, number]

/* ---------------- // SECTION // ---------------- */
// Base Post interface, only used to extend different types of posts
interface __PostBase__ {
  // Title of the trip
  title: string
  // Optional description of the trip
  description: string | null

  // Properties for the map
  map: {
    zoom: number
    center: Coordinate
    markers: Coordinate[]
  }

  // Country code, used to get additional data about a country
  code: string
}

/* ---------------- // SECTION // ---------------- */
// Interface for what the API returns
export interface PostReponse extends __PostBase__ {
  id: number
  timestamp: string

  // Dates in which a country was visited
  // Each items in the array is also used for how many times a country was visited
  visits: string[]
}

/* ---------------- // SECTION // ---------------- */
// Interface used for form validation and posting
export interface PostCreate extends __PostBase__ {
  // This will be appended to the visits array
  date: string
  images: Buffer[]
}
