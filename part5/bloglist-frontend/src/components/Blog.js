import React from 'react'
const Blog = ({blog}) => (
  <div>
    <b style={{color: '#222222', fontSize:15, fontFamily: 'consolas'}}>{blog.title}</b>&nbsp;|&nbsp;
    <i>{blog.author}</i>&nbsp;|&nbsp;
    <u style={{color: 'purple'}}>{blog.url}</u>&nbsp;|&nbsp;
    likes: <b style={{color: 'blue'}}>{blog.likes}</b>
  </div>
)

export default Blog