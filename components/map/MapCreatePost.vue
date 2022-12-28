<script setup lang='ts'>
import type { SearchOutput } from 'country-code-lookup'
import { byIso } from 'country-code-lookup'

const props = defineProps<{
  code: string
}>()

const country = computed<SearchOutput>(() => byIso(props.code))
</script>

<template>
  <div class="map-create-post">
    <h5>{{ country?.country }}</h5>
    <pre>
      {{ country }}
    </pre>
  </div>
</template>

<style lang="scss">
.map-create-post {
  border-radius: var(--radius-lg);
  position: absolute;
  top: 20px;
  left: 20px;
  bottom: 20px;
  width: 386px;
  z-index: 5;
  padding: 10px;
  display: block;
  background-color: var(--color-bg-dark-85);
  backdrop-filter: blur(50px);
  box-shadow: var(--shadow);
}
</style>
