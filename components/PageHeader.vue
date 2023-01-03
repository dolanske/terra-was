<script setup lang='ts'>
const props = defineProps<{
  title: string
  subtitle?: string
  bg?: string
}>()
</script>

<template>
  <div class="page-title">
    <h2>{{ props.title }}</h2>
    <p>{{ props.subtitle }}</p>

    <div class="bg">
      <img :src="props.bg" alt="">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-title {
  display: block;
  border-radius: var(--radius-lg);
  padding: 100px;
  background-color: var(--color-bg-light);
  box-shadow: var(--shadow);
  position: relative;
  margin-bottom: 80px;

  h2 {
    @include font(400);
    display: block;
    font-size: 4rem;
    margin-bottom: 20px;
    color: var(--color-text);
    // opacity: 0.9;
    max-width: 628px;
    line-height: 1.25em;
    z-index: 5;
  }

  p {
    @include sans(400);
    display: block;
    font-size: 1.2rem;
    color: var(--color-text-light);
    max-width: 50%;
    margin: 0;
    z-index: 5;
  }

  .bg {
    display: block;
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: var(--radius-lg);
    z-index: -1;

    img {
      display: block;
      height: 100%;
      width: 100%;
      object-position: center;
      object-fit: cover;
    }
  }
}
</style>
