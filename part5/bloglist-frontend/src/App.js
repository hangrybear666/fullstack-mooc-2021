import React, { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Logout from './components/Logout'
import Blogs from './components/Blogs'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState(null)

  const blogFormRef = useRef()

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

  const handleLike = async (likedBlog) => {
    try {
      likedBlog.likes = likedBlog.likes+1
      const liked = await blogService.like(likedBlog)
      if (liked.status === 200) {
        const updatedBlogs = blogs.map(blog => blog === likedBlog ? likedBlog : blog)
        setBlogs(updatedBlogs)
      } else {
        setErrorMessage('Blog could not be liked.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    } catch (exception) {
      console.log(exception)
      setErrorMessage('Blog could not be liked.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleCreate = async (newBlog) => {
    try {
      /**
       * After Blog creation hide the blog creation form:
       * using the ref mechanism of React, which offers a reference to the component.
       * The Togglable component uses the useImperativeHandle hook to make its
       * toggleVisibility function available outside of the component.
       */
      blogFormRef.current.toggleVisibility()

      const created = await blogService.create(newBlog)
      if (created) {
        const blogList = new Array(...blogs.concat(created))
        setBlogs(blogList)
        setNotificationMsg(`Your blog with the title ${newBlog.title} by ${newBlog.author} has been added.`)
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
  const handleUsernameChange = (event) => {
    setUsername(event.target.value.trim())
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value.trim())
  }
  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedNoteappUser')
  }

  return (
    <>
      <Notification message={errorMessage} type="error"/>
      <Notification message={notificationMsg} type="notification"/>
      <Togglable
        buttonLabel='login'
        display={user ? false : true}
      >
        <LoginForm
          handleLogin={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password}/>
      </Togglable>

      <Togglable
        buttonLabel='new blog'
        display={user ? true : false}
        ref={blogFormRef}
      >
        <BlogForm
          handleCreate={handleCreate}
          blogs={blogs}/>
      </Togglable>

      <Blogs
        blogs={blogs}
        handleLike={handleLike}
        display={user ? true : false}
      />

      <Logout
        handleLogout={handleLogout}
        user={user}/>
    </>
  )
}

export default App