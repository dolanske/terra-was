<script setup lang='ts'>
const props = defineProps<{
  text: string
  // Types
  accent?: boolean
  gray?: boolean
}>()

const slot = useSlots()

const cls = computed(() => ({
  'type-accent': props.accent,
  'type-gray': props.gray,
}))
</script>

<template>
  <div class="tag" :class="cls">
    <span v-if="slot.default">
      <slot />
    </span>
    <span v-else>
      {{ props.text }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.tag {
  display: inline-block;
  border-radius: var(--radius-sm);
  height: 30px;
  line-height: 28px;
  border: 1px solid transparent;
  padding: 0 10px;

  span {
    @include font(400);
    font-size: 0.8rem;
  }

  &.type-accent {
    background-color: var(--color-accent-bg);

    span {
      color: var(--color-accent);
    }
  }

  &.type-gray {
    background-color: var(--color-bg);

span {
  color: var(--color-text-light);
}
  }
}
</style>
