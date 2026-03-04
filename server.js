// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors()); // ✅ Browser kann fetch auf localhost nutzen

const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdmZmQyODRmLWI1YjQtNDc1Ni05MWVmLWM1ZTMwNzdkNWRmMSIsImlhdCI6MTc3MjYzMjMxOSwic3ViIjoiZGV2ZWxvcGVyLzQ0YjY3ZDkwLWM0NjUtNzM5Mi0wYjIzLTA1ZDQyNGYxYjIxOSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiOTEuNDYuNjMuMTMzIiwiMC4wLjAuMCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.pC_L-vT4kTFfxHpDE12ZTV9PWgs5JQBMjZs9l3bLOrIdPfc0rkKRocsmwu5DUanQK3xSKV4azDiM7PLYjiWO1A"; // hier deinen echten API-Key einfügen

// Route für PlayerTag
app.get("/api/player/:tag", async (req, res) => {
    try {
        const rawTag = req.params.tag;
        const encodedTag = encodeURIComponent(rawTag);

        const response = await fetch(`https://api.brawlstars.com/v1/players/${encodedTag}`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
        });

        const text = await response.text();

        if (response.status !== 200) {
            return res.status(response.status).json({
                error: "Brawl API Error",
                status: response.status,
                raw: text
            });
        }

        const data = JSON.parse(text);

        res.json({
            trophies: data.trophies,
            name: data.name
        });

    } catch (err) {
        console.error("SERVER ERROR:", err);
        res.status(500).json({ error: "Server Crash" });
    }
});

// Optional: Default Route für festen Player
app.get("/api/player", (req, res) => {
    res.redirect("/api/player/PRQ8L8G99");
});

app.listen(3000, () => console.log("Server läuft auf http://localhost:3000"));