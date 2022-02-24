const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

/**
 * HTTP GET request to all users in db
 */
usersRouter.get('/', async (request, response) => {
  /**
   * The parameter given to the populate method ensures that the users
   * contain selected information of referenced blog entries
   */
  const users = await User.find({})
    .populate('blogs',
      { title: 1,
        author: 1,
        url: 1,
        likes: 1
      })
  response.json(users)
})

/**
 * HTTP POST request to add user in db
 */
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // test for password provision and length >=3
  if (!password) {
    return response.status(400).json({
      error: 'password must provided'
    })
  }
  if (password.length < 3) {
    return response.status(400).json({
      error: `password must be at least 3 characters. you provided ${password.length} characters.`
    })
  }
  // test for username provision and length >=3
  if (!username) {
    return response.status(400).json({
      error: 'username must provided'
    })
  }
  if (username.length < 3) {
    return response.status(400).json({
      error: `username must be at least 3 characters. you provided ${username.length} characters.`
    })
  }

  // test for user uniqueness
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})


module.exports = usersRouter