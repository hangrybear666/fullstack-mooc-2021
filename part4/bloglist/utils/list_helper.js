const dummy = (blogs) => {
  return 1
}

const sumOfLikes = (blogs) => {
  if (blogs && blogs.length === 0) {
    return 0
  } else if(blogs && blogs.length === 1) {
    return blogs[0].likes
  } else {
    const initialvalue = 0
    const result = blogs.reduce((previousValue, currentArrayObject, currentIndex, array) => {
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
  // if (blogs && blogs.length === 0) {
  //   return []
  // } else if(blogs && blogs.length === 1) {
  //   return blogs[0]
  // } else {
  //   const initialvalue = 0
  //   const result = blogs.reduce((previousValue, currentArrayObject, currentIndex, array) => {
  //     const maxIndex = array[currentIndex].likes > array[previousValue].likes ? currentIndex : previousValue
  //     console.log("max Index ", maxIndex)
  //     return maxIndex
  //   }, initialvalue)
  //   return blogs[result]
  // }
}

module.exports = {
  dummy,
  sumOfLikes,
  favoriteBlog,
  mostBlogs
}