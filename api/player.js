// api/player.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // Nur der eine Player-Tag, fest kodiert
    const playerTag = encodeURIComponent("#PRQ8L8G99");

    const API_KEY = process.env.BRAWLSTARS_API_KEY;
    const apiUrl = `https://api.brawlstars.com/v1/players/${playerTag}`;

    const apiResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ error: "Brawl Stars API Fehler" });
    }

    const data = await apiResponse.json();

    // Nur relevante Daten zurückgeben
    const result = {
      trophies: data.trophies,
      name: data.name,
      club: data.club?.name || null,
      rank: data.rank || null,
    };

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Fehler" });
  }
}
