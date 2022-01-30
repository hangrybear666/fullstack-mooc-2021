import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CountryView from './components/CountryView'
import CountryFilter from './components/CountryFilter'

function App() {
  /**
   * State of the App is maintained here
   */
  const [nameFilter, setNameFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('Too many matches, please specify another filter.')
  const [initialCountries, setInitialCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      // .get('http://localhost:3001/countries')
      .then(response => {
        setInitialCountries(response.data)
      })
  }
  useEffect(hook, [])

  /**
   * Checks whether or not the input text is included in the countries dataset
   * and updates the filtered dataset to match if the # of matches is 10 or less
   * @param {event} e
   */
  const filterChangeListener = (e) => {
    setNameFilter(e.target.value)

    const preFilteredCountries =
      initialCountries
      .filter(country =>
        country.name.common.toLowerCase().includes(
          e.target.value.toLowerCase().trim()
        )
      )
    /**
     * if filtering leads to country number exceeding 10, set Countries to empty array  and display error
     * else if filtering leads to country number between 1 and 10, set filtered Countries to empty array
     * else filtering leads to zero matches, set filtered Countries to empty array
     */
    if (preFilteredCountries.length > 10) {
      setFilteredCountries([])
      setErrorMessage('Too many matches, please specify another filter.')
    } else if (preFilteredCountries.length <= 10 && preFilteredCountries.length > 0) {
      setFilteredCountries(preFilteredCountries)
      setErrorMessage('')
    } else {
      setFilteredCountries([])
      setErrorMessage('0 matches. Please specify another filter')
    }
  }

  /**
   * the button's id is assigned to the index of the selected item from the filteredCountries variable
   * this index is then read from the button click to select the desired country to display additional information
   * @param {event} e
   */
  const handleClick = (e) => {
    const selection = filteredCountries.filter( (country,index) => index == e.target.id)
    setFilteredCountries(selection)
    setErrorMessage('')
  }

  return (
    <>
      <CountryFilter  value={nameFilter}
                      onChange={filterChangeListener}
                      errorMessage={errorMessage}/>

      <CountryView  countries={filteredCountries}
                    onClick={handleClick} />
    </>
  )
}

export default App
