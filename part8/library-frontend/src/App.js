import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {ALL_BOOKS, ALL_AUTHORS} from './queries/queries.js'
import { useQuery  } from '@apollo/client'
import EditAuthorBirthyear from './components/EditAuthorBirthyear'

const App = () => {
  const [page, setPage] = useState('authors')
  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('edit author')}>edit author</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} authors={authorsResult.data.allAuthors} />
      <Books show={page === 'books'} books={booksResult.data.allBooks}/>
      <NewBook show={page === 'add'}/>
      <EditAuthorBirthyear show={page === 'edit author'} authors={authorsResult.data.allAuthors}/>

    </div>
  )
}

export default App
