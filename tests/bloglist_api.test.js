const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')


describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = await helper.initialUser()
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log('nyt tietokannassa ', usersAtStart)

    const newUser = {
      username: 'kalpis',
      name: 'Noora Koo',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with status code 400 and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with status code 400 and message if password is less than 4 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'käyttäjä',
      name: 'käyttäjä',
      password: '12',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toBe('password and username length must be more than 3 characters')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with status code 400 and message if username is less than 4 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mo',
      name: 'käyttäjä',
      password: '1234',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toBe('password and username length must be more than 3 characters')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

describe('login', () => {
  test('succeeds with valid request data', async () => {

    const user = {
      username: 'root',
      name: 'Superuser',
      password: 'sekret'
    }

    const response = await api
      .post('/api/login')
      .send(user)
      .expect(200)

    expect(response.body.token).toBeDefined()

  })
  test('fails with incorrect password', async () => {
    const  user = {
      username: 'root',
      password: 'secret'
    }

    const response = await api
      .post('/api/login')
      .send(user)
      .expect(401)

    expect(response.body.error).toEqual('invalid username or password')
  })
})


describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      let users = await helper.usersInDb()
      console.log(users[0])

      blogObject.user = users[0].id

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

  describe('posting a new blog', () => {
    test('a valid blog can be added ', async () => {
      const token = await helper.token()
      const newBlog =   {
        title: 'Pidempi korsi',
        author: 'Paula',
        url: 'https://pidempikorsi.tumblr.com',
        blogs: 614,
        likes: 998
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
      const token = await helper.token()

      const newBlog =   {
        title: 'Pidempi korsi',
        author: 'Paula',
        url: 'https://pidempikorsi.tumblr.com',
        blogs: 614
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      console.log('tykkäykset', blogsAtEnd)
      expect(blogsAtEnd[blogsAtEnd.length-1].likes).toEqual(0)
    })

    test('blog post without title fails with statuscode 400', async () => {
      const token = await helper.token()
      const newBlog = {
        author: 'Birgit Bloggari',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog post without url fails with statuscode 400', async () => {
      const token = await helper.token()
      const newBlog = {
        author: 'Birgit Bloggari',
        title: 'Bloki'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
    test('fails with status code 401 without authentication token', async () => {
      const blogsAtStart = helper.blogsInDb()
      const newBlog =   {
        title: 'Ploki',
        author: 'Plokkari',
        url: 'www.bloki.fi',
        blogs: 614,
        likes: 998
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(blogsAtStart.length)
    })
  })
  describe('deleting a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      const token = await helper.token()

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(b => b.title)

      expect(titles).not.toContain(blogToDelete.title)
    })
  })

  describe('updating a note', () => {
    test('succeeds with status code 200', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const body = {
        blogs: 438,
        likes: 1060
      }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(body)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd[0].likes).toEqual(body.likes)
      expect(blogsAtEnd[0].blogs).toEqual(body.blogs)

    })
  })
})



afterAll(() => {
  mongoose.connection.close()
})