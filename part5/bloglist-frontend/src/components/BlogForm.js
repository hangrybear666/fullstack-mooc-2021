import React, { useState } from 'react'
const BlogForm = ({
  handleCreate
 }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value.trim())
  }
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value.trim())
  }
  const handleUrlChange = (event) => {
    setUrl(event.target.value.trim())
  }
  const createNewBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url,
      likes: 0
    }
    handleCreate(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <form onSubmit={createNewBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={handleTitleChange}
        />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            onChange={handleUrlChange}
          />
        </div>
        <button style={{ marginTop:10 }}type="submit">create</button>
      </form>
    </div>
  )
}
export default BlogForm