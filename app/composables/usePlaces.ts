import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

export interface PlacePrediction {
  description: string
  place_id: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export interface PlaceDetails {
  placeId: string
  formattedAddress: string
  latitude: number
  longitude: number
  street: string
  streetNumber: string
  neighborhood: string
  city: string
  state: string
  country: string
  postalCode: string
}

export const usePlaces = (searchInput: Ref<string>) => {
  const predictions = ref<PlacePrediction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Debounce the search to avoid too many API calls
  const debouncedSearch = useDebounceFn(async (input: string) => {
    if (!input) {
      predictions.value = []
      return
    }

    try {
      isLoading.value = true
      error.value = null

      const response = await useFetch('/api/places/autocomplete', {
        query: { input }
      })

      if (response.error.value) {
        throw new Error(response.error.value.message)
      }

      predictions.value = response.data.value as PlacePrediction[]
    } catch (err) {
      console.error('Places autocomplete error:', err)
      error.value = 'Failed to fetch suggestions'
    } finally {
      isLoading.value = false
    }
  }, 300)

  // Watch for input changes
  watch(searchInput, (newValue) => {
    debouncedSearch(newValue)
  })

  // Get place details
  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
    try {
      error.value = null
      const response = await useFetch('/api/places/details', {
        query: { placeId }
      })

      if (response.error.value) {
        throw new Error(response.error.value.message)
      }

      return response.data.value as PlaceDetails
    } catch (err) {
      console.error('Places details error:', err)
      error.value = 'Failed to fetch place details'
      return null
    }
  }

  return {
    predictions,
    isLoading,
    error,
    getPlaceDetails
  }
}