// api/player.js
import fetch from "node-fetch";

// Erlaubte Domains für API-Zugriff
const ALLOWED_ORIGINS = [
  'https://woxrix.site',
  'https://www.woxrix.site',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
];

// Sicherheits-Check: Prüft Origin/Referer
function isRequestAllowed(req) {
  const origin = req.headers.origin || req.headers.referer;
  
  // Bei lokalem Entwicklung ohne Origin erlauben
  if (!origin && process.env.NODE_ENV === 'development') {
    return true;
  }
  
  if (!origin) {
    return false;
  }
  
  // Prüfe ob Origin in erlaubten Domains
  return ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed));
}

export default async function handler(req, res) {
  // Sicherheitsprüfung: Nur Anfragen von erlaubten Domains
  if (!isRequestAllowed(req)) {
    return res.status(403).json({ 
      error: 'Forbidden: Access denied. This API can only be accessed from authorized domains.' 
    });
  }

  // CORS nur für erlaubte Origins
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET');
  }

  try {
    const API_KEY = process.env.BRAWLSTARS_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: "API Key fehlt" });

    const playerTag = encodeURIComponent("#PRQ8L8G99");
    // NUTZE DEN ROYALEAPI PROXY UM VERCEL IP BANS ZU UMGEHEN!
    // Wichtig: Du musst in deinem Brawl Stars Entwickler-Account 
    // die IP "45.79.218.79" zu deinem API-Key hinzufügen!
    const apiResponse = await fetch(`https://bsproxy.royaleapi.dev/v1/players/${playerTag}`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });

    if (!apiResponse.ok) {
      const text = await apiResponse.text();
      return res.status(apiResponse.status).json({ error: text });
    }

    const data = await apiResponse.json();
    res.status(200).json({ trophies: data.trophies, name: data.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Fehler" });
  }
}
