// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-icon', '@vueuse/nuxt'],
  nitro: {
    plugins: ['~/server/db/index.ts'],
  },
  typescript: {
    shim: false,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/style/mixins.scss" as *;
            @use "~/assets/style/fonts.scss" as *;
          `,
        },
      },
    },
  },
  css: ['~/assets/style/_index.scss'],
  runtimeConfig: {
    public: {
      mapToken: 'pk.eyJ1IjoiZG9sYW5za2UwMDAiLCJhIjoiY2xjNmZwOWRoMDdrajNwcDJlcmx6dzBkaiJ9.33y-0NKKkRazS0BUE0RT8w',
      mapStyle: 'mapbox://styles/dolanske000/cl3hpk2ji005514l4asj0h9nf',
    },
    MONGO_URL: process.env.MONGO_URL,
  },
})
