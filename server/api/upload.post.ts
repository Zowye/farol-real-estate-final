// /server/api/upload.post.ts
import { createError, defineEventHandler, readMultipartFormData, getQuery } from 'h3'
import { randomUUID } from 'crypto'
import { uploadBufferToGCS } from '../utils/gcs'

export default defineEventHandler(async (event) => {
  const { type, propertyId, isCover, public: publicFlag } = getQuery(event)
  if (!type || !propertyId) {
    throw createError({ statusCode: 400, message: 'Missing required parameters: type, propertyId' })
  }

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
  const base = isCover === 'true' ? 'cover' : randomUUID()
  const storagePath = `properties/${propertyId}/${base}.${ext}`

  const uploaded = await uploadBufferToGCS({
    buffer: file.data as Buffer,
    contentType: file.type,
    storagePath,
    // se quiser público, passe ?public=true e defina cache agressivo:
    makePublic: publicFlag === 'true',
    cacheControl: publicFlag === 'true' ? 'public, max-age=31536000, immutable' : undefined
  })

  // Retorne storagePath (para guardar no DB) e um signedUrl só para uso imediato no front (não salvar no DB)
  return {
    storagePath: uploaded.storagePath,
    publicUrl: uploaded.publicUrl ?? null
  }
})
