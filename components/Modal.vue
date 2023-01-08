<script setup lang='ts'>
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'open'): void
}>()

watch(() => props.open, (val) => {
  if (val)
    emit('open')

  document.body.style.overflow = val ? 'hidden' : 'unset'
})

const el = ref<HTMLElement>()

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape')
    emit('close')
})
</script>

<template>
  <Teleport to="body">
    <Transition mode="out-in" name="modal">
      <div v-if="open" ref="el" class="modal-background" @click.self="emit('close')">
        <button class="modal-close" @click="emit('close')">
          <!-- <Icon name="mdi:close" size="18px" /> -->
          <span class="btn">
            Close

          </span>
          <kbd>Esc</kbd>
        </button>

        <div class="modal-wrapper" @click.self="emit('close')">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.modal-background {
  position: fixed;
  inset: 0;
  z-index: 10000000;
  background-color: var(--color-bg-light-75);
  backdrop-filter: blur(3px);

  .modal-wrapper {
    display: flex;
    padding: 40px;
    padding-top: 60px;
    align-items: center;
    justify-content: center;
  }

  .modal-close {
    position: absolute;
    top: 15px;
    left: 20px;
    height: 30px;
    line-height: 30px;
    font-size: 0.8rem;
    color: var(--color-text-light);

    span {
      padding: 4px 6px;
      text-align: center;
      // color: var(--color-accent);
    }

    kbd {
      border: 1px solid var(--color-border);
      padding: 2px 6px;
      opacity: 0.5;
      margin-left: 5px;

    }
  }
}

.modal-enter-active,
.modal-leave-active {  transition: all 0.15s;}

.modal-enter-from,
.modal-leave-to {  opacity: 0}
</style>
