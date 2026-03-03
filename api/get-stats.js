export default async function handler(req, res) {
    const PLAYER_TAG = "PRQ8L8G99"; 
    try {
        // Wir nutzen den offiziellen API-Proxy von BrawlAPI (sehr stabil für Entwickler)
        const response = await fetch(`https://api.brawlapi.com/v1/player?tag=${PLAYER_TAG}`);
        
        if (!response.ok) {
            return res.status(response.status).json({ error: "Proxy Fehler" });
        }

        const data = await response.json();
        // Die Struktur ist hier leicht anders: data.trophies
        return res.status(200).json({ trophies: data.trophies });
    } catch (error) {
        return res.status(500).json({ error: "Server Fehler" });
    }
}
