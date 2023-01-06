<script setup lang='ts'>
const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const attrs = useAttrs()
</script>

<template>
  <div class="form-item form-search">
    <span class="form-icon">
      <Icon name="mdi:magnify" size="24px" />
    </span>
    <input v-bind="attrs" type="text" :value="props.modelValue" @input="(e: any) => emit('update:modelValue', e.target.value)">
  </div>
</template>
