<script setup lang='ts'>
import { formatDate } from '@vueuse/shared'
import type { SearchOutput } from 'country-code-lookup'
import { byIso } from 'country-code-lookup'
import type { Map } from 'mapbox-gl'
import { parse } from 'marked'
import { MapboxMap } from 'vue-mapbox-ts'
import { take } from 'lodash'
import Slider from '@dolanske/slider'
import { logicalExpression } from '@babel/types'
import type { Country } from '~~/utils/country.types'
import type { TripDB } from '~~/utils/trip.types'

const { params } = useRoute()
const { mapToken, mapStyle } = useRuntimeConfig()
const trip = ref<TripDB>()
const loading = ref(true)
const map = ref<Map>()

const country = ref<Country>()

onBeforeMount(async () => {
  const { data } = await useFetch(`/api/trip/${params.id}`)

  if (data.value) {
    trip.value = data.value as TripDB

    useHead({
      title: `${trip.value.title}  /  Your Locations`,
    })

    // Fetch information about a country
    const info = await fetchCountryInfo(trip.value?.iso)

    if (info)
      country.value = info
  }

  loading.value = false
})

// Get formatted date of post
const date = computed(() => formatDate(new Date(trip.value?.date ?? Date.now()), DATE_FORMAT))

// Map loaded event
function onMapLoaded(ins: Map) {
  map.value = ins
  addCountryLayer(ins)
  addCountryHighlight(map, trip.value?.iso)
}

// Scroll up

const { y } = useWindowScroll()

function scrollUp() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// Get information about visited country
const countryMetadata = computed<SearchOutput>(() => byIso(trip.value?.iso ?? ''))
const lastVisit = computed(() => formatDate(new Date(country.value?.visits.at(-1)?.date ?? Date.now()), DATE_FORMAT))

// Modal stuff
const modalOpen = ref(false)
const slider = ref()
const activeSlide = ref(0)

async function openSlider() {
  await nextTick()

  // Get % height of window in pixels
  const height = window.innerHeight * 0.7

  slider.value = new Slider('#gallery', {
    height,
    dots: false,
    transition: {
      time: 0.45,
      mode: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
    },
    on: {
      slideChange({ toIndex }: { toIndex: number }) {
        activeSlide.value = toIndex
      },
    },
  })
}

// Deleting a post
const options = ['Cancel', 'Delete']
const deleting = ref(false)

async function deletePost(option: string) {
  if (option === 'Delete' && trip.value) {
    deleting.value = true

    const { error } = await useFetch(`/api/trip/${trip.value.id}`, { method: 'DELETE' })

    if (error.value) {
      // Handle error
    }

    deleting.value = false
  }
}
</script>

<template>
  <div :key="trip?.id" class="location-detail">
    <!-- Navigation -->
    <div class="post-nav">
      <NuxtLink to="/locations" class="button btn-transparent active-gray">
        <Icon name="la:long-arrow-alt-left" />
        Back
      </NuxtLink>
    </div>

    <button v-if="y > 516" class="go-up btn" data-title-top="Scroll Up" @click="scrollUp">
      <Icon name="material-symbols:arrow-upward" size="24px" />
    </button>

    <!-- Loading -->
    <div v-if="loading" class="loading-indicator">
      <Spinner />
    </div>

    <!-- Posts -->
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

      <div class="container">
        <div>
          <h1>{{ trip.title }}</h1>
          <div class="post-details">
            <span v-if="countryMetadata"> {{ countryMetadata.region }} </span>
            <span>{{ date }}</span>
            <span>{{ trip.images.length }} Photos</span>
            <div class="flex-1" />
            <div class="button-wrap">
              <button class="button btn-transparent active-accent" data-title-top="Edit Trip">
                <Icon name="material-symbols:edit-location-alt" size="20px" />
              </button>

              <FormDropdown :options="options" @set="deletePost">
                <template #default="{ open }">
                  <button class="button btn-transparent active-accent" data-title-top="Delete Trip" :class="{ 'btn-active': open }">
                    <Icon name="material-symbols:delete-outline-rounded" size="20px" />
                  </button>
                </template>
              </FormDropdown>
            </div>
          </div>

          <div class="post-wrapper">
            <div v-html="parse(trip.description)" />
          </div>
        </div>
        <div class="country-info-wrap">
          <div class="country-info-sticky">
            <button v-if="countryMetadata" class="country-info" :data-title-top="`Show All Trips to ${countryMetadata.country}`">
              <div class="country-title">
                <img :src="getFlagUrl(countryMetadata.iso2)" :alt="`${countryMetadata.country} flag`">
                <strong>{{ countryMetadata.country }}</strong>
              </div>

              <hr>

              <div class="country-note">
                <span>Visits</span>
                <strong>{{ country?.visits.length ?? 0 }}</strong>
              </div>
              <div class="country-note no-m">
                <span>Last visit</span>
                <strong>{{ lastVisit }}</strong>
              </div>
            </button>

            <button v-if="trip.images.length > 0" class="gallery-wrap" data-title-top="Open Gallery" @click="modalOpen = true">
              <strong class="strong-title">Gallery</strong>
              <div class="gallery-items">
                <template v-if="trip.images.length <= 4">
                  <img
                    v-for="photo in trip.images"
                    :key="photo.id" :src="photo.path" alt=""
                  >
                </template>
                <template v-else>
                  <img
                    v-for="photo in take(trip.images, 3)"
                    :key="photo.id" :src="photo.path" alt=""
                  >

                  <div class="more-images">
                    <strong>+ {{ trip.images.length - 3 }}</strong>
                    more
                  </div>
                </template>
              </div>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>

  <Modal v-if="trip" :open="modalOpen" @close="modalOpen = false" @open="openSlider">
    <div style="width:100%">
      <div id="gallery">
        <div
          v-for="photo in trip.images"
          :key="photo.id"
        >
          <img :src="photo.path" alt="">
        </div>
      </div>

      <div class="inline-images">
        <button
          v-for="(photo, index) in trip.images"
          :key="photo.id"
          class="inline-image-nav"
          :class="{ 'is-active': index === activeSlide }"
          @click="slider.set(index)"
        >
          <img :src="photo.path" alt="">
        </button>
      </div>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
h1 {
  margin-bottom: 15px;
}

strong {
  color: var(--color-text);
}

.inline-images {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;

  button {
    border-radius: var(--radius-md);
    display: block;
    width: 80px;
    height: 80px;

    &:hover,
    &.is-active {
      outline: 3px solid var(--color-accent);
    }

    img {
      border-radius: var(--radius-md);
      overflow: hidden;
      display: block;
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
    }

  }
}

.country-info-wrap {
  display: block;
  height: 100%;

  .country-info-sticky {
    position: sticky;
    top: 40px;
  }

  .gallery-wrap,
  .country-info {
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    padding: 25px;
    margin-bottom: 30px;
    width: 100%;

    &:hover {
      background-color: var(--color-bg-dark-hover);
    }
  }

  .gallery-wrap {

    .strong-title {
      @include sans(600);
      display: block;
      font-size: 0.8rem;
      text-transform: uppercase;
      margin-bottom: 10px;
      color: var(--color-text-light);
    }

    .gallery-items {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      // grid-template-rows: 64px 64px;

      img {
        border-radius: var(--radius-sm);
        display: block;
        width: 100%;
        // width: 64px;
        height: 64px;
        object-position: center;
        object-fit: cover;
      }

      .more-images {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;
        color: var(--color-text-light);

        strong {
          @include sans(600);

        }
      }
    }
  }

  .country-info {
    hr {
      display: block;
      // padding: 20px 0;
      padding-top: 15px;
      margin-bottom: 15px;
      border-bottom: 1px solid var(--color-border);
    }

    .country-title {
      display: grid;
      grid-template-columns: 32px 1fr;
      gap: 15px;
      align-items: flex-start;
      // margin-bottom: 10px;
      width: 100%;

      strong {
        margin-bottom: 0;
        font-size: 1.2rem;
        color: var(--color-text-light);
      }

      img {
        border-radius: var(--radius-sm);
        overflow: hidden;
        display: block;
        object-position: center;
        object-fit: contain;
        height: auto;
        transform: translateY(-5px);
      }
    }

    .country-note {
      display: block;
      width: 100%;
      margin-bottom: 20px;

      &.no-m {
        margin-bottom: 0;
      }

      span {
        display: block;
        color: var(--color-text-lighter);
        font-size: 0.7rem;
        text-transform: uppercase;
        margin-bottom: 5px;
      }

      strong {
        font-size: 0.95rem;
        @include sans(600);
      }
    }
  }
}

.post-nav {
  position: fixed;
  top: 40px;
  left: 35px;
  z-index: 10;

  .button {
    backdrop-filter: blur(75px);
    // opacity: 0.5;
    color: var(--color-text-lighter);

    svg {
      @include t();
    }

    &:hover {
      gap: 10px;
      transform: translateX(-10px);
      opacity: 1;
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

.go-up {
  position: fixed;
  bottom: 40px;
  right: 50px;
  width: 64px;
  height: 64px;
  text-align: center;
  color: var(--color-text-lighter);
}

.post-details {
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 40px;
  margin-bottom: 80px;
  border-bottom: 1px solid var(--color-border);

  span {
    font-size: 0.9rem;
    color: var(--color-accent);

    &:last-of-type {
      color: var(--color-text-light);
    }
  }

  .button-wrap {
    display: flex;
    gap: 10px;
    align-items: center;

    .button {
      color: var(--color-text-lighter);

      &:hover {
        color: var(--color-text);
      }
    }
  }
}

.container {
  grid-template-columns: 1fr 256px;
  gap: 148px;
  width: 1152px;
  display: grid;
  margin-left: 10%;
  padding-bottom: 256px;
  padding-top: 60px;
}
</style>
