import { prisma } from '../utils/prisma'
import { getSignedReadUrl } from '../utils/gcs'
import type { Property, PropertyPhoto, Room, RoomPhoto } from '@prisma/client'
import { getQuery, createError, defineEventHandler } from 'h3'

// Extend types with signed URL
type EnhancedPhoto = PropertyPhoto & { url: string }
type EnhancedRoomPhoto = RoomPhoto & { url: string }
type EnhancedRoom = Room & { photos: EnhancedRoomPhoto[] }
type EnhancedProperty = Property & {
  photos: EnhancedPhoto[]
  rooms: EnhancedRoom[]
}

export default defineEventHandler(async (event) => {
  try {
    // pega o ID passado na rota (ex: /api/properties/123)

  const query = getQuery(event)
  const id = Number(query.id)

  console.log("Recebi algo", id);
  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: 'ID inválido' })
  }

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        propertyType: true,
        amenities: { include: { amenityType: true } },
        rooms: {
          include: {
            roomType: true,
            photos: { orderBy: { position: 'asc' } }
          }
        },
        photos: { orderBy: { position: 'asc' } }
      }
    })

    if (!property) {
      throw createError({ statusCode: 404, message: 'Imóvel não encontrado' })
    }

    // Map with signed URLs
    const photos: EnhancedPhoto[] = await Promise.all(
      property.photos.map(async (ph: PropertyPhoto) => ({
        ...ph,
        url: await getSignedReadUrl(ph.storagePath)
      }))
    )

    const rooms: EnhancedRoom[] = await Promise.all(
      property.rooms.map(async (r: Room) => {
        const roomPhotos: EnhancedRoomPhoto[] = await Promise.all(
          r.photos.map(async (rp: RoomPhoto) => ({
            ...rp,
            url: await getSignedReadUrl(rp.storagePath)
          })))
        return { ...r, photos: roomPhotos }
      })
    )

    const enhanced: EnhancedProperty = { ...property, photos, rooms }
    return enhanced
  } catch (err) {
    console.error('❌ Erro ao buscar imóvel:', err)
    throw createError({
      statusCode: 500,
      message: typeof err === 'object' && err !== null && 'message' in err ? (err as { message: string }).message : 'Erro interno'
    })
  }
})
    