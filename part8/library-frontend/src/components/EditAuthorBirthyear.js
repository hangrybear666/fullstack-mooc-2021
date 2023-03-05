
import { ALL_BOOKS, ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries/queries.js'
import { useState } from 'react'
import { useMutation  } from '@apollo/client'

const EditAuthorBirthyear = (props) => {
  const [author, setAuthor] = useState('')
  const [birthyear, setBirthyear] = useState('')
  const [ editBirthyear ] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS }, { query: ALL_BOOKS } ]  })

  if (!props.show) {
    return null
  }

  const authors = props.authors

  const submit = async (event) => {
    event.preventDefault()

    editBirthyear({  variables: { author, birthyear } })

    let update = { author, birthyear }
    console.log('edit birthyear...')
    console.log(JSON.stringify(update))

    setAuthor('')
    setBirthyear('')
  }

  return (
    <div>
      <h2>edit author</h2>
      <form onSubmit={submit}>
        <label>
          Choose author:
          <select value={author} onChange={({ target }) => setAuthor(target.value)}>
            {authors.map((a) => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
        </label>
        <div>
          birthyear
          <input
            type="number"
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.valueAsNumber)}
          />
        </div>
        <button type="submit">update birthyear</button>
      </form>
    </div>
  )
}

export default EditAuthorBirthyear