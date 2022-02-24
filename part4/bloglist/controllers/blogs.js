const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

/**
 * HTTP GET request to all blogs in db
 */
blogsRouter.get('/', async  (request, response, next) => {
  try {
    /**
     * The parameter given to the populate method ensures that the blogs
     * contain selected information of referenced user entries
     */
    const blogs = await Blog.find({})
      .populate('user', {
        username: 1,
        name: 1
      })
    logger.info('received GET request fetching all blogs')
    response.json(blogs)
  } catch(exception) {
    next(exception)
  }
})

/**
 * HTTP POST request to add blog in db
 */
blogsRouter.post('/', async (request, response, next) => {
  const { url, title, author, likes } = request.body
  try {
    const user = request.user
    const blog = new Blog({
      title: title,
      author: author,
      url: url,
      likes: likes,
      user: user._id
    })
    const savedBlog = await blog.save()
    logger.info('received POST request adding: ', savedBlog)
    // add new blog to provided user as "foreign key" reference
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blogToDelete = await Blog.findById(request.params.id)
    if (request.user.id !== blogToDelete.user.toString()) {
      const errorMsg = { error: 'Only the creator is allowed to delete their blog post' }
      response.statusMessage = errorMsg.error
      logger.error('ERROR: ', errorMsg.error)
      response.status(401)
      response.json(errorMsg)
    }
    logger.info('received DELETE request deleting id : ', request.params.id)
    const deletedBlog = await Blog.findByIdAndRemove(request.params.id)
    if (!deletedBlog) {
      const errorMsg = { error: `Person with id ${request.params.id} not found.` }
      response.statusMessage = errorMsg.error
      logger.error('ERROR: ', errorMsg.error)
      response.status(204)
      response.json(errorMsg)
    } else {
      response.status(200).end()
    }
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { url, title, author, likes } = request.body
  if (!url && !title &&  !likes && !author) {
    const errorMsg = { error: 'no properties provided in order to update' }
    response.statusMessage = errorMsg.error
    logger.error('ERROR: ', errorMsg.error)
    response.status(400)
    return response.json(errorMsg)
  }
  try {
    logger.info('received PUT request updating id : ', request.params.id)
    const user = request.user
    const filter = { _id: request.params.id }
    const update = {
      title: title,
      author: author,
      url: url,
      likes: likes,
      user: user._id
    }
    const updatedPerson = await Blog.findOneAndUpdate(
      filter,
      update,
      { new: true, runValidators: true, context: 'query' }) // to enable mongoose validation for PUT requests
    if (!updatedPerson) {
      const errorMsg = { error: `Person with id ${request.params.id} not found.` }
      response.statusMessage = errorMsg.error
      logger.error('ERROR: ', errorMsg.error)
      response.status(204)
      response.json(errorMsg)
    } else {
      response.status(200).end()
    }
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter