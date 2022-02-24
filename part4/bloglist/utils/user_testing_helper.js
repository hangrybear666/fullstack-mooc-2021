const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const getRootUser = async () => {
  const users = await User.findOne({ username: 'root' }).exec()
  return users.map(u => u.toJSON())
}

module.exports = {
  usersInDb,
  getRootUser
}