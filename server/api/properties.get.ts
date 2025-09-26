import { createError, defineEventHandler } from 'h3'
import { prisma } from '../utils/prisma'
import { getSignedReadUrl } from '../utils/gcs'
import type { Property, PropertyPhoto, Room, RoomPhoto } from '@prisma/client'

// Extend types with signed URL
type EnhancedPhoto = PropertyPhoto & { url: string }
type EnhancedRoomPhoto = RoomPhoto & { url: string }
type EnhancedRoom = Room & { photos: EnhancedRoomPhoto[] }
type EnhancedProperty = Property & {
  photos: EnhancedPhoto[]
  rooms: EnhancedRoom[]
}

export default defineEventHandler(async () => {
  try {
    const properties = await prisma.property.findMany({
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
      },
      orderBy: { createdAt: 'desc' }
    })

    // Map with signed URLs
    const enhanced: EnhancedProperty[] = await Promise.all(
      properties.map(async (p: Property) => {
        const photos: EnhancedPhoto[] = await Promise.all(
          p.photos.map(async (ph: PropertyPhoto) => ({
            ...ph,
            url: await getSignedReadUrl(ph.storagePath)
          }))
        )

        const rooms: EnhancedRoom[] = await Promise.all(
          p.rooms.map(async (r: Room) => {
            const roomPhotos: EnhancedRoomPhoto[] = await Promise.all(
              r.photos.map(async (rp: RoomPhoto) => ({
                ...rp,
                url: await getSignedReadUrl(rp.storagePath)
              }))
            )
            return { ...r, photos: roomPhotos }
          })
        )

        return { ...p, photos, rooms }
      })
    )

    return enhanced
  } catch (err) {
    console.error('❌ Erro ao buscar propriedades:', err)
    throw createError({
      statusCode: 500,
      message: 'Falha ao buscar propriedades'
    })
  }
})
