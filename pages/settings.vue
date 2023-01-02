<script setup lang='ts'>
import type { Photo } from '~~/utils/photo.types'

const res = reactive<{ v: Array<Photo | null> }>({ v: [] })

// This event should be called when files are input (should be on <input> el)
async function submit(event: Event) {
  event.preventDefault()

  const files = (event.target as HTMLInputElement).files

  if (!files)
    return

  for (const file of files) {
    const formData = new FormData()
    formData.append('photo', file)

    const id = await useFetch<Photo>('/api/photo', {
      method: 'POST',
      body: formData,
    })

    if (id.data.value)
      res.v.push(id.data.value)
  }
}

async function delPhoto(item: Photo) {
  const res = await useFetch(`/api/photo/${item.id}`, { method: 'DELETE' })
  console.log(res)
}
</script>

<template>
  <div>
    <br>
    <br>
    <br>
    <code>
      <pre>{{ res }}</pre>
    </code>
    <br>
    <hr style="border-bottom:1px solid gray;">
    <br>
    <form><input type="file" name="file" multiple accept="image/*" @input="submit"></form>
    <br>
    <hr style="border-bottom:1px solid gray;">
    <template v-for="button in res.v" :key="button.id">
      <button v-if="button" @click="delPhoto(button)">
        {{ button.path }}
      </button>
    </template>
  </div>
</template>
