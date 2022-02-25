const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  if (!user) {
    return response.status(401).json({
      error: 'invalid username'
    })
  }
  if (!passwordCorrect) {
    return response.status(401).json({
      error: 'invalid password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(userForToken, process.env.SECRET,{ expiresIn: 60*60 })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user._id })
})

module.exports = loginRouter