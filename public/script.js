
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const card = document.getElementById("weather-card");

function getCondition(code) {
  if (code === 0) return "Clear sky ☀️";
  if ([1, 2].includes(code)) return "Partly cloudy 🌤️";
  if (code === 3) return "Overcast ☁️";
  if ([45, 48].includes(code)) return "Foggy 🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle 🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "Rainy 🌧️";
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "Snowy ❄️";
  }
  if ([95, 96, 99].includes(code)) return "Thunderstorm ⛈️";
  return "Weather code: " + code;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  if (!city) return;

  message.textContent = "Fetching weather...";
  card.hidden = true;

  try {
    const response = await fetch(
      `/api/weather?city=${encodeURIComponent(city)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    const current = data.current;
    const units = data.units;

    document.getElementById("location").textContent =
      `${data.city}, ${data.country}`;

    document.getElementById("condition").textContent =
      getCondition(current.weather_code);

    document.getElementById("temperature").textContent =
      `${current.temperature_2m}${units.temperature_2m}`;

    document.getElementById("feels-like").textContent =
      `Feels like ${current.apparent_temperature}${units.apparent_temperature}`;

    document.getElementById("humidity").textContent =
      `${current.relative_humidity_2m}${units.relative_humidity_2m}`;

    document.getElementById("wind").textContent =
      `${current.wind_speed_10m} ${units.wind_speed_10m}`;

    document.getElementById("precipitation").textContent =
      `${current.precipitation} ${units.precipitation}`;

    document.getElementById("updated").textContent =
      `Local time: ${current.time.replace("T", " ")}`;

    card.hidden = false;
    message.textContent = "Weather loaded successfully!";

  } catch (error) {
    message.textContent = error.message;
  }
});
