export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module'],

  // ❌ remove isso (não precisa)
  // nitro: { preset: 'node-server' },

  nitro: {
    // Cloud Run injeta automaticamente process.env.PORT
    // O Nitro padrão (node) já respeita isso
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 8080,
  },

  runtimeConfig: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    public: {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    }
  }
})
