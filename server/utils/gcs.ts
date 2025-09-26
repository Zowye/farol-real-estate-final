// /server/utils/gcs.ts
import { Storage, GetSignedUrlConfig } from '@google-cloud/storage'

const storage =
  process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS }) // local
    : new Storage() // Cloud Run usa a service account atrelada ao serviço

const bucketName = process.env.GOOGLE_CLOUD_BUCKET || ''
const bucket = storage.bucket(bucketName)

// Call this once at module load to fail fast if misconfigured
let bucketChecked = false
async function ensureBucket() {
  if (bucketChecked) return
  const [exists] = await bucket.exists()
  if (!exists) throw new Error(`Bucket "${bucketName}" does not exist`)
  bucketChecked = true
}

export type UploadedObject = {
  storagePath: string
  contentType: string
  size: number
  publicUrl?: string
}

export async function uploadBufferToGCS(opts: {
  buffer: Buffer
  contentType: string
  storagePath: string
  makePublic?: boolean
  cacheControl?: string
}): Promise<UploadedObject> {
  await ensureBucket()
  const file = bucket.file(opts.storagePath)
  await file.save(opts.buffer, {
    contentType: opts.contentType,
    resumable: false,
    metadata: {
      cacheControl: opts.cacheControl ?? 'private, max-age=0, no-cache'
    }
  })
  if (opts.makePublic) {
    await file.makePublic()
    return {
      storagePath: opts.storagePath,
      contentType: opts.contentType,
      size: opts.buffer.length,
      publicUrl: `https://storage.googleapis.com/${bucketName}/${opts.storagePath}`
    }
  }
  return {
    storagePath: opts.storagePath,
    contentType: opts.contentType,
    size: opts.buffer.length
  }
}

export async function getSignedReadUrl(storagePath: string, ttlSeconds = 3600) {
  await ensureBucket()
  const [url] = await bucket.file(storagePath).getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + ttlSeconds * 1000
  } as GetSignedUrlConfig)
  return url
}
