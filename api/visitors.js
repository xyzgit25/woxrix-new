// api/visitors.js
// Persistent visitor counter using Upstash Redis
import { Redis } from '@upstash/redis';

// Validate environment variables
if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  console.error('Missing Redis KV credentials. Set KV_REST_API_URL and KV_REST_API_TOKEN in environment variables.');
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  // Check if Redis is properly configured
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(500).json({ 
      error: 'Redis KV not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.' 
    });
  }
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const visitorId = req.headers['x-visitor-id'] || req.headers['x-forwarded-for'] || 'anonymous';

    if (req.method === 'POST') {
      // Check if visitor has been counted before
      const hasVisited = await redis.sismember('visitors', visitorId);
      
      if (!hasVisited) {
        // Add visitor to set and increment counter
        await redis.sadd('visitors', visitorId);
        await redis.incr('visitor_count');
      }

      // Get current counts
      const count = await redis.get('visitor_count') || 0;
      const unique = await redis.scard('visitors') || 0;

      return res.status(200).json({ 
        count: Number(count),
        unique: Number(unique)
      });
    }

    if (req.method === 'GET') {
      // Return current counts
      const count = await redis.get('visitor_count') || 0;
      const unique = await redis.scard('visitors') || 0;

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
