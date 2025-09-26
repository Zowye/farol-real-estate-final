<template>
  <v-form v-model="isValid" @submit.prevent>
    <v-row>
      <!-- Address Search -->
      <v-col cols="12">
        <v-combobox
          v-model="searchInput"
          :items="predictions"
          :loading="isLoading"
          label="Search Address"
          item-title="description"
          :rules="[v => !!v || 'Address is required']"
          hide-no-data
          @update:search="onSearchUpdate"
          @update:modelValue="onAddressSelect"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <v-list-item-title>{{ item.raw.structured_formatting.main_text }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.raw.structured_formatting.secondary_text }}</v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-combobox>
      </v-col>

      <!-- Address Details -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="address.street"
          label="Street"
          readonly
          :rules="[v => !!v || 'Street is required']"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="address.streetNumber"
          label="Number"
          :rules="[v => !!v || 'Street number is required']"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="address.neighborhood"
          label="Neighborhood"
          readonly
          :rules="[v => !!v || 'Neighborhood is required']"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="address.postalCode"
          label="Postal Code"
          readonly
          :rules="[v => !!v || 'Postal code is required']"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="address.city"
          label="City"
          readonly
          :rules="[v => !!v || 'City is required']"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="address.state"
          label="State"
          readonly
          :rules="[v => !!v || 'State is required']"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="address.country"
          label="Country"
          readonly
          :rules="[v => !!v || 'Country is required']"
        ></v-text-field>
      </v-col>

      <!-- Preview no mapa -->
      <v-col cols="12">
        <v-card v-if="address.latitude && address.longitude" class="mb-4">
          <v-img
            :src="`https://maps.googleapis.com/maps/api/staticmap?center=${address.latitude},${address.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${address.latitude},${address.longitude}&key=${mapsApiKey}`"
            height="300"
            cover
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PlacePrediction } from '~/composables/usePlaces'

interface Address {
  street: string
  streetNumber: string
  neighborhood: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude?: number
  longitude?: number
  placeId?: string
}

const props = defineProps<{
  modelValue: Address
}>()

const emit = defineEmits(['update:modelValue', 'update:valid'])

// Form validation
const isValid = computed({
  get: () => true, // Initial value
  set: (value) => emit('update:valid', value)
})

// Address search
const searchInput = ref('')
const { predictions, isLoading, getPlaceDetails } = usePlaces(searchInput)

// Get Maps API Key from runtime config
const config = useRuntimeConfig()
const mapsApiKey = config.public.GOOGLE_MAPS_API_KEY

// Update search without selecting
const onSearchUpdate = (text: string) => {
  if (typeof text === 'string') {
    searchInput.value = text
  }
}

// Handle address selection
const onAddressSelect = async (value: string | PlacePrediction) => {
  // If string, user is still typing
  if (typeof value === 'string') {
    return
  }

  // Get place details
  const details = await getPlaceDetails(value.place_id)
  if (!details) return

  // Update address
  emit('update:modelValue', {
    street: details.street || '',
    streetNumber: details.streetNumber || '',
    neighborhood: details.neighborhood || '',
    city: details.city || '',
    state: details.state || '',
    country: details.country || '',
    postalCode: details.postalCode || '',
    latitude: details.latitude,
    longitude: details.longitude,
    placeId: details.placeId
  })
}

// Computed address for v-model
const address = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>