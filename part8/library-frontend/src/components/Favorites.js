
import FilteredBooks from './FilteredBooks'
/* import { useEffect } from 'react' */
import { useQuery } from '@apollo/client'
import {BOOKS_BY_FAVORITE_GENRE, ME} from '../queries/queries.js'

const Favorites = ({ show, favoriteGenre, user, setFavoriteGenre, setUser  }) => {
  const meResult = useQuery(ME)
  const favGenreBooksResult = useQuery(BOOKS_BY_FAVORITE_GENRE, {
    variables: {favoriteGenre} ,
  })
  if (!show) {
    return null
  }
  if (meResult.loading || favGenreBooksResult.loading) {
    return <h2>Loading</h2>
  }
  if (meResult.error || favGenreBooksResult.error) {
    return <h2>Error</h2>
  }
  setFavoriteGenre(meResult.data.me.favoriteGenre)
  setUser(meResult.data.me.username)
  favGenreBooksResult.refetch({genre: favoriteGenre})

  return (
    <div>
      <h2>books by favorite genre</h2>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
      <FilteredBooks genre={favoriteGenre} queryResult={favGenreBooksResult}/>
        </tbody>
      </table>
      <div style={{marginTop:'10px'}}>
        <label style={{fontSize:'1.1em',fontWeight:'bold'}}>
          Logged in user:&nbsp;&nbsp;&nbsp;&nbsp;
        </label>
        <span style={{color:'red',fontFamily:'Consolas'}}>{user}</span>
      </div>
      <div style={{marginTop:'10px'}}>
        <label style={{fontSize:'1.1em',fontWeight:'bold'}}>
          Favorite genre:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </label>
        <span style={{color:'green',fontFamily:'Consolas'}}>{favoriteGenre}</span>
      </div>
    </div>
  )
}

export default Favorites
