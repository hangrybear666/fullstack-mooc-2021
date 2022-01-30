import React from 'react'
import WeatherInfo from './WeatherInfo'

const CountryAdditionalInfo = ( {country} ) => {

  const languages = []
  for (let [key,value] of Object.entries(country.languages)) {
    languages.push({short:key,
                    name:value})
  }

  return (
    <div className="additionalInfo">
      <h3>{country.name.common}</h3>
      <p>capital:    {country.capital}{"\n"}
         population: {country.population}
      </p>
      <h4>languages</h4>
      <ul>
        {languages.map(language =>
          <li key={language.short}>{language.name}</li>
        )}
      </ul>
      <img className="flagImg"
        src={country.flags.png}/>
      <WeatherInfo country={country}/>
    </div>
  )
}

export default CountryAdditionalInfo