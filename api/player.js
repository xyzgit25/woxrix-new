// api/player.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const API_KEY = process.env.BRAWLSTARS_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: "API Key fehlt" });

    const playerTag = encodeURIComponent("#PRQ8L8G99");
    const apiResponse = await fetch(`https://api.brawlstars.com/v1/players/${playerTag}`, {
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
