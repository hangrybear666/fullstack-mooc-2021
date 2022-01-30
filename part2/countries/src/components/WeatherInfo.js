import React, { useState, useEffect } from 'react'
import axios from 'axios'

const WeatherInfo = ( {country} ) => {
  const [weatherData, setWeatherData] = useState(null)
  const api_key = process.env.REACT_APP_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${api_key}`

  const hook = () => {
    axios
      .get(url)
      .then(response => {
        setWeatherData(response.data)
      })
  }
  useEffect(hook, [])
  console.log(weatherData == null)

  if (weatherData != null) {
    console.log("first");
    return (
      <div className="weatherInfo">
        <h3>Weather in {country.capital}</h3>
        <p><b>temperature:</b> {Math.trunc(weatherData.current.temp - 273.15)}°C</p>
        <p><b>humidity:</b> {weatherData.current.humidity}%</p>
        <p><b>wind speed:</b> {weatherData.current.wind_speed}m/s</p>
      </div>
    )
  } else {
    console.log("second");
    return (
      <>
        <h3>Weather in {country.capital}</h3>
        <p>Please provide your own API key in .env and restart the server to access weather data</p>
        <a>https://openweathermap.org/api/one-call-api</a>
      </>
    )
  }
}

export default WeatherInfo