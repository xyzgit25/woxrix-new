// api/player.js
import fetch from "node-fetch";

export default async function handler(req, res) {
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