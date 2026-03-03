export default async function handler(req, res) {
    const PLAYER_TAG = "PRQ8L8G99"; 
    try {
        // Wir nutzen den stabilen Proxy von BrawlAPI
        const response = await fetch(`https://api.brawlapi.com/v1/player?tag=${PLAYER_TAG}`);
        
        if (!response.ok) {
            return res.status(response.status).json({ error: "Fehler beim Abrufen" });
        }

        const data = await response.json();
        // Gibt die echten Trophäen zurück
        return res.status(200).json({ trophies: data.trophies });
    } catch (error) {
        return res.status(500).json({ error: "Server Fehler" });
    }
}
