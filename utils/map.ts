// Map configurations
import type { Map } from 'mapbox-gl'

export function addCountryLayer(map: Map) {
  // Add a map layer for highlighting
  map.addLayer(
    {
      'id': 'country-boundaries',
      'source': {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      },
      'source-layer': 'country_boundaries',
      'type': 'fill',
      'paint': {
        'fill-color': useCssVar('--color-accent').value,
        'fill-opacity': 0.4,
      },
    },
    'country-label',
  )
}

export function addCountryHighlight(map: Ref<Map>, country?: string | null) {
  if (!map.value)
    return

  map.value.setFilter('country-boundaries', [
    'in',
    'iso_3166_1_alpha_3',
    country ?? '',
  ])
}
