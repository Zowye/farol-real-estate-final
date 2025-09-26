<!-- index.vue -->
<template>
  <v-container>
    <!-- Header -->
    <v-row class="mb-8">
      <v-col>
        <h1 class="text-h3 mb-2">Encontre seu imóvel ideal</h1>
        <p class="text-h5 text-grey-darken-1">Explore nossa seleção de propriedades disponíveis</p>
      </v-col>
    </v-row>

    <!-- Properties Grid -->
    <v-row v-if="properties">
      <v-col
        v-for="property in properties"
        :key="property.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <PropertyCard
          :property="property"
        />
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-else-if="pending">
      <v-col class="text-center py-12">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error">
      <v-col class="text-center py-12">
        <p class="text-h5 text-error">Erro ao carregar propriedades</p>
      </v-col>
    </v-row>

    <!-- No Properties Message -->
    <v-row v-else>
      <v-col class="text-center py-12">
        <p class="text-h5 text-grey-darken-1">Nenhuma propriedade encontrada.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Fetch properties from the API with better error handling
const { data: properties, pending, error } = await useFetch('/api/properties')

// Log para debug
console.log('Properties:', properties.value)
</script>