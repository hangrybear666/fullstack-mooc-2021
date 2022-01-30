import React from 'react'

const CountryFilter = ( {onChange, value, errorMessage} ) => {
  return (
    <>
      <div className="country-filter">
        filter by country name: <input  value={value}
                                        onChange={onChange}/>
      </div>
      <p className="errorMsg">{errorMessage}</p>
    </>
  )
}

export default CountryFilter