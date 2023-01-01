<script setup lang='ts'>
const res = reactive<{ value: any[] }>({ value: [] })

// This event should be called when files are input (should be on <input> el)
async function submit(event: Event) {
  event.preventDefault()

  const files = (event.target as HTMLInputElement).files

  if (!files)
    return

  for (const file of files) {
    const formData = new FormData()
    formData.append('photo', file)

    const id = await useFetch('/api/photo', {
      method: 'POST',
      body: formData,
    })

    res.value.push(id.data)
  }

  // res.value = await useFetch('/api/trip', {
  //   method: 'POST',
  //   body: {
  //     title: 'Hello World',
  //     description: 'This better work.',
  //     iso: 'FIN',
  //     images: [],
  //     date: Date.now(),
  //     map: {
  //       zoom: 10,
  //       center: [26.580630439319265, 63.63131223322321],
  //     },
  //   },
  // })

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

    <br>

    <br>

    <code>

      <pre>
        {{ res.value }}
      </pre>
    </code>
    <br>
    <hr style="border-bottom:1px solid gray;">
    <br>
    <form>
      <input type="file" name="file" multiple accept="image/*" @input="submit">

      <!-- <button class="button btn-gray" type="submit">
        Query
      </button> -->
    </form>
  </div>
</template>
