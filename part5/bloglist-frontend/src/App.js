import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect (() =>{
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({username, password})
      // save user received from backend api to local browser storage
      if (user) {
        window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
        setNotificationMsg('Your have been logged in successfully')
        setTimeout(() => {
          setNotificationMsg(null)
        }, 3000)
      }

    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url,
        likes: 0
      }
      const created = await blogService.create(newBlog)
      if (created) {
        const blogList = new Array(...blogs.concat(created))
        setBlogs(blogList)
        setNotificationMsg(`Your blog with the title ${title} by ${author} has been added.`)
        setTimeout(() => {
          setNotificationMsg(null)
        }, 5000)
      }
    } catch (exception) {
      setErrorMessage('Blog could not be created.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedNoteappUser')
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username:
        <input
          type="text"
          value={username}
          name="Username"
          onChange={ ({ target }) => setUsername(target.value.trim())}
          />
      </div>
      <div>
        password:
        <input
          type="password"
          value={password}
          name="Password"
          onChange={ ({ target }) => setPassword(target.value.trim())}
          />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <div>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={ ({ target }) => setTitle(target.value.trim())}
        />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={ ({ target }) => setAuthor(target.value.trim())}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            onChange={ ({ target }) => setUrl(target.value.trim())}
          />
        </div>
        <button style={{ marginTop:10 }}type="submit">create</button>
      </form>
      <h2>blogs</h2>
      {blogs.map(blog => {
        return (<Blog key={blog.id} blog={blog} />)
      }
      )}
    </div>
  )
  const logoutBtn = () => (
    <div style={{ marginTop:15 }}>
      <i>Logged in as</i> <b>{user.name}</b>
      <button onClick={handleLogout}>
        logout
      </button>
    </div>
  )

    return (
      <>
        <Notification message={errorMessage} type="error"/>
        <Notification message={notificationMsg} type="notification"/>
        {user === null ? loginForm() : blogForm()}
        {user !== null && logoutBtn()}
      </>
  )
}

export default App