import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries/queries.js'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ login, result ] = useMutation(LOGIN,
  /* {
    refetchQueries: [ { query: ME }, { query: BOOKS_BY_FAVORITE_GENRE } ]
  },
  {
    update: (cache, response) => {
      cache.updateQuery({ query: BOOKS_BY_FAVORITE_GENRE }, ({ booksByFavGenre }) => {
        console.log("!!!!!!!!!!!!!!")
        console.log(response)
        return {
          booksByFavGenre: booksByFavGenre,
          }
        })
      }
    } */
  )

  /* eslint-disable */
  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('user-token', token)
    }
  }, [result.data])
  /* eslint-enable */

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <InputText
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <InputText
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button type='submit'>login</Button>
      </form>
    </div>
  )
}

export default LoginForm