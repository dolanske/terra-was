<script setup lang="ts">
import type { TripDB } from '~~/utils/trip.types'

const trips = reactive<{ value: TripDB[] }>({ value: [] })

onBeforeMount(() => {
  const { data } = useFetch('/api/trip', { method: 'GET' })

  if (!data.value)
    return

  trips.value = data.value as TripDB[]
})

/**
 * Filter
 */
type SortBy = 'country' | 'date' | 'visits'

const sortBy = ref<SortBy>('country')
const search = ref('')
</script>

<template>
  <div class="route-location">
    <PageHeader
      title="Your visited locations"
      subtitle="List of all saved locations sorted by date, country or times visited."
      bg="/img/location-bg.svg"
    />
    <div class="container">
      <input v-model="search" type="text" placeholder="Search for a trip">
      <select id="" name="">
        <option value="cum">
          cum
        </option>
      </select>
    </div>
    <div class="container post">
      <div class="posts-list">
        <LocationListItem v-for="trip in trips.value" :key="trip.id" :data="trip" />
      </div>

      <div class="posts-nav">
        <ul>
          <li class="active">
            December 2019
          </li>
          <li>October 2018</li>
          <li>August 2018</li>
          <li>January 2015</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.route-location {
  padding-top: 10px;
  padding-right: 10px;

  .posts-list {
    display: flex;
    flex-wrap: wrap;
    gap: 56px;
    justify-content: flex-start;
  }

  .posts-nav {
    ul {
      padding: 0;

      li {
        @include t();
        border-radius: var(--radius-lg);
        margin-bottom: 10px;
        font-size: 0.8rem;
        color: var(--color-text-lighter);
        padding: 8px 14px;
        border: 1px solid transparent;
        cursor: pointer;

        &:hover {
          background-color: var(--color-accent-bg);
        }

        &.active {
          color: var(--color-text);
          border-color: var(--color-accent);
        }

        &:before {
          display: none;
        }
      }
    }
  }
}

.container {
  display: block;
  margin: 0 auto;
  width: 1024px;
  margin-bottom: 32px;

  &.post {
    margin-bottom: 0;
    display: grid;
    grid-template-columns: 1fr 156px;
    gap: 128px;
  }
}
</style>
