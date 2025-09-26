import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
  var __prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient()
  }
  prisma = global.__prisma
}

// Verificação de diagnóstico: Checa se os modelos foram gerados e estão no client.
// O cliente Prisma gerado tem os nomes dos modelos como propriedades (em minúsculo).
// O cliente base não tem. Se 'property' não existe, o 'prisma generate' falhou ou não foi encontrado.
if (!('property' in prisma)) {
  const models = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
  const errorMessage = `[Prisma Client Erro] O modelo 'property' não foi encontrado no cliente Prisma.
  Isso significa que o 'prisma generate' não foi executado ou falhou.
  Modelos encontrados: [${models.join(', ')}].
  Certifique-se que 'prisma generate' é executado antes de 'nuxt build'.`;
  
  // Em desenvolvimento, isso vai quebrar o HMR com uma mensagem clara.
  // Em produção, vai impedir a aplicação de iniciar.
  throw new Error(errorMessage);
}

export { prisma }