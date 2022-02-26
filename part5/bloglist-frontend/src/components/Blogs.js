import Blog from '../components/Blog'

const Blogs = ({ blogs, display, handleLike, handleDelete }) => {
  const displayElement = display ? '' : 'none'
  return (
    <div style={{ display: displayElement}}>
      <h2>blogs</h2>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => {
        return (<Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} />)
      })}
    </div>
  )
}

export default Blogs