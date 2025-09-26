import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { input } = query

    if (!input) {
      throw createError({
        statusCode: 400,
        message: 'Input is required'
      })
    }

    // Google Places API endpoint
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
    url.searchParams.append('input', input as string)
    url.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY || '')
    url.searchParams.append('language', 'pt-BR')
    url.searchParams.append('components', 'country:br') // Limitar ao Brasil

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch places'
      })
    }

    return data.predictions
  } catch (error) {
    console.error('Places autocomplete error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch places'
    })
  }
})
