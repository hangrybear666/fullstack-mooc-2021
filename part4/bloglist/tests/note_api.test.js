const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [{"title":"React patterns","author":"Michael Chan","url":"https://reactpatterns.com/","likes":7,"id":"621632c1e2ff1a4c633b66d3"},{"title":"Go To Statement Considered Harmful","author":"Edsger W. Dijkstra","url":"http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html","likes":5,"id":"621632c3e2ff1a4c633b66d5"},{"title":"Canonical string reduction","author":"Edsger W. Dijkstra","url":"http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html","likes":12,"id":"621632c6e2ff1a4c633b66d7"},{"title":"First class tests","author":"Robert C. Martin","url":"http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll","likes":10,"id":"621632cae2ff1a4c633b66d9"},{"title":"TDD harms architecture","author":"Robert C. Martin","url":"http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html","likes":0,"id":"621632cce2ff1a4c633b66db"}]

beforeEach(async () => {
  await Blog.deleteMany({})
  let noteObject = new Blog(initialBlogs[0])
  await noteObject.save()
  noteObject = new Blog(initialBlogs[1])
  await noteObject.save()
  noteObject = new Blog(initialBlogs[2])
  await noteObject.save()
  noteObject = new Blog(initialBlogs[3])
  await noteObject.save()
  noteObject = new Blog(initialBlogs[4])
  await noteObject.save()
})

test('notes are returned as json', async () => {
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
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }

  await api
    .post('/api/blogs')
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

test('the unique identifier property exists and is named \'id\'', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.id)
  expect(contents[0]).toBeDefined()
})

test('an added blog without a like count defaults to likes=0', async () => {
  const newBlog =   {
    title: "Self-Written-Trash",
    author: "Herb W. Dean",
    url: "http://localhost:3002"
  }

  await api
    .post('/api/blogs')
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
    author: "Herb W. Dean",
    url: "http://localhost:3002",
    likes: 4
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('adding a post without url results in status code 400 BAD REQUEST', async () => {
  const newBlog =   {
    title: "Self-Written-Trash",
    author: "Herb W. Dean",
    likes: 4
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('deleting a post with correct id succeeds', async () => {
  const id = '621632c1e2ff1a4c633b66d3'

  await api
    .delete(`/api/blogs/${id}`)
    .expect(200)
})

test('deleting a post with false id fails', async () => {
  const id = 'asd'

  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)
})

test('updating a post with correct id succeeds', async () => {
  const id = '621632c1e2ff1a4c633b66d3'
  const blogToUpdate = {
    title: "React patterns UPDATED",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    id: "621632c1e2ff1a4c633b66d3"
  }
  await api
    .put(`/api/blogs/${id}`)
    .send(blogToUpdate)
    .expect(200)

})

test('updating a post with false id fails', async () => {
  const id = 'asd'
  const blogToUpdate = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    id: "621632c1e2ff1a4c633b66d3"
  }
  await api
    .put(`/api/blogs/${id}`)
    .send(blogToUpdate)
    .expect(204)
})

afterAll(() => {
  mongoose.connection.close()
})