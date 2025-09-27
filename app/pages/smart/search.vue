<template>
  <v-container class="d-flex flex-column align-center justify-center custom-bg">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12" class="text-center">
        <div class="logo-container mb-4">
          <v-icon icon="mdi-lighthouse-on" size="64" class="logo-icon" />
        </div>
        <h1 class="text-h3 font-weight-bold primary--text mb-2">
          Smart Search Farol
        </h1>
        <p class="text-body-2 text-medium-emphasis">
          Buscar imóvel pelo ID
        </p>
      </v-col>
    </v-row>

    <!-- Input + botão -->
    <v-row justify="center" class="w-100 mt-0">
      <v-col cols="12" md="8" lg="6" class="d-flex justify-center">
        <div class="search-container w-100">
          <v-text-field
            v-model="query"
            placeholder="Digite o ID do imóvel..."
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            density="comfortable"
            class="rounded-xl elevation-2 search-input"
            hide-details
            @keydown.enter="sendQuery"
          >
            <template v-slot:append>
              <v-fade-transition>
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  size="28"
                  color="primary"
                  class="mr-2"
                />
                <v-btn
                  v-else
                  icon
                  variant="flat"
                  color="primary"
                  size="large"
                  class="go-button"
                  @click="sendQuery"
                >
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </v-fade-transition>
            </template>
          </v-text-field>
        </div>
      </v-col>
    </v-row>

    <!-- Card do imóvel -->
    <v-row justify="center" class="w-100 mt-6" v-if="property">
      <v-col cols="12" md="8" lg="6">
        <PropertyCard :property="property" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const query = ref('')
const loading = ref(false)
const property = ref(null)

const sendQuery = async () => {
  if (!query.value.trim()) return

  loading.value = true
  property.value = null

  try {
    const { data, error } = await useFetch('/api/property', {
      query: { id: query.value }
    })
    if (error.value) throw new Error('Falha na busca do imóvel')
    property.value = data.value
  } catch (err) {
    console.error('Erro ao buscar imóvel:', err)
    property.value = null
  } finally {
    loading.value = false
  }
}

</script>


<style scoped>
.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  box-shadow: 0 8px 16px rgba(25, 118, 210, 0.3);
}

.logo-icon {
  color: white;
}

.search-container {
  position: relative;
}

.search-input {
  background: #fff;
}

.go-button {
  margin-right: 4px;
  transition: all 0.3s ease;
}

.go-button:hover {
  transform: scale(1.05);
}

.response-card {
  border-left: 4px solid #1976d2;
  background: #f8fbff;
}

.response-content {
  line-height: 1.6;
  color: #333;
}
</style>