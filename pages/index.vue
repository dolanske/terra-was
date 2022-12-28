<script setup lang="ts">
import type { Map, MapMouseEvent, MapboxEvent } from 'mapbox-gl'
import wc from 'which-country'
import { debounce } from 'lodash-es'

const { mapToken, mapStyle } = useRuntimeConfig()

const map = ref<Map>()
const properties = useLocalStorage('map-properties', {
  projection: 'globe',
  zoom: 10,
})
const accent = useCssVar('--color-text')

/**
 *  Runs when map is loaded
 */
function onMapLoaded(instance: Map) {
  map.value = instance

  instance.addLayer(
    {
      'id': 'country-boundaries',
      'source': {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      },
      'source-layer': 'country_boundaries',
      'type': 'fill',
      'paint': {
        'fill-color': accent.value,
        'fill-opacity': 0.4,
      },
    },
    'country-label',
  )

  selectCountry(null)
}

const selectedCountry = ref<string | null>()

function selectCountry(code: string | null) {
  if (!map.value)
    return

  map.value.setFilter('country-boundaries', [
    'in',
    'iso_3166_1_alpha_3',
    code ?? '',
  ])
}

/**
 * Runs when map is clicked
 */
function onMapClicked(e: MapMouseEvent) {
  const { lng, lat } = e.lngLat
  const country = wc([lng, lat])

  if (!country)
    return

  if (country === selectedCountry.value) {
    selectCountry(null)
    selectedCountry.value = null
    return
  }

  selectCountry(country)
  selectedCountry.value = country
}

const onMapZoomed = debounce((e: MapboxEvent<'zoom'>) => {
  properties.value.zoom = e.target.getZoom()
}, 100)
</script>

<template>
  <div class="route-map">
    <!-- <div class="map-header">
      <h6>The World</h6>

    </div> -->

    <div class="map-footer">
      <!-- <div class="buttons">
        <button @click="properties.projection === 'globe'">
          <Icon name="mdi:earth" />
        </button>
        <button @click="properties.projection === 'mercator'">
          <Icon name="mdi:map" />
        </button>
      </div> -->
    </div>

    <MapCreatePost v-if="selectedCountry" :code="selectedCountry" />

    <div class="map-wrapper">
      <MapboxMap
        :map-style="mapStyle"
        :access-token="mapToken"
        :zoom="properties.zoom"
        :projection="properties.projection"
        :center="[5, 46]"
        @loaded="onMapLoaded"
        @click="onMapClicked"
        @zoom="onMapZoomed"
      />
    </div>
  </div>
</template>

<style lang="scss">
.route-map {
  border-radius: var(--radius-lg);
  padding: 10px;
  height: 100vh;
  max-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 5;

  .map-footer {
    border-radius: var(--radius-md);
    width: 680px;
    position: absolute;
    bottom: 40px;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(#171818,0.9);
    backdrop-filter: blur(10px);

    button {
    border-radius: var(--radius-sm);
      width: 35px;
      height: 35px;
      line-height: 35px;
    }
  }

  // .map-header {
  //   border-top-left-radius: var(--radius-lg);
  //   border-top-right-radius: var(--radius-lg);
  //   position: absolute;
  //   inset: 10px;
  //   bottom: unset;
  //   padding: 20px;
  //   z-index: 10;
  //   background-color: rgba(#171818,0.9);
  //   backdrop-filter: blur(10px);

  //   h6 {
  //     margin: 0;
  //   }
  // }

  .map-wrapper {
    flex: 1;
    border-radius: var(--radius-lg);
    background-color: var(--color-bg-dark);

    .mapboxgl-map {
      border-radius: var(--radius-lg) !important;
    }
  }
}
</style>
