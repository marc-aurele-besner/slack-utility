import { Pool } from '@neondatabase/serverless'

const cache = new Map<string, Pool>()

export const getPool = (connectionString: string): Pool => {
    let pool = cache.get(connectionString)
    if (!pool) {
        pool = new Pool({ connectionString })
        pool.on('error', (err: Error) => console.error('pg pool error', err))
        cache.set(connectionString, pool)
    }
    return pool
}

export default getPool
