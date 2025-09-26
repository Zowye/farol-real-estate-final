<template>
  <v-form v-model="isValid" @submit.prevent>
    <v-row>
      <!-- Address Search -->
 <v-col cols="12">
        <v-combobox
          v-model="selectedPrediction"
          :items="predictions"
          :loading="isLoading"
          label="Search Address"
          item-title="description"
          item-value="place_id"
          :return-object="true"              
          hide-no-data
          @update:search="onSearchUpdate" 
          @update:modelValue="onAddressSelect"
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props">
              <v-list-item-title>
                {{ item.raw.structured_formatting?.main_text || item.raw.description }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.raw.structured_formatting?.secondary_text }}
              </v-list-item-subtitle>
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
    <!-- Debug alert -->
    <v-alert type="info" variant="tonal" class="mb-2">
      Debug: lat={{ address.latitude }}, lng={{ address.longitude }},
      key={{ mapsApiKey ? '✔️' : '❌' }}
    </v-alert>

    <v-img
  :src="`https://maps.googleapis.com/maps/api/staticmap?center=${address.latitude},${address.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${address.latitude},${address.longitude}&key=${mapsApiKey}`"
  height="300"
  cover
  @error="onMapError"
>
  <template #placeholder>
    <v-row class="fill-height ma-0" align="center" justify="center">
      <v-progress-circular indeterminate color="primary" />
    </v-row>
  </template>
</v-img>

<v-alert v-if="mapError" type="error" variant="tonal" class="mt-2">
  {{ mapError }}
</v-alert>

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

const props = defineProps<{ modelValue: Address }>()
const emit = defineEmits(['update:modelValue', 'update:valid'])

// Typed text vs. selected item
const searchInput = ref('')                               // only the text the user types
const selectedPrediction = ref<PlacePrediction | null>(null) // the chosen suggestion

// Places composable
const { predictions, isLoading, getPlaceDetails } = usePlaces(searchInput)

// Runtime config
const config = useRuntimeConfig()
const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY

// Keep v-model <-> parent in sync
const address = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})


// Form validity binding
const isValid = computed(() => {
  const v = address.value || {} as Address
  return !!v.street &&
         !!v.streetNumber &&
         !!v.neighborhood &&
         !!v.postalCode &&
         !!v.city &&
         !!v.state &&
         !!v.country &&
         !!v.latitude &&
         !!v.longitude
})
watch(isValid, (v) => emit('update:valid', v))





// Defina mapError como uma ref
const mapError = ref<string>('')

// Função para lidar com erro de carregamento do mapa
const onMapError = () => {
  mapError.value = 'Failed to load map image. Please check your API key and network connection.'
}

// Computed para a URL do mapa estático
const mapSrc = computed(() => {
  if (!address.value.latitude || !address.value.longitude || !mapsApiKey) {
    return ''
  }
  return `https://maps.googleapis.com/maps/api/staticmap?center=${address.value.latitude},${address.value.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${address.value.latitude},${address.value.longitude}&key=${mapsApiKey}`
})




function onSearchUpdate(text: string) {
  // Update only the search text; this triggers predictions in your composable
  if (typeof text === 'string') searchInput.value = text
}




async function onAddressSelect(value: PlacePrediction | null) {
  // Only run when a suggestion is actually selected
  if (!value?.place_id) return

  const details = await getPlaceDetails(value.place_id)
  if (!details) return

  // Update the parent's location model in one shot (keeps reactivity intact)
  address.value = {
    ...address.value,
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
  }


  const isValidLocation = !!details.latitude && !!details.longitude &&
    !!details.city && !!details.state && !!details.country; 

  console.log('Is valid location:', isValidLocation);
  // Optional: mark as valid once we have a resolvable location
  emit('update:valid',
    isValidLocation 
  )
}
</script>