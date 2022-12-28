type Coordinate = [number, number]

/* ---------------- // SECTION // ---------------- */
// Base Post interface, only used to extend different types of posts
interface __PostBase__ {
  // Title of the trip
  title: string
  // Optional description of the trip
  description: string | null

  // Dates in which a country was visited
  // Each items in the array is also used for how many times a country was visited
  visits: string[]

  // Properties for the map
  map: {
    zoom: string
    center: Coordinate
    markers: Coordinate[]
  }

  // Country code
  code: string
}

/* ---------------- // SECTION // ---------------- */
// Interface for what the API returns
export interface PostReponse extends __PostBase__ {
  id: number
  timestamp: string
}

/* ---------------- // SECTION // ---------------- */
// Interface used for form validation and posting
export interface PostCreate extends __PostBase__ {
  // This will be appended to the visits array
  date: string
}
