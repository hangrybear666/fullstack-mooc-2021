import React from 'react'
import { useState } from 'react'
const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(true)

  const viewInfo = { display: visible ? '' : 'none' }
  const hideInfo = { display: visible ? 'none' : '' }
  let showDelete
  if (user) {
    showDelete = { display: blog.user.username === user.username ? '' : 'none' }
  }

  return (
    <li className='blog'>
      <div className="blogContainer">
        <div className="blogInfo">
          <b style={{color: '#222222', fontSize:15, fontFamily: 'consolas'}}>{blog.title}</b>&nbsp;
          <i>{blog.author}</i>&nbsp;
          <button
            style={hideInfo}
            onClick={() => setVisible(true)}>
            hide
          </button>
        </div>
        <div style={hideInfo}>
          <u style={{color: 'purple'}}>{blog.url}</u>&nbsp;
          <p>likes: <b style={{color: 'blue'}}>{blog.likes}</b>&nbsp;
            <button
              onClick={() => handleLike(blog)}
              className="likeBtn">like</button>
          </p>
          <p><i>created by {blog.user.username}|{blog.user.name}</i></p>
          <button
            style={showDelete}
            onClick={() => handleDelete(blog)}>
            delete
          </button>
        </div>
        <div style={viewInfo} className="blogInfo">
          <button
            onClick={() => setVisible(false)}>
            view
          </button>
        </div>
      </div>
    </li>
  )
}

export default Blog