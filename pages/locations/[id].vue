<script setup lang='ts'>
import { LongWithoutOverridesClass } from 'bson'
import { parse } from 'marked'
import type { TripDB } from '~~/utils/trip.types'

const { params } = useRoute()
const trip = ref<TripDB>()
const loading = ref(true)

onBeforeMount(async () => {
  const { data } = await useFetch(`/api/trip/${params.id}`)

  if (data.value)
    trip.value = data.value as TripDB

  loading.value = false
})
</script>

<template>
  <div class="location-detail">
    <div v-if="loading" class="loading-indicator">
      <Spinner />
    </div>
    <template v-else-if="trip">
      <div class="post-header" />

      <div class="container post">
        <h1>{{ trip.title }}</h1>

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
