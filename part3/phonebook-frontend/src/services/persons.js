import axios from 'axios'
const baseUrl = '/api/persons' // online repo and online frontend build
// const baseUrl = 'https://hangrybear666-nodejs-backend.herokuapp.com/api/persons' // online repo and local react development
// const baseUrl = 'http://localhost:3002/api/persons' // local node.js server run from different repo
// const baseUrl = 'http://localhost:3001/persons' // local json-server run via npm run server

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deleteEntry = (id) => {
  const deletionUrl = `${baseUrl}/${id}`
  const request = axios.delete(deletionUrl)
  return request.then(response => response.data)
}

export default { getAll, create, update, deleteEntry }