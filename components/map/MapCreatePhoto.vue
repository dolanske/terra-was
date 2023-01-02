<script setup lang='ts'>
import type { Uploader } from '~~/utils/other.types'

const props = defineProps<{ data: Uploader }>()
const emit = defineEmits<{ (e: 'remove'): void }>()
</script>

<template>
  <div class="image-input-item" :class="{ 'is-loading': props.data.loading }">
    <Spinner v-if="props.data.loading" />
    <template v-else-if="props.data.file">
      <button @click.prevent="emit('remove')">
        <Icon name="mdi:close" />
      </button>
      <img :src="props.data.file.path">
    </template>
  </div>
</template>

<style lang="scss" scoped>
.image-input-item {
  @include t();
  border-radius: var(--radius-md);
  height: 84px;
  width: 84px;
  position: relative;
  z-index: 1;

  &:hover button {
    opacity: 1;
    transform: scale(1);
    border-radius: var(--radius-md);
  }

  &.is-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--color-border);
  }

  button {
    @include t();
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 10;
    background-color: var(--color-bg-light-75);
    color: var(--color-text);
    transform: scale(0.7);
  }

  img {
  border-radius: var(--radius-md);
    display: block;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
}
</style>
