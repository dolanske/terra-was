<script setup lang='ts'>
const route = useRoute()
</script>

<template>
  <aside>
    <!-- I am a header -->

    <div class="vertical-wrapper">
      <NuxtLink class="btn" to="/" data-title-right="Map">
        <Icon name="mdi:compass" />
      </NuxtLink>

      <NuxtLink class="btn" to="/locations" data-title-right="Your Locations">
        <Icon name="mdi:map-marker" />
      </NuxtLink>

      <!-- <div class="flex-1" /> -->

      <NuxtLink class="btn" to="/settings" data-title-right="Preferences">
        <Icon name="mdi:cog-outline" />
      </NuxtLink>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
aside {
  display: flex;
  justify-content: flex-end;
  padding: 60px 40px;
  z-index: 100;
  position: sticky;
  top: 0;
  height: 100vh;
  border-top-right-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);

  .vertical-wrapper {
    display: flex;
    justify-content: flex-start;
    height: 100%;
    align-items: center;
    flex-direction: column;
    gap: 20px;

    a {
      @include t();
      width: 64px;
      height: 64px;
      line-height: 61px;
      text-align: center;
      color: var(--color-text);
    }
  }

  .flex-1 {
    flex: 1;
  }
}
</style>
