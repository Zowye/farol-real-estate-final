import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const propertyTypes = await prisma.propertyType.findMany({
      orderBy: { label: 'asc' }
    })
    return propertyTypes;
  } catch (err) {
    console.error('Error fetching property types:', err)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch property types'
    })
  }
})