<script setup lang='ts'>
const props = withDefaults(defineProps<{
  label?: string
  value: any
  type: string
}>(), {
  type: 'text',
})

const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()
function updateValue(e: any) {
  emit('update:value', e.target.value)
}

const attrs = useAttrs()
</script>

<template>
  <div class="form-item form-input">
    <label v-if="props.label" v-html="props.label" />
    <textarea v-bind="attrs" tabindex="0" :type="props.type" :value="props.value" @input="updateValue" />
  </div>
</template>
