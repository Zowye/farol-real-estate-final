#!/bin/sh

# Aplica migrations (sem resetar nada)
npx prisma migrate deploy

# Inicia a aplicação
npm run dev
