import React from 'react'
import CountryAdditionalInfo from './CountryAdditionalInfo'
import CountryViewButton from './CountryViewButton'

const CountryView = ( {countries, onClick} ) => {
  if (countries.length == 1) {
    return <CountryAdditionalInfo country={countries[0]}/>
  } else {
    return (
      <>
        {countries.map((country,index) => {
            return (
              <li className="countryList" key={country.cca3}>
                <p>{country.name.common}</p>
                <CountryViewButton id={index} onClick={onClick}/>
              </li>
            )
        }
          )}
      </>
    )
  }
}

export default CountryView