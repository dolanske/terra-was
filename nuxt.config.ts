// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-icon', '@vueuse/nuxt', 'formidable'],
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
    IS_DEV: process.env.NODE_ENV !== 'production',
    IS_PRD: process.env.NODE_ENV === 'production',
  },
  app: {
    // pageTransition: {
    //   name: 'page',
    //   mode: 'out-in',
    // },
  },
})
