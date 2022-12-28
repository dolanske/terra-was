<script setup lang='ts'>

</script>

<template>
  <aside>
    <!-- I am a header -->

    <div class="vertical-wrapper">
      <NuxtLink to="/" data-title-right="Map">
        <Icon name="mdi:compass" />
      </NuxtLink>

      <NuxtLink to="/locations" data-title-right="Your Locations">
        <Icon name="mdi:map-marker" />
      </NuxtLink>

      <!-- <div class="flex-1" /> -->

      <NuxtLink to="/settings" data-title-right="Preferences">
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
  border-right: 1px solid var(--color-border);

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
      position: relative;
      z-index: 2;

      &:after {
        @include t();
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        z-index: -1;
        background-color: var(--color-accent-bg);
        opacity: 0;
      }

      &:hover,
      &.router-link-active {
        color: var(--color-accent);

        &:after {
          border-radius: 20px;
          opacity: 1;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
        }
      }
    }
  }

  .flex-1 {
    flex: 1;
  }
}
</style>
