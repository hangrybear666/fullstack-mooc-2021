import React from 'react'
import { useState } from 'react'
const Blog = ({ blog, handleLike }) => {
  const [visible, setVisible] = useState(true)

  const viewInfo = { display: visible ? '' : 'none' }
  const hideInfo = { display: visible ? 'none' : '' }

  return (
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
            value={blog}
            onClick={() => handleLike(blog)}
            className="likeBtn">like</button>
        </p>
        <p><i>created by {blog.user.username}|{blog.user.name}</i></p>
      </div>
      <div style={viewInfo} className="blogInfo">
        <button
          onClick={() => setVisible(false)}>
          view
        </button>
      </div>
    </div>
  )
}

export default Blog