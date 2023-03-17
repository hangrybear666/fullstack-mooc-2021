
import React from "react";

const FilteredBooks = ( {genre, queryResult } ) => {

    if (queryResult.loading) return <span>Loading...</span>
    if (queryResult.error) {
        console.error(queryResult.error)
        return <span>Error :(</span>
    }
    if (!queryResult.loading) {
      console.log(`books by genre [${genre}] result:`)
      console.log(queryResult.data.allBooks)
    }
    return (
      <>
        {queryResult.data.allBooks.map((a) => (
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        ))}
      </>
    )
  }

  export default FilteredBooks
