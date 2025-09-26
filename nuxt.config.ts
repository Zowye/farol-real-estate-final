// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module'],
  vite: {
    server: {
      // HMR no host/porta mapeados
      hmr: { protocol: 'ws', host: 'localhost', port: 24678 },
      // Watch por polling (Windows + Docker)
      watch: { usePolling: true, interval: 300 }
    }
  },
  runtimeConfig: {
    // Private keys (server-side)
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    // Public keys (also exposed to client)
    public: {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    }
  }
})