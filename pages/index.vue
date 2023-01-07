<script setup lang="ts">
import type { Map, MapMouseEvent, MapboxEvent } from 'mapbox-gl'
import wc from 'which-country'
import { debounce } from 'lodash-es'

const { mapToken, mapStyle } = useRuntimeConfig()

const map = ref<Map>()

const properties = useLocalStorage('map-properties', {
  projection: 'globe',
  zoom: 10,
}, { deep: true })

/**
 *  Runs when map is loaded
 */
function onMapLoaded(ins: Map) {
  map.value = ins
  addCountryLayer(ins)
  selectCountry(null)
}

const selectedCountry = ref<string | null>()
const selectedCenter = ref<[number, number]>([0, 0])

function selectCountry(code: string | null) {
  addCountryHighlight(map, code)
}

function reset() {
  selectCountry(null)
  selectedCountry.value = null
  selectedCenter.value = [0, 0]
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
    reset()
    return
  }

  selectCountry(country)
  selectedCountry.value = country
  selectedCenter.value = [lng, lat]
}

const onMapZoomed = debounce((e: MapboxEvent<'zoom'>) => {
  properties.value.zoom = e.target.getZoom()
}, 100)
</script>

<template>
  <div class="route-map">
    <div class="map-header">
      <button class="btn small" data-title-bottom="Zoom In" @click="properties.zoom += 0.5">
        <Icon name="mdi:plus-box" size="20" />
      </button>
      <button class="btn small" data-title-bottom="Zoom Out" @click="properties.zoom -= 0.5">
        <Icon name="mdi:minus-box" size="20" />
      </button>

      <div class="divider" />

      <button class="btn small" :class="{ 'btn-active': properties.projection === 'globe' }" data-title-bottom="Globe Projection" @click="properties.projection = 'globe'">
        <Icon name="mdi:earth" size="20" />
      </button>
      <button class="btn small" :class="{ 'btn-active': properties.projection === 'mercator' }" data-title-bottom-right="Mercator Projection" @click="properties.projection = 'mercator'">
        <Icon name="mdi:map" size="20" />
      </button>
    </div>

    <MapCreatePost
      v-if="selectedCountry"
      :code="selectedCountry"
      :zoom="properties.zoom"
      :center="selectedCenter"
      @close="reset()"
    />

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
  height: 100vh;
  max-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 5;

  .map-header {
    border-radius: var(--radius-md);
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    align-items: center;
    position: absolute;
    top: 10px;
    z-index: 10;
    right: 10px;
    height: 48px;
    z-index: 10;
    padding: 0 10px;
    background-color: var(--color-bg-light-20);
    backdrop-filter: blur(75px);
    box-shadow: var(--shadow);

    .divider {
      display: block;
      width: 1px;
      height: 100%;
      border-right: 1px solid var(--color-border);
    }

    button {
    border-radius: var(--radius-sm);
      width: 35px;
      height: 35px;
      line-height: 35px;
      font-size: 0.8rem;
      text-align: center;
      color: var(--color-text);

    }
  }

  .map-wrapper {
    flex: 1;
    border-top-left-radius: var(--radius-lg);
    border-bottom-left-radius: var(--radius-lg);
    background-color: var(--color-bg-dark);
    box-shadow: var(--shadow);

    .mapboxgl-map {
      border-top-left-radius: var(--radius-lg);
      border-bottom-left-radius: var(--radius-lg);
    }
  }
}
</style>
