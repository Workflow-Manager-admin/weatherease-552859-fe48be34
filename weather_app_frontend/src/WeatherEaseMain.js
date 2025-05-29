import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * WeatherIcon displays an icon relevant to the weather condition.
 * condition: string describing current weather (e.g., 'Clear', 'Clouds', 'Rain', etc.)
 */
function WeatherIcon({ condition, size = 48 }) {
  // Simple built-in SVG icons for demo; in production, would use API icon or richer SVG set.
  const icons = {
    Clear: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="14" fill="#FFD600"/><circle cx="24" cy="24" r="10" fill="#FFFDE7"/>
      </svg>
    ),
    Clouds: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <ellipse cx="22" cy="30" rx="14" ry="9" fill="#C3D9F7"/>
        <ellipse cx="32" cy="28" rx="8" ry="6" fill="#90B8EC"/>
      </svg>
    ),
    Rain: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <ellipse cx="20" cy="30" rx="14" ry="9" fill="#90B8EC"/>
        <line x1="18" y1="39" x2="16" y2="45" stroke="#2196F3" strokeWidth="2"/>
        <line x1="24" y1="39" x2="22" y2="45" stroke="#2196F3" strokeWidth="2"/>
        <line x1="30" y1="39" x2="28" y2="45" stroke="#2196F3" strokeWidth="2"/>
      </svg>
    ),
    Drizzle: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="30" rx="14" ry="9" fill="#B3E5FC"/>
        <line x1="20" y1="39" x2="20" y2="45" stroke="#2196F3" strokeWidth="2"/>
        <line x1="28" y1="39" x2="28" y2="45" stroke="#2196F3" strokeWidth="2"/>
      </svg>
    ),
    Thunderstorm: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <ellipse cx="22" cy="30" rx="14" ry="9" fill="#C3D9F7"/>
        <polygon points="24,35 29,35 25,45 30,40 27,40 31,35" fill="#FFC107"/>
      </svg>
    ),
    Snow: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="30" rx="14" ry="9" fill="#E3F2FD"/>
        <circle cx="19" cy="41" r="2" fill="#90CAF9"/>
        <circle cx="24" cy="44" r="2" fill="#90CAF9"/>
        <circle cx="29" cy="41" r="2" fill="#90CAF9"/>
      </svg>
    ),
    Mist: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="30" rx="14" ry="9" fill="#F5F5F5"/>
        <rect x="13" y="39" width="22" height="2" rx="1" fill="#B0BEC5"/>
      </svg>
    ),
    Default: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill="#E0E0E0"/>
        <text x="24" y="29" fontSize="16" textAnchor="middle" fill="#B0BEC5">?</text>
      </svg>
    )
  };

  let mapped;
  if (condition && condition in icons) mapped = icons[condition];
  else if (condition && condition.includes("Clear")) mapped = icons.Clear;
  else if (condition && condition.includes("Cloud")) mapped = icons.Clouds;
  else if (condition && condition.includes("Rain")) mapped = icons.Rain;
  else if (condition && condition.includes("Drizzle")) mapped = icons.Drizzle;
  else if (condition && condition.includes("Thunder")) mapped = icons.Thunderstorm;
  else if (condition && condition.includes("Snow")) mapped = icons.Snow;
  else if (condition && condition.includes("Mist")) mapped = icons.Mist;
  else mapped = icons.Default;

  return mapped;
}

// PUBLIC_INTERFACE
/**
 * LocationSearch allows the user to search for a city's weather or use geolocation.
 * onSearch: callback(cityName)
 * onLocation: callback(lat, lon)
 */
function LocationSearch({ onSearch, onLocation }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const handleGeo = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => onLocation(pos.coords.latitude, pos.coords.longitude),
        () => alert("Unable to get location."),
      );
    } else {
      alert("Geolocation not available.");
    }
  };

  return (
    <form className="location-search" onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      <input
        type="text"
        placeholder="Search city..."
        value={input}
        onChange={e => setInput(e.target.value)}
        className="search-bar"
        style={{
          flex: 1,
          padding: "10px 14px",
          border: "1px solid #B0BEC5",
          borderRadius: 4,
          outline: "none",
        }}
      />
      <button type="submit" className="btn" style={{ background: "#2196F3", color: "white" }}>Search</button>
      <button
        type="button"
        onClick={handleGeo}
        className="btn"
        style={{ background: "#FFC107", color: "#333", fontWeight: 500 }}
      >
        Use Location
      </button>
    </form>
  );
}

// PUBLIC_INTERFACE
/**
 * CurrentWeatherCard renders current weather info.
 * props: {weather: {...}}
 */
function CurrentWeatherCard({ weather, city }) {
  if (!weather) return null;
  const { main, weather: weatherArr, wind, name } = weather;
  const condition = weatherArr && weatherArr[0] && weatherArr[0].main;
  const desc = weatherArr && weatherArr[0] && weatherArr[0].description;
  // Fallback city name if supplied via LocationSearch
  const displayCity = name || city || "Location";

  return (
    <div
      className="weather-card"
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        boxShadow: "0 2px 16px rgba(33,150,243,0.09)",
        padding: 28,
        marginBottom: 32,
        display: "flex",
        alignItems: "center",
        gap: 28,
      }}
    >
      <div>
        <WeatherIcon condition={condition} size={66} />
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 26, color: "#2196F3", marginBottom: 2 }}>{displayCity}</div>
        <div style={{ fontSize: 15, color: "#999", textTransform: "capitalize", marginBottom: 8 }}>
          {desc}
        </div>
        <div style={{ fontWeight: 500, fontSize: 42 }}>
          {Math.round(main.temp)}°C
        </div>
        <div style={{ marginTop: 8, color: "#555", fontSize: 15 }}>
          <span style={{ marginRight: 24 }}>💧 Humidity: {main.humidity}%</span>
          <span>💨 Wind: {Math.round(wind.speed)} m/s</span>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * FiveDayForecast displays a horizontal scrollable 5-day forecast.
 * props: { forecast: [...] }
 */
function FiveDayForecast({ forecast }) {
  // forecast: Array< {dt_txt, main: {temp_max, temp_min}, weather:[{main}] } >
  if (!forecast || !forecast.length) return null;

  // Group by calendar day
  const byDate = {};
  forecast.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(item);
  });

  // Build a compact array, 5 items
  const summary = Object.keys(byDate).slice(0, 5).map(date => {
    const entries = byDate[date];
    const temps = entries.map(e => e.main);
    const min = Math.round(Math.min(...temps.map(t => t.temp_min)));
    const max = Math.round(Math.max(...temps.map(t => t.temp_max)));
    // Pick the most common weather condition for icons per day
    const weather = entries[0].weather[0].main;
    return { date, min, max, weather };
  });

  // Day of week short names
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <div className="forecast-scroll"
      style={{
        display: "flex",
        gap: 20,
        overflowX: "auto",
        marginBottom: 12,
        paddingBottom: 8,
      }}
    >
      {summary.map(item => (
        <div
          className="forecast-card"
          key={item.date}
          style={{
            flex: "0 0 110px",
            background: "#F5F7FA",
            borderRadius: 10,
            textAlign: "center",
            boxShadow: "0 1px 6px rgba(33,150,243,0.07)",
            padding: "12px 8px 14px 8px",
          }}
        >
          <div style={{ fontWeight: 500, color: "#2196F3", marginBottom: 2 }}>
            {days[new Date(item.date).getDay()]}
          </div>
          <WeatherIcon condition={item.weather} size={38} />
          <div style={{ fontSize: 17, fontWeight: 500 }}>
            {item.max}° / <span style={{ fontWeight: 400 }}>{item.min}°</span>
          </div>
          <div style={{ textTransform: "capitalize", fontSize: 12, color: "#556", marginTop: 4 }}>
            {item.weather}
          </div>
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * WeatherEaseMain is the main container for the WeatherEase app.
 * Handles search, current weather, forecast, theming & layout.
 */
function WeatherEaseMain() {
  // Theme colors
  const COLORS = {
    primary: "#2196F3",
    secondary: "#FFFFFF",
    accent: "#FFC107"
  };
  // App state
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState(null); // {lat, lon}
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bg, setBg] = useState("linear-gradient(120deg,#CFE6FA 0%, #FFF 100%)");

  // API
  // For demo, use OpenWeatherMap's free API; user must supply key for working app!
  const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // <-- Replace for production!

  // Helper: fetch weather by city or lat/lon.
  const fetchWeather = async ({ city: cityName, coords }) => {
    setLoading(true);
    let urlCurrent, urlForecast;
    if (coords) {
      const { lat, lon } = coords;
      urlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    } else {
      urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`;
      urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`;
    }
    try {
      const resCur = await fetch(urlCurrent);
      if (!resCur.ok) throw new Error("Location not found.");
      const dataCur = await resCur.json();
      setCurrent(dataCur);

      const resFcst = await fetch(urlForecast);
      if (!resFcst.ok) throw new Error("Couldn't fetch forecast.");
      const dataFcst = await resFcst.json();
      setForecast(dataFcst.list || []);
      // Gradient based on the main condition
      const condition = dataCur.weather[0].main;
      let bg;
      if (condition === "Clear") bg = "linear-gradient(120deg,#FDEB71 0%, #F8D800 100%)";
      else if (condition === "Rain" || condition === "Drizzle") bg = "linear-gradient(120deg,#ace0f9 0%, #5fbcff 100%)";
      else if (condition === "Clouds") bg = "linear-gradient(120deg,#e3eafc 0%, #b7cbe8 100%)";
      else if (condition === "Thunderstorm") bg = "linear-gradient(120deg,#d1c5f0 0%, #7f7fd5 100%)";
      else if (condition === "Snow") bg = "linear-gradient(120deg,#e8f5ff 0%, #eaeaea 100%)";
      else bg = "linear-gradient(120deg,#CFE6FA 0%, #FFF 100%)";
      setBg(bg);
    } catch (err) {
      alert(err.message);
      setCurrent(null);
      setForecast([]);
    }
    setLoading(false);
  };

  // Handlers
  const handleSearch = (cityName) => {
    setCity(cityName);
    setCoords(null);
    fetchWeather({ city: cityName });
  };
  const handleGeoloc = (lat, lon) => {
    setCoords({ lat, lon });
    setCity("");
    fetchWeather({ coords: { lat, lon } });
  };

  // Autofetch weather for previous city/loc or default ("New York")
  useEffect(() => {
    if (!city && !coords) {
      fetchWeather({ city: "New York" });
    }
    // eslint-disable-next-line
  }, []);

  // App Layout
  return (
    <div
      className="weatherease-main"
      style={{
        minHeight: "100vh",
        background: bg,
        transition: "background 0.7s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav
        className="navbar"
        style={{
          background: COLORS.primary,
          color: "#FFF",
          padding: "20px 0",
          marginBottom: 24,
        }}
      >
        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span style={{ fontWeight: 700, letterSpacing: 1.5, fontSize: 24, display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: 8, fontSize: 26, color: COLORS.accent }}>☀️</span> WeatherEase
          </span>
        </div>
      </nav>

      <main style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 12
      }}>
        <div
          className="container"
          style={{ width: "100%", maxWidth: 500 }}
        >
          <LocationSearch onSearch={handleSearch} onLocation={handleGeoloc} />
          {loading && <div style={{ fontSize: 18, textAlign: "center", color: "#888", marginTop: 32 }}>Loading…</div>}
          {!loading && (
            <>
              <CurrentWeatherCard weather={current} city={city} />
              <FiveDayForecast forecast={forecast} />
            </>
          )}
        </div>
        <footer style={{
          marginTop: "auto", textAlign: "center", color: "#888", padding: 18
        }}>
          <span style={{ fontSize: 13 }}>Powered by <a href="https://openweathermap.org/" style={{ color: COLORS.primary }} target="_blank" rel="noreferrer">OpenWeatherMap</a></span>
        </footer>
      </main>
    </div>
  );
}

export default WeatherEaseMain;
