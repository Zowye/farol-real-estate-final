# Dev container for Nuxt + Vuetify (SSR + BFF)
FROM node:20-alpine
WORKDIR /app

# Copia manifestos primeiro
COPY package*.json ./

# Instala deps (limpas, Linux-compatible)
RUN npm install && \
    npm install -D ts-node typescript @types/node && \
    npm install @google-cloud/storage multer

# Copia o resto do projeto (pra fallback; no compose a gente monta via bind mount)
COPY . .

# Gera Prisma Client (garante que exista no container)
RUN npx prisma generate

# Variáveis pra Nuxt SSR
ENV NUXT_TELEMETRY_DISABLED=1
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Adiciona script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
CMD ["docker-entrypoint.sh"]