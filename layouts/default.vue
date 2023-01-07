<script lang="ts" setup>
</script>

<template>
  <div class="app-layout">
    <NavSidebar />

    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  display: grid;
  width: 100%;
  min-height: 100vh;
  gap: 0;
  grid-template-columns: 216px 1fr;
  align-items: stretch;
  position: relative;
}
</style>
