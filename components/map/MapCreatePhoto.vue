<script setup lang='ts'>
const props = defineProps<{
  path: string
}>()

const emit = defineEmits<{
  (e: 'remove'): void
}>()
</script>

<template>
  <div class="image-input-item">
    <button @click="emit('remove')">
      <Icon name="mdi:close" />
    </button>
    <img :src="props.path">
  </div>
</template>

<style lang="scss" scoped>
.image-input-item {
  @include t();
  border-radius: var(--radius-md);
  height: 84px;
  position: relative;
  z-index: 1;

  &:hover button {
    opacity: 1;
    transform: scale(1);
    border-radius: var(--radius-md);

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
