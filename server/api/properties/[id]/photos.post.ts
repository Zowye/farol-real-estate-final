// /server/api/properties/[id]/photos.post.ts
import { createError, defineEventHandler, readMultipartFormData, getQuery } from 'h3'
import { uploadBufferToGCS } from '../../../utils/gcs'
import { randomUUID } from 'crypto'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id
  const propertyId = parseInt(idParam || '', 10)


  if (!propertyId || propertyId <= 0) {
    throw createError({ 
      statusCode: 400, 
      message: 'Invalid propertyId parameter' 
    })
  }

  // Check if property exists
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  })

  if (!property) {
    throw createError({
      statusCode: 404,
      message: `Property with id ${propertyId} not found`
    })
  }

  const { isCover } = getQuery(event)
  const cover = String(isCover) === 'true'

  const formData = await readMultipartFormData(event)
  if (!formData?.length) throw createError({ statusCode: 400, message: 'No file uploaded' })

  const file = formData[0]
  if (!file?.filename || !file?.type || !file?.data) {
    throw createError({ statusCode: 400, message: 'Invalid file' })
  }
  if (!file.type.startsWith('image/')) {
    throw createError({ statusCode: 400, message: 'Only images are allowed' })
  }

  const ext = file.filename.split('.').pop()
  const storagePath = `properties/${propertyId}/${randomUUID()}.${ext}`

  const uploaded = await uploadBufferToGCS({
    buffer: file.data as Buffer,
    contentType: file.type,
    storagePath,
    makePublic: false
  })
  try {
    const photo = await prisma.propertyPhoto.create({
      data: {
        propertyId,
        storagePath: uploaded.storagePath,
        contentType: uploaded.contentType,
        isCover: cover
      }
    })
    console.log('Photo created:', photo)
    return { photoId: photo.id, storagePath: uploaded.storagePath }
  } catch (err: any) {
    console.error('Prisma error creating propertyPhoto:', err)
    throw createError({ statusCode: 500, message: 'Failed to save property photo' })
  }
})
