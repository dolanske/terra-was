export interface Country {
  // Country code, matched against a trip & metadata about country
  iso: string
  // Stores the ID of each post in it
  visits: CountryVisit[]
}

// Interface for creating a country
export interface CountryCreate {
  iso: string
  date: number
  postId: string
}

// Interface for a singular country visit
export interface CountryVisit {
  date: number
  postId: string
}
