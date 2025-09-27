<template>
  <v-container class="d-flex flex-column align-center justify-center custom-bg">
    <!-- Header com gradiente e sombra -->
    <v-row class="mb-6">
      <v-col cols="12" class="text-center">
        <div class="logo-container mb-4">
          <v-icon icon="mdi-lighthouse-on" size="64" class="logo-icon" />
        </div>
        <h1 class="text-h3 font-weight-bold primary--text mb-2">
          Ask Farol
        </h1>
        <p class="text-body-2 text-medium-emphasis">
          Sua inteligência artificial para consultas imobiliárias
        </p>
      </v-col>
    </v-row>

    <!-- Input centralizado com botão GO! -->
    <v-row justify="center" class="w-100 mt-0">
      <v-col cols="12" md="8" lg="6" class="d-flex justify-center">
        <div class="search-container w-100">
          <v-text-field
            v-model="query"
            placeholder="Pesquise por imóveis..."
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

     <!-- Card de resposta -->
    <v-row justify="center" class="w-100 mt-6" v-if="serverResponse">
      <v-col cols="12" md="8" lg="6">
        <v-card class="response-card pa-4 rounded-lg elevation-4">
          <v-card-title class="d-flex align-center mb-2">
            <v-icon icon="mdi-home-analytics" class="mr-2" color="primary"></v-icon>
            <span class="text-h6">Resposta</span>
          </v-card-title>
          <v-card-text>
            <div v-if="serverResponse.mode === 'chat'">
              <p>{{ serverResponse.answer }}</p>
            </div>
            <div v-else-if="serverResponse.mode === 'sql'">
              <p v-if="serverResponse.answer">{{ serverResponse.answer }}</p>
              <v-table v-if="serverResponse.rows && serverResponse.rows.length">
                <thead>
                  <tr>
                    <th v-for="col in serverResponse.columns" :key="col">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in serverResponse.rows" :key="index">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                  </tr>
                </tbody>
              </v-table>
              <p v-else>Nenhum dado encontrado.</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const query = ref('')
const loading = ref(false)
const serverResponse = ref(null)

const sendQuery = async () => {
  if (!query.value.trim()) return

  loading.value = true
  serverResponse.value = null

  try {
    const responseData = await fetch("http://localhost:8080/v1/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: query.value }),
    })

    const data = await responseData.json()
    serverResponse.value = data
    console.log('Resposta do servidor:', data)
  } catch (error) {
    console.error('Erro ao enviar pergunta:', error)
    serverResponse.value = { mode: 'error', answer: "Desculpe, ocorreu um erro ao processar sua solicitação." }
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