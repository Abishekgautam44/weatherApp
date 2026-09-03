import React, { useState, useEffect } from "react";
import Weathercard from "./weatherCard";
import "./style.css";

const GEOCODING_API_URL =
  process.env.REACT_APP_GEOCODING_API_URL ||
  "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API_URL =
  process.env.REACT_APP_WEATHER_API_URL ||
  "https://api.open-meteo.com/v1/forecast";

const Temp = () => {
  const [searchValue, setSearchValue] = useState("Urlabari");
  const [tempInfo, setTempInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeatherInfo = async () => {
    const city = searchValue.trim();

    if (!city) {
      setError("Enter a city name to search.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Step 1: Find the city's latitude and longitude
      const locationResponse = await fetch(
        `${GEOCODING_API_URL}?name=${encodeURIComponent(
          city
        )}&count=1&language=en&format=json`
      );

      if (!locationResponse.ok) {
        throw new Error("Unable to find that city.");
      }

      const locationData = await locationResponse.json();
      const location = locationData.results?.[0];

      if (!location) {
        throw new Error("City not found. Try another search.");
      }

      // Step 2: Get weather information using latitude and longitude
      const weatherResponse = await fetch(
        `${WEATHER_API_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,weather_code&daily=sunset&timezone=auto&forecast_days=1`
      );

      if (!weatherResponse.ok) {
        throw new Error("Weather data is unavailable.");
      }

      const weatherData = await weatherResponse.json();
      const current = weatherData.current;

      // Open-Meteo weather codes
      const weatherCodes = {
        0: "Clear",
        1: "Clear",
        2: "Clouds",
        3: "Clouds",
        45: "Haze",
        48: "Haze",
        51: "Rain",
        53: "Rain",
        55: "Rain",
        61: "Rain",
        63: "Rain",
        65: "Rain",
        71: "Snow",
        73: "Snow",
        75: "Snow",
        80: "Rain",
        81: "Rain",
        82: "Rain",
        95: "Thunderstorm",
      };

      const myNewWeatherInfo = {
        temp: Math.round(current.temperature_2m),
        humidity: Math.round(current.relative_humidity_2m),
        pressure: Math.round(current.pressure_msl),
        weathermood: weatherCodes[current.weather_code] || "Clear",
        name: location.name,
        speed: Math.round(current.wind_speed_10m),
        country: location.country_code,
        sunset: new Date(weatherData.daily.sunset[0]).getTime() / 1000,
      };

      setTempInfo(myNewWeatherInfo);
    } catch (error) {
      setError(error.message || "Something went wrong.");
      setTempInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWeatherInfo();
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    getWeatherInfo();
  };

  return (
    <section className="dashboard">
      <div className="intro">
        <p className="eyebrow">Your atmosphere, at a glance</p>

        <h1>
          Read the sky
          <br />
          before you step out.
        </h1>

        <p className="introCopy">
          Live conditions and useful details for wherever your day takes you.
        </p>
      </div>

      <div className="wrap">
        <form className="search" onSubmit={submitSearch}>
          <label htmlFor="search">Search for a city</label>

          <input
            type="search"
            placeholder="Try London or Tokyo"
            id="search"
            className="searchTerm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <button
            className="searchButton"
            type="submit"
            disabled={isLoading}
            aria-label="Search weather"
          >
            {isLoading ? "Loading..." : "Search"}
          </button>
        </form>

        <p className="searchHint">
          Powered by Open-Meteo. No sign-in required.
        </p>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      {tempInfo ? (
        <Weathercard {...tempInfo} />
      ) : (
        <div className="loadingCard">Finding your forecast...</div>
      )}
    </section>
  );
};

export default Temp;


// import React, { useState, useEffect } from "react";
// import Weathercard from "./weatherCard";
// import "./style.css";

// const Temp = () => {
//   const [searchValue, setSearchValue] = useState("Urlabari");
//   const [tempInfo, setTempInfo] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const getWeatherInfo = async () => {
//     const city = searchValue.trim();
//     if (!city) {
//       setError("Enter a city name to search.");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const locationResponse = await fetch(
//         `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
//           city
//         )}&count=1&language=en&format=json`
//       );
//       if (!locationResponse.ok) throw new Error("Unable to find that city.");

//       const locationData = await locationResponse.json();
//       const location = locationData.results?.[0];
//       if (!location) throw new Error("City not found. Try another search.");

//       const weatherResponse = await fetch(
//         `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,weather_code&daily=sunset&timezone=auto&forecast_days=1`
//       );
//       if (!weatherResponse.ok) throw new Error("Weather data is unavailable.");

//       const weatherData = await weatherResponse.json();
//       const current = weatherData.current;
//       const weatherCodes = {
//         0: "Clear",
//         1: "Clear",
//         2: "Clouds",
//         3: "Clouds",
//         45: "Haze",
//         48: "Haze",
//         51: "Rain",
//         53: "Rain",
//         55: "Rain",
//         61: "Rain",
//         63: "Rain",
//         65: "Rain",
//         71: "Snow",
//         73: "Snow",
//         75: "Snow",
//         80: "Rain",
//         81: "Rain",
//         82: "Rain",
//         95: "Thunderstorm",
//       };

//       const myNewWeatherInfo = {
//         temp: Math.round(current.temperature_2m),
//         humidity: Math.round(current.relative_humidity_2m),
//         pressure: Math.round(current.pressure_msl),
//         weathermood: weatherCodes[current.weather_code] || "Clear",
//         name: location.name,
//         speed: Math.round(current.wind_speed_10m),
//         country: location.country_code,
//         sunset: new Date(weatherData.daily.sunset[0]).getTime() / 1000,
//       };

//       setTempInfo(myNewWeatherInfo);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     getWeatherInfo();
//   }, []);

//   const submitSearch = (event) => {
//     event.preventDefault();
//     getWeatherInfo();
//   };

//   return (
//     <section className="dashboard">
//       <div className="intro">
//         <p className="eyebrow">Your atmosphere, at a glance</p>
//         <h1>Read the sky<br />before you step out.</h1>
//         <p className="introCopy">Live conditions and useful details for wherever your day takes you.</p>
//       </div>

//       <div className="wrap">
//         <form className="search" onSubmit={submitSearch}>
//           <label htmlFor="search">Search for a city</label>
//           <input
//             type="search"
//             placeholder="Try London or Tokyo"
//             id="search"
//             className="searchTerm"
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//           />
//           <button
//             className="searchButton"
//             type="button"
//             onClick={getWeatherInfo}
//             disabled={isLoading}
//             aria-label="Search weather">
//             {isLoading ? "Loading..." : "Search"}
//           </button>
//         </form>
//         <p className="searchHint">Powered by Open-Meteo. No sign-in required.</p>
//         </div>
//         {error && <p className="errorMessage">{error}</p>}

//       {tempInfo ? <Weathercard {...tempInfo} /> : <div className="loadingCard">Finding your forecast...</div>}
//     </section>
//   );
// };

// export default Temp;
