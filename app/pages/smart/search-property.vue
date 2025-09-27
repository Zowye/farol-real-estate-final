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
          Busque em linguagem natural (ex.: "casa 3 quartos com suíte e varanda em Campinas até 900k")
        </p>
      </v-col>
    </v-row>

    <!-- Input + botão -->
    <v-row justify="center" class="w-100 mt-0">
      <v-col cols="12" md="8" lg="6" class="d-flex justify-center">
        <div class="search-container w-100">
          <v-text-field
            v-model="query"
            placeholder="Descreva o que você procura..."
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            density="comfortable"
            class="rounded-xl elevation-2 search-input"
            hide-details
            @keydown.enter="sendQuery"
          >
            <template #append>
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

    <!-- Erro -->
    <v-row v-if="errorMsg" class="w-100 mt-4" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-alert type="error" variant="tonal" density="comfortable">
          {{ errorMsg }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Resultado: Summary + Property lado a lado -->
    <v-row v-if="summary || property" class="w-100 mt-6" justify="center" align="stretch">
      <!-- Summary -->
      <v-col cols="12" md="5" lg="4">
        <v-card class="pa-4 response-card h-100 d-flex flex-column">
          <div class="d-flex align-center mb-3">
            <v-icon class="mr-2" color="primary">mdi-text-long</v-icon>
            <h3 class="text-h6 mb-0">Resumo do Imóvel</h3>
          </div>

          <v-skeleton-loader v-if="loading" type="paragraph, paragraph, paragraph" />

          <div v-else-if="summary" class="response-content summary-text flex-grow-1">
            {{ showFullSummary ? summary : truncatedSummary }}
          </div>

          <div v-else class="text-medium-emphasis flex-grow-1">
            Digite uma busca para ver o resumo aqui.
          </div>

          <div v-if="summary && summary.length > 200" class="mt-3 pt-2 text-center border-t">
            <v-btn 
              variant="text" 
              color="primary" 
              size="small"
              @click="showFullSummary = !showFullSummary"
            >
              {{ showFullSummary ? 'Ver menos' : 'Ver mais' }}
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- PropertyCard -->
      <v-col cols="12" md="7" lg="6">
        <v-card class="pa-0 h-100 d-flex flex-column" variant="flat">
          <v-skeleton-loader v-if="loading" type="image, article" class="flex-grow-1" />
          <PropertyCard 
            v-else-if="property" 
            :property="property" 
            class="elevation-2 flex-grow-1 compact-card"
          />
          <v-alert v-else variant="tonal" density="comfortable" class="flex-grow-1">
            Nenhum imóvel carregado ainda.
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const query = ref('')
const loading = ref(false)
const property = ref<any | null>(null)
const summary = ref<string>('')
const errorMsg = ref<string>('')
const showFullSummary = ref(false)

// Computed para truncar o summary
const truncatedSummary = computed(() => {
  if (!summary.value) return ''
  return summary.value.length > 200 
    ? summary.value.substring(0, 200) + '...' 
    : summary.value
})

/** Call internal API /api/smart-search with the user's question */
const sendQuery = async () => {
  if (!query.value.trim() || loading.value) return

  loading.value = true
  errorMsg.value = ''
  property.value = null
  summary.value = ''
  showFullSummary.value = false

  try {
    const { data, error } = await useFetch('/api/smart-search', {
      method: 'POST',
      body: { question: query.value },
      // avoid cache across different queries
      key: `smart-${Date.now()}`
    })

    if (error.value) throw error.value

    const payload = data.value as { property: any; summary: string } | null
    if (!payload || !payload.property || typeof payload.summary !== 'string') {
      throw new Error('Resposta inválida do smart-search')
    }

    property.value = payload.property
    summary.value = payload.summary
  } catch (err: any) {
    console.error('❌ Smart search error:', err)
    errorMsg.value = err?.message || 'Falha ao executar smart-search'
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
.logo-icon { color: white; }
.search-container { position: relative; }
.search-input { background: #fff; }

.go-button { margin-right: 4px; transition: all 0.3s ease; }
.go-button:hover { transform: scale(1.05); }

.response-card { 
  border-left: 4px solid #1976d2; 
  background: #f8fbff; 
}

.response-content { 
  line-height: 1.6; 
  color: #333; 
  min-height: 60px;
}

.summary-text { white-space: pre-line; } /* preserves line breaks from the LLM */

.border-t {
  border-top: 1px solid #e0e0e0;
}

/* Estilo para tornar o PropertyCard mais compacto */
.compact-card {
  max-height: 400px;
  overflow: hidden;
}

.compact-card :deep(.v-card-item) {
  padding: 16px;
}

.compact-card :deep(.v-card-text) {
  padding: 0 16px 16px;
}

/* Garantir que os cards tenham a mesma altura */
.h-100 {
  height: 100%;
}

.d-flex.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>