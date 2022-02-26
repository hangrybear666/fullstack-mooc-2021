import Blog from '../components/Blog'

const Blogs = ({ blogs, display, handleLike }) => {
  const displayElement = display ? '' : 'none'
  return (
    <div style={{ display: displayElement}}>
      <h2>blogs</h2>
      {blogs.map(blog => {
        return (<Blog key={blog.id} blog={blog} handleLike={handleLike} />)
      })}
    </div>
  )
}

export default Blogs