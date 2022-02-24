const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  if (request.path !== '/api/login') {
    // hide pw from logging
    logger.info('Body:  ', request.body)
  }
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

/**
 *
 * @param {*} request
 * @returns jswt token generated from login to /api/login endpoint
 */
const tokenExtractor = (request, response, next)  => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = async (request, response, next)  => {
  if (request.token) {
    // query user to receive ObjectID for "foreign key" reference of new blog entry
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'login token missing or invalid' })
    }
    // query user to receive ObjectID for "foreign key" reference of new blog entry
    const user = await User.findById(decodedToken.id)
    if (user) {
      request.user = user
    }
  } else {
    // no token present in POST or DELETE request --> error
    if (request.method === 'POST' || request.method === 'DELETE') {
      return response.status(401).json({ error: 'login token missing or invalid' })
    }
  }
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}