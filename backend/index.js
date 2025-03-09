require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Get nearby EV stations from Google Places API
app.post("/api/nearby-stations", async (req, res) => {
    const { userLat, userLng } = req.body;

    if (!userLat || !userLng) {
        return res.status(400).json({ error: "Latitude and Longitude are required." });
    }

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${userLat},${userLng}`,
                radius: 10000, // 10km range
                type: "charging_station",
                key: GOOGLE_PLACES_API_KEY
            }
        });

        const stations = response.data.results.map((station) => ({
            id: station.place_id,
            name: station.name,
            latitude: station.geometry.location.lat,
            longitude: station.geometry.location.lng,
            address: station.vicinity || "No Address Available"
        }));

        res.json({ stations });
    } catch (error) {
        console.error("Error fetching EV stations:", error);
        res.status(500).json({ error: "Failed to fetch EV stations." });
    }
});

// Login Route
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and Password are required." });
    }

    // Dummy authentication (Replace with actual DB check)
    if (email === "test@example.com" && password === "password123") {
        return res.json({ token: "dummy-jwt-token" });
    }

    return res.status(401).json({ error: "Invalid email or password" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
