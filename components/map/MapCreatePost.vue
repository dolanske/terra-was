<script setup lang='ts'>
import type { SearchOutput } from 'country-code-lookup'
import { byIso } from 'country-code-lookup'
import type { __TripBase__ } from '~~/utils/trip.types'

const props = defineProps<{
  code: string
}>()

const country = computed<SearchOutput>(() => byIso(props.code))

/**
 * Form
 */

const form = reactive<__TripBase__>({
  title: '',
  description: null,
  map: {
    zoom: 0,
    center: [0, 0],
    // markers: [],
  },
  date: '',
  iso: '',
  images: [],
})

watch(() => props.code, (value) => {
  form.iso = value
})

async function submit() {
  // https://pqina.nl/blog/upload-image-with-nodejs/
}

/**
 * Handle uploading of images
 */

const photos = reactive({ files: [] })

function uploadPhotos(e: Event) {
  e.preventDefault()
  e.stopPropagation()

  const files = (e.currentTarget as HTMLInputElement).files

  if (!files)
    return

  let index = 0

  for (const file of files) {
    const formData = new FormData()
    formData.append('file', file)

    // files.values[index] = {
    //   name: file.name,
    //   size: file.size,
    //   loading: true,
    //   key: null,
    // }

    useFetch('/api/images')

    // return upload('/api/images/', formData)
    //   .then((response: any) => {
    //     Object.assign(files.values[index], {
    //       loading: false,
    //       key: response.key,
    //     })
    //   })
    //   .catch((error) => {
    //     Object.assign(files.values[index], {
    //       loading: false,
    //       error,
    //     })
    //   })

    index++
  }
}
</script>

<template>
  <div v-if="country" class="map-create-post">
    <div class="title-wrap">
      <img :src="getFlagUrl(country.iso2)" alt="">
      <h6>{{ country.country }}</h6>
    </div>

    <ul>
      <li>Visited: <strong>0 times</strong></li>
      <li>Region: <strong>{{ country.region }}</strong></li>
    </ul>

    <hr>

    <form @submit="submit">
      <FormInput v-model:value="form.title" label="Name" :placeholder="`${country.capital} was awesome!`" />
      <FormTextarea v-model:value="form.description" label="Description" placeholder="Let me tell you a story..." />

      <span class="form-label">Photos</span>
      <div class="image-input-wrap">
        <!-- <MapPostImage url="https://friends.hivecom.net/data/image/u1Lc1SdJTkm_ebw6fvbCJQ/tiny.jpg" @remove="removeImage('')" /> -->
        <!-- <MapPostImage url="https://friends.hivecom.net/data/image/HSd2nWqeRnaRZIX_LzoxAg/tiny.jpg" @remove="removeImage('')" /> -->
        <!-- <MapPostImage url="https://friends.hivecom.net/data/image/WrmT272FQFaa8zmxPexjVg/tiny.jpg" @remove="removeImage('')" /> -->
        <!-- <MapPostImage url="https://friends.hivecom.net/data/image/rNbSjBKCSx-RWWSE7SZCYQ/tiny.jpg" @remove="removeImage('')" /> -->

        <div class="image-input">
          <input type="file" name="file" multiple accept="image/*" @input="uploadPhotos">
          <label for="file">
            <Icon name="ic:baseline-add-photo-alternate" size="1.4rem" />
            Photos
          </label>
        </div>
      </div>
    </form>
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
  z-index: 5;
  padding: 10px;
  display: block;
  background-color: var(--color-bg-light-20);
  backdrop-filter: blur(50px);
  box-shadow: var(--shadow);

  .image-input-wrap {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(4, 1fr);

    input {
      display: none;

      & + label {
        @include t();
        cursor: pointer;
        border-radius: var(--radius-md);
        display: flex;
        gap: 5px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
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

  .saved-trips-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;

    svg {
      color: var(--color-accent);
    }
  }

  hr {
    display: block;
    margin: 25px -10px;
    border-bottom: 1px solid var(--color-border);
  }

  ul {
    display: flex;
    gap: 20px;
    margin: 0;
    padding: 0;
    margin-bottom: 20px;
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

  .title-wrap {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 10px;
    align-items: center;
    margin-bottom: 5px;

    h6 {
      margin-bottom: 0;
    }

    img {
      border-radius: var(--radius-sm);
      overflow: hidden;
      display: block;
      object-position: center;
      object-fit: contain;
      // max-width: 32px;
      // max-height: 32px;
      height: auto;
    }
  }
}
</style>
