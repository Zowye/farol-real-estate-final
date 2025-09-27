import { prisma } from '../utils/prisma'
import { getSignedReadUrl } from '../utils/gcs'
import type { Property, PropertyPhoto, Room, RoomPhoto } from '@prisma/client'
import { readBody, createError, defineEventHandler } from 'h3'

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
    // 1. Recebe question do frontend
    const body = await readBody<{ question?: string }>(event)
    if (!body?.question) {
      throw createError({ statusCode: 400, message: 'Campo "question" é obrigatório' })
    }

    // log do question
    console.log('❓ Pergunta recebida:', body.question)

    // 2. Chama o serviço ML
    let mlRes: any

    try {
      mlRes = await $fetch('http://ml-ml-hello-1:8080/v1/smart-search', {
      method: 'POST',
      body: JSON.stringify({ question: body.question }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      console.log('🔍 Resposta do ML:', mlRes)

    // 3. Valida estrutura do retorno
    if (!mlRes || typeof mlRes !== 'object') {
      throw createError({ statusCode: 500, message: 'Resposta inválida do serviço ML' })
    }

    const propertyId = Number((mlRes as any).property_id)
    const summary = String((mlRes as any).summary ?? '')
    if (!Number.isFinite(propertyId) || !summary) {
      throw createError({ statusCode: 500, message: 'Resposta inválida do serviço ML' })
    }
} catch (err: any) {
  const status = err?.response?.status ?? 502
  const data = err?.data ?? err?.response?._data
  console.error('❌ Erro na chamada ao ML:', status, data)

  // se o ML disser 404 (nenhum imóvel), faça um fallback simples:
  if (status === 404) {
    const property = await prisma.property.findFirst({
      orderBy: { price: 'asc' },
      include: {
        propertyType: true,
        amenities: { include: { amenityType: true } },
        rooms: { include: { roomType: true, photos: { orderBy: { position: 'asc' } } } },
        photos: { orderBy: { position: 'asc' } },
      }
    })
    if (property) {
      const photos = await Promise.all(property.photos.map(async ph => ({
        ...ph, url: await getSignedReadUrl(ph.storagePath)
      })))
      const rooms = await Promise.all(property.rooms.map(async r => ({
        ...r,
        photos: await Promise.all(r.photos.map(async rp => ({
          ...rp, url: await getSignedReadUrl(rp.storagePath)
        })))
      })))
      return {
        property: { ...property, photos, rooms },
        summary: 'Não achei exatamente o que você pediu. Mostrando o imóvel mais barato disponível no banco.'
      }
    }
  }

  throw createError({
    statusCode: status,
    message: data?.detail ?? `Falha ao conectar com ML service`
  })
}
    // 3. Valida estrutura do retorno
    if (!mlRes || typeof mlRes !== 'object' || !('property_id' in mlRes) || !('summary' in mlRes)) {
      throw createError({ statusCode: 500, message: 'Resposta inválida do serviço ML' })
    }

    const propertyId = Number(mlRes.property_id)
    const summary = String(mlRes.summary)

    // 4. Busca imóvel no banco
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
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
      throw createError({ statusCode: 404, message: `Imóvel ${propertyId} não encontrado` })
    }

    // 5. Monta URLs assinadas
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
          }))
        )
        return { ...r, photos: roomPhotos }
      })
    )

    const enhanced: EnhancedProperty = { ...property, photos, rooms }

    // 6. Retorna para o frontend
    return {
      property: enhanced,
      summary
    }
  } catch (err) {
    console.error('❌ Erro no smart-search pipeline:', err)
    throw createError({
      statusCode: 500,
      message: typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message: string }).message
        : 'Erro interno'
    })
  }
})
