const { createClient } = require('redis')

const REDIS_URL = process.env.REDIS_URL
const DEFAULT_TTL_SECONDS = Number(process.env.REDIS_CACHE_TTL_SECONDS || 60)

let client = null
let connectPromise = null
let disabled = !REDIS_URL

function isReady() {
  return Boolean(client?.isReady)
}

async function connectRedis() {
  if (disabled) return null
  if (isReady()) return client
  if (connectPromise) return connectPromise

  client = createClient({
    url: REDIS_URL,
    socket: {
      reconnectStrategy(retries) {
        return Math.min(retries * 100, 3000)
      },
    },
  })

  client.on('error', (err) => {
    console.warn('Redis error:', err.message)
  })

  connectPromise = client
    .connect()
    .then(() => {
      console.log('Redis connected')
      return client
    })
    .catch((err) => {
      console.warn('Redis disabled:', err.message)
      disabled = true
      return null
    })
    .finally(() => {
      connectPromise = null
    })

  return connectPromise
}

async function getCache(key) {
  const redis = await connectRedis()
  if (!redis?.isReady) return null

  try {
    const value = await redis.get(key)
    return value ? JSON.parse(value) : null
  } catch (err) {
    console.warn(`Redis get failed for ${key}:`, err.message)
    return null
  }
}

async function setCache(key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
  const redis = await connectRedis()
  if (!redis?.isReady) return

  try {
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds })
  } catch (err) {
    console.warn(`Redis set failed for ${key}:`, err.message)
  }
}

async function delCache(...keys) {
  const redis = await connectRedis()
  if (!redis?.isReady || keys.length === 0) return

  try {
    await redis.del(keys)
  } catch (err) {
    console.warn('Redis delete failed:', err.message)
  }
}

async function delByPattern(pattern) {
  const redis = await connectRedis()
  if (!redis?.isReady) return

  try {
    const keys = []
    for await (const key of redis.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      keys.push(key)
    }
    if (keys.length > 0) await redis.del(keys)
  } catch (err) {
    console.warn(`Redis pattern delete failed for ${pattern}:`, err.message)
  }
}

async function closeRedis() {
  if (client?.isReady) {
    await client.quit()
  }
}

module.exports = {
  connectRedis,
  closeRedis,
  delByPattern,
  delCache,
  getCache,
  isReady,
  setCache,
}
