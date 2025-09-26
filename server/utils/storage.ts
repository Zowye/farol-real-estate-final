// DEPRECATED

import { Storage } from '@google-cloud/storage'
import { randomUUID } from 'crypto'

// Initialize storage with flexible configuration
const initializeStorage = () => {
  // Em produção (Cloud Run, GKE, etc), a autenticação é automática
  // usando a service account associada ao serviço
  if (process.env.NODE_ENV === 'production') {
    return new Storage();
  }

  // Em desenvolvimento, usa o arquivo JSON
  return new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
  });
}

const storage = initializeStorage()
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET || '')

export interface UploadedFile {
  originalname: string
  buffer: Buffer
  mimetype: string
}

export const uploadPropertyPhoto = async (
  propertyId: string | number,
  file: UploadedFile,
  isCover: boolean = false
): Promise<{ url: string; storagePath: string }> => {
  // Generate unique filename
  const extension = file.originalname.split('.').pop()
  const filename = isCover ? 'cover' : randomUUID()
  const storagePath = `properties/${propertyId}/${filename}.${extension}`

  // Upload file
  const blob = bucket.file(storagePath)
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype
    },
    public: true // Make file publicly accessible
  })

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => {
      reject(error)
    })

    blobStream.on('finish', async () => {
      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`
      
      resolve({
        url: publicUrl,
        storagePath
      })
    })

    blobStream.end(file.buffer)
  })
}

export const uploadRoomPhoto = async (
  propertyId: string | number,
  roomId: string | number,
  file: UploadedFile
): Promise<{ url: string; storagePath: string }> => {
  // Generate unique filename
  const extension = file.originalname.split('.').pop()
  const filename = randomUUID()
  const storagePath = `properties/${propertyId}/rooms/${roomId}/${filename}.${extension}`

  // Upload file
  const blob = bucket.file(storagePath)
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype
    },
    public: true
  })

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => {
      reject(error)
    })

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`
      
      resolve({
        url: publicUrl,
        storagePath
      })
    })

    blobStream.end(file.buffer)
  })
}

export const deletePhoto = async (storagePath: string): Promise<void> => {
  const file = bucket.file(storagePath)
  await file.delete()
}