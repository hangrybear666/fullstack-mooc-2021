const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let authHeader // initialized in beforeEach!
let initialBlogs // initialized in beforeEach!

beforeEach(async () => {
  /**
   * purge database of users and create a new root
   * user that is  associated with all blog posts
   */
  await User.deleteMany({})
  const username = 'root'
  const password = 'oijasjioijmoasd2123'
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username: username, name: 'Superuser', passwordHash })
  await user.save()

  /**
   * verify new user against /api/login backend
   * to receive authentification token for further post request testing
   */
  const loginUser = {
    username: username,
    password: password
  }
  const authorizationString = 'bearer '
  const loginResponse = await api
    .post('/api/login')
    .send(loginUser)
  authHeader = authorizationString.concat(loginResponse.body.token)
  const userId = loginResponse.body.id

  initialBlogs = [
    { 'title':'React patterns','author':'Michael Chan','url':'https://reactpatterns.com/','likes':7, 'user': userId },
    { 'title':'Go To Statement Considered Harmful','author':'Edsger W. Dijkstra','url':'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html','likes':5, 'user': userId },
    { 'title':'Canonical string reduction','author':'Edsger W. Dijkstra','url':'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html','likes':12, 'user': userId  },
    { 'title':'First class tests','author':'Robert C. Martin','url':'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll','likes':10, 'user': userId  },
    { 'title':'TDD harms architecture','author':'Robert C. Martin','url':'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html','likes':0, 'user': userId  }]

  await Blog.deleteMany({})
  let newBlog = initialBlogs[0]
  await api.post('/api/blogs').set('Authorization', authHeader).send(newBlog)
  newBlog = initialBlogs[1]
  await api.post('/api/blogs').set('Authorization', authHeader).send(newBlog)
  newBlog = initialBlogs[2]
  await api.post('/api/blogs').set('Authorization', authHeader).send(newBlog)
  newBlog = initialBlogs[3]
  await api.post('/api/blogs').set('Authorization', authHeader).send(newBlog)
  newBlog = initialBlogs[4]
  await api.post('/api/blogs').set('Authorization', authHeader).send(newBlog)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('there are five blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('the first blog\'s author is Michael Chan', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].author).toBe('Michael Chan')
})

test('a specific blog is within the returned notes', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)
  expect(contents).toContain(
    'First class tests'
  )
})

test('a valid blog can be added', async () => {
  const newBlog =   {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authHeader)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(contents).toContain(
    'Type wars'
  )
})

test('a valid blog without authorization token results in STATUS 401 UNAUTHORIZED', async () => {
  const newBlog =   {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('the unique identifier property exists and is named \'id\'', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.id)
  expect(contents[0]).toBeDefined()
})

test('an added blog without a like count defaults to likes=0', async () => {
  const newBlog =   {
    title: 'Self-Written-Trash',
    author: 'Herb W. Dean',
    url: 'http://localhost:3002'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authHeader)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.find(blog => blog.title === newBlog.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(contents.likes).toBe(0)
})

test('adding a post without title results in status code 400 BAD REQUEST', async () => {
  const newBlog =   {
    author: 'Herb W. Dean',
    url: 'http://localhost:3002',
    likes: 4
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authHeader)
    .send(newBlog)
    .expect(400)
})

test('adding a post without url results in status code 400 BAD REQUEST', async () => {
  const newBlog =   {
    title: 'Self-Written-Trash',
    author: 'Herb W. Dean',
    likes: 4
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authHeader)
    .send(newBlog)
    .expect(400)
})

test('deleting a post with correct id succeeds', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  const id = blogs[blogs.length-1].id

  await api
    .delete(`/api/blogs/${id}`)
    .expect(200)
})

test('deleting a post with false id results in error: malformatted id', async () => {
  const id = 'asd'

  const response = await api
    .delete(`/api/blogs/${id}`)
    .expect(400)
  expect(response.body.error).toContain('malformatted id')
})

test('updating a post with correct id succeeds', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  const id = blogs[blogs.length-1].id

  const blogToUpdate = {
    title: 'React patterns UPDATED',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    id: id
  }
  await api
    .put(`/api/blogs/${id}`)
    .set('Authorization', authHeader)
    .send(blogToUpdate)
    .expect(200)
})

test('updating a post with false id results in error: malformatted id', async () => {
  const id = 'asd'
  const blogToUpdate = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    id: id
  }
  const response = await api
    .put(`/api/blogs/${id}`)
    .set('Authorization', authHeader)
    .send(blogToUpdate)
    .expect(400)

  expect(response.body.error).toContain('malformatted id')
})

test('updating a post with empty author fails', async () => {
  const id = '621632c1e2ff1a4c633b66d3'
  const blogToUpdate = {
    title: 'React patterns UPDATED',
    author: '',
    url: 'https://reactpatterns.com/',
    likes: 7,
    id: id
  }
  await api
    .put(`/api/blogs/${id}`)
    .set('Authorization', authHeader)
    .send(blogToUpdate)
    .expect(400)
})

test('updating a post with empty url fails', async () => {
  const id = '621632c1e2ff1a4c633b66d3'
  const blogToUpdate = {
    title: 'React patterns UPDATED',
    author: 'Michael Chan',
    url: '',
    likes: 7,
    id: id
  }
  await api
    .put(`/api/blogs/${id}`)
    .set('Authorization', authHeader)
    .send(blogToUpdate)
    .expect(400)
})

test('updating a post with no properties fails', async () => {
  const id = '621632c1e2ff1a4c633b66d3'
  const blogToUpdate = {
  }
  await api
    .put(`/api/blogs/${id}`)
    .set('Authorization', authHeader)
    .send(blogToUpdate)
    .expect(400)
})

test('updating a post with string as likes fails', async () => {
  const id = '621632c1e2ff1a4c633b66d3'
  const blogToUpdate = {
    title: 'React patterns UPDATED',
    author: 'Michael Chan UPDATED',
    url: 'https://reactpatterns.com/ UPDATED',
    likes: '7asd',
    id: id
  }
  await api
    .put(`/api/blogs/${id}`)
    .set('Authorization', authHeader)
    .send(blogToUpdate)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})