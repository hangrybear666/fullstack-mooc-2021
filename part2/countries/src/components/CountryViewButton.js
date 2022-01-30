import React from 'react'

const CountryViewButton = ( {onClick, id} ) => {
  return (
    <>
      <button id={id}
              onClick={onClick} >
        show
      </button>
    </>
  )
}

export default CountryViewButton