// server/api/properties.post.ts
import { defineEventHandler, createError, readBody } from 'h3'
import { prisma } from '../utils/prisma'


// Accept either { storagePath } or { url } and convert to storagePath.
// Works with public GCS URLs and V4 signed URLs pointing to your bucket.
function extractStoragePathFromUrl(url: string): string | null {
  try {
    // gs://bucket/obj
    if (url.startsWith('gs://')) {
      // remove "gs://<bucket>/" e retorna só o objeto
      return url.replace(/^gs:\/\/[^/]+\//, '');
    }

    const u = new URL(url);
    const host = u.host.toLowerCase();
    const pathname = u.pathname; // começa com "/"
    const parts = pathname.split('/').filter(Boolean);

    // 1) <bucket>.storage.googleapis.com/<object>
    if (host.endsWith('.storage.googleapis.com')) {
      // pathname já é o objeto (sem bucket)
      return decodeURIComponent(pathname.replace(/^\/+/, ''));
    }

    // 2) storage.googleapis.com/<bucket>/<object>
    // 3) storage.cloud.google.com/<bucket>/<object>
    if (host === 'storage.googleapis.com' || host === 'storage.cloud.google.com') {
      if (parts.length >= 2) {
        // remove o bucket (parts[0]) e junta o resto como objeto
        return decodeURIComponent(parts.slice(1).join('/'));
      }
    }

    // 4) download API: storage.googleapis.com/download/storage/v1/b/<bucket>/o/<object-enc>
    // 5) download API: www.googleapis.com/download/storage/v1/b/<bucket>/o/<object-enc>
    if (host === 'storage.googleapis.com' || host === 'www.googleapis.com') {
      const idxB = parts.indexOf('b');
      const idxO = parts.indexOf('o');
      if (idxB !== -1 && idxO !== -1 && idxO + 1 < parts.length) {
        return decodeURIComponent(parts[idxO + 1]);
      }
    }

    // 6) Firebase Storage: firebasestorage.googleapis.com/v0/b/<bucket>/o/<object-enc>
    if (host === 'firebasestorage.googleapis.com') {
      const idxB = parts.indexOf('b');
      const idxO = parts.indexOf('o');
      if (idxB !== -1 && idxO !== -1 && idxO + 1 < parts.length) {
        return decodeURIComponent(parts[idxO + 1]);
      }
    }

    return null;
  } catch {
    return null;
  }
}

// Now accepts: { storagePath } OR { url }
function normalizePhotosCreate(input: any): { storagePath: string; isCover?: boolean }[] | undefined {
  if (!input?.create?.length) return undefined;

  const items = input.create;

  // Debug log: see exactly what came from the client
  console.log('normalizePhotosCreate received:', JSON.stringify(items, null, 2));

  if (!Array.isArray(items)) {
    throw createError({ statusCode: 400, message: 'photos.create must be an array' });
  }

  return items.map((p, idx) => {
    if (p?.storagePath && typeof p.storagePath === 'string') {
      console.log(`photos[${idx}] using storagePath:`, p.storagePath);
      return { storagePath: p.storagePath, isCover: !!p.isCover };
    }

    if (p?.url && typeof p.url === 'string') {
      console.log(`photos[${idx}] received url:`, p.url);
      const sp = extractStoragePathFromUrl(p.url);
      console.log(`photos[${idx}] extracted storagePath:`, sp);
      if (!sp) {
        throw createError({
          statusCode: 400,
          message: `photos.create[${idx}].url is not a recognizable Google Cloud Storage URL`
        });
      }
      return { storagePath: sp, isCover: !!p.isCover };
    }

    throw createError({
      statusCode: 400,
      message: `photos.create[${idx}].storagePath is required (or provide a valid GCS/Firebase url)`
    });
  });
}



export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const requiredFields = [
      'name','description','propertyTypeId','contract','price',
      'roomsCount','bathrooms','garages',
      'street','streetNumber','neighborhood','city','state','country','postalCode'
    ]
    for (const f of requiredFields) {
      if (!body[f]) {
        throw createError({ statusCode: 400, message: `Missing required field: ${f}` })
      }
    }

    const data: any = {
      name: body.name,
      description: body.description,
      propertyTypeId: Number(body.propertyTypeId),
      contract: body.contract,
      price: body.price,
      roomsCount: body.roomsCount,
      bathrooms: body.bathrooms,
      garages: body.garages,
      street: body.street,
      streetNumber: body.streetNumber,
      neighborhood: body.neighborhood,
      city: body.city,
      state: body.state,
      country: body.country,
      postalCode: body.postalCode
    }

    if (body.amenities?.create?.length) {
      if (!Array.isArray(body.amenities.create)) {
        throw createError({ statusCode: 400, message: 'amenities.create must be an array' })
      }
      data.amenities = { create: body.amenities.create }
    }

    if (body.rooms?.create?.length) {
      if (!Array.isArray(body.rooms.create)) {
        throw createError({ statusCode: 400, message: 'rooms.create must be an array' })
      }
      data.rooms = {
        create: body.rooms.create.map((room: any, idx: number) => {
          if (!room?.roomTypeId) {
            throw createError({ statusCode: 400, message: `rooms.create[${idx}].roomTypeId is required` })
          }
          const roomPhotos = room.photos ? normalizePhotosCreate(room.photos) : undefined
          return {
            roomTypeId: Number(room.roomTypeId),
            name: room.name,
            description: room.description,
            areaM2: room.areaM2,
            floorNumber: room.floorNumber,
            position: room.position,
            photos: roomPhotos ? { create: roomPhotos } : undefined
          }
        })
      }
    }

    const propertyPhotos = body.photos ? normalizePhotosCreate(body.photos) : undefined
    if (propertyPhotos?.length) {
      data.photos = { create: propertyPhotos }
    }

    const property = await prisma.property.create({
      data,
      include: {
        propertyType: true,
        rooms: { include: { roomType: true, photos: true } },
        amenities: { include: { amenityType: true } },
        photos: true
      }
    })

    return property
  } catch (err: any) {
    console.error('Error creating property:', err)
    if (err.statusCode === 400) throw err
    throw createError({ statusCode: 500, message: 'Failed to create property' })
  }
})
