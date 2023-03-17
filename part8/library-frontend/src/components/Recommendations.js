
import FilteredBooks from './FilteredBooks'

const Recommendations = ({ allBooks, show, genre, setGenre, queryResult }) => {
  if (!show) {
    return null
  }
  if (queryResult.loading) {
    return <h2>Loading</h2>
  }
  if (queryResult.error) {
    return <h2>Error</h2>
  }
  queryResult.refetch({genre: genre})

  let allGenres = []
  allBooks.map((a) => (a.genres.map(g => (allGenres.push(g)))))
  let uniqueGenres = [...new Set(allGenres)]
  console.log("all genres initialized as")
  console.log(uniqueGenres)

  return (
    <div>
      <h2>books by genre</h2>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
      <FilteredBooks genre={genre} queryResult={queryResult}/>
        </tbody>
      </table>
      <div style={{marginTop:'10px'}}>
        <label style={{fontSize:'1.1em',fontWeight:'bold'}}>
          Choose genre:&nbsp;&nbsp;
          <select style={{padding:'10px',fontSize:'0.8em'}} value={genre} onLoad={({ target }) => setGenre(target.value)} onChange={({ target }) => setGenre(target.value)}>
            {uniqueGenres.map(g => (
              <option key={g} value={g}>{g}</option>
              ))
            }
          </select>
        </label>
      </div>
    </div>
  )
}

export default Recommendations
