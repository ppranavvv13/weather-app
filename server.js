
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city?.trim();

    if (!city) {
      return res.status(400).json({
        error: "Please enter a city name."
      });
    }

    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );

    if (!geoResponse.ok) {
      throw new Error("Geocoding service unavailable.");
    }

    const geoData = await geoResponse.json();
    const place = geoData.results?.[0];

    if (!place) {
      return res.status(404).json({
        error: "City not found. Try another name."
      });
    }

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
    );

    if (!weatherResponse.ok) {
      throw new Error("Weather service unavailable.");
    }

    const weatherData = await weatherResponse.json();

    res.json({
      city: place.name,
      country: place.country,
      current: weatherData.current,
      units: weatherData.current_units
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to fetch weather. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
