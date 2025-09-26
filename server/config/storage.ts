import { Storage } from '@google-cloud/storage'

// Configuração flexível que pode vir do Terraform
interface StorageConfig {
  projectId: string
  bucketName: string
  keyFilename?: string // Para desenvolvimento local
  credentials?: {
    client_email: string
    private_key: string
  } // Para ambiente cloud (pode vir de secret manager)
}

// Função para obter configuração baseada no ambiente
const getStorageConfig = (): StorageConfig => {
  if (process.env.NODE_ENV === 'development') {
    return {
      projectId: process.env.GOOGLE_CLOUD_PROJECT || '',
      bucketName: process.env.GOOGLE_CLOUD_BUCKET || '',
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS // Caminho para service account key em dev
    }
  }

  // Em produção, as credenciais virão do ambiente cloud
  // O Terraform terá configurado as permissões necessárias
  return {
    projectId: process.env.GOOGLE_CLOUD_PROJECT || '',
    bucketName: process.env.GOOGLE_CLOUD_BUCKET || '',
    // Em prod, o serviço já terá as permissões necessárias
    // através da service account associada
  }
}

// Inicializa o cliente do Storage
export const initializeStorage = () => {
  const config = getStorageConfig()
  
  const storage = new Storage({
    projectId: config.projectId,
    ...(config.keyFilename ? { keyFilename: config.keyFilename } : {}),
    ...(config.credentials ? { credentials: config.credentials } : {})
  })

  return {
    storage,
    bucket: storage.bucket(config.bucketName)
  }
}
