export default async function handler(req, res) {
    const PLAYER_TAG = "PRQ8L8G99"; 
    // Dein bereitgestellter Token
    const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjhiYTk1YTI5LWYzZTMtNGZmYS04NjE3LTZiZTE5MDRjZjI1MiIsImlhdCI6MTc3MjU3NzM2MCwic3ViIjoiZGV2ZWxvcGVyLzQ0YjY3ZDkwLWM0NjUtNzM5Mi0wYjIzLTA1ZDQyNGYxYjIxOSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMC4wLjAuMCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.CpodQ_hHQm3pfYMtHkYe94VJKwrCmf6wSbyzH2ifSQd3HUGuVJI03L1OakVMD3ygFpCor7t-BXRVI71Ic0Cfrw";

    try {
        // Die Raute (#) muss als %23 kodiert werden
        const response = await fetch(`https://api.brawlstars.com/v1/players/%23${PLAYER_TAG}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: "Brawl Stars API Fehler", details: errorData });
        }

        const data = await response.json();
        // Wir geben nur die Trophäenzahl zurück
        return res.status(200).json({ trophies: data.trophies });
    } catch (error) {
        return res.status(500).json({ error: "Interner Server Fehler" });
    }
}
