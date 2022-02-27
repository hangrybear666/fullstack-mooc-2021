import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const like = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject, config)
  return response
}

const deleteBlog = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${newObject.id}`, config)
  return response
}

export default {
  getAll,
  create,
  setToken,
  like,
  deleteBlog }