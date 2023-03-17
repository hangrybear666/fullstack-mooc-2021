// Prime React Frontend Styling & Themenp
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';

import {Button} from 'primereact/button';
import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Favorites from './components/Favorites'
import Recommendations from './components/Recommendations'
import LoginForm from './components/LoginForm'
import {ALL_BOOKS, ALL_AUTHORS, BOOKS_BY_GENRE} from './queries/queries.js'
import { useQuery, useApolloClient } from '@apollo/client'
import EditAuthorBirthyear from './components/EditAuthorBirthyear'

const App = () => {
  const client = useApolloClient()
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [genre, setGenre] = useState('')
  const [user, setUser] = useState('')
  const [favoriteGenre, setFavoriteGenre] = useState('')
  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  const booksByGenreResult = useQuery(BOOKS_BY_GENRE, {
    variables: {genre} ,
  })
  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }
  if (authorsResult && !authorsResult.loading) {
    console.log("authors queried with result:")
    console.log(authorsResult.data.allAuthors)
  }
  if (booksResult && !booksResult.loading) {
    console.log("books queried with result:")
    console.log(booksResult.data.allBooks)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <>
        <LoginForm setToken={setToken} setFavoriteGenre={setFavoriteGenre} setUser={setUser} />
      </>
      )
  }

  return (
    <div>
      <div className="btn-menu">
        <Button onClick={() => setPage('authors')}>authors</Button>
        <Button onClick={() => setPage('books')}>books</Button>
        <Button severity="success" onClick={() => setPage('favorites')}>favorites</Button>
        <Button severity="success" onClick={() => setPage('recommendations')}>books by genre</Button>
        <Button severity="info" onClick={() => setPage('edit author')}>edit author</Button>
        <Button severity="info" onClick={() => setPage('add')}>add book</Button>
        <Button severity="danger" onClick={logout}>logout</Button>
      </div>

      <Authors show={page === 'authors'} authors={authorsResult.data.allAuthors} />
      <Books show={page === 'books'} books={booksResult.data.allBooks}/>
      <Favorites show={page === 'favorites'} user={user} favoriteGenre={favoriteGenre} setUser={setUser} setFavoriteGenre={setFavoriteGenre}/>
      <Recommendations show={page === 'recommendations'} allBooks={booksResult.data.allBooks} setGenre={setGenre} genre={genre} queryResult={booksByGenreResult}/>
      <NewBook show={page === 'add'} filteredGenre={genre} favoriteGenre={favoriteGenre}/>
      <EditAuthorBirthyear show={page === 'edit author'} authors={authorsResult.data.allAuthors}/>

    </div>
  )
}

export default App
