
import { ALL_BOOKS, ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries/queries.js'
import { useState } from 'react'
import { useMutation  } from '@apollo/client'
import { InputText } from 'primereact/inputtext';
import {Button} from 'primereact/button';

const EditAuthorBirthyear = (props) => {
  const [author, setAuthor] = useState('')
  const [birthyear, setBirthyear] = useState('')
  const [ editBirthyear, result ] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS }, { query: ALL_BOOKS } ]  })
    if (!props.show) {
      return null
    }

  const authors = props.authors

  const submit = async (event) => {
    event.preventDefault()

    let update = { author, birthyear }
    console.log('edit birthyear...')
    console.log(JSON.stringify(update))
    editBirthyear({  variables: { author, birthyear } })
    console.log("edit birthyear result...")
    console.log(result)

    setAuthor('')
    setBirthyear('')
  }

  return (
    <div>
      <h2>edit author</h2>
      <form onSubmit={submit}>
        <label style={{fontSize:'1.1em',fontWeight:'bold'}}>
          Choose author:&nbsp;&nbsp;
          <select style={{padding:'10px',fontSize:'0.8em'}} value={author} onChange={({ target }) => setAuthor(target.value)} onLoad={({ target }) => setAuthor(target.value)}>
            {authors.map((a) => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
        </label>
        <span className="p-float-label" style={{marginTop:'10px'}}>
          <InputText className="p-inputtext-sm" id="birthyear"
            type="number"
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.valueAsNumber)}
          />
          <label htmlFor="birthyear">birthyear</label>
        </span>
        <hr></hr>
        <Button severity="success" type="submit">update birthyear</Button>
      </form>
    </div>
  )
}

export default EditAuthorBirthyear