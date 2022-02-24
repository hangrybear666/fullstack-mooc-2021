const dummy = (blogs) => {// eslint-disable-line
  return 1
}

const sumOfLikes = (blogs) => {
  if (blogs && blogs.length === 0) {
    return 0
  } else if(blogs && blogs.length === 1) {
    return blogs[0].likes
  } else {
    const initialvalue = 0
    const result = blogs.reduce((previousValue, currentArrayObject, currentIndex, array) => {// eslint-disable-line
      return previousValue + currentArrayObject.likes
    }, initialvalue)
    return result
  }
}

const favoriteBlog = (blogs) => {
  if (blogs && blogs.length === 0) {
    return []
  } else if(blogs && blogs.length === 1) {
    return blogs[0]
  } else {
    const initialvalue = 0
    const result = blogs.reduce((previousValue, currentArrayObject, currentIndex, array) => {
      const maxIndex = array[currentIndex].likes > array[previousValue].likes ? currentIndex : previousValue
      return maxIndex
    }, initialvalue)
    return blogs[result]
  }
}

const mostBlogs = (blogs) => {
  let authorBlogCount = []
  if (blogs && blogs.length === 0) {
    return []
  } else if(blogs && blogs.length === 1) {
    authorBlogCount.push({
      author: blogs[0].author,
      blogs: 1
    })
    return authorBlogCount[0]
  }
  else {
    let existingAuthorIndex = -1
    blogs.forEach((blog, index, array) => {// eslint-disable-line
      existingAuthorIndex = authorBlogCount.map(e => e.author).indexOf(blog.author)
      if (existingAuthorIndex !== -1) {
        // console.log('author found!')
        authorBlogCount[existingAuthorIndex].blogs += 1
      } else {
        authorBlogCount.push({
          author: blog.author,
          blogs: 1
        })
      }
    })
    const initialvalue = 0
    const result = authorBlogCount.reduce((previousValue, currentArrayObject, currentIndex, array) => {
      const maxIndex = array[currentIndex].blogs > array[previousValue].blogs ? currentIndex : previousValue
      return maxIndex
    }, initialvalue)
    return authorBlogCount[result]
  }
}

const mostLikes = (blogs) => {
  let authorLikeCount = []
  if (blogs && blogs.length === 0) {
    return []
  } else if(blogs && blogs.length === 1) {
    authorLikeCount.push({
      author: blogs[0].author,
      likes: blogs[0].likes
    })
    return authorLikeCount[0]
  }
  else {
    let existingAuthorIndex = -1
    blogs.forEach((blog, index, array) => { // eslint-disable-line
      existingAuthorIndex = authorLikeCount.map(e => e.author).indexOf(blog.author)
      if (existingAuthorIndex !== -1) {
        // console.log('author found!')
        authorLikeCount[existingAuthorIndex].likes += blog.likes
      } else {
        authorLikeCount.push({
          author: blog.author,
          likes: blog.likes
        })
      }
    })
    const initialvalue = 0
    const result = authorLikeCount.reduce((previousValue, currentArrayObject, currentIndex, array) => {
      const maxIndex = array[currentIndex].likes > array[previousValue].likes ? currentIndex : previousValue
      return maxIndex
    }, initialvalue)
    return authorLikeCount[result]
  }
}

module.exports = {
  dummy,
  sumOfLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}