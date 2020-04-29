const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  console.log('entered test')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog has an id defined', async () => {
  const response = await api.get('/api/blogs')
  response.body.map((blog) => {
    expect(blog.id).toBeDefined()
  })
})

/* test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(titles).toContain('Hellapoliisi')
})

 */

test('a valid blog can be added ', async () => {
  const newBlog =   {
    title: 'Pidempi korsi',
    author: 'Paula',
    url: 'https://pidempikorsi.tumblr.com',
    blogs: 614,
    likes: 998
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(
    'Pidempi korsi'
  )
})

test('blog without a value for likes gets 0 as value for likes', async () => {
  const newBlog =   {
    title: 'Pidempi korsi',
    author: 'Paula',
    url: 'https://pidempikorsi.tumblr.com',
    blogs: 614
  }

  await api
    .post('/api/blogs')
    .send(newBlog)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd[blogsAtEnd.length-1].likes).toEqual(0)
})

test('blog post without title fails with statuscode 400', async () => {
  const newBlog = {
    author: 'Birgit Bloggari',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog post without url fails with statuscode 400', async () => {
  const newBlog = {
    author: 'Birgit Bloggari',
    title: 'Bloki'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})