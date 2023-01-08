<script setup lang="ts">
import { byIso } from 'country-code-lookup'
import type { TripDB } from '~~/utils/trip.types'

const trips = ref<TripDB[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  const { data } = await useFetch('/api/trip', { method: 'GET' })

  if (data.value)
    trips.value = data.value as TripDB[]

  loading.value = false
})

/**
 * Filter
 */
type SortBy = 'country' | 'date-new' | 'date-old' | 'visits'

const sort = ref<SortBy>('country')
const search = ref('')

const dropdownOptions = [
  { value: 'country', label: 'Country' },
  { value: 'visits', label: 'Country Visits' },
  { value: 'date-new', label: 'Date (Newest)' },
  { value: 'date-old', label: 'Date (Oldest)' },
]

// @ts-expect-error There is no chance anything but the item will be found
const selectedLabel = computed(() => dropdownOptions.find(item => item.value === sort.value).label)

// Filter data based on search
const filteredLocations = computed(() => {
  let data = trips.value

  // #1 Search
  if (search.value) {
    data = trips.value.filter((trip) => {
      // @ts-expect-error I can confirm that this is the result. Why does the
      // returning interface cry about it? I dont know.
      const { continent, country } = byIso(trip.iso)

      return searchInStr([trip.title, continent, country], search.value)
    })
  }

  // #2 Sort soft

  switch (sort.value) {
    case 'date-new': return data.sort((a, b) => a.date > b.date ? -1 : 1)
    case 'date-old': return data.sort((a, b) => a.date > b.date ? -1 : 1)
  }

  // console.log('rendered')

  // #3 Sort hard (when clicked nav)

  return data
})

// Generate sidebar titles based on selected sort-by option
const navigationOptions = computed(() => {
  switch (sort.value) {
    case 'country': {
      // Reduce all posts based on their upload date

      // return trips.value
      //   .reduce((trip) => {

      //   })
      //   .map((trip) => {
      //     return trip
      //   })
    }

    // case 'date': {

    // }
  }
})
</script>

<template>
  <div class="route-location">
    <PageHeader
      title="Your visited locations"
      subtitle="List of all saved locations sorted by date, country or times visited."
      bg="/img/location-bg.svg"
    />

    <div v-if="loading" class="loading-indicator">
      <Spinner />
    </div>
    <template v-else>
      <div class="container filters">
        <div>
          <FormSearch v-model="search" placeholder="Search trips" />
          <FormDropdown v-model="sort" :options="dropdownOptions" drop-label="Sort your trips">
            <template #default="{ open }">
              <button class="button btn-transparent active-accent" :class="{ 'btn-active': open }">
                {{ selectedLabel }}
                <Icon :name="!open ? 'mdi:menu-down' : 'mdi:menu-up'" size="20px" />
              </button>
            </template>
          </FormDropdown>
        </div>
      </div>
      <div class="container">
        <div class="posts-list">
          <LocationListItem v-for="trip in filteredLocations" :key="trip.id" :data="trip" />
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
    </template>
  </div>
</template>

<style lang="scss" scoped>
.route-location {
  padding-top: 10px;
  padding-right: 10px;

  .posts-list {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
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
  width: 1024px;
  margin-bottom: 32px;
  display: grid;
  grid-template-columns: 1fr 156px;
  gap: 128px;
  margin-bottom: 40px;
  z-index: 1;

  &.filters {
    display: block;
    margin-bottom: 65px;
    z-index: 2;
    position: relative;

    & > div {
      padding-bottom: 5px;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
    }
  }
}
</style>
