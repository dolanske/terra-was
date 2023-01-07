<script setup lang='ts'>
import { byIso } from 'country-code-lookup'
import type { TripResponse } from '~~/utils/trip.types'

const props = defineProps<{ data: TripResponse }>()
const date = useDateFormat(props.data.date, 'MMMM DD, YYYY')

const { mapToken, mapStyle } = useRuntimeConfig()

const thumbnail = computed(() => {
  const [lng, lat] = props.data.map.center
  const style = mapStyle.split('styles/')[1]

  const layer = JSON.stringify({
    'id': 'country-boundaries',
    'source': {
      type: 'vector',
      url: 'mapbox://mapbox.country-boundaries-v1',
    },
    'source-layer': 'country_boundaries',
    'type': 'fill',
    'paint': {
      'fill-color': '%2369F0BF',
      'fill-opacity': 0.4,
    },
    'filter': [
      'in',
      'iso_3166_1_alpha_3',
      props.data.iso,
      'country-boundaries',
    ],
  })

  return `https://api.mapbox.com/styles/v1/${style}/static/${lng},${lat},${props.data.map.zoom - 0.5},0.00,0.00/740x292?access_token=${mapToken}&addlayer=${layer}&before_layer=country-label`
})
</script>

<template>
  <NuxtLink :to="`/locations/${props.data.id}`" class="post-item">
    <div class="post-title">
      <h5>
        <img :src="getFlagUrl(byIso(props.data.iso)?.iso2 ?? '')" :alt="`FLag of ${props.data.iso}`">
        {{ props.data.title }}
      </h5>
      <div class="flex-wrap">
        <span class="post-date">{{ date }}</span>
        <span v-if="props.data.images.length > 0">
          {{ props.data.images.length }}
          {{ props.data.images.length === 1 ? 'Photo' : 'Photos' }}
        </span>
      </div>
    </div>

    <div class="post-map">
      <div class="hover-arrow">
        <span>Click for details</span>
        <Icon name="mdi:arrow-right" />
      </div>

      <img
        :src="thumbnail"
        alt="Map Location idk where the fuck it went"
      >
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.post-item {
  @include t(0.4s);
  display: block;
  width: 100%;
  // margin-bottom: 20px;

  &:hover {
    .post-map {
      box-shadow: var(--shadow);

      .hover-arrow {
        backdrop-filter: blur(20px);
        opacity: 1;

        svg {
          opacity: 1;
          transform: translateX(10px);
        }

        span {
          transform: translateY(0);
        }
      }
    }
  }
}

h5 {
  @include t();
  @include font(400);
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 10px;
  color: var(--color-text);

  img {
    transform: translateY(1px)
  }
}

.post-map {
  @include t(0.4s);
  display: block;
  width: 100%;
  height: 224px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;

  .hover-arrow {
    @include t(0.4s);
    position: absolute;
    z-index: 5;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    opacity: 0;

    svg {
      @include t(0.4s);
      color: var(--color-accent);
    }

    span {
      @include t(0.4s);
      @include font(400);
      font-size: 1rem;
      color: var(--color-text);
      transform: translateY(8px);
    }
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top 10px center;
  }
}

.flex-wrap {
  gap: 30px;
  margin-bottom: 30px;
  padding-left: 45px;

  span {
    font-size: 0.8rem;
    color: var(--color-text-lighter);

    &.date {
      color: var(--color-accent);
    }
  }
}
</style>
