<script setup lang="ts">
// import { ref } from "vue"
// import { onClickOutside } from "@vueuse/core"

type Button =
  | {
    value: any
    label: string
    icon?: string
  }
  | string

interface Props {
  options: Button[]
  modelValue: any
  dropLabel?: string
}

interface Emits {
  (e: 'set', value: string): void
  (e: 'update:modelValue', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
// Wrapper stuff
const open = ref(false)
const wrapper = ref()

onClickOutside(wrapper, () => {
  setTimeout(() => {
    open.value = false
  }, 10)
})

// Emitting
function setValue(btn: Button) {
  open.value = false
  emit('set', getValue(btn))
  emit('update:modelValue', getValue(btn))
}

function getValue(btn: Button) {
  return typeof btn === 'string' ? btn : btn.value
}
</script>

<template>
  <div ref="wrapper" class="dropdown-wrapper-el">
    <!-- This slot is for the activation button -->

    <div @click="open = !open">
      <slot :open="open" />
    </div>

    <!-- <transition name="fade" mode="out-in"> -->
    <div class="dropdown-element" :class="{ 'is-active': open }">
      <span v-if="props.dropLabel" class="drop-label">{{ props.dropLabel }}</span>

      <button
        v-for="btn in options"
        :key="typeof btn === 'string' ? btn : btn.label"
        class="button btn-transparent active-accent"
        :class="{ 'btn-active': props.modelValue === getValue(btn) }"
        @click="setValue(btn)"
      >
        <template v-if="typeof btn !== 'string' && btn.icon">
          <Icon :name="btn.icon" />
        </template>

        {{ typeof btn === "string" ? btn : btn.label }}
      </button>
    </div>
    <!-- </transition> -->
  </div>
</template>

<style scoped lang="scss">
.dropdown-wrapper-el {
  position: relative;

  .dropdown-element {
    right: 45%;
    top: 85%;
    &.is-active {
      top: 85%;
    }
  }
}

.dropdown-element {
  @include t();
  // @include radius(6px);
  border-radius: var(--radius-md);
  position: absolute;
  padding: 10px;
  top: 100%;
  right: 0;
  width: 224px;
  max-height: 216px;
  overflow-y: auto;
  scrollbar-width: 4px;
  scrollbar-width: thin;
  opacity: 0;
  visibility: hidden;
  z-index: -1;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow);
  transform: scale(0.9) translateY(-8px);
  transform-origin: center top;

  .drop-label {
    display: block;
    font-size: 0.8rem;
    margin-bottom: 10px;
    color: var(--color-text-light);
  }

  &.is-active {
    // top: calc(100% + 16px);
    z-index: 100;
    opacity: 1;
    visibility: visible;
    transform: scale(1) translateY(0);
  }

  button {
    border-radius: var(--radius-md);

    text-align: left;
    position: relative;
    display: block;
    width: 100%;
    height: 48px;
    padding: 0 20px;
    line-height: 48px;
    margin-bottom: 5px;
    // padding-left: 60px;
    color: var(--color-text);
    // border-bottom: 1px solid var(--color-border-light);

    &:hover {
      background-color: var(--color-accent-bg);

      .add-item {
        opacity: 1;
      }
    }

    &:last-child {
      margin-bottom: 0;
      border-bottom: 0;
    }
  }
}
</style>
