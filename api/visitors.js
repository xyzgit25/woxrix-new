// api/visitors.js
// Persistent visitor counter using Redis
import Redis from 'ioredis';

let redis = null;

// Initialize Redis client
function getRedisClient() {
  if (!redis) {
    if (!process.env.REDIS_URL) {
      throw new Error('REDIS_URL environment variable is not set');
    }
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: false
    });
    redis.on('error', (err) => console.error('Redis Client Error', err));
  }
  return redis;
}

export default async function handler(req, res) {
  // Check if Redis is properly configured
  if (!process.env.REDIS_URL) {
    return res.status(500).json({ 
      error: 'Redis not configured. Please set REDIS_URL environment variable.' 
    });
  }
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const client = getRedisClient();
    const visitorId = req.headers['x-visitor-id'] || req.headers['x-forwarded-for'] || 'anonymous';

    if (req.method === 'POST') {
      // Check if visitor has been counted before
      const hasVisited = await client.sismember('visitors', visitorId);
      
      if (!hasVisited) {
        // Add visitor to set and increment counter
        await client.sadd('visitors', visitorId);
        await client.incr('visitor_count');
      }

      // Get current counts
      const count = await client.get('visitor_count') || 0;
      const unique = await client.scard('visitors') || 0;

      return res.status(200).json({ 
        count: Number(count),
        unique: Number(unique)
      });
    }

    if (req.method === 'GET') {
      // Return current counts
      const count = await client.get('visitor_count') || 0;
      const unique = await client.scard('visitors') || 0;

      return res.status(200).json({ 
        count: Number(count),
        unique: Number(unique)
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('KV Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
