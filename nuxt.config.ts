// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module'],

  // 🚀 Adiciona isso:
  nitro: {
    preset: 'node-server',
  },

  devServer: {
    port: process.env.PORT ? Number(process.env.PORT) : 8080,
    host: '0.0.0.0',
  },

  vite: {
    server: {
      hmr: { protocol: 'ws', host: 'localhost', port: 24678 },
      watch: { usePolling: true, interval: 300 }
    }
  },

  runtimeConfig: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    public: {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    }
  }
})
