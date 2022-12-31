<script setup lang='ts'>
const res = ref({})

// async function makeCall() {
//   const _res = await useFetch('/api/trip', { method: 'get' })
//   // console.log(res)
//   res.value = _res
// }

async function submit() {
  res.value = await useFetch('/api/trip', {
    method: 'POST',
    body: {
      title: 'Hello World',
      description: 'This better work.',
      iso: 'FIN',
      images: [],
      date: Date.now(),
      map: {
        zoom: 10,
        center: [26.580630439319265, 63.63131223322321],
      },
    },
  })

  // res.value = await useFetch('/api/country', {
  //   method: 'POST',
  //   body: {
  //     iso: 'FIN',
  //   },
  // })

  // res.value = await useFetch('/api/country/FIN')

  // res.value = await useFetch('/api/country', {
  //   method: 'PUT',
  //   body: {
  //     iso: 'FIN',
  //     date: Date.now(),
  //     postId: 10,
  //   },
  // })
}
</script>

<template>
  <div>
    <br>
    <button class="button btn-gray" @click="submit">
      Query
    </button>
    <br>
    <code>
      <pre>{{ res.data }}</pre>
    </code>
  </div>
</template>
