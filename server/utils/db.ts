import { Pool } from 'pg'

// reuse the pool across HMR in dev:
const globalAny = globalThis as any
export const pool: Pool = globalAny.__pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // local
})
if (!globalAny.__pgPool) globalAny.__pgPool = pool
