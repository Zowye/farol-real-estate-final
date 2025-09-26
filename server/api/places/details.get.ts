import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { placeId } = query

    if (!placeId) {
      throw createError({
        statusCode: 400,
        message: 'Place ID is required'
      })
    }

    // Google Places Details API endpoint
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
    url.searchParams.append('place_id', placeId as string)
    url.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY || '')
    url.searchParams.append('language', 'pt-BR')
    url.searchParams.append('fields', [
      'address_components',
      'formatted_address',
      'geometry',
      'name',
      'place_id'
    ].join(','))

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('Places API error:', data)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch place details'
      })
    }

    // Parse address components
    const result = data.result
    const addressComponents = result.address_components.reduce((acc, component) => {
      component.types.forEach(type => {
        acc[type] = component.long_name
      })
      return acc
    }, {})

    return {
      placeId: result.place_id,
      formattedAddress: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      street: addressComponents.route,
      streetNumber: addressComponents.street_number,
      neighborhood: addressComponents.sublocality_level_1 || addressComponents.sublocality,
      city: addressComponents.administrative_area_level_2,
      state: addressComponents.administrative_area_level_1,
      country: addressComponents.country,
      postalCode: addressComponents.postal_code
    }
  } catch (error) {
    console.error('Places details error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch place details'
    })
  }
})
