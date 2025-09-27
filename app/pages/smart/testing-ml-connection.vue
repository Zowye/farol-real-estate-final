<template>
  <v-container class="d-flex flex-column align-center justify-center pa-6">
    <v-btn
      :loading="loading"
      color="primary"
      class="mb-4"
      @click="sendQuery"
    >
      Testar ML
    </v-btn>

    <v-card v-if="property" class="pa-4">
      <pre>{{ property }}</pre>
    </v-card>
  </v-container>
</template>

<script setup>
const loading = ref(false)
const property = ref(null)

const sendQuery = async () => {
  loading.value = true
  property.value = null

  try {
    const { data, error } = await useFetch('/api/testml')
    if (error.value) throw error.value
    property.value = data.value
  } catch (err) {
    console.error('Erro ao chamar testml:', err)
  } finally {
    loading.value = false
  }
}
</script>
