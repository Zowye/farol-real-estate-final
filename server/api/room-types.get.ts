import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const roomTypes = await prisma.roomType.findMany({
      orderBy: { label: 'asc' }
    })
    return roomTypes
  } catch (err) {
    console.error('Error fetching room types:', err)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch room types'
    })
  }
})