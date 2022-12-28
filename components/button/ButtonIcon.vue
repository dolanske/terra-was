<script setup lang='ts'>

</script>

<template>
  <button>
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
  @include sans();
  height: 40px;
  line-height: 40px;
  padding: 20px;
  font-size: 1.1rem;
}
</style>
