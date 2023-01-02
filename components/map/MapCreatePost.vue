<script setup lang='ts'>
import type { SearchOutput } from 'country-code-lookup'
import { byIso } from 'country-code-lookup'
import { parse } from 'marked'
import type { Photo } from '~~/utils/photo.types'
import type { __TripBase__ } from '~~/utils/trip.types'
import type { Uploader } from '~~/utils/other.types'

const props = defineProps<{
  code: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const country = computed<SearchOutput>(() => byIso(props.code))
const expand = ref(false)

/**
 * Form
 */

const defaultForm: __TripBase__ = {
  title: '',
  description: '',
  map: {
    zoom: 0,
    center: [0, 0],
    // markers: [],
  },
  date: 0,
  iso: '',
  images: [],
}

const form = reactive<__TripBase__>(structuredClone(defaultForm))

const descriptionPreview = computed(() => parse(form.description))

watch(() => props.code, (value) => {
  form.iso = value
})

function clear() {
  Object.assign(form, structuredClone(defaultForm))
}

function cancel() {
  clear()
  emit('close')
}

async function submit() {
  // Submit the whole form
}

/**
 * Handle uploading of images
 *
 * Ideally, we want to first iterate over the list of uploaded files.
 * Due to not having the photo ID available during the upload, we
 * reference all files using an index.
 *
 * #1 Take the form files and append an information about them.
 * {
 *  rawFile: The raw form submission object
 *  file: the object which is appended after photo is uploaded
 *  error: null
 *  loading: true
 * }
 *
 * #1.1 All rendered elements show loading
 *
 * #2 At the same time, begin uploading loop (uploadPhotos). Store the index of the upload loop.
 * When a photo is uploaded, by index, we change the loading to false, and if error occured, append
 * the message.
 *
 * #3 When photo is uploaded. Its object is appended to the array item by reference index
 * and within the element, we can remove the loading state and instead render the <img> element
 * with the provided path.
 *
 */

const uploader = reactive<{ photos: Map<number, Uploader> }>({ photos: new Map() })

async function uploadPhotos(e: Event) {
  e.preventDefault()
  e.stopPropagation()

  const files = (e.currentTarget as HTMLInputElement).files

  if (!files)
    return

  // Iterate over files once, without delays and save them and the important data
  let index1 = 0
  for (const file of files) {
    uploader.photos.set(index1, {
      index: index1,
      rawFile: file,
      file: null,
      loading: true,
    })

    index1++
  }

  // Iterate over files again, this time we wait for them to upload one by one.
  let index2 = 0

  for (const file of files) {
    const formData = new FormData()
    formData.append('photo', file)

    const { data } = await useFetch<Photo>('/api/photo', {
      method: 'POST',
      body: formData,
    })

    if (!data.value)
      return

    const obj = uploader.photos.get(index2)

    if (!obj)
      return

    uploader.photos.set(index2, {
      ...obj,
      file: data.value,
      loading: false,
    })

    index2++
  }
}

async function deletePhoto(item: Uploader) {
  if (!item.file)
    return

  await useFetch(`/api/photo/${item.file.id}`, { method: 'DELETE' })
  uploader.photos.delete(item.index)
}
</script>

<template>
  <div v-if="country" class="map-create-post" :class="{ 'is-expand': expand }">
    <div class="map-create-form">
      <div class="context-wrap">
        <button
          class="btn"
          :class="{ 'btn-active': expand }"
          :data-title-bottom="`${expand ? 'Collapse' : 'Expand'} Editor`"
          @click="expand = !expand"
        >
          <Icon name="material-symbols:expand-content" size="20" />
        </button>
        <button class="btn" data-title-bottom="Close Editor" @click="cancel()">
          <Icon name="mdi:close" size="20" />
        </button>
      </div>

      <div class="title-wrap">
        <img :src="getFlagUrl(country.iso2)" alt="">
        <h6>{{ country.country }}</h6>
      </div>

      <ul class="metadata">
        <li>Visited: <strong>0 times</strong></li>
        <li>Region: <strong>{{ country.region }}</strong></li>
      </ul>

      <hr>

      <div class="form-wrap-outer">
        <div class="form-wrap-inner">
          <form @submit="submit">
            <FormInput v-model:value="form.title" label="Name" :placeholder="`${country.capital} was awesome!`" />
            <FormTextarea v-model:value="form.description" label="Description" placeholder="Feel free to use markdown" />

            <span class="form-label">Photos</span>
            <div class="image-input-wrap">
              <MapCreatePhoto
                v-for="[, item] in uploader.photos"
                :key="item.index"
                :data="item"
                @remove="deletePhoto(item)"
              />

              <div class="image-input">
                <input id="file" type="file" name="file" multiple accept="image/*" tabindex="0" @input="uploadPhotos">
                <label for="file">
                  <Icon name="ic:baseline-add-photo-alternate" size="1.4rem" />
                  Photos
                </label>
              </div>
            </div>
          </form>

          <hr>

          <div class="flex-wrap right">
            <button class="button btn-transparent" @click="clear">
              Clear
            </button>
            <button class="button btn-accent bold" @click="submit">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="expand" class="map-create-preview">
      <Tag text="Preview" gray />
      <div v-html="descriptionPreview" />
    </div>
  </div>
</template>

<style lang="scss">
.map-create-post {
  border-radius: var(--radius-md);
  position: absolute;
  top: 10px;
  left: 10px;
  bottom: 10px;
  width: 386px;
  z-index: 25;
  padding: 10px;
  background-color: var(--color-bg-light-20);
  backdrop-filter: blur(50px);
  box-shadow: var(--shadow);

  &.is-expand {
    display: grid;
    gap: 40px;
    flex: 1;
    grid-template-columns: 1fr 1fr;
    width: unset;
    right: 10px;
  }

  .map-create-form {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .map-create-preview {
    border-radius: var(--radius-md);
    padding: 20px;
    background-color: var(--color-bg-light-40);

    .tag {
      margin-bottom: 10px;
    }
  }

  .form-wrap-outer {
    flex: 1;
    height: 100%;
    width: 100%;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;

    .form-wrap-inner {
      position: absolute;
      inset: 0;
      padding: 10px;
    }
  }

  .image-input-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-start;

    input[type=file] {
      display: none;

      &:focus + label {
        border-color: var(--color-accent);
      }

      & + label {
        @include t();
        cursor: pointer;
        border-radius: var(--radius-md);
        display: flex;
        gap: 5px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 84px;
        height: 84px;
        font-size: 0.8rem;
        text-align: center;
        border: 2px dashed var(--color-border);
        z-index: 2;
        position: relative;

        &:hover {
          &:after {
            opacity: 1;
            transform: scale(1);
            border-radius: var(--radius-md);
          }

          border-color: var(--color-accent);
        }

        &:after {
          @include t();
          border-radius: var(--radius-lg);
          content: "";
          position: absolute;
          inset: 0;
          background-color: var(--color-accent-bg);
          transform: scale(0.7);
          border-radius: var(--radius-lg);
          z-index: -1;
          opacity: 0;
        }
      }
    }
  }

  hr {
    display: block;
    margin: 25px -10px;
    border-bottom: 1px solid var(--color-border);
  }

  .metadata {
    display: flex;
    gap: 20px;
    margin: 0;
    padding: 0;
    // margin-bottom: 20px;
    padding-left: 42px;

    li {
      @include sans(200);
      margin: 0;
      font-size: 0.7rem;
      padding: 0;
      color: var(--color-text-light);

      strong {
        @include sans(600);
        font-size: inherit;
        color: var(--color-text);
      }

      &:before {
        display: none;
      }
    }
  }

  .context-wrap {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    margin-bottom: 5px;
    width: 100%;
    z-index: 100;

    button {
      width: 35px;
      height: 35px;
      text-align: center;
      line-height: 32px;
      color: var(--color-text-light);
    }
  }

  .title-wrap {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 5px;
    width: 100%;

    h6 {
      margin-bottom: 0;
    }

    img {
      border-radius: var(--radius-sm);
      overflow: hidden;
      display: block;
      object-position: center;
      object-fit: contain;
      height: auto;
      transform: translateY(-4px);
    }
  }
}
</style>
