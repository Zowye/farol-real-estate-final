import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const amenityTypes = await prisma.amenityType.findMany({
      where: { is_active: true },
      orderBy: [
        { category: 'asc' },
        { label: 'asc' }
      ]
    })
    return amenityTypes
  } catch (err) {
    console.error('Error fetching amenity types:', err)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch amenity types'
    })
  }
})