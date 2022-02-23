const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      logger.info('received GET request fetching all blogs')
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => {
      logger.info('received POST request adding: ', request.body)
      response.status(201).json(result)
    })
})

module.exports = blogsRouter