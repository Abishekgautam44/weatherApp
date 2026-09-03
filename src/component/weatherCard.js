import React from "react";

const Weathercard = ({
  temp,
  humidity,
  pressure,
  weathermood,
  name,
  speed,
  country,
  sunset,
}) => {
  const weatherIcons = {
    Clouds: "wi-day-cloudy",
    Haze: "wi-fog",
    Clear: "wi-day-sunny",
    Rain: "wi-rain",
    Snow: "wi-snow",
    Thunderstorm: "wi-thunderstorm",
  };
  const weatherState = weatherIcons[weathermood] || "wi-day-sunny";
  const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="widget">
      <div className="weatherHero">
        <div className="weatherIcon" aria-hidden="true">
          <i className={`wi ${weatherState}`}></i>
        </div>
        <div className="heroCopy">
          <p className="conditionLabel">Current condition</p>
          <div className="weatherCondition">{weathermood}</div>
          <div className="place">{name}, {country}</div>
          <div className="temperature"><span>{temp}&deg;</span><small>C</small></div>
        </div>
        <div className="date">Updated {new Date().toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}</div>
      </div>

      <div className="detailHeader">
        <div>
          <p className="eyebrow">Today's details</p>
          <h2>Make the most of the day.</h2>
        </div>
        <span className="statusDot">LIVE</span>
      </div>

      <div className="extra-temp">
        <div className="detailItem">
          <i className="wi wi-humidity" aria-hidden="true"></i>
          <span className="detailValue">{humidity}%</span>
          <span className="detailLabel">Humidity</span>
        </div>
        <div className="detailItem">
          <i className="wi wi-barometer" aria-hidden="true"></i>
          <span className="detailValue">{pressure}</span>
          <span className="detailLabel">Pressure hPa</span>
        </div>
        <div className="detailItem">
          <i className="wi wi-strong-wind" aria-hidden="true"></i>
          <span className="detailValue">{speed} <small>km/h</small></span>
          <span className="detailLabel">Wind speed</span>
        </div>
        <div className="detailItem">
          <i className="wi wi-sunset" aria-hidden="true"></i>
          <span className="detailValue">{sunsetTime}</span>
          <span className="detailLabel">Sunset</span>
        </div>
      </div>
    </article>
  );
};

export default Weathercard;
