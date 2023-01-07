<script setup lang='ts'>
import type { Map } from 'mapbox-gl'
import { parse } from 'marked'
import { MapboxMap } from 'vue-mapbox-ts'
import type { TripDB } from '~~/utils/trip.types'

const { params } = useRoute()
const { mapToken, mapStyle } = useRuntimeConfig()
const trip = ref<TripDB>()
const loading = ref(true)
const map = ref<Map>()

onBeforeMount(async () => {
  const { data } = await useFetch(`/api/trip/${params.id}`)

  if (data.value)
    trip.value = data.value as TripDB

  loading.value = false
})

const date = computed(() => useDateFormat(trip.value?.date ?? new Date(), 'MMMM DD, YYYY'))

// Map loaded event
function onMapLoaded(ins: Map) {
  map.value = ins
  addCountryLayer(ins)
  addCountryHighlight(map, trip.value?.iso)
}
</script>

<template>
  <div class="location-detail">
    <div class="post-nav">
      <NuxtLink to="/locations" class="button btn-gray">
        <Icon name="la:long-arrow-alt-left" />
        Back
      </NuxtLink>
    </div>

    <div v-if="loading" class="loading-indicator">
      <Spinner />
    </div>
    <template v-else-if="trip">
      <div class="post-map">
        <MapboxMap
          :map-style="mapStyle"
          :access-token="mapToken"
          :zoom="trip.map.zoom"
          :center="trip.map.center"
          @loaded="onMapLoaded"
        />
      </div>

      <div class="container post">
        <h1>{{ trip.title }}</h1>

        <div class="post-details">
          <span>{{ date }}</span>
        </div>

        <div class="post-wrapper">
          <div v-html="parse(trip.description)" />
        </div>
      </div>

      <!-- <pre>
        {{ trip }}
      </pre> -->
    </template>
  </div>
</template>

<style scoped lang="scss">
.post-nav {
  position: fixed;
  top: 40px;
  left: 40px;
  z-index: 10;

  .button {
    background-color: var(--color-bg-light-20);
    backdrop-filter: blur(75px);
    box-shadow: var(--shadow);

    svg {
      @include t();
      color: var(--color-text-light);
    }

    &:hover {
      gap: 10px;
      transform: translateX(-10px);
    }
  }
}

.post-map {
  border-radius: var(--radius-lg);
  display: block;
  width: 100%;
  height: 516px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.post-title {
  display: block;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.container {
  margin: 0;
  margin-left: 10%;
  // padding-left: 10%;
  &.post {
    width: 756px;
    padding-bottom: 256px;
    padding-top: 60px;
  }
}
</style>
