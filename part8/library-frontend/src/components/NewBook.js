
import {ALL_BOOKS, ALL_AUTHORS, NEW_BOOK} from '../queries/queries.js'
import { useState } from 'react'
import { InputText } from 'primereact/inputtext';

import {Button} from 'primereact/button';
import { useMutation  } from '@apollo/client'
const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [ createBook ] = useMutation(NEW_BOOK, {
    refetchQueries: [ { query: ALL_AUTHORS }, { query: ALL_BOOKS } ],
    /* update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(response.data.addPerson),
        }
      })
  }, */
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    
    let newBook = {title, author, published, genres}
    console.log('add book...')
    console.log(JSON.stringify(newBook))
    const createBookResult = createBook({  variables: { title, published, author, genres } })
    console.log("book result...")
    console.log(createBookResult)

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form className="addbook" onSubmit={submit}>
        <span className="p-float-label">
          <InputText className="p-inputtext-sm" id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <label htmlFor="title">Title</label>
        </span>
        <span className="p-float-label">
          <InputText className="p-inputtext-sm" id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <label htmlFor="author">Author</label>
        </span>
        <span className="p-float-label">
          <InputText className="p-inputtext-sm" id="published"
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.valueAsNumber)}
          />
          <label htmlFor="published">Published</label>
        </span>
        <span className="p-float-label">
          <InputText className="p-inputtext-sm" id ="genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <label htmlFor="genre">Genre</label>
          <Button severity="primary" size="small" onClick={addGenre} type="button">
            add genre
          </Button>
        </span>
        <hr></hr>
        <span className="genreStyle" style={{textDecoration:'underline'}}>genres:</span>
        <span > {genres.join(' | ')}</span>
        <hr></hr>
        <Button severity="success" type="submit">create book</Button>
      </form>
    </div>
  )
}

export default NewBook