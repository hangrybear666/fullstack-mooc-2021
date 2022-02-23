const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async  (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    logger.info('received GET request fetching all blogs')
    response.json(blogs)
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  try {
    const savedBlog = await blog.save()
    logger.info('received POST request adding: ', savedBlog)
    response.status(201).json(savedBlog)
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    logger.info('received DELETE request deleting id : ', request.params.id)
    const deletedPerson = await Blog.findOneAndRemove({ id: request.params.id })
    if (!deletedPerson) {
      const errorMsg = { error: `Person with id ${request.params.id} not found.` }
      response.statusMessage = errorMsg.error
      console.log('ERROR: ', errorMsg.error)
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
  if (!request.body.url) {
    const errorMsg = { error: 'no url provided in order to update' }
    response.statusMessage = errorMsg.error
    console.log('ERROR: ', errorMsg.error)
    response.status(204)
    return response.json(errorMsg)
  }
  if (!request.body.title) {
    const errorMsg = { error: 'no title provided in order to update' }
    response.statusMessage = errorMsg.error
    console.log('ERROR: ', errorMsg.error)
    response.status(204)
    return response.json(errorMsg)
  }
  if (!request.body.author) {
    const errorMsg = { error: 'no author provided in order to update' }
    response.statusMessage = errorMsg.error
    console.log('ERROR: ', errorMsg.error)
    response.status(204)
    return response.json(errorMsg)
  }
  if (!request.body.likes) {
    const errorMsg = { error: 'no likes provided in order to update' }
    response.statusMessage = errorMsg.error
    console.log('ERROR: ', errorMsg.error)
    response.status(204)
    return response.json(errorMsg)
  }
  try {
    logger.info('received PUT request updating id : ', request.params.id)
    const filter = { id: request.params.id }
    const update = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes
    }
    const updatedPerson = await Blog.findOneAndUpdate(
      filter,
      update,
      { new: true, runValidators: true, context: 'query' }) // to enable mongoose validation for PUT requests
    if (!updatedPerson) {
      const errorMsg = { error: `Person with id ${request.params.id} not found.` }
      response.statusMessage = errorMsg.error
      console.log('ERROR: ', errorMsg.error)
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