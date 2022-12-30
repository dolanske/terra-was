<script setup lang='ts'>
const res = ref({})

async function makeCall() {
  const _res = await useFetch('/api/trip', { method: 'get' })
  // console.log(res)
  res.value = _res
}
</script>

<template>
  <div>
    <br>
    <button class="button btn-gray" @click="makeCall">
      Query
    </button>
    <br>
    <code>
      <pre>{{ res }}</pre>
    </code>
  </div>
</template>
